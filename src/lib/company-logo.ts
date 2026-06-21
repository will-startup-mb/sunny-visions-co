export function buildFaviconUrl(website: string | null | undefined): string | null {
  if (!website) return null;
  try {
    const { hostname } = new URL(website);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
}
