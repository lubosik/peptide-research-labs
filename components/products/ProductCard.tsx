'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product, hasVariants, getProductMinPrice, isProductInStock } from '@/data/products';
import { getProductImage } from '@/lib/products/get-product-image';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { useCart } from '@/lib/context/CartContext';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { useToast } from '@/components/ui/ToastProvider';
import { useState, useEffect, useRef } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
  isDiscontinued?: boolean; // Airtable field
  airtableInStock?: boolean; // Airtable field (overrides product.inStock)
}

/**
 * Extract strength/size from product specification or name for products without variants
 */
function getProductStrength(product: Product): string | null {
  if (hasVariants(product)) {
    return null; // Products with variants don't show strength on card
  }
  
  // Try to extract from specification
  if (product.specification) {
    // Remove "× 10 vials" if present (since each sale is 1 vial)
    const spec = product.specification.replace(/\s*×\s*10\s*vials?/i, '').trim();
    if (spec) return spec;
  }
  
  // Try to extract from name (e.g., "HMG (75iu × 10 vials)" -> "75iu")
  const nameMatch = product.name.match(/\(([^)]+)\)/);
  if (nameMatch) {
    const match = nameMatch[1].replace(/\s*×\s*10\s*vials?/i, '').trim();
    if (match) return match;
  }
  
  return null;
}

