'use client';

import { Product, ProductVariant, hasVariants, getDefaultVariant } from '@/data/products';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { getVariantDescription } from '@/lib/utils/variant-descriptions';
import { useState, useEffect } from 'react';

interface VariantSelectorProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  product,
  selectedVariant,
  onVariantChange,
}: VariantSelectorProps) {
  const { selectedWarehouse } = useWarehouse();
  const hasMultipleVariants = hasVariants(product);
  const [showInitialGlow, setShowInitialGlow] = useState(true);

  // If no variants, return null (product uses legacy structure)
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  // Initial glow animation (2 seconds on mount)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialGlow(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Get warehouse multiplier
  const warehouseMultiplier =
    product.warehouseOptions?.[selectedWarehouse]?.priceMultiplier ?? 1.0;

  // Calculate price for a variant
  const getVariantPrice = (variant: ProductVariant) => {
    return variant.price * warehouseMultiplier;
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-charcoal mb-3">
        SELECT STRENGTH
      </label>
      
      {/* Variant Options - Segmented Button Style */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {product.variants.map((variant) => {
          const isSelected = selectedVariant?.strength === variant.strength;
          const variantPrice = getVariantPrice(variant);
          
          return (
            <button
              key={variant.strength}
              type="button"
              onClick={() => onVariantChange(variant)}
              disabled={!variant.inStock}
              className={`
                relative px-4 py-3 rounded-lg border-2 transition-all duration-400 text-sm font-semibold font-serif
                ${
                  isSelected
                    ? 'border-charcoal bg-taupe text-charcoal'
                    : variant.inStock
                    ? 'border-taupe bg-ivory text-charcoal hover:border-charcoal hover:bg-taupe'
                    : 'border-stone bg-ivory text-stone cursor-not-allowed opacity-50'
                }
              `}
              style={{
                boxShadow: isSelected ? '0 2px 8px rgba(43, 43, 43, 0.15)' : 'none',
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-base font-bold">{variant.strength}</span>
                <span className="text-xs mt-1">
                  ${variantPrice.toFixed(2)}
                </span>
                {!variant.inStock && (
                  <span className="text-xs text-red-600 mt-1">Out of Stock</span>
                )}
              </div>
              
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-ivory"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Variant Description - with fade transition */}
      {selectedVariant && (
        <div 
          key={selectedVariant.strength}
          className="mt-4 p-3 bg-taupe border border-stone rounded-lg animate-fade-in"
        >
          {(() => {
            const description = getVariantDescription(product.name, selectedVariant.strength);
            if (description) {
              return (
                <p className="text-sm text-charcoal leading-relaxed">
                  {description}
                </p>
              );
            }
            // Fallback description if no specific description exists
            return (
              <p className="text-sm text-charcoal leading-relaxed">
                The {selectedVariant.strength} strength provides a {selectedVariant.strength.includes('mg') && parseFloat(selectedVariant.strength) >= 10 ? 'higher' : 'standard'} peptide concentration suitable for laboratory research protocols.
              </p>
            );
          })()}
        </div>
      )}

      {/* Info Line */}
      <p className="text-xs text-stone mt-3 italic">
        Each unit corresponds to one research vial. For laboratory use only.
      </p>
    </div>
  );
}

