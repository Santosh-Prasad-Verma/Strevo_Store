"use client"

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface SuggestionsListProps {
  suggestions: {
    products: any[];
    categories: any[];
    brands: any[];
  };
  selectedIndex: number;
  onSelect: (item: any) => void;
  onClose: () => void;
}

export function SuggestionsList({ suggestions, selectedIndex, onSelect, onClose }: SuggestionsListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  const { products, categories, brands } = suggestions;
  const hasResults = products.length > 0 || categories.length > 0 || brands.length > 0;
  
  if (!hasResults) return null;
  
  return (
    <div
      ref={listRef}
      id="search-suggestions"
      role="listbox"
      className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-md shadow-lg max-h-96 overflow-y-auto"
    >
      {products.length > 0 && (
        <div className="p-2">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1">
            Products
          </div>
          {products.map((product, idx) => (
            <button
              key={product.id}
              onClick={() => onSelect({ ...product, type: 'product' })}
              className={`w-full flex items-center gap-3 p-2 rounded hover:bg-neutral-50 text-left ${
                selectedIndex === idx ? 'bg-neutral-100' : ''
              }`}
              role="option"
              aria-selected={selectedIndex === idx}
            >
              {product.image_url && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div 
                  className="font-medium text-sm truncate"
                  dangerouslySetInnerHTML={{ __html: product._formatted?.name || product.name }}
                />
                <div className="text-xs text-neutral-500">
                  {product.brand} · ${product.price}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {categories.length > 0 && (
        <div className="p-2 border-t border-neutral-100">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1">
            Categories
          </div>
          {categories.map((cat, idx) => (
            <button
              key={cat.value}
              onClick={() => onSelect(cat)}
              className={`w-full text-left px-2 py-1.5 rounded hover:bg-neutral-50 text-sm ${
                selectedIndex === products.length + idx ? 'bg-neutral-100' : ''
              }`}
              role="option"
              aria-selected={selectedIndex === products.length + idx}
            >
              {cat.value}
            </button>
          ))}
        </div>
      )}
      
      {brands.length > 0 && (
        <div className="p-2 border-t border-neutral-100">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1">
            Brands
          </div>
          {brands.map((brand, idx) => (
            <button
              key={brand.value}
              onClick={() => onSelect(brand)}
              className={`w-full text-left px-2 py-1.5 rounded hover:bg-neutral-50 text-sm ${
                selectedIndex === products.length + categories.length + idx ? 'bg-neutral-100' : ''
              }`}
              role="option"
              aria-selected={selectedIndex === products.length + categories.length + idx}
            >
              {brand.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
