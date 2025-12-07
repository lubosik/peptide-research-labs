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
    <div className="bg-secondary-charcoal border-b border-luxury-gold/20 py-4">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading text-lg font-semibold text-accent-gold-light">FILTERS</h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-luxury-gold hover:text-accent-gold-light transition-colors duration-400 text-sm"
            >
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filter Controls */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-pure-white mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full border border-luxury-gold/30 rounded-lg px-4 py-2 text-pure-white bg-primary-black focus:outline-none focus:border-luxury-gold transition-all duration-400"
                >
                  <option value="all" className="bg-primary-black">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug} className="bg-primary-black">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-pure-white mb-2">
                  Price Range: ${priceRange[0].toFixed(0)} - ${priceRange[1].toFixed(0)}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                    className="flex-1 accent-luxury-gold"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 accent-luxury-gold"
                  />
                </div>
              </div>

              {/* Warehouse Filter */}
              <div>
                <label className="block text-sm font-semibold text-pure-white mb-2">Warehouse</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedWarehouse('overseas')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-400 ${
                      selectedWarehouse === 'overseas'
                        ? 'bg-luxury-gold text-primary-black'
                        : 'bg-primary-black border border-luxury-gold/30 text-pure-white hover:border-luxury-gold'
                    }`}
                  >
                    Overseas
                  </button>
                  <button
                    onClick={() => setSelectedWarehouse('us')}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-400 ${
                      selectedWarehouse === 'us'
                        ? 'bg-luxury-gold text-primary-black'
                        : 'bg-primary-black border border-luxury-gold/30 text-pure-white hover:border-luxury-gold'
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

