"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { formatINR } from '@/lib/utils/currency'

interface Suggestion {
  id: string
  title: string
  slug: string
  price: number
  thumbnail_url: string | null
}

interface SearchSuggestProps {
  placeholder?: string
  className?: string
  onClose?: () => void
  autoFocus?: boolean
}

export default function SearchSuggest({ 
  placeholder = "Search products...",
  className = "",
  onClose,
  autoFocus = false
}: SearchSuggestProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [cacheStatus, setCacheStatus] = useState<string>('')

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    // Abort previous request
    if (controllerRef.current) {
      controllerRef.current.abort()
    }
    
    if (!searchQuery.trim()) {
      setSuggestions([])
      setIsOpen(false)
      return
    }
    
    controllerRef.current = new AbortController()
    setIsLoading(true)
    
    try {
      const response = await fetch(
        `/api/search/suggest?q=${encodeURIComponent(searchQuery)}&limit=6`,
        { signal: controllerRef.current.signal }
      )
      
      if (!response.ok) throw new Error('Search failed')
      
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setCacheStatus(data.cache || '')
      setIsOpen(true)
      setSelectedIndex(-1)
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Search error:', error)
        setSuggestions([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query)
    }, 250) // 250ms debounce
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, fetchSuggestions])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort()
      }
    }
  }, [])

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          navigateToProduct(suggestions[selectedIndex])
        } else if (query.trim()) {
          navigateToSearch()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        onClose?.()
        break
    }
  }

  const navigateToProduct = (suggestion: Suggestion) => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    onClose?.()
    router.push(`/products/${suggestion.slug}`)
  }

  const navigateToSearch = () => {
    setIsOpen(false)
    onClose?.()
    router.push(`/products?search=${encodeURIComponent(query)}`)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      selectedElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-neutral-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
          aria-label="Search products"
        />
        
        {/* Loading / Clear button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
          ) : query ? (
            <button
              onClick={clearSearch}
              className="p-0.5 hover:bg-neutral-100 rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-[400px] overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <Link
                href={`/products/${suggestion.slug}`}
                className={`flex items-center gap-3 p-3 transition-colors ${
                  index === selectedIndex 
                    ? 'bg-neutral-100' 
                    : 'hover:bg-neutral-50'
                }`}
                onClick={() => {
                  setQuery('')
                  setSuggestions([])
                  setIsOpen(false)
                  onClose?.()
                }}
              >
                {/* Thumbnail */}
                <div className="relative w-14 h-14 flex-shrink-0 bg-neutral-100 rounded overflow-hidden">
                  {suggestion.thumbnail_url ? (
                    <Image
                      src={suggestion.thumbnail_url}
                      alt={suggestion.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <Search className="w-5 h-5" />
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 truncate">
                    {highlightMatch(suggestion.title, query)}
                  </div>
                  <div className="text-sm font-semibold text-neutral-700 mt-0.5">
                    {formatINR(suggestion.price)}
                  </div>
                </div>
              </Link>
            </li>
          ))}
          
          {/* View All Results */}
          <li className="border-t border-neutral-100">
            <button
              onClick={navigateToSearch}
              className="w-full px-4 py-3 text-sm font-medium text-center text-neutral-600 hover:bg-neutral-50 hover:text-black transition-colors"
            >
              View all results for "{query}"
            </button>
          </li>
        </ul>
      )}

      {/* No Results */}
      {isOpen && query && !isLoading && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl p-6 text-center">
          <p className="text-neutral-600 text-sm">No products found for "{query}"</p>
          <button
            onClick={navigateToSearch}
            className="mt-3 text-sm font-medium text-black hover:underline"
          >
            Search all products
          </button>
        </div>
      )}
    </div>
  )
}

// Highlight matching text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-100 text-inherit">{part}</mark>
    ) : (
      part
    )
  )
}
