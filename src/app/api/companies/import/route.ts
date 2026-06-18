import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';

// Single-pass parser that correctly handles quoted fields containing commas and newlines.
function parseCSV(text: string): Record<string, string>[] {
  // Normalise line endings
  const input = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Tokenise character by character into rows of fields
  const allRows: string[][] = [];
  let currentRow: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        // Escaped quote inside a quoted field
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch; // newlines inside quotes are kept as part of the field value
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        currentRow.push(field.trim());
        field = '';
      } else if (ch === '\n') {
        currentRow.push(field.trim());
        field = '';
        allRows.push(currentRow);
        currentRow = [];
      } else {
        field += ch;
      }
    }
  }
  // Push final field and row
  currentRow.push(field.trim());
  if (currentRow.some((f) => f !== '')) allRows.push(currentRow);

  if (allRows.length < 2) return [];

  const headers = allRows[0].map((h) => h.replace(/^"|"$/g, '').trim());
  const companyNameHeader = headers[0];

  const rows: Record<string, string>[] = [];

  for (const rawRow of allRows.slice(1)) {
    const firstValue = rawRow[0]?.replace(/^"|"$/g, '').trim() ?? '';

    // Skip blank rows and repeated header rows
    if (!firstValue) continue;
    if (firstValue.toLowerCase().replace(/[\s_-]/g, '') ===
        companyNameHeader.toLowerCase().replace(/[\s_-]/g, '')) continue;

    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = (rawRow[i] ?? '').replace(/^"|"$/g, '').trim();
    });
    rows.push(row);
  }

  return rows;
}

// Map common CSV column names to schema fields
function mapRowToCompany(row: Record<string, string>, mapping: Record<string, string>) {
  const company: Record<string, string | boolean | number | null> = {
    is_published: false,
    founder_status: 'Not Contacted',
    interviewed: false,
  };

  for (const [csvCol, dbField] of Object.entries(mapping)) {
    const value = row[csvCol];
    if (value === undefined || value === '') continue;

    const boolFields = ['has_about_page', 'has_team_page', 'social_media_active', 'press_coverage', 'interviewed'];
    const intFields = ['innovation_score', 'opportunity_score'];

    if (boolFields.includes(dbField)) {
      company[dbField] = value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
    } else if (intFields.includes(dbField)) {
      const n = parseInt(value);
      company[dbField] = isNaN(n) ? null : n;
    } else {
      company[dbField] = value;
    }
  }

  return company;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { csv, mapping } = body as { csv: string; mapping: Record<string, string> };

  if (!csv || !mapping) {
    return NextResponse.json({ error: 'csv and mapping are required' }, { status: 400 });
  }

  const rows = parseCSV(csv);
  const now = new Date();
  const inserted: unknown[] = [];
  const errors: string[] = [];

  for (const row of rows) {
    try {
      const companyData = mapRowToCompany(row, mapping);
      // Skip if no company name resolved after mapping
      if (!companyData.company_name || String(companyData.company_name).trim() === '') continue;

      const [record] = await db
        .insert(companies)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .values({ ...(companyData as any), created_at: now, updated_at: now })
        .returning();
      inserted.push(record);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  return NextResponse.json({ inserted: inserted.length, errors });
}
