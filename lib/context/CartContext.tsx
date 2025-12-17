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
    
    // Calculate price if not provided - always fetch from Airtable if possible
    let finalPrice = calculatedPrice;
    if (!finalPrice || finalPrice <= 0) {
      if (product.variants && variant) {
        // Find variant and calculate price
        const selectedVariant = product.variants.find(v => v.strength === variant);
        if (selectedVariant && selectedVariant.price > 0) {
          const warehouseMultiplier = product.warehouseOptions?.[warehouse]?.priceMultiplier ?? 1.0;
          finalPrice = selectedVariant.price * warehouseMultiplier;
        } else if (product.variants.length > 0 && product.variants[0].price > 0) {
          // Fallback to first variant if exact match not found
          const warehouseMultiplier = product.warehouseOptions?.[warehouse]?.priceMultiplier ?? 1.0;
          finalPrice = product.variants[0].price * warehouseMultiplier;
        } else {
          finalPrice = (product.price ?? 0) * (product.warehouseOptions?.[warehouse]?.priceMultiplier ?? 1.0);
        }
      } else {
        // Legacy product without variants
        const basePrice = product.price ?? 0;
        const warehouseMultiplier = product.warehouseOptions?.[warehouse]?.priceMultiplier ?? 1.0;
        finalPrice = basePrice * warehouseMultiplier;
      }
    }
    
    // Ensure price is valid - if still 0, log error
    if (finalPrice <= 0) {
      console.error('Invalid price calculated when adding to cart:', {
        productName: product.name,
        productId: product.id,
        variant,
        warehouse,
        calculatedPrice,
        productPrice: product.price,
        variants: product.variants?.map(v => ({ strength: v.strength, price: v.price })),
      });
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
        
        // Try to find product by both id and slug (productId might be either)
        const freshProduct = allProducts.find((p) => 
          p.id === productId || p.slug === productId
        );
        
        if (freshProduct) {
          setItems((prevItems) =>
            prevItems.map((item) => {
              if ((item.product.id === productId || item.product.slug === productId) && 
                  (item.variantStrength === variantStrength || (!item.variantStrength && !variantStrength))) {
                // Calculate new price based on fresh data from Airtable
                let basePrice = 0;
                
                // Priority 1: If product has variants, use variant price
                if (freshProduct.variants && freshProduct.variants.length > 0) {
                  // Try to find exact variant match
                  let variant = variantStrength 
                    ? freshProduct.variants.find(v => v.strength === variantStrength)
                    : null;
                  
                  // If exact match not found, try case-insensitive or use first variant
                  if (!variant) {
                    if (variantStrength) {
                      variant = freshProduct.variants.find(v => 
                        v.strength.toLowerCase() === variantStrength.toLowerCase()
                      );
                    }
                    if (!variant) {
                      variant = freshProduct.variants[0]; // Use first variant as fallback
                    }
                  }
                  
                  if (variant && variant.price > 0) {
                    basePrice = variant.price;
                  }
                }
                
                // Priority 2: If no variant price found, use product base price
                if (basePrice <= 0 && freshProduct.price && freshProduct.price > 0) {
                  basePrice = freshProduct.price;
                }
                
                // Priority 3: Last resort - use item's existing variant or price
                if (basePrice <= 0) {
                  if (item.product.variants && variantStrength) {
                    const itemVariant = item.product.variants.find(v => v.strength === variantStrength);
                    if (itemVariant && itemVariant.price > 0) {
                      basePrice = itemVariant.price;
                    } else if (item.product.variants.length > 0 && item.product.variants[0].price > 0) {
                      basePrice = item.product.variants[0].price;
                    }
                  } else if (item.product.price && item.product.price > 0) {
                    basePrice = item.product.price;
                  }
                }
                
                // Apply warehouse multiplier
                const warehouseOption = freshProduct.warehouseOptions?.[newWarehouse];
                const newPrice = warehouseOption && basePrice > 0
                  ? basePrice * warehouseOption.priceMultiplier
                  : basePrice;
                
                // Ensure price is valid
                if (newPrice <= 0) {
                  console.error('Invalid price calculated for product:', {
                    productId,
                    variantStrength,
                    newWarehouse,
                    basePrice,
                    warehouseMultiplier: warehouseOption?.priceMultiplier,
                    freshProduct: {
                      name: freshProduct.name,
                      slug: freshProduct.slug,
                      price: freshProduct.price,
                      variants: freshProduct.variants?.map(v => ({ strength: v.strength, price: v.price })),
                    },
                    itemProduct: {
                      name: item.product.name,
                      slug: item.product.slug,
                      price: item.product.price,
                    },
                  });
                  // Don't update if price is invalid - keep existing price
                  return item;
                }
                
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
          
          // Force a small delay to ensure state updates, then trigger a refresh
          // This ensures useCartRefresh picks up the warehouse change
          setTimeout(() => {
            // The cart items have changed (warehouse updated), which should trigger useCartRefresh
            // But we add a small delay to ensure the state update is complete
          }, 100);
          
          return;
        } else {
          console.error('Product not found in Airtable:', {
            productId,
            searchedBy: 'slug',
            availableProducts: allProducts.slice(0, 3).map(p => ({ slug: p.slug, id: p.id, name: p.name })),
          });
        }
      } else {
        console.error('Failed to fetch products from Airtable API');
      }
    } catch (error) {
      console.error('Error fetching fresh product data:', error);
    }
    
    // Fallback to using cached product data if fetch fails
    setItems((prevItems) =>
      prevItems.map((item) => {
        if ((item.product.id === productId || item.product.slug === productId) && 
            (item.variantStrength === variantStrength || (!item.variantStrength && !variantStrength))) {
          // Calculate new price based on warehouse and variant
          let basePrice = 0;
          
          // Priority 1: If product has variants, use variant price
          if (item.product.variants && item.product.variants.length > 0) {
            let variant = variantStrength
              ? item.product.variants.find(v => v.strength === variantStrength)
              : null;
            
            // Try case-insensitive match or use first variant
            if (!variant && variantStrength) {
              variant = item.product.variants.find(v => 
                v.strength.toLowerCase() === variantStrength.toLowerCase()
              );
            }
            if (!variant) {
              variant = item.product.variants[0];
            }
            
            if (variant && variant.price > 0) {
              basePrice = variant.price;
            }
          }
          
          // Priority 2: Use product base price if no variant found
          if (basePrice <= 0 && item.product.price && item.product.price > 0) {
            basePrice = item.product.price;
          }
          
          // Priority 3: Keep existing calculated price if all else fails
          if (basePrice <= 0) {
            basePrice = item.calculatedPrice || 0;
          }
          
          const warehouseOption = item.product.warehouseOptions?.[newWarehouse];
          const newPrice = warehouseOption && basePrice > 0
            ? basePrice * warehouseOption.priceMultiplier
            : basePrice;
          
          // Only update warehouse, keep price if calculation failed
          return {
            ...item,
            warehouse: newWarehouse,
            calculatedPrice: newPrice > 0 ? newPrice : item.calculatedPrice,
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

