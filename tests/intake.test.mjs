import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { intakeEnabled, intakeBlockers } from '../src/lib/intake.mjs';
import { renderDocument } from '../src/lib/render.mjs';

const business = JSON.parse(await readFile(new URL('../content/business.json', import.meta.url)));
const pages = JSON.parse(await readFile(new URL('../content/pages.json', import.meta.url)));
const navigation = JSON.parse(await readFile(new URL('../content/navigation.json', import.meta.url)));
const script = await readFile(new URL('../src/scripts/site.js', import.meta.url), 'utf8');
const approved = () => ({
  ...structuredClone(business),
  formEndpoint: 'https://intake.example.test/lead',
  leadForm: { enabled: true, processingConfirmed: true, storageCountry: 'RU', approvedEndpoint: 'https://intake.example.test/lead' },
  legal: { confirmed: true, operatorName: 'Test operator', operatorAddress: 'Test address', inn: 'test', privacyContact: 'test@example.test', privacyPolicyPath: '/legal/privacy.html', consentPath: '/legal/consent.html', consentVersion: 'test-v1' }
});
const context = b => ({ business: b, pages, navigation, base: '/dve-korobki-site', siteUrl: business.siteUrl,
  asset: p => '/dve-korobki-site' + p, versionedAsset: p => '/dve-korobki-site' + p,
  link: p => '/dve-korobki-site' + p, absoluteAsset: p => business.siteUrl + p });

test('disabled collection never renders a form, even with an old environment endpoint', () => {
  const b = { ...business, leadForm: { ...business.leadForm, enabled: false }, formEndpoint: 'https://formsubmit.co/ajax/test@example.test' };
  for (const page of pages) {
    const html = renderDocument(page, context(b));
    assert.doesNotMatch(html, /<form\b|name="(?:name|phone)"|formsubmit\.co/);
    assert.match(html, /data-phone-booking/);
    assert.match(html, /id="lead-form"/);
  }
});

test('missing review, changed endpoint, combined documents and unsafe paths block enabling', () => {
  assert.equal(intakeEnabled(approved()), true);
  for (const alter of [
    b => b.leadForm.processingConfirmed = false,
    b => b.leadForm.storageCountry = '',
    b => b.formEndpoint = 'https://other.example.test/lead',
    b => b.legal.operatorName = '',
    b => b.legal.confirmed = false,
    b => b.legal.consentPath = b.legal.privacyPolicyPath,
    b => b.legal.privacyPolicyPath = '/legal/../../private.html'
  ]) {
    const b = approved(); alter(b);
    assert.equal(intakeEnabled(b), false);
    assert.ok(intakeBlockers(b).length);
    assert.doesNotMatch(renderDocument(pages[0], context(b)), /<form\b/);
  }
});

test('enabled form has separate documents and an unchecked required consent', () => {
  const html = renderDocument(pages[0], context(approved()));
  assert.match(html, /href="\/dve-korobki-site\/legal\/privacy.html"/);
  assert.match(html, /href="\/dve-korobki-site\/legal\/consent.html"/);
  assert.match(html, /name="consent_version" value="test-v1"/);
  const input = html.match(/<input name="Согласие"[^>]+>/)[0];
  assert.match(input, /required/);
  assert.doesNotMatch(input, /checked/);
});

async function simulate(payload, { valid = true } = {}) {
  let submit, requests = 0, reset = false;
  const attributes = new Map([['action', 'https://intake.example.test/lead']]);
  const status = { textContent: '', dataset: {} };
  const source = { value: '' };
  const button = { textContent: 'Отправить заявку', disabled: false };
  const form = {
    method: 'post', addEventListener: (name, fn) => { submit = fn; },
    getAttribute: key => attributes.get(key), setAttribute: (key, value) => attributes.set(key, value), removeAttribute: key => attributes.delete(key),
    querySelector: selector => selector === '[data-form-status]' ? status : selector === '[data-form-source]' ? source : button,
    reportValidity: () => valid, reset: () => { reset = true; }
  };
  runInNewContext(script, {
    document: { querySelector: () => null, querySelectorAll: selector => selector === '[data-lead-form]' ? [form] : [] },
    window: { location: { origin: 'https://example.test', pathname: '/diagnostika/', href: 'https://example.test/diagnostika/?phone=private#name' } },
    FormData: class {}, AbortController, setTimeout: () => 1, clearTimeout: () => {},
    fetch: async () => { requests++; return { ok: true, json: async () => payload }; }
  });
  await submit({ preventDefault() {} });
  return { status, source, requests, reset };
}

test('a 200 response without explicit success is not shown as a delivered request', async () => {
  for (const payload of [null, {}, { success: false }, { success: 'false' }]) {
    const result = await simulate(payload);
    assert.equal(result.status.dataset.state, 'error');
    assert.equal(result.reset, false);
  }
  const result = await simulate({ success: true });
  assert.equal(result.status.dataset.state, 'success');
  assert.equal(result.source.value, 'https://example.test/diagnostika/');
});

test('invalid form never sends a request', async () => {
  assert.equal((await simulate({ success: true }, { valid: false })).requests, 0);
});
