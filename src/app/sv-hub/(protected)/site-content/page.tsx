import { getSiteContent } from '@/lib/db/site-content';
import { getNavOrder } from '@/lib/db/nav-order';
import { SiteContentEditor } from './SiteContentEditor';
import { NavOrderEditor } from './NavOrderEditor';

export const dynamic = 'force-dynamic';

export default async function SiteContentPage() {
  const [content, navOrder] = await Promise.all([getSiteContent(), getNavOrder()]);
  return <SiteContentEditor initial={content} navOrderEditor={<NavOrderEditor initialOrder={navOrder} />} />;
}
