'use client';

import { Product, hasVariants } from '@/data/products';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { getVariantDescription } from '@/lib/utils/variant-descriptions';
import { useState } from 'react';

interface VariantComparisonTableProps {
  product: Product;
}

export default function VariantComparisonTable({ product }: VariantComparisonTableProps) {
  const { selectedWarehouse } = useWarehouse();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMultipleVariants = hasVariants(product);

  if (!hasMultipleVariants || !product.variants || product.variants.length < 2) {
    return null;
  }

  const warehouseMultiplier = product.warehouseOptions?.[selectedWarehouse]?.priceMultiplier ?? 1.0;

  return (
    <div className="mt-6 border border-luxury-gold/20 rounded-lg overflow-hidden">
      {/* Header - Collapsible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-secondary-charcoal hover:bg-luxury-gold/10 transition-colors flex items-center justify-between"
      >
        <h3 className="text-heading text-lg font-semibold text-accent-gold-light">
          Strength Comparison Table
        </h3>
        <svg
          className={`w-5 h-5 text-luxury-gold transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Table Content */}
      {isExpanded && (
        <div className="bg-primary-black overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-luxury-gold/20">
                <th className="px-4 py-3 text-left text-sm font-semibold text-accent-gold-light">
                  Strength
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-accent-gold-light">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-accent-gold-light">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-accent-gold-light">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-accent-gold-light">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((variant, index) => {
                const variantPrice = variant.price * warehouseMultiplier;
                const description = getVariantDescription(product.name, variant.strength);
                
                return (
                  <tr
                    key={variant.strength}
                    className={`border-b border-luxury-gold/10 ${
                      index % 2 === 0 ? 'bg-secondary-charcoal/50' : 'bg-primary-black'
                    }`}
                  >
                    <td className="px-4 py-3 text-pure-white font-semibold">
                      {variant.strength}
                    </td>
                    <td className="px-4 py-3 text-luxury-gold font-semibold">
                      ${variantPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-pure-white font-mono text-sm">
                      {variant.sku}
                    </td>
                    <td className="px-4 py-3">
                      {variant.inStock ? (
                        <span className="text-green-400 text-sm font-medium">In Stock</span>
                      ) : (
                        <span className="text-red-400 text-sm font-medium">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-pure-white text-sm">
                      {description || (
                        <span className="text-neutral-gray italic">
                          Standard concentration for laboratory research
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

