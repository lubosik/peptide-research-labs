'use client';

import { useState } from 'react';
import { categories } from '@/data/categories';
import { useWarehouse } from '@/lib/context/WarehouseContext';

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

export default function FilterBar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
}: FilterBarProps) {
  const { selectedWarehouse, setSelectedWarehouse } = useWarehouse();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-taupe border-b border-stone py-4">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading text-lg font-semibold text-charcoal">FILTERS</h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-charcoal hover:text-charcoal/80 transition-colors duration-400 text-sm underline"
            >
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filter Controls */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full border border-taupe rounded-lg px-4 py-2 text-charcoal bg-ivory focus:outline-none focus:border-charcoal transition-all duration-400 font-serif"
                >
                  <option value="all" className="bg-ivory">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug} className="bg-ivory">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Price Range: ${priceRange[0].toFixed(0)} - ${priceRange[1].toFixed(0)}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                    className="flex-1 accent-charcoal"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 accent-charcoal"
                  />
                </div>
              </div>

              {/* Warehouse Filter */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Warehouse</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedWarehouse('overseas')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-400 ${
                      selectedWarehouse === 'overseas'
                        ? 'bg-charcoal text-ivory'
                        : 'bg-ivory border border-taupe text-charcoal hover:border-charcoal'
                    }`}
                  >
                    Overseas
                  </button>
                  <button
                    onClick={() => setSelectedWarehouse('us')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-400 ${
                      selectedWarehouse === 'us'
                        ? 'bg-charcoal text-ivory'
                        : 'bg-ivory border border-taupe text-charcoal hover:border-charcoal'
                    }`}
                  >
                    US
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

