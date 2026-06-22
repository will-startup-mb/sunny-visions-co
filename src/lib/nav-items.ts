export const ALL_NAV_ITEMS = [
  { href: '/sv-hub/clients', label: 'Clients' },
  { href: '/sv-hub/cost-tracker', label: 'Cost Tracker' },
  { href: '/sv-hub/inquiries', label: 'Inquiries' },
  { href: '/sv-hub/services', label: 'Services' },
  { href: '/sv-hub/reports', label: 'Reports' },
  { href: '/sv-hub/stats', label: 'Stats' },
  { href: '/sv-hub/site-content', label: 'Site Content' },
  { href: '/sv-hub/security', label: 'Security' },
];

export const DEFAULT_NAV_ORDER = ALL_NAV_ITEMS.map((i) => i.href);

export function applyNavOrder(order: string[]) {
  const map = Object.fromEntries(ALL_NAV_ITEMS.map((i) => [i.href, i]));
  const ordered = order.flatMap((href) => (map[href] ? [map[href]] : []));
  const missing = ALL_NAV_ITEMS.filter((i) => !order.includes(i.href));
  return [...ordered, ...missing];
}
