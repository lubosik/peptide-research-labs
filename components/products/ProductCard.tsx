'use client';

import Link from 'next/link';
import { Product } from '@/data/products';
import StockImage from '@/components/images/StockImage';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { useCart } from '@/lib/context/CartContext';
import { useToast } from '@/components/ui/ToastProvider';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addItem(product, 1);
    showToast(`${product.name} added to cart!`, 'success');
    
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-xl hover:shadow-glow-sm transition-all duration-300 flex flex-col glow-on-hover gpu-accelerated ${className}`}
    >
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative w-full h-64 overflow-hidden">
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
          <h2 className="text-heading text-xl font-bold text-accent-gray mb-2 hover:text-primary transition-colors">
            {product.name}
          </h2>
        </Link>
        <p className="text-sm text-text-gray mb-4 flex-grow">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-accent-gray">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Stock Status */}
        {product.inStock ? (
          <span className="text-sm text-green-600 font-medium mb-4">
            In Stock
          </span>
        ) : (
          <span className="text-sm text-red-600 font-medium mb-4">
            Out of Stock
          </span>
        )}

        {/* RUO Disclaimer */}
        <div className="mb-4 p-3 bg-secondary/5 border border-secondary/20 rounded text-xs text-text-gray">
          {getComplianceText('RUO_DISCLAIMER')}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          {product.inStock ? (
            <>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-primary text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-glow-sm glow-on-hover gpu-accelerated text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? 'ADDING...' : 'ADD TO CART'}
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="w-full bg-gray-100 text-accent-gray text-center py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 text-sm text-center"
                onClick={(e) => e.stopPropagation()}
              >
                Read More
              </Link>
            </>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 text-center py-3 px-4 rounded-lg font-semibold cursor-not-allowed text-sm"
            >
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

