import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { intakeBlockers, intakeEnabled } from '../src/lib/intake.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const business = JSON.parse(await readFile(resolve(root, 'content/business.json'), 'utf8'));
business.formEndpoint = process.env.FORM_ENDPOINT || business.formEndpoint || '';
const pages = JSON.parse(await readFile(resolve(root, 'content/pages.json'), 'utf8'));

const errors = [];
const warnings = [];
const requiredPageFields = ['type','route','shortTitle','title','description','priority','figma'];
const routes = new Set();

if (pages.length !== 22) errors.push(`Expected 22 production routes, found ${pages.length}`);

for (const page of pages) {
  for (const field of requiredPageFields) {
    if (!page[field]) errors.push(`${page.route || '(no route)'}: missing ${field}`);
  }
  if (!page.route.startsWith('/')) errors.push(`${page.route}: route must start with /`);
  if (routes.has(page.route)) errors.push(`${page.route}: duplicate route`);
  routes.add(page.route);

  if (!page.figma.desktopFrame || !page.figma.desktopNode) errors.push(`${page.route}: missing desktop Figma mapping`);
  if (!page.figma.mobileFrame || !page.figma.mobileNode) errors.push(`${page.route}: missing mobile Figma mapping`);

  if (page.type === 'service') {
    for (const field of ['lead','symptoms','services','prices','steps','faq']) {
      if (!page[field]?.length) errors.push(`${page.route}: service page missing ${field}`);
    }
  }
}

if (!business.phoneHref || !business.phoneDisplay) errors.push('Business phone is required');
for (const [city, address] of Object.entries(business.addresses || {})) {
  if (/требуется подтвердить/i.test(address)) warnings.push(`${city}: address is not confirmed`);
}
errors.push(...intakeBlockers(business));
if (!intakeEnabled(business)) warnings.push('Online collection is disabled; telephone booking remains available');
if (!business.legal?.confirmed) warnings.push('Operator details and personal data documents are not confirmed');
if (intakeEnabled(business)) {
  for (const path of [business.legal.privacyPolicyPath, business.legal.consentPath]) {
    try { await readFile(resolve(root, 'public', path.slice(1)), 'utf8'); }
    catch { errors.push(`Missing approved legal document: ${path}`); }
  }
}
if (!business.warranty?.confirmed) warnings.push('Warranty wording is not legally confirmed');

if (errors.length) {
  console.error('Validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validation passed: ${pages.length} routes`);
if (warnings.length) {
  console.warn('Warnings before production:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}
