'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { Warehouse } from './WarehouseContext';

export interface CartItem {
  product: Product;
  variantStrength?: string; // Variant strength (e.g., "5mg", "10mg") - replaces size
  quantity: number; // Number of vials (always 1 vial per quantity unit)
  warehouse: Warehouse;
  calculatedPrice: number; // variantPrice * warehouseMultiplier
  // Legacy support
  size?: string; // Deprecated - use variantStrength instead
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantStrength?: string, warehouse?: Warehouse, calculatedPrice?: number) => void;
  removeItem: (productId: string, variantStrength?: string) => void;
  updateQuantity: (productId: string, variantStrength: string | undefined, quantity: number) => void;
  updateWarehouse: (productId: string, variantStrength: string | undefined, newWarehouse: Warehouse) => void;
  updateItemPrice: (productId: string, variantStrength: string | undefined, newPrice: number) => void;
  updateItemProduct: (productId: string, variantStrength: string | undefined, newProduct: Product) => void;
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
    variantStrength?: string, // Accept variantStrength (preferred) or legacy size
    warehouse: Warehouse = 'overseas',
    calculatedPrice?: number
  ) => {
    // Use variantStrength if provided, otherwise fall back to size for legacy support
    const variant = variantStrength;
    
    // Calculate price if not provided
    let finalPrice = calculatedPrice;
    if (!finalPrice) {
      if (product.variants && variant) {
        // Find variant and calculate price
        const selectedVariant = product.variants.find(v => v.strength === variant);
        if (selectedVariant) {
          const warehouseMultiplier = product.warehouseOptions?.[warehouse]?.priceMultiplier ?? 1.0;
          finalPrice = selectedVariant.price * warehouseMultiplier;
        } else {
          finalPrice = product.price ?? 0;
        }
      } else {
        // Legacy product without variants
        finalPrice = product.price ?? 0;
        const warehouseMultiplier = product.warehouseOptions?.[warehouse]?.priceMultiplier ?? 1.0;
        finalPrice = finalPrice * warehouseMultiplier;
      }
    }
    
    setItems((prevItems) => {
      // Check if same product with same warehouse and variant exists
      const existingItem = prevItems.find(
        (item) => 
          item.product.id === product.id && 
          item.warehouse === warehouse &&
          (item.variantStrength === variant || (!item.variantStrength && !variant))
      );
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id && 
          item.warehouse === warehouse &&
          (item.variantStrength === variant || (!item.variantStrength && !variant))
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { 
        product, 
        quantity, 
        variantStrength: variant,
        warehouse, 
        calculatedPrice: finalPrice 
      }];
    });
  };

  const removeItem = (productId: string, variantStrength?: string) => {
    setItems((prevItems) => 
      prevItems.filter((item) => 
        !(item.product.id === productId && 
          (item.variantStrength === variantStrength || (!item.variantStrength && !variantStrength)))
      )
    );
  };

  const updateQuantity = (productId: string, variantStrength: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, variantStrength);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && 
        (item.variantStrength === variantStrength || (!item.variantStrength && !variantStrength))
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateWarehouse = async (productId: string, variantStrength: string | undefined, newWarehouse: Warehouse) => {
    // Fetch fresh product data from Airtable to get updated prices
    try {
      const response = await fetch(`/api/products?t=${Date.now()}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
      });
      
      if (response.ok) {
        const data = await response.json();
        const { convertAirtableToProducts } = await import('@/lib/airtableProductAdapter');
        const allProducts = convertAirtableToProducts(data.products);
        const freshProduct = allProducts.find((p) => p.slug === productId);
        
        if (freshProduct) {
          setItems((prevItems) =>
            prevItems.map((item) => {
              if (item.product.id === productId && 
                  (item.variantStrength === variantStrength || (!item.variantStrength && !variantStrength))) {
                // Calculate new price based on fresh data
                let basePrice = freshProduct.price ?? 0;
                
                // If product has variants, use variant price
                if (freshProduct.variants && variantStrength) {
                  const variant = freshProduct.variants.find(v => v.strength === variantStrength);
                  if (variant) {
                    basePrice = variant.price;
                  }
                }
                
                const warehouseOption = freshProduct.warehouseOptions?.[newWarehouse];
                const newPrice = warehouseOption
                  ? basePrice * warehouseOption.priceMultiplier
                  : basePrice;
                
                return {
                  ...item,
                  product: freshProduct, // Update product data
                  warehouse: newWarehouse,
                  calculatedPrice: newPrice,
                };
              }
              return item;
            })
          );
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching fresh product data:', error);
    }
    
    // Fallback to using cached product data if fetch fails
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId && 
            (item.variantStrength === variantStrength || (!item.variantStrength && !variantStrength))) {
          // Calculate new price based on warehouse and variant
          let basePrice = item.product.price ?? 0;
          
          // If product has variants, use variant price
          if (item.product.variants && variantStrength) {
            const variant = item.product.variants.find(v => v.strength === variantStrength);
            if (variant) {
              basePrice = variant.price;
            }
          }
          
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

  const updateItemPrice = (productId: string, variantStrength: string | undefined, newPrice: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && 
        (item.variantStrength === variantStrength || (!item.variantStrength && !variantStrength))
          ? { ...item, calculatedPrice: newPrice }
          : item
      )
    );
  };

  const updateItemProduct = (productId: string, variantStrength: string | undefined, newProduct: Product) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product.id === productId && 
            (item.variantStrength === variantStrength || (!item.variantStrength && !variantStrength))) {
          // Recalculate price with new product data
          let basePrice = newProduct.price ?? 0;
          
          if (newProduct.variants && variantStrength) {
            const variant = newProduct.variants.find(v => v.strength === variantStrength);
            if (variant) {
              basePrice = variant.price;
            }
          }
          
          const warehouseOption = newProduct.warehouseOptions?.[item.warehouse];
          const newPrice = warehouseOption
            ? basePrice * warehouseOption.priceMultiplier
            : basePrice;
          
          return {
            ...item,
            product: newProduct,
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
        updateItemPrice,
        updateItemProduct,
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

