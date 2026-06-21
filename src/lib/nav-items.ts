export const ALL_NAV_ITEMS = [
  { href: '/mb-hub/batch-research', label: 'Batch Research' },
  { href: '/mb-hub/blog', label: 'Blog' },
  { href: '/mb-hub/companies', label: 'Companies' },
  { href: '/mb-hub/cost-dashboard', label: 'Cost Dashboard' },
  { href: '/mb-hub/industries', label: 'Industries' },
  { href: '/mb-hub/reports', label: 'Reports' },
  { href: '/mb-hub/research-history', label: 'Research History' },
  { href: '/mb-hub/security', label: 'Security' },
  { href: '/mb-hub/site-content', label: 'Site Content' },
  { href: '/mb-hub/stats', label: 'Statistics' },
  { href: '/mb-hub/suggestions', label: 'Suggestions' },
];

export const DEFAULT_NAV_ORDER = ALL_NAV_ITEMS.map((i) => i.href);

export function applyNavOrder(order: string[]) {
  const map = Object.fromEntries(ALL_NAV_ITEMS.map((i) => [i.href, i]));
  const ordered = order.flatMap((href) => (map[href] ? [map[href]] : []));
  const missing = ALL_NAV_ITEMS.filter((i) => !order.includes(i.href));
  return [...ordered, ...missing];
}
