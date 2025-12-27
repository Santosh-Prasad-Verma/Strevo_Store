'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface AdvancedSearchBarProps {
  useDarkText?: boolean
}

export function AdvancedSearchBar({ useDarkText = false }: AdvancedSearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/search/suggest-fast?q=${encodeURIComponent(debouncedQuery)}&limit=6`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => {
        setSuggestions(data.suggestions || []);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setSuggestions([]);
      });
    return () => controller.abort();
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
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setQuery('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-2xl">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          useDarkText ? 'text-black/60' : 'text-white/60'
        }`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className={`w-full pl-12 pr-12 py-3 border-0 rounded-none focus:outline-none bg-transparent transition-colors ${
            useDarkText ? 'text-black placeholder:text-black/60' : 'text-white placeholder:text-white/60'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
              useDarkText ? 'text-black/60 hover:text-black' : 'text-white/60 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </form>
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-lg max-h-96 overflow-y-auto z-50">
          {suggestions.map((suggestion: any) => (
            <button
              key={suggestion.id}
              onClick={() => router.push(`/products/${suggestion.slug}`)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-3"
            >
              <div className="relative w-12 h-12 bg-neutral-100 rounded flex-shrink-0">
                <Image
                  src={suggestion.thumbnail_url}
                  alt={suggestion.title}
                  fill
                  className="object-cover rounded"
                  sizes="48px"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">{suggestion.title}</span>
                <p className="text-xs text-neutral-500">₹{suggestion.price}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
