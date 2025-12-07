'use client';

import Link from 'next/link';
import { Product, hasVariants, getProductMinPrice, isProductInStock } from '@/data/products';
import StockImage from '@/components/images/StockImage';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { useCart } from '@/lib/context/CartContext';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { useToast } from '@/components/ui/ToastProvider';
import { useState, useEffect, useRef } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
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

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCart();
  const { selectedWarehouse, getPrice } = useWarehouse();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [showInitialGlow, setShowInitialGlow] = useState(true);

  // Check if product has variants
  const hasMultipleVariants = hasVariants(product);
  
  // Get display price (minimum variant price or legacy price)
  const minPrice = getProductMinPrice(product);
  const displayPrice = hasMultipleVariants ? minPrice : getPrice(product);
  
  // Check stock status
  const inStock = isProductInStock(product);
  
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
    
    // Gold pulse glow feedback at button location
    if (buttonRef.current) {
      const originalStyle = buttonRef.current.style.boxShadow;
      buttonRef.current.style.boxShadow = '0 0 20px rgba(245, 214, 123, 0.5)';
      buttonRef.current.style.transition = 'box-shadow 0.3s ease-out';
      
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.boxShadow = originalStyle || '0 4px 12px rgba(245, 214, 123, 0.25)';
        }
      }, 500);
    }
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div
      className={`bg-secondary-charcoal rounded-lg border border-luxury-gold/20 overflow-hidden shadow-md transition-all duration-400 flex flex-col ${className}`}
      style={{
        transform: 'perspective(1000px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateY(2deg)';
        e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 214, 123, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Product Image - Larger Thumbnail */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative w-full h-80 overflow-hidden bg-primary-black">
          <StockImage
            imageType="product-placeholder"
            context={product.name}
            fill
            className="transition-transform duration-400 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <h2 className="text-heading text-xl font-bold text-accent-gold-light hover:text-luxury-gold transition-colors duration-400">
              {product.name}
            </h2>
          </Link>
          {hasMultipleVariants && (
            <span className="text-xs bg-luxury-gold/10 text-accent-gold-light px-2 py-1 rounded border border-luxury-gold/30 whitespace-nowrap">
              Multiple Strengths
            </span>
          )}
        </div>
        
        {/* Show strength for products without variants */}
        {!hasMultipleVariants && productStrength && (
          <div className="mb-2">
            <span className="text-sm text-neutral-gray font-medium">
              Strength: <span className="text-accent-gold-light">{productStrength}</span>
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            {hasMultipleVariants ? (
              <>
                <span className="text-sm text-neutral-gray">from</span>
                <span className="text-2xl font-bold text-luxury-gold">
                  ${displayPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-luxury-gold">
                ${displayPrice.toFixed(2)}
              </span>
            )}
          </div>
          {hasMultipleVariants && (
            <p className="text-xs text-neutral-gray mt-1 italic">
              Available in multiple strengths
            </p>
          )}
          {/* Show "1 vial per order" for all products */}
          <p className="text-xs text-neutral-gray mt-1">
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
                  className="w-full bg-luxury-gold text-primary-black text-center py-3.5 px-4 rounded-lg font-semibold hover:bg-accent-gold-light transition-all duration-400 shadow-md hover:shadow-xl text-sm block min-h-[44px] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    boxShadow: showInitialGlow 
                      ? '0 0 15px rgba(245, 214, 123, 0.4)' 
                      : '0 4px 12px rgba(245, 214, 123, 0.25)',
                    transition: 'box-shadow 0.4s ease-out',
                  }}
                >
                  SELECT STRENGTH
                </Link>
              ) : (
                <button
                  ref={buttonRef as React.RefObject<HTMLButtonElement>}
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full bg-luxury-gold text-primary-black text-center py-3.5 px-4 rounded-lg font-semibold hover:bg-accent-gold-light transition-all duration-400 shadow-md hover:shadow-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
                  style={{
                    boxShadow: showInitialGlow 
                      ? '0 0 15px rgba(245, 214, 123, 0.4)' 
                      : '0 4px 12px rgba(245, 214, 123, 0.25)',
                    transition: 'box-shadow 0.4s ease-out',
                  }}
                >
                  {isAdding ? 'ADDING...' : 'ADD TO CART'}
                </button>
              )}
            </>
          ) : (
            <button
              disabled
              className="w-full bg-neutral-gray/30 text-neutral-gray text-center py-3.5 px-4 rounded-lg font-semibold cursor-not-allowed text-sm min-h-[44px] flex items-center justify-center"
            >
              OUT OF STOCK
            </button>
          )}
          
          {/* Secondary CTA: Read More - Always visible */}
          <Link
            href={`/products/${product.slug}`}
            className="w-full bg-transparent border-2 border-luxury-gold/50 text-luxury-gold text-center py-3 px-4 rounded-lg font-semibold hover:bg-luxury-gold/10 hover:border-luxury-gold transition-all duration-400 text-sm block min-h-[44px] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            READ MORE
          </Link>
        </div>
      </div>
    </div>
  );
}

