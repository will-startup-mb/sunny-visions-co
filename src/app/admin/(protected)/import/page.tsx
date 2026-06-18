'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const SCHEMA_FIELDS = [
  'company_name', 'website', 'city_region', 'primary_industry', 'secondary_industry',
  'stage', 'estimated_employees', 'funding_raised', 'company_description',
  'contact_name', 'contact_email', 'founder_names', 'founder_overview',
  'founder_linkedin_url', 'company_linkedin_url', 'has_about_page', 'has_team_page',
  'social_media_active', 'press_coverage', 'innovation_score', 'opportunity_score',
  'interview_priority', 'founder_status', 'last_contact_date', 'outreach_linkedin_draft',
  'outreach_notes', 'interviewed', 'podcast_episode', 'source_list',
  'research_date', 'research_notes',
];

function parseHeaders(csv: string): string[] {
  const first = csv.split('\n')[0];
  return first.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
}

export default function ImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csv, setCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [step, setStep] = useState<'upload' | 'map' | 'done'>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ inserted: number; errors: string[] } | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setCsv((ev.target?.result as string) || '');
    reader.readAsText(file);
  };

  const handleNext = () => {
    const parsed = parseHeaders(csv);
    setHeaders(parsed);

    const auto: Record<string, string> = {};
    for (const header of parsed) {
      const normalized = header.toLowerCase().replace(/[\s-]/g, '_');
      if (SCHEMA_FIELDS.includes(normalized)) {
        auto[header] = normalized;
      } else if (normalized === 'name' || normalized === 'company') {
        auto[header] = 'company_name';
      } else if (normalized === 'url' || normalized === 'site') {
        auto[header] = 'website';
      }
    }
    setMapping(auto);
    setStep('map');
  };

  const handleImport = async () => {
    setImporting(true);
    const res = await fetch('/api/companies/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv, mapping }),
    });
    const data = await res.json();
    setResult(data);
    setStep('done');
    setImporting(false);
  };

  const reset = () => {
    setCsv('');
    setFileName('');
    setStep('upload');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/companies" className="text-sm" style={{ color: '#3A9E9E' }}>← Back</Link>
        <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>CSV Import</h1>
      </div>

      {step === 'upload' && (
        <div className="card p-6 space-y-5">
          <p className="text-sm text-gray-600">
            Export your Google Sheet as CSV and upload it below. All imported companies will be set to unpublished — you can review and publish them individually.
          </p>

          <div
            className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors"
            style={{ borderColor: fileName ? '#3A9E9E' : '#c8d8e4', backgroundColor: fileName ? '#f0fafa' : 'white' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileName ? (
              <div className="space-y-1">
                <div className="text-3xl">📄</div>
                <p className="font-semibold text-sm" style={{ color: '#1B3A52' }}>{fileName}</p>
                <p className="text-xs text-gray-400">Click to choose a different file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-3xl text-gray-300">📁</div>
                <p className="text-sm font-medium text-gray-500">Click to select a CSV file</p>
                <p className="text-xs text-gray-400">.csv files only</p>
              </div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!csv.trim()}
            className="btn-primary"
          >
            Next: Map Columns →
          </button>
        </div>
      )}

      {step === 'map' && (
        <div className="card p-6 space-y-5">
          <p className="text-sm text-gray-600">
            Map each CSV column to the correct database field. Columns already auto-matched are pre-filled. Leave unmapped columns as <em>Skip</em>.
          </p>
          <div className="space-y-2">
            {headers.map((header) => (
              <div key={header} className="flex items-center gap-3">
                <span className="text-xs font-mono bg-gray-100 rounded px-2 py-1 w-48 truncate flex-shrink-0">
                  {header}
                </span>
                <span className="text-gray-400">→</span>
                <select
                  value={mapping[header] || ''}
                  onChange={(e) => setMapping((prev) => ({ ...prev, [header]: e.target.value }))}
                  className="text-sm"
                >
                  <option value="">Skip</option>
                  {SCHEMA_FIELDS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleImport} disabled={importing} className="btn-primary">
              {importing ? 'Importing…' : '📥 Import'}
            </button>
            <button onClick={() => setStep('upload')} className="btn-ghost">Back</button>
          </div>
        </div>
      )}

      {step === 'done' && result && (
        <div className="card p-6 space-y-4">
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold" style={{ color: '#1B3A52' }}>Import Complete</h2>
            <p className="text-gray-600 mt-2">
              <strong>{result.inserted}</strong> companies imported successfully.
            </p>
            {result.errors.length > 0 && (
              <div className="mt-4 text-left bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm font-semibold text-red-700 mb-2">{result.errors.length} errors:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/admin/companies" className="btn-primary">View Companies</Link>
            <button onClick={reset} className="btn-ghost">Import More</button>
          </div>
        </div>
      )}
    </div>
  );
}
