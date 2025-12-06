'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import SearchBar from '@/components/search/SearchBar';

type SortOption = 'default' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc';

export default function ShopPage() {
  const { getPrice } = useWarehouse();
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Get best-selling products (top 10 by price as proxy for popularity)
  const bestSelling = useMemo(() => {
    return [...products]
      .sort((a, b) => getPrice(b) - getPrice(a))
      .slice(0, 10);
  }, [getPrice]);

  // Get newest additions (last 10 products in the array, reversed)
  const newest = useMemo(() => {
    return [...products].slice(-10).reverse();
  }, []);

  // Sort all products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'price-high':
        sorted.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default: keep original order
        break;
    }
    
    return sorted;
  }, [sortBy, getPrice]);

  return (
    <div className="bg-primary-black min-h-screen">
      {/* Page Header */}
      <section className="bg-secondary-charcoal border-b border-luxury-gold/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-accent-gold-light mb-4">
              SHOP ALL
            </h1>
            <p className="text-lg text-pure-white mb-6">
              SHOWING ALL {products.length} RESULTS
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl">
              <SearchBar placeholder="Search products and articles..." />
            </div>
          </div>
        </div>
      </section>

      {/* Sort Bar */}
      <section className="bg-primary-black border-b border-luxury-gold/20 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto flex justify-end">
            <div className="flex items-center space-x-4">
              <span className="text-pure-white font-medium">SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-luxury-gold/30 rounded-lg px-4 py-2 text-pure-white bg-secondary-charcoal focus:outline-none focus:border-luxury-gold"
              >
                <option value="default" className="bg-secondary-charcoal">DEFAULT SORTING</option>
                <option value="price-low" className="bg-secondary-charcoal">PRICE: LOW TO HIGH</option>
                <option value="price-high" className="bg-secondary-charcoal">PRICE: HIGH TO LOW</option>
                <option value="name-asc" className="bg-secondary-charcoal">NAME: A TO Z</option>
                <option value="name-desc" className="bg-secondary-charcoal">NAME: Z TO A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* All Peptides Grid */}
      <section className="py-12 md:py-16 bg-primary-black">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-heading text-3xl md:text-4xl font-bold text-accent-gold-light mb-8">
              ALL PEPTIDES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Glowing Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent"></div>

      {/* Best-Selling Compounds Section */}
      <section className="bg-secondary-charcoal py-12 md:py-16 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <ProductCarousel title="Best-Selling Research Compounds" products={bestSelling} />
          </div>
        </div>
      </section>

      {/* Glowing Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent"></div>

      {/* Newest Additions Section */}
      <section className="bg-primary-black py-12 md:py-16 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <ProductCarousel title="Newest Additions" products={newest} />
          </div>
        </div>
      </section>
    </div>
  );
}

