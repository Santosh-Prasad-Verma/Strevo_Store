/**
 * Normalize search query for consistent matching
 * Handles: case, hyphens, special chars, whitespace
 */
export function normalizeQuery(query: string = ''): string {
  return query
    .toLowerCase()
    .normalize('NFKD') // Decompose accented characters
    .replace(/[-_]/g, ' ') // Replace hyphens/underscores with spaces
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
}

/**
 * Generate query variations for better matching
 * Examples: "t-shirt" -> ["t-shirt", "t shirt", "tshirt"]
 */
export function generateQueryVariations(query: string): string[] {
  const normalized = normalizeQuery(query);
  const variations = new Set<string>([normalized]);
  
  // Add version without spaces
  variations.add(normalized.replace(/\s+/g, ''));
  
  // Add version with hyphens
  variations.add(normalized.replace(/\s+/g, '-'));
  
  return Array.from(variations).filter(v => v.length > 0);
}
