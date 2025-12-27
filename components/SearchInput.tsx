"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SuggestionsList } from './SuggestionsList';

interface SearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ onSearch, placeholder = "Search products...", className = "" }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();
  
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions(null);
      setIsOpen(false);
      return;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    
    try {
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, {
        signal: abortControllerRef.current.signal
      });
      const data = await res.json();
      setSuggestions(data);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Suggestion error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(query);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !suggestions) return;
    
    const totalItems = (suggestions.products?.length || 0) + 
                       (suggestions.categories?.length || 0) + 
                       (suggestions.brands?.length || 0);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      // Handle selection
    }
  };
  
  const handleClear = () => {
    setQuery('');
    setSuggestions(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };
  
  return (
    <div className="relative w-full" role="combobox" aria-expanded={isOpen} aria-haspopup="listbox">
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
      
      {isOpen && suggestions && (
        <SuggestionsList
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={(item) => {
            setIsOpen(false);
            if (item.type === 'product') {
              router.push(`/products/${item.id}`);
            } else if (item.type === 'category') {
              router.push(`/products?category=${item.value}`);
            } else if (item.type === 'brand') {
              router.push(`/products?brand=${item.value}`);
            }
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
