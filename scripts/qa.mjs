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
    ['booking destination', html.includes('id="lead-form"')],
    ['telephone contact', /href="tel:\+\d+"/.test(html)]
  ];
  if (manifest.intakeEnabled) {
    checks.push(
      ['lead form', html.includes('data-lead-form')],
      ['form source', html.includes('data-form-source')],
      ['form honeypot', html.includes('name="_honey"')],
      ['form consent', /name="Согласие"[^>]*required/.test(html)],
      ['privacy policy link', /href="[^"]+">политика обработки персональных данных<\/a>/.test(html)],
      ['separate consent link', /href="[^"]+">согласие на обработку персональных данных<\/a>/.test(html)],
      ['consent version', html.includes('name="consent_version"')]
    );
  } else {
    checks.push(
      ['telephone booking fallback', html.includes('data-phone-booking')],
      ['no collection form while disabled', !/<form\b|data-lead-form|formsubmit\.co/i.test(html)],
      ['no personal data inputs while disabled', !/<input\b[^>]*name="(?:name|phone)"/.test(html)]
    );
  }
  if (/в макете|endpoint|Preview:|SERVICE\.\d/i.test(html)) errors.push(`${item.route}: developer wording in public content`);
  for (const [name, ok] of checks) {
    if (!ok) errors.push(`${item.route}: missing ${name}`);
  }
  if (html.includes('undefined')) errors.push(`${item.route}: contains "undefined"`);
  if (html.includes('TODO')) warnings.push(`${item.route}: contains TODO`);
  if (item.type === 'service' && !html.includes('service-hero-visual') && !html.includes('real-photo--hero')) {
    errors.push(`${item.route}: missing service hero visual`);
  }
  for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    const src = match[1];
    if (/^(?:https?:|data:)/.test(src)) continue;
    let assetPath = src.split('?')[0];
    if (manifest.base && assetPath.startsWith(`${manifest.base}/`)) assetPath = assetPath.slice(manifest.base.length);
    try { await stat(join(dist, assetPath.replace(/^\/+/, ''))); }
    catch { errors.push(`${item.route}: missing image ${src}`); }
  }
  for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:)/.test(href)) continue;
    const [target, fragment] = href.split('#');
    let localPath = target.split('?')[0];
    if (manifest.base && localPath.startsWith(`${manifest.base}/`)) localPath = localPath.slice(manifest.base.length);
    const destination = localPath ? join(dist, localPath.replace(/^\/+/, ''), localPath.endsWith('/') ? 'index.html' : '') : file;
    try {
      const linked = await readFile(destination, 'utf8');
      if (fragment && !linked.includes(`id="${fragment}"`)) errors.push(`${item.route}: missing anchor ${href}`);
    } catch { errors.push(`${item.route}: broken local link ${href}`); }
  }
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
