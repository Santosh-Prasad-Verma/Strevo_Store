import { Suspense } from 'react';
import { ProductCard } from '@/components/product-card';

interface PageProps {
  searchParams: {
    q?: string;
    brand?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  };
}

async function SearchResults({ searchParams }: PageProps) {
  const params = new URLSearchParams();
  if (searchParams.q) params.set('q', searchParams.q);
  if (searchParams.brand) params.set('brand', searchParams.brand);
  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice);
  if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice);
  if (searchParams.sort) params.set('sort', searchParams.sort);
  if (searchParams.page) params.set('page', searchParams.page);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  if (!baseUrl.match(/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$|^https:\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/)) {
    throw new Error('Invalid app URL')
  }
  
  const res = await fetch(`${baseUrl}/api/meili/search?${params}`, {
    cache: 'no-store'
  });
  
  const data = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {searchParams.q ? `Search results for "${searchParams.q}"` : 'All Products'}
        </h1>
        <p className="text-gray-600 mt-1">
          {data.totalHits} products found • {data.processingTimeMs}ms
        </p>
      </div>

      {data.facets && (
        <div className="mb-6 flex gap-4">
          {data.facets.brand && Object.keys(data.facets.brand).length > 0 && (
            <select className="border border-gray-300 px-4 py-2 rounded-none">
              <option value="">All Brands</option>
              {Object.entries(data.facets.brand).map(([brand, count]) => (
                <option key={brand} value={brand}>{brand} ({String(count)})</option>
              ))}
            </select>
          )}
          {data.facets.category && Object.keys(data.facets.category).length > 0 && (
            <select className="border border-gray-300 px-4 py-2 rounded-none">
              <option value="">All Categories</option>
              {Object.entries(data.facets.category).map(([cat, count]) => (
                <option key={cat} value={cat}>{cat} ({String(count)})</option>
              ))}
            </select>
          )}
        </div>
      )}

      {data.hits?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.hits?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage(props: PageProps) {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <SearchResults {...props} />
    </Suspense>
  );
}
