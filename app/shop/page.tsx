'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { getProductMinPrice } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import SearchBar from '@/components/search/SearchBar';
import FilterBar from '@/components/shop/FilterBar';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { categories } from '@/data/categories';
import { useAirtableProducts } from '@/lib/hooks/useAirtableProducts';

type SortOption = 'default' | 'price-low' | 'price-high' | 'newest';

export default function ShopPage() {
  const { selectedWarehouse, getPrice } = useWarehouse();
  const { products: airtableProducts, loading, error } = useAirtableProducts();
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Extract products from Airtable data
  const products = useMemo(() => {
    return airtableProducts.map(item => item.product);
  }, [airtableProducts]);

  // Calculate price range bounds
  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const warehouseMultiplier = selectedWarehouse === 'us' ? 1.25 : 1.0;
    const prices = products.map(p => getProductMinPrice(p) * warehouseMultiplier);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [selectedWarehouse, products]);

  // Initialize price range
  useEffect(() => {
    if (priceRange[1] === 1000 && priceBounds.max > 0) {
      setPriceRange([priceBounds.min, priceBounds.max]);
    }
  }, [priceBounds]);

  // Get best-selling products (top 10 by minimum price as proxy for popularity)
  const bestSelling = useMemo(() => {
    return [...airtableProducts]
      .filter(item => !item.isDiscontinued)
      .sort((a, b) => {
        const priceA = getProductMinPrice(a.product);
        const priceB = getProductMinPrice(b.product);
        // Apply warehouse multiplier
        const warehouseMultiplier = selectedWarehouse === 'us' ? 1.25 : 1.0;
        return (priceB * warehouseMultiplier) - (priceA * warehouseMultiplier);
      })
      .slice(0, 10)
      .map(item => item.product);
  }, [selectedWarehouse, airtableProducts]);

  // Get newest additions (last 10 products in the array, reversed)
  const newest = useMemo(() => {
    return [...airtableProducts]
      .filter(item => !item.isDiscontinued)
      .slice(-10)
      .reverse()
      .map(item => item.product);
  }, [airtableProducts]);

  // Filter and sort products (with Airtable data)
  const filteredAndSortedProducts = useMemo(() => {
    const warehouseMultiplier = selectedWarehouse === 'us' ? 1.25 : 1.0;
    
    // Filter products (exclude discontinued)
    let filtered = airtableProducts.filter((item) => {
      const product = item.product;
      
      // Exclude discontinued products
      if (item.isDiscontinued) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== 'all' && product.category !== categories.find(c => c.slug === selectedCategory)?.name) {
        return false;
      }
      
      // Price range filter
      const productPrice = getProductMinPrice(product) * warehouseMultiplier;
      if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
        return false;
      }
      
      return true;
    });
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = getProductMinPrice(a.product) * warehouseMultiplier;
          const priceB = getProductMinPrice(b.product) * warehouseMultiplier;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = getProductMinPrice(a.product) * warehouseMultiplier;
          const priceB = getProductMinPrice(b.product) * warehouseMultiplier;
          return priceB - priceA;
        });
        break;
      case 'newest':
        // Sort by ID (assuming newer products have higher IDs)
        filtered.sort((a, b) => b.product.id.localeCompare(a.product.id));
        break;
      default:
        // Default: keep original order
        break;
    }
    
    return filtered;
  }, [sortBy, selectedWarehouse, selectedCategory, priceRange, airtableProducts]);

  return (
    <div className="bg-primary-black min-h-screen">
      {/* Page Header with Persistent Search */}
      <section className="bg-secondary-charcoal border-b border-luxury-gold/20 py-8 sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-heading text-3xl md:text-4xl font-bold text-accent-gold-light">
                SHOP ALL
              </h1>
              <p className="text-sm text-neutral-gray">
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'RESULT' : 'RESULTS'}
              </p>
            </div>
            {/* Persistent Search Bar */}
            <div className="max-w-2xl">
              <SearchBar placeholder="Search products and articles..." />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        minPrice={priceBounds.min}
        maxPrice={priceBounds.max}
      />

      {/* Sort Bar - Right Aligned */}
      <section className="bg-primary-black border-b border-luxury-gold/20 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto flex justify-end">
            <div className="flex items-center space-x-4">
              <span className="text-pure-white font-medium text-sm">SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-luxury-gold/30 rounded-lg px-4 py-2 text-pure-white bg-secondary-charcoal focus:outline-none focus:border-luxury-gold transition-all duration-400 text-sm"
              >
                <option value="default" className="bg-secondary-charcoal">DEFAULT</option>
                <option value="price-low" className="bg-secondary-charcoal">PRICE: LOW TO HIGH</option>
                <option value="price-high" className="bg-secondary-charcoal">PRICE: HIGH TO LOW</option>
                <option value="newest" className="bg-secondary-charcoal">NEWEST</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* All Peptides Grid - 3 Columns Desktop */}
      <section className="py-12 md:py-16 bg-primary-black">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {loading && (
              <div className="text-center py-16">
                <p className="text-pure-white text-lg">Loading products...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-16">
                <p className="text-red-500 text-lg">Error loading products: {error}</p>
              </div>
            )}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredAndSortedProducts.map((item) => (
                    <ProductCard
                      key={item.product.id}
                      product={item.product}
                      isDiscontinued={item.isDiscontinued}
                      airtableInStock={item.airtableInStock}
                    />
                  ))}
                </div>
                {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-pure-white text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange([priceBounds.min, priceBounds.max]);
                  }}
                  className="mt-4 text-luxury-gold hover:text-accent-gold-light transition-colors duration-400"
                >
                  Clear all filters
                </button>
              </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />

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

