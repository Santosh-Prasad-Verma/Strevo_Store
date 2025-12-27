'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/hooks/useDebounce';

export function MeiliSearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    fetch(`/api/meili/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
      .then(res => res.json())
      .then(data => {
        setSuggestions(data.hits || []);
        setLoading(false);
      })
      .catch(() => {
        setSuggestions([]);
        setLoading(false);
      });
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-2xl">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-none focus:outline-none focus:border-black transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-lg max-h-96 overflow-y-auto z-50">
          {suggestions.map((hit) => (
            <button
              key={hit.id}
              onClick={() => router.push(`/products/${hit.id}`)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3"
            >
              {hit.image_url && (
                <img src={hit.image_url} alt="" className="w-12 h-12 object-cover" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium" dangerouslySetInnerHTML={{ __html: hit._formatted?.name || hit.name }} />
                <div className="text-xs text-gray-500">₹{hit.price}</div>
              </div>
            </button>
          ))}
          <button
            onClick={() => handleSearch(query)}
            className="w-full px-4 py-3 text-left border-t border-gray-200 hover:bg-gray-100 flex items-center gap-3 font-medium"
          >
            <Search className="w-4 h-4" />
            View all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
}
