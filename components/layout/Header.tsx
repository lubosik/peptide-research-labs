'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { categories } from '@/data/categories';
import SearchBar from '@/components/search/SearchBar';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-primary-black border-b border-luxury-gold/20 sticky top-0 z-50 shadow-sm" style={{ boxShadow: '0 2px 8px rgba(212, 175, 55, 0.1)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="relative w-32 h-16 md:w-40 md:h-20">
              <Image
                src="/images/vici-logo.png"
                alt="Vici Peptides"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 128px, 160px"
              />
            </div>
          </Link>

          {/* Desktop Navigation - 5 Primary Links Only */}
          <nav className="hidden md:flex items-center space-x-12 flex-1 max-w-2xl mx-8">
            <Link 
              href="/" 
              className="text-pure-white hover:text-accent-gold-light font-medium transition-all duration-400 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-400 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/shop" 
              className="text-pure-white hover:text-accent-gold-light font-medium transition-all duration-400 relative group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-400 group-hover:w-full"></span>
            </Link>
            {/* Categories Dropdown */}
            <div ref={categoriesRef} className="relative">
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="text-pure-white hover:text-accent-gold-light font-medium flex items-center gap-1 transition-all duration-400 relative group"
              >
                Categories
                <svg
                  className={`w-4 h-4 transition-transform duration-400 ${isCategoriesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-400 group-hover:w-full"></span>
              </button>
              {isCategoriesOpen && (
                <div
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="absolute top-full left-0 mt-2 w-80 bg-primary-black border border-luxury-gold/30 rounded-lg shadow-xl z-50 py-4" style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.2)' }}
                >
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="px-4 py-2 text-pure-white hover:bg-luxury-gold/10 hover:text-accent-gold-light transition-colors block"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-neutral-gray mt-1">{category.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link 
              href="/blog" 
              className="text-pure-white hover:text-accent-gold-light font-medium transition-all duration-400 relative group"
            >
              Blog
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-400 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/contact" 
              className="text-pure-white hover:text-accent-gold-light font-medium transition-all duration-400 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-400 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar 
              placeholder="Search products and articles..."
              onResultClick={() => setIsMobileMenuOpen(false)}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Header (Desktop) */}
            <Link
              href="/cart"
              className="hidden md:block p-2 text-pure-white hover:text-accent-gold-light relative transition-colors duration-400"
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-luxury-gold text-primary-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Cart Icon */}
            <Link
              href="/cart"
              className="md:hidden p-2 text-pure-white hover:text-accent-gold-light relative transition-colors duration-400"
              aria-label="Shopping cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-luxury-gold text-primary-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle - Enhanced with Gold Hover */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 text-pure-white hover:text-luxury-gold transition-all duration-400 rounded-lg hover:bg-luxury-gold/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              style={{
                boxShadow: isMobileMenuOpen ? '0 0 10px rgba(245, 214, 123, 0.25)' : 'none',
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Enhanced with Gold Hover */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-luxury-gold/20 bg-primary-black">
            {/* Mobile Search Bar */}
            <div className="mb-4 px-2">
              <SearchBar 
                placeholder="Search products and articles..."
                onResultClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
            <div className="flex flex-col space-y-2 px-2">
              <Link
                href="/"
                className="text-pure-white hover:text-luxury-gold hover:bg-luxury-gold/10 font-medium transition-all duration-400 px-4 py-3 rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-pure-white hover:text-luxury-gold hover:bg-luxury-gold/10 font-medium transition-all duration-400 px-4 py-3 rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <div className="space-y-2">
                <div className="text-pure-white font-medium px-4 py-2">Categories</div>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="block pl-6 pr-4 py-3 text-neutral-gray hover:text-luxury-gold hover:bg-luxury-gold/10 text-sm transition-all duration-400 rounded-lg min-h-[44px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/blog"
                className="text-pure-white hover:text-luxury-gold hover:bg-luxury-gold/10 font-medium transition-all duration-400 px-4 py-3 rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-pure-white hover:text-luxury-gold hover:bg-luxury-gold/10 font-medium transition-all duration-400 px-4 py-3 rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

