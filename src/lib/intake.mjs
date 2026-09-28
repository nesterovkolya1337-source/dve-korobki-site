// Configuration checks prevent accidental collection before the actual data flow
// and documents have been reviewed. They are not a legal compliance certificate.
export function intakeBlockers(business) {
  if (business.leadForm?.enabled !== true) return [];
  const issues = [];
  const form = business.leadForm;
  const legal = business.legal || {};
  if (form.processingConfirmed !== true || form.storageCountry !== 'RU') {
    issues.push('Confirm the actual processing chain and Russian database location before enabling forms');
  }
  let endpoint;
  try { endpoint = new URL(business.formEndpoint); } catch {}
  if (!endpoint || endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.hash) {
    issues.push('Lead form requires an HTTPS endpoint without credentials or a fragment');
  }
  if (!form.approvedEndpoint || business.formEndpoint !== form.approvedEndpoint) {
    issues.push('Form endpoint must match the endpoint reviewed with the processing chain');
  }
  if (legal.confirmed !== true) issues.push('Operator and legal documents must be confirmed');
  for (const key of ['operatorName', 'operatorAddress', 'inn', 'privacyContact', 'consentVersion']) {
    if (!String(legal[key] || '').trim()) issues.push(`Missing legal.${key}`);
  }
  for (const key of ['privacyPolicyPath', 'consentPath']) {
    if (!/^\/legal\/[a-z0-9-]+\.html$/.test(legal[key] || '')) {
      issues.push(`legal.${key} must point to a local document in public/legal/`);
    }
  }
  if (legal.privacyPolicyPath === legal.consentPath) {
    issues.push('Privacy policy and consent must be separate documents');
  }
  return issues;
}

export function intakeEnabled(business) {
  return business.leadForm?.enabled === true && intakeBlockers(business).length === 0;
}
