export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function jsonScript(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

export function routeToOutput(route) {
  if (route === '/') return 'index.html';
  return `${route.replace(/^\/|\/$/g, '')}/index.html`;
}

export function normalizeBase(value = '') {
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === '/') return '';
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
}

export function joinUrl(base, route = '/') {
  if (!route.startsWith('/')) return route;
  const normalized = route === '/' ? '/' : `/${route.replace(/^\/+|\/+$/g, '')}/`;
  return `${base}${normalized}` || '/';
}

export function canonicalUrl(siteUrl, route) {
  const base = String(siteUrl || '').replace(/\/+$/, '');
  if (!base) return '';
  return route === '/' ? `${base}/` : `${base}/${route.replace(/^\/+|\/+$/g, '')}/`;
}
