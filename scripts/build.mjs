import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { renderDocument } from '../src/lib/render.mjs';
import { routeToOutput, normalizeBase, joinUrl } from '../src/lib/html.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = join(root, 'dist');

async function readJson(path) {
  return JSON.parse(await readFile(join(root, path), 'utf8'));
}

const [businessFile, pages, navigation] = await Promise.all([
  readJson('content/business.json'),
  readJson('content/pages.json'),
  readJson('content/navigation.json')
]);

const base = normalizeBase(process.env.BASE_PATH || '');
const siteUrl = (process.env.SITE_URL || businessFile.siteUrl || '').replace(/\/+$/, '');
const [mainCss, siteJs] = await Promise.all([
  readFile(join(root, 'src/styles/main.css')),
  readFile(join(root, 'src/scripts/site.js'))
]);
const assetRevision = createHash('sha256').update(mainCss).update(siteJs).digest('hex').slice(0, 10);
const business = {
  ...businessFile,
  formEndpoint: process.env.FORM_ENDPOINT || businessFile.formEndpoint || ''
};

const asset = (path) => {
  if (/^(https?:|data:|mailto:|tel:)/.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || normalized;
};
const link = (route) => joinUrl(base, route);
const absoluteAsset = (path) => `${siteUrl}/${String(path).replace(/^\/+/, '')}`;
const versionedAsset = (path) => `${asset(path)}?v=${assetRevision}`;

const ctx = { business, pages, navigation, base, siteUrl, asset, versionedAsset, link, absoluteAsset };

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'public'), dist, { recursive: true });
await mkdir(join(dist, 'styles'), { recursive: true });
await mkdir(join(dist, 'scripts'), { recursive: true });
await cp(join(root, 'src/styles/main.css'), join(dist, 'styles/main.css'));
await cp(join(root, 'src/scripts/site.js'), join(dist, 'scripts/site.js'));

const report = [];
for (const page of pages) {
  const relative = routeToOutput(page.route);
  const output = join(dist, relative);
  await mkdir(dirname(output), { recursive: true });
  const html = renderDocument(page, ctx);
  await writeFile(output, html, 'utf8');
  report.push({
    route: page.route,
    output: relative,
    title: page.title,
    type: page.type,
    priority: page.priority,
    figma: page.figma
  });
}

const notFound = `<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Страница не найдена — Две Коробки</title><link rel="stylesheet" href="${versionedAsset('/styles/main.css')}">
<body><main class="hero"><div class="container"><p class="eyebrow">404</p><h1>Страница не найдена</h1>
<p class="hero-lead">Проверьте адрес или вернитесь на главную.</p><a class="button button--primary" href="${link('/')}">На главную</a></div></main></body></html>`;
await writeFile(join(dist, '404.html'), notFound, 'utf8');

const sitemapUrls = pages.map(page => {
  const loc = page.route === '/' ? `${siteUrl}/` : `${siteUrl}/${page.route.replace(/^\/+|\/+$/g, '')}/`;
  return `  <url><loc>${loc}</loc><changefreq>${page.route === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${page.priority === 'P0' ? '0.9' : page.priority === 'P1' ? '0.8' : '0.7'}</priority></url>`;
}).join('\n');
await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`, 'utf8');
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');

const manifest = {
  generatedAt: new Date().toISOString(),
  routeCount: pages.length,
  siteUrl,
  base,
  routes: report
};
await writeFile(join(dist, 'build-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
await writeFile(join(root, 'docs/BUILD_MANIFEST.json'), JSON.stringify(manifest, null, 2), 'utf8');

console.log(`Built ${pages.length} routes into ${dist}`);
console.log(`Base path: ${base || '/'}`);
console.log(`Site URL: ${siteUrl || '(not configured)'}`);
