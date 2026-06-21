import { getSiteContent } from '@/lib/db/site-content';
import { SiteContentEditor } from './SiteContentEditor';

export const dynamic = 'force-dynamic';

export default async function SiteContentPage() {
  const content = await getSiteContent();
  return <SiteContentEditor initial={content} />;
}
