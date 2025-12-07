'use client';

import { useState, useEffect } from 'react';
import AddToCartButton from './AddToCartButton';
import { Product, ProductVariant } from '@/data/products';

interface FloatingAddToCartProps {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  warehousePrice: number;
}

export default function FloatingAddToCart({
  product,
  variant,
  quantity,
  warehousePrice,
}: FloatingAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating button after scrolling 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary-black border-t border-luxury-gold/20 p-4 z-40 shadow-lg" style={{ boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.5)' }}>
      <AddToCartButton 
        product={product} 
        variant={variant}
        quantity={quantity}
        warehousePrice={warehousePrice}
      />
    </div>
  );
}

