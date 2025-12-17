'use client';

import { use, useState, useMemo, useEffect } from 'react';
import { getProductMinPrice } from '@/data/products';
import { getCategoryBySlug, getAllCategorySlugs } from '@/data/categories';
import ProductCard from '@/components/products/ProductCard';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { useDebounce } from '@/lib/hooks/useDebounce';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { useAirtableProductsByCategory } from '@/lib/hooks/useAirtableProducts';

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

type SortOption = 'default' | 'price-low' | 'price-high' | 'newest' | 'popular';

export default function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = use(params);
  const category = getCategoryBySlug(categorySlug);
  const { selectedWarehouse, getPrice } = useWarehouse();
  
  // Fetch products from Airtable
  const { products: airtableProducts, loading, error } = useAirtableProductsByCategory(
    category?.name || ''
  );
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Debounce search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get all products for this category (filter out discontinued)
  const categoryProducts = useMemo(() => {
    if (!category || loading) return [];
    return airtableProducts
      .filter(item => !item.isDiscontinued)
      .map(item => item.product);
  }, [category, airtableProducts, loading]);

  // Filter and sort products (with Airtable data)
  const filteredAndSortedProducts = useMemo(() => {
    // Map products back to Airtable data
    const productsWithAirtableData = categoryProducts.map(product => {
      const airtableItem = airtableProducts.find(item => item.product.id === product.id);
      return {
        product,
        isDiscontinued: airtableItem?.isDiscontinued || false,
        airtableInStock: airtableItem?.airtableInStock !== undefined ? airtableItem.airtableInStock : (product.inStock ?? true),
      };
    });
    
    let filtered = productsWithAirtableData;

    // Search filter (including variant fields)
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter((item) => {
        const product = item.product;
        // Base product fields
        const baseMatch =
          product.name.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query);
        
        // Variant fields
        let variantMatch = false;
        if (product.variants && product.variants.length > 0) {
          variantMatch = product.variants.some(
            (variant) =>
              variant.strength.toLowerCase().includes(query) ||
              variant.sku.toLowerCase().includes(query) ||
              variant.specification?.toLowerCase().includes(query)
          );
        }
        
        return baseMatch || variantMatch;
      });
    }

    // Price range filter (using minimum variant price)
    const warehouseMultiplier = selectedWarehouse === 'us' ? 1.25 : 1.0;
    filtered = filtered.filter((item) => {
      const minPrice = getProductMinPrice(item.product) * warehouseMultiplier;
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    // Sort (using minimum variant price)
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
        // Assuming newer products have higher IDs or we can use a timestamp
        // For now, we'll sort by ID (which might not be perfect)
        filtered.sort((a, b) => b.product.id.localeCompare(a.product.id));
        break;
      case 'popular':
        // For now, sort by minimum price as a proxy for popularity
        // In production, you'd use actual popularity data
        filtered.sort((a, b) => {
          const priceA = getProductMinPrice(a.product) * warehouseMultiplier;
          const priceB = getProductMinPrice(b.product) * warehouseMultiplier;
          return priceB - priceA;
        });
        break;
      default:
        // Default: keep original order
        break;
    }

    return filtered;
  }, [categoryProducts, airtableProducts, debouncedSearch, priceRange, sortBy, selectedWarehouse]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  // Calculate price range for slider (using minimum variant prices)
  const priceRangeBounds = useMemo(() => {
    if (categoryProducts.length === 0) return [0, 1000];
    const warehouseMultiplier = selectedWarehouse === 'us' ? 1.25 : 1.0;
    const prices = categoryProducts.map((p) => getProductMinPrice(p) * warehouseMultiplier);
    return [Math.min(...prices), Math.max(...prices)];
  }, [categoryProducts, selectedWarehouse]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, priceRange, sortBy]);

  // Update price range bounds when category changes
  useEffect(() => {
    if (priceRangeBounds[1] > 0) {
      setPriceRange([priceRangeBounds[0], priceRangeBounds[1]]);
    }
  }, [priceRangeBounds]);

  if (!category) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Category Not Found</h1>
          <p className="text-charcoal">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero Section */}
      <section className="bg-taupe border-b border-stone py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
              {category.name.toUpperCase()}
            </h1>
            <p className="text-lg text-charcoal mb-4 max-w-3xl">
              {category.description}
            </p>
            <p className="text-base text-charcoal max-w-3xl">
              {category.scientificSummary}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-ivory rounded-lg border border-taupe p-6 sticky top-4" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
                <h2 className="text-xl font-bold text-charcoal mb-6">Filters</h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-2 border border-taupe rounded-lg focus:outline-none focus:border-charcoal bg-ivory text-charcoal placeholder-stone font-serif"
                  />
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal">Min:</span>
                      <input
                        type="number"
                        min={priceRangeBounds[0]}
                        max={priceRangeBounds[1]}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = Math.max(priceRangeBounds[0], Math.min(Number(e.target.value), priceRange[1]));
                          setPriceRange([val, priceRange[1]]);
                        }}
                        className="w-20 px-2 py-1 border border-taupe rounded text-sm bg-ivory text-charcoal font-serif"
                      />
                    </div>
                    <input
                      type="range"
                      min={priceRangeBounds[0]}
                      max={priceRangeBounds[1]}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full accent-charcoal"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-charcoal">Max:</span>
                      <input
                        type="number"
                        min={priceRangeBounds[0]}
                        max={priceRangeBounds[1]}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = Math.min(priceRangeBounds[1], Math.max(Number(e.target.value), priceRange[0]));
                          setPriceRange([priceRange[0], val]);
                        }}
                        className="w-20 px-2 py-1 border border-taupe rounded text-sm bg-ivory text-charcoal font-serif"
                      />
                    </div>
                    <input
                      type="range"
                      min={priceRangeBounds[0]}
                      max={priceRangeBounds[1]}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-charcoal"
                    />
                    <div className="text-xs text-center text-charcoal">
                      ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-taupe">
                  <p className="text-sm text-charcoal">
                    Showing {filteredAndSortedProducts.length} of {categoryProducts.length} products
                  </p>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="bg-ivory rounded-lg border border-taupe p-4 mb-6" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm text-charcoal">
                      {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-charcoal">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border border-taupe rounded-lg px-4 py-2 text-charcoal bg-ivory focus:outline-none focus:border-charcoal font-serif"
                    >
                      <option value="default" className="bg-ivory">Default</option>
                      <option value="price-low" className="bg-ivory">Price: Low to High</option>
                      <option value="price-high" className="bg-ivory">Price: High to Low</option>
                      <option value="newest" className="bg-ivory">Newest</option>
                      <option value="popular" className="bg-ivory">Popular</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                    {paginatedProducts.map((item) => (
                      <ProductCard
                        key={item.product.id}
                        product={item.product}
                        isDiscontinued={item.isDiscontinued}
                        airtableInStock={item.airtableInStock}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-taupe rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-taupe transition-colors text-charcoal bg-ivory"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 border rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-charcoal text-ivory border-charcoal'
                                  : 'border-taupe text-charcoal hover:bg-taupe bg-ivory'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="px-2 text-charcoal">...</span>;
                        }
                        return null;
                      })}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-taupe rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-taupe transition-colors text-charcoal bg-ivory"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-ivory rounded-lg border border-taupe p-12 text-center" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
                  <p className="text-lg text-charcoal">No products found matching your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([priceRangeBounds[0], priceRangeBounds[1]]);
                      setSortBy('default');
                    }}
                    className="mt-4 px-6 py-2 bg-ivory border-2 border-charcoal text-charcoal rounded-lg hover:bg-charcoal hover:text-ivory transition-all duration-400"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

