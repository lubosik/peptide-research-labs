'use client';

import { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { useToast } from '@/components/ui/ToastProvider';
import { Product } from '@/data/products';

interface AddToCartButtonProps {
  product: Product;
  size?: string;
  quantity?: number;
  warehousePrice?: number;
  className?: string;
}

export default function AddToCartButton({
  product,
  size,
  quantity = 1,
  warehousePrice,
  className = '',
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { selectedWarehouse, getPrice } = useWarehouse();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    const finalPrice = warehousePrice ?? getPrice(product);
    addItem(product, quantity, size, selectedWarehouse, finalPrice);
    showToast(`${product.name} added to cart!`, 'success');

    // Brief delay for visual feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  if (!product.inStock) {
    return (
      <button
        disabled
        className={`w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-lg font-semibold text-lg cursor-not-allowed ${className}`}
      >
        OUT OF STOCK
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-glow-md glow-on-hover gpu-accelerated ${className} ${
        isAdding ? 'opacity-75 cursor-wait' : ''
      }`}
    >
      {isAdding ? 'ADDING...' : 'ADD TO CART'}
    </button>
  );
}