export default function ProductCard({ product, className = '', isDiscontinued = false, airtableInStock }: ProductCardProps) {
  const { addItem } = useCart();
  const { selectedWarehouse, getPrice } = useWarehouse();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [showInitialGlow, setShowInitialGlow] = useState(true);

  // Check if product has variants
  const hasMultipleVariants = hasVariants(product);
  
  // Get display price (minimum variant price or legacy price)
  // Always use minPrice calculation to ensure we get the lowest variant price
  const minPrice = getProductMinPrice(product);
  // For products with variants, show "from $X.XX", for single products show the price
  const displayPrice = minPrice > 0 ? minPrice : (product.price ?? 0);
  
  // Check stock status (Airtable takes precedence)
  const inStock = airtableInStock !== undefined ? airtableInStock : isProductInStock(product);
  
  // Get strength for products without variants
  const productStrength = getProductStrength(product);

  // Initial glow animation (2 seconds on mount)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialGlow(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If product has variants, redirect to product page instead
    if (hasMultipleVariants) {
      window.location.href = `/products/${product.slug}`;
      return;
    }
    
    setIsAdding(true);
    addItem(product, 1, undefined, selectedWarehouse, displayPrice);
    showToast(`${product.name} added to cart!`, 'success');
    
    // Subtle shadow feedback at button location
    if (buttonRef.current) {
      const originalStyle = buttonRef.current.style.boxShadow;
      buttonRef.current.style.boxShadow = '0 4px 12px rgba(43, 43, 43, 0.2)';
      buttonRef.current.style.transition = 'box-shadow 0.3s ease-out';
      
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.boxShadow = originalStyle || '0 2px 8px rgba(43, 43, 43, 0.1)';
        }
      }, 500);
    }
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div
      className={`bg-ivory rounded-lg border border-taupe overflow-hidden shadow-md transition-all duration-400 flex flex-col relative ${className} ${isDiscontinued ? 'opacity-50' : ''}`}
      style={{
        boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
      }}
      onMouseEnter={(e) => {
        if (!isDiscontinued) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 43, 43, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(43, 43, 43, 0.1)';
      }}
    >
      {/* Out of Stock Overlay */}
      {!inStock && !isDiscontinued && (
        <div className="absolute inset-0 bg-ivory/90 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-charcoal font-bold text-lg uppercase tracking-wide" style={{ color: '#DC2626' }}>
            OUT OF STOCK
          </div>
        </div>
      )}
      
      {/* Discontinued Overlay */}
      {isDiscontinued && (
        <div className="absolute inset-0 bg-ivory/90 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-stone font-semibold text-base text-center px-4">
            This research compound has been retired
          </div>
        </div>
      )}
      {/* Product Image - Larger Thumbnail */}
      <Link href={`/products/${product.slug}`} className={`block ${isDiscontinued ? 'pointer-events-none' : ''}`}>
        <div className="relative w-full h-80 overflow-hidden bg-taupe">
          <Image
            src={getProductImage(product.name)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-400 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/products/${product.slug}`} className={`flex-1 ${isDiscontinued ? 'pointer-events-none' : ''}`}>
            <h2 className="text-heading text-xl font-bold text-charcoal hover:text-charcoal/80 transition-colors duration-400">
              {product.name}
            </h2>
          </Link>
          {hasMultipleVariants && (
            <span className="text-xs bg-taupe text-charcoal px-2 py-1 rounded border border-stone whitespace-nowrap">
              Multiple Strengths
            </span>
          )}
        </div>
        
        {/* Show strength for products without variants */}
        {!hasMultipleVariants && productStrength && (
          <div className="mb-2">
            <span className="text-sm text-charcoal font-semibold">
              Strength: <span className="text-charcoal font-bold">{productStrength}</span>
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            {hasMultipleVariants ? (
              <>
                <span className="text-sm text-charcoal font-semibold">from</span>
                <span className="text-2xl font-bold text-charcoal">
                  ${displayPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-charcoal">
                ${displayPrice.toFixed(2)}
              </span>
            )}
          </div>
          {hasMultipleVariants && (
            <p className="text-xs text-charcoal mt-1 italic font-medium">
              Available in multiple strengths
            </p>
          )}
          {/* Show "1 vial per order" for all products */}
          <p className="text-xs text-charcoal mt-1 font-medium">
            Each unit = 1 research vial
          </p>
        </div>

        {/* Action Buttons - Two CTAs: Read More + Add to Cart/Select Strength */}
        <div className="mt-auto space-y-2">
          {/* Primary CTA: Add to Cart or Select Strength */}
          {inStock ? (
            <>
              {hasMultipleVariants ? (
                <Link
                  ref={buttonRef as React.RefObject<HTMLAnchorElement>}
                  href={`/products/${product.slug}`}
                  className="w-full bg-ivory border-2 border-charcoal text-charcoal text-center py-3.5 px-4 rounded-lg font-semibold hover:bg-charcoal hover:text-ivory transition-all duration-400 text-sm block min-h-[44px] flex items-center justify-center uppercase tracking-wide"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
                  }}
                >
                  SELECT STRENGTH
                </Link>
              ) : (
                <button
                  ref={buttonRef as React.RefObject<HTMLButtonElement>}
                  onClick={handleAddToCart}
                  disabled={isAdding || isDiscontinued}
                  className="w-full bg-ivory border-2 border-charcoal text-charcoal text-center py-3.5 px-4 rounded-lg font-semibold hover:bg-charcoal hover:text-ivory transition-all duration-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center uppercase tracking-wide"
                  style={{
                    boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
                  }}
                >
                  {isAdding ? 'ADDING...' : 'ADD TO CART'}
                </button>
              )}
            </>
          ) : (
            <button
              disabled
              className="w-full bg-stone/30 text-stone text-center py-3.5 px-4 rounded-lg font-semibold cursor-not-allowed text-sm min-h-[44px] flex items-center justify-center uppercase tracking-wide"
            >
              OUT OF STOCK
            </button>
          )}
          
          {/* Secondary CTA: Read More - Always visible (unless discontinued) */}
          {!isDiscontinued && (
            <Link
              href={`/products/${product.slug}`}
              className="w-full bg-transparent border-2 border-taupe text-charcoal text-center py-3 px-4 rounded-lg font-semibold hover:bg-taupe transition-all duration-400 text-sm block min-h-[44px] flex items-center justify-center uppercase tracking-wide"
              onClick={(e) => e.stopPropagation()}
            >
              READ MORE
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

