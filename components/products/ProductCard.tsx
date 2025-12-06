'use client';

import Link from 'next/link';
import { Product } from '@/data/products';
import StockImage from '@/components/images/StockImage';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { useCart } from '@/lib/context/CartContext';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { useToast } from '@/components/ui/ToastProvider';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCart();
  const { selectedWarehouse, getPrice } = useWarehouse();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const displayPrice = getPrice(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addItem(product, 1, undefined, selectedWarehouse, displayPrice);
    showToast(`${product.name} added to cart!`, 'success');
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div
      className={`bg-secondary-charcoal rounded-lg border border-luxury-gold/20 overflow-hidden shadow-md hover:shadow-xl hover:shadow-golden-glow transition-all duration-300 flex flex-col hover-glow gpu-accelerated ${className}`}
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative w-full h-64 overflow-hidden bg-primary-black">
          <StockImage
            imageType="product-placeholder"
            context={product.name}
            fill
            className="transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex-grow flex flex-col">
        <Link href={`/products/${product.slug}`}>
          <h2 className="text-heading text-xl font-bold text-accent-gold-light mb-2 hover:text-luxury-gold transition-colors">
            {product.name}
          </h2>
        </Link>
        <p className="text-sm text-pure-white mb-4 flex-grow">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-luxury-gold">
              ${displayPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Stock Status */}
        {product.inStock ? (
          <span className="text-sm text-green-400 font-medium mb-4">
            In Stock
          </span>
        ) : (
          <span className="text-sm text-red-400 font-medium mb-4">
            Out of Stock
          </span>
        )}

        {/* RUO Disclaimer */}
        <div className="mb-4 p-3 bg-luxury-gold/10 border border-luxury-gold/20 rounded text-xs text-pure-white">
          {getComplianceText('RUO_DISCLAIMER')}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          {product.inStock ? (
            <>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-luxury-gold text-primary-black text-center py-3 px-4 rounded-lg font-semibold hover:bg-accent-gold-light transition-all duration-300 shadow-md hover:shadow-golden-glow animate-gold-pulse text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? 'ADDING...' : 'ADD TO CART'}
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="w-full bg-transparent border border-luxury-gold/50 text-luxury-gold text-center py-3 px-4 rounded-lg font-semibold hover:bg-luxury-gold hover:text-primary-black transition-all duration-300 text-sm text-center"
                onClick={(e) => e.stopPropagation()}
              >
                Read More
              </Link>
            </>
          ) : (
            <button
              disabled
              className="w-full bg-neutral-gray/30 text-neutral-gray text-center py-3 px-4 rounded-lg font-semibold cursor-not-allowed text-sm"
            >
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

