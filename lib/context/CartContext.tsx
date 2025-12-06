'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { Warehouse } from './WarehouseContext';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  warehouse: Warehouse;
  calculatedPrice: number; // basePrice * warehouseMultiplier
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, warehouse?: Warehouse, calculatedPrice?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateWarehouse: (productId: string, size: string | undefined, newWarehouse: Warehouse) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (
    product: Product, 
    quantity: number = 1, 
    size?: string, 
    warehouse: Warehouse = 'overseas',
    calculatedPrice?: number
  ) => {
    // Calculate price if not provided
    const finalPrice = calculatedPrice ?? product.price;
    
    setItems((prevItems) => {
      // Check if same product with same warehouse and size exists
      const existingItem = prevItems.find(
        (item) => 
          item.product.id === product.id && 
          item.warehouse === warehouse &&
          item.size === size
      );
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && 
          item.warehouse === warehouse &&
          item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity, size, warehouse, calculatedPrice: finalPrice }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateWarehouse = (productId: string, size: string | undefined, newWarehouse: Warehouse) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId && item.size === size) {
          // Calculate new price based on warehouse
          const basePrice = item.product.price;
          const warehouseOption = item.product.warehouseOptions?.[newWarehouse];
          const newPrice = warehouseOption
            ? basePrice * warehouseOption.priceMultiplier
            : basePrice;
          
          return {
            ...item,
            warehouse: newWarehouse,
            calculatedPrice: newPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.calculatedPrice * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateWarehouse,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

