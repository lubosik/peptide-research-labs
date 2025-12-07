'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/data/products';
import { Article } from '@/data/articles';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface SearchResult {
  type: 'product' | 'article';
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  price?: number;
  image?: string;
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onResultClick?: () => void;
}

export default function SearchBar({ 
  className = '', 
  placeholder = 'Search products and articles...',
  onResultClick 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const debouncedQuery = useDebounce(query, 300);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    performSearch(debouncedQuery.trim());
  }, [debouncedQuery]);

  async function performSearch(searchQuery: string) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed: ${response.status}`);
      }
      const data = await response.json();
      setResults(data.results || []);
      setIsOpen(data.results && data.results.length > 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setIsOpen(true);
    }
  }

  function handleInputFocus() {
    if (results.length > 0) {
      setIsOpen(true);
    }
  }

  function handleResultClick(result: SearchResult) {
    setIsOpen(false);
    setQuery('');
    if (onResultClick) {
      onResultClick();
    }
    router.push(result.url);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter' && results.length > 0) {
      handleResultClick(results[0]);
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 pr-10 border border-luxury-gold/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold text-pure-white bg-secondary-charcoal placeholder:text-neutral-gray"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-neutral-gray"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-primary-black border border-luxury-gold/30 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto" style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.2)' }}>
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-secondary-charcoal transition-colors border-b border-luxury-gold/10 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            result.type === 'product'
                              ? 'bg-luxury-gold/20 text-accent-gold-light'
                              : 'bg-luxury-gold/10 text-accent-gold-light'
                          }`}
                        >
                          {result.type === 'product' ? 'Product' : 'Article'}
                        </span>
                        {result.category && (
                          <span className="text-xs text-neutral-gray truncate">
                            {result.category}
                          </span>
                        )}
                        {result.type === 'product' && result.description.includes('Available in:') && (
                          <span className="text-xs bg-luxury-gold/10 text-accent-gold-light px-2 py-0.5 rounded border border-luxury-gold/30">
                            Multiple Strengths
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-accent-gold-light mb-1 truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-pure-white line-clamp-2">
                        {result.description}
                      </p>
                    </div>
                    {result.price !== undefined && (
                      <div className="flex-shrink-0 text-right">
                        {result.type === 'product' && result.description.includes('Available in:') ? (
                          <div>
                            <span className="text-xs text-neutral-gray block">from</span>
                            <span className="text-lg font-bold text-luxury-gold">
                              ${result.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-luxury-gold">
                            ${result.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-pure-white">
              <p className="text-sm">No results found</p>
              <p className="text-xs text-neutral-gray mt-1">
                Try different keywords or browse our categories
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

