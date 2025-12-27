/**
 * Normalize search queries for consistent matching
 * Handles: case, diacritics, hyphens, special chars, whitespace
 */
export function normalizeQuery(q: string): string {
  if (!q) return '';
  
  return q
    .toLowerCase()
    .normalize('NFKD') // Decompose unicode characters
    .replace(/[-_]/g, ' ') // Convert hyphens/underscores to spaces
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
}

/**
 * Generate query variations for synonym matching
 */
export function generateQueryVariations(q: string): string[] {
  const normalized = normalizeQuery(q);
  const variations = new Set<string>([normalized]);
  
  // Add hyphenated version
  variations.add(normalized.replace(/\s+/g, '-'));
  
  // Add concatenated version
  variations.add(normalized.replace(/\s+/g, ''));
  
  // Add with common abbreviations
  const abbrevMap: Record<string, string> = {
    'tshirt': 't-shirt',
    't shirt': 't-shirt',
    'tee': 't-shirt',
  };
  
  Object.entries(abbrevMap).forEach(([key, value]) => {
    if (normalized.includes(key)) {
      variations.add(normalized.replace(key, value));
    }
  });
  
  return Array.from(variations);
}
