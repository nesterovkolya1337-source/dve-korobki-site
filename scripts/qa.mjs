import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const manifest = JSON.parse(await readFile(join(dist, 'build-manifest.json'), 'utf8'));
const errors = [];
const warnings = [];

for (const item of manifest.routes) {
  const file = join(dist, item.output);
  const html = await readFile(file, 'utf8');
  const checks = [
    ['doctype', html.startsWith('<!doctype html>')],
    ['lang', html.includes('<html lang="ru">')],
    ['viewport', html.includes('name="viewport"')],
    ['title', /<title>[^<]+<\/title>/.test(html)],
    ['description', html.includes('name="description"')],
    ['h1', /<h1\b[^>]*>[\s\S]*?<\/h1>/.test(html)],
    ['canonical', html.includes('rel="canonical"')],
    ['schema', html.includes('application/ld+json')],
    ['header', html.includes('site-header')],
    ['footer', html.includes('site-footer')],
    ['lead form', html.includes('data-lead-form')],
    ['form endpoint', html.includes('https://formsubmit.co/ajax/')],
    ['form source', html.includes('data-form-source')],
    ['form honeypot', html.includes('name="_honey"')],
    ['form consent', /name="Согласие"[^>]*required/.test(html)]
  ];
  for (const [name, ok] of checks) {
    if (!ok) errors.push(`${item.route}: missing ${name}`);
  }
  if (html.includes('undefined')) errors.push(`${item.route}: contains "undefined"`);
  if (html.includes('TODO')) warnings.push(`${item.route}: contains TODO`);
}

for (const required of ['404.html','sitemap.xml','robots.txt','styles/main.css','scripts/site.js']) {
  try { await stat(join(dist, required)); }
  catch { errors.push(`Missing build asset: ${required}`); }
}

if (errors.length) {
  console.error('QA failed:');
  errors.forEach(x => console.error(`- ${x}`));
  process.exit(1);
}

console.log(`QA passed: ${manifest.routes.length} pages + core assets`);
warnings.forEach(x => console.warn(`Warning: ${x}`));
