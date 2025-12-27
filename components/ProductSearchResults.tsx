"use client"

import { useState, useEffect } from 'react';
import { ProductCard } from './product-card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductSearchResultsProps {
  initialQuery?: string;
  initialFilters?: Record<string, unknown>;
}

export function ProductSearchResults({ initialQuery = '', initialFilters = {} }: ProductSearchResultsProps) {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  
  useEffect(() => {
    if (!initialQuery) return;
    
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: initialQuery,
          page: page.toString(),
          perPage: '20',
          ...filters
        });
        
        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [initialQuery, page, filters]);
  
  if (!results && !loading) {
    return null;
  }
  
  if (loading && !results) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }
  
  const totalPages = Math.ceil((results?.total || 0) / 20);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Search Results</h2>
          <p className="text-neutral-600 mt-1">
            {results?.total || 0} products found for "{initialQuery}"
          </p>
        </div>
        
        {results?.facets && Object.keys(results.facets).length > 0 && (
          <div className="flex gap-2">
            {/* Filter controls */}
          </div>
        )}
      </div>
      
      {results?.hits?.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-neutral-600 mb-6">
            Try adjusting your search or filters
          </p>
          {results?.facets?.category && (
            <div className="space-y-2">
              <p className="text-sm text-neutral-500">Browse by category:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {Object.keys(results.facets.category).slice(0, 5).map(cat => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, category: [cat] })}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results?.hits?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm text-neutral-600">
                Page {page} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
