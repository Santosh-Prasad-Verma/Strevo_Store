import Fuse from 'fuse.js';

export interface FuseProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  tags: string[];
}

export function createFuseIndex(products: FuseProduct[]) {
  const options = {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'brand', weight: 0.3 },
      { name: 'category', weight: 0.2 },
      { name: 'tags', weight: 0.1 },
      { name: 'description', weight: 0.05 }
    ],
    threshold: 0.3,
    distance: 100,
    minMatchCharLength: 2,
    includeScore: true,
    useExtendedSearch: true
  };
  
  return new Fuse(products, options);
}

export function searchWithFuse(fuse: Fuse<FuseProduct>, query: string, limit: number = 20) {
  const results = fuse.search(query, { limit });
  return results.map(r => ({
    ...r.item,
    score: r.score
  }));
}
