import { MetadataRoute } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { companies } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://startupmb.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = await db
    .select({ slug: companies.slug, updated_at: companies.updated_at })
    .from(companies)
    .where(eq(companies.is_published, true));

  const companyEntries: MetadataRoute.Sitemap = published
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${BASE_URL}/${c.slug}`,
      lastModified: c.updated_at,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...companyEntries,
  ];
}
