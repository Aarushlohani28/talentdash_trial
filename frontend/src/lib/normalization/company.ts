/**
 * Normalizes a company name for consistent database indexing and querying.
 * Converts to lowercase, trims whitespace, and removes common suffixes.
 */
export function normalizeCompanyName(name: string): string {
  if (!name) return '';

  let normalized = name.toLowerCase().trim();

  // Remove common corporate suffixes
  const suffixes = [
    ' inc.', ' inc', ' incorporated',
    ' corp.', ' corp', ' corporation',
    ' llc.', ' llc',
    ' ltd.', ' ltd', ' limited',
    ' pvt', ' private'
  ];

  for (const suffix of suffixes) {
    if (normalized.endsWith(suffix)) {
      normalized = normalized.slice(0, -suffix.length).trim();
    }
  }

  // Remove special characters and extra spaces
  normalized = normalized.replace(/[^a-z0-9\s]/g, '');
  normalized = normalized.replace(/\s+/g, ' ');

  return normalized;
}
