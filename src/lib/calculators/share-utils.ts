/**
 * Name personalization utility for IndiaWise sharing.
 *
 * Rules:
 * - Optional
 * - Sanitized (alphanumeric, spaces, hyphens only)
 * - Length-limited (max 30 characters)
 * - Safe for URL encoding and display
 * - Deterministic fallback to generic text if absent or invalid
 */

export function sanitizeShareName(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  // Strip control chars, html tags, script/unsafe punctuation, keep letters, numbers, spaces, and hyphens
  const cleaned = raw.replace(/[^a-zA-Z0-9 \-]/g, '').trim().replace(/\s+/g, ' ');
  return cleaned.slice(0, 30);
}

export function formatShareHeading(name: string | undefined | null, calculatorName: string): string {
  const cleanName = sanitizeShareName(name);
  const baseName = calculatorName.replace(/\s+Calculator$/i, '').trim();
  const targetName = baseName.endsWith('EMI') || baseName.endsWith('Score') || baseName.endsWith('Tax')
    ? baseName
    : (baseName === 'SIP' || baseName === 'FD' || baseName === 'RD' ? `${baseName} Calculation` : baseName);

  if (!cleanName) {
    return `Check My ${targetName}`;
  }
  const possessive = cleanName.endsWith('s') || cleanName.endsWith('S') 
    ? `${cleanName}'` 
    : `${cleanName}'s`;
  return `Check ${possessive} ${targetName}`;
}

export function formatOwnerNameBadge(name: string | undefined | null): string {
  const cleanName = sanitizeShareName(name);
  if (!cleanName) return '';
  return cleanName.endsWith('s') || cleanName.endsWith('S')
    ? `${cleanName}'`
    : `${cleanName}'s`;
}
