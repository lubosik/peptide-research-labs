'use client';

import { useState, useRef } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { useToast } from '@/components/ui/ToastProvider';
import { Product, ProductVariant, isProductInStock } from '@/data/products';

interface AddToCartButtonProps {
  product: Product;
  variant?: ProductVariant | null;
  quantity?: number;
  warehousePrice?: number;
  className?: string;
}

export default function AddToCartButton({
  product,
  variant,
  quantity = 1,
  warehousePrice,
  className = '',
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { selectedWarehouse, getPrice } = useWarehouse();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = () => {
    if (!variant) {
      showToast('Please select a strength', 'error');
      return;
    }

    if (!variant.inStock) {
      showToast('This strength is out of stock', 'error');
      return;
    }

    setIsAdding(true);
    const finalPrice = warehousePrice ?? getPrice(product);
    
    // Pass variant strength as the variantStrength parameter
    addItem(product, quantity, variant.strength, selectedWarehouse, finalPrice);
    
    const variantName = variant.strength ? `${product.name} (${variant.strength})` : product.name;
    showToast(`${variantName} added to cart!`, 'success');

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

    // Brief delay for visual feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  // Update button state based on variant selection - updates instantly when variant changes
  const isButtonReady = variant && variant.inStock;

  const inStock = variant ? variant.inStock : isProductInStock(product);

  if (!inStock) {
    return (
      <button
        disabled
        className={`w-full bg-neutral-gray/30 text-neutral-gray py-4 px-6 rounded-lg font-semibold text-lg cursor-not-allowed min-h-[44px] flex items-center justify-center ${className}`}
      >
        OUT OF STOCK
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleAddToCart}
      disabled={isAdding || !isButtonReady}
      className={`w-full bg-luxury-gold text-primary-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-accent-gold-light transition-all duration-400 shadow-lg hover:shadow-xl min-h-[44px] flex items-center justify-center ${className} ${
        isAdding ? 'opacity-75 cursor-wait' : ''
      } ${!isButtonReady ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        boxShadow: '0 4px 12px rgba(245, 214, 123, 0.25)',
        backgroundColor: '#E5C047', // 10% brighter gold for better visibility
      }}
    >
      {isAdding ? 'ADDING...' : 'ADD TO CART'}
    </button>
  );
}

