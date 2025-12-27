'use client'

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function MegaMenuSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions(null);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Suggest error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search products..."
          className="w-64 px-4 py-2 pl-10 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {isOpen && suggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 w-96 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {suggestions.products?.length > 0 && (
              <div className="p-4">
                <p className="text-xs font-bold uppercase text-neutral-500 mb-2">Products</p>
                {suggestions.products.map((product: any) => (
                  <a
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-neutral-100 rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-neutral-500">${product.price}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {suggestions.brands?.length > 0 && (
              <div className="p-4 border-t">
                <p className="text-xs font-bold uppercase text-neutral-500 mb-2">Brands</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.brands.map((brand: string) => (
                    <a
                      key={brand}
                      href={`/products?brand=${brand}`}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm"
                    >
                      {brand}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
