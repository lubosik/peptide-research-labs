'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CartItem } from '@/lib/context/CartContext';
import { Product } from '@/data/products';
import { convertAirtableToProducts } from '@/lib/airtableProductAdapter';

interface CartItemValidation {
  item: CartItem;
  isValid: boolean;
  errors: string[];
  updatedProduct?: Product;
  updatedPrice?: number;
}

/**
 * Hook to refresh cart items with fresh data from Airtable
 * Validates prices, stock status, and product availability
 */
export function useCartRefresh(cartItems: CartItem[]) {
  const [validatedItems, setValidatedItems] = useState<CartItemValidation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRefreshingRef = useRef(false);
  const lastCartItemsRef = useRef<string>('');
  const cartItemsRef = useRef<CartItem[]>(cartItems);
  
  // Keep ref in sync with current cartItems
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  const refreshCartItems = useCallback(async () => {
    const currentItems = cartItemsRef.current;
    
    if (currentItems.length === 0) {
      setValidatedItems([]);
      setLoading(false);
      isRefreshingRef.current = false;
      return;
    }

    // Prevent multiple simultaneous refreshes
    if (isRefreshingRef.current) {
      return;
    }

    // Create a stable key from cart items to detect actual changes (NOT including price)
    const cartKey = JSON.stringify(currentItems.map(item => ({
      id: item.product.id,
      variant: item.variantStrength,
      warehouse: item.warehouse,
    })));
    
    // Only refresh if cart items actually changed (not just prices)
    // Note: lastCartItemsRef is already updated in useEffect, so we check here to prevent duplicate calls
    if (cartKey === lastCartItemsRef.current) {
      setLoading(false);
      isRefreshingRef.current = false;
      return;
    }
    isRefreshingRef.current = true;
    setLoading(true);
    setError(null);

    // Safety timeout to ensure loading state clears even if something goes wrong
    const safetyTimeout = setTimeout(() => {
      if (isRefreshingRef.current) {
        console.warn('Cart refresh taking too long, clearing loading state');
        setLoading(false);
        isRefreshingRef.current = false;
      }
    }, 15000); // 15 second safety timeout

    let fetchTimeoutId: NodeJS.Timeout;

    try {
      // Fetch all products from Airtable with timeout
      const controller = new AbortController();
      fetchTimeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/products?t=${Date.now()}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
        signal: controller.signal,
      });

      clearTimeout(fetchTimeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch products from Airtable: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid response from Airtable API');
      }
      
      const allProducts = convertAirtableToProducts(data.products);

      // Validate each cart item (use current items from ref)
      const validations: CartItemValidation[] = currentItems.map((item) => {
        const errors: string[] = [];
        
        // Find the product in fresh Airtable data - try multiple methods
        let freshProduct = allProducts.find((p) => p.slug === item.product.slug);
        
        // If not found by slug, try by id
        if (!freshProduct) {
          freshProduct = allProducts.find((p) => p.id === item.product.id || p.id === item.product.slug);
        }
        
        // If still not found, try by name (for products with special characters)
        if (!freshProduct) {
          freshProduct = allProducts.find((p) => 
            p.name.toLowerCase() === item.product.name.toLowerCase() ||
            p.name.toLowerCase().includes(item.product.name.toLowerCase()) ||
            item.product.name.toLowerCase().includes(p.name.toLowerCase())
          );
        }
        
        if (!freshProduct) {
          console.error('Product not found in Airtable:', {
            itemSlug: item.product.slug,
            itemId: item.product.id,
            itemName: item.product.name,
            availableProducts: allProducts.slice(0, 5).map(p => ({ slug: p.slug, id: p.id, name: p.name })),
          });
          errors.push('Product no longer available');
          return {
            item,
            isValid: false,
            errors,
          };
        }

        // Check if product is discontinued
        const airtableProduct = data.products.find(
          (ap: any) => ap.productSlug === item.product.slug
        );
        if (airtableProduct?.isDiscontinued) {
          errors.push('Product has been discontinued');
        }

        // Validate variant if present
        let updatedPrice = item.calculatedPrice;
        if (item.variantStrength) {
          // Try to find variant with exact match first
          let variant = freshProduct.variants?.find(
            (v) => v.strength === item.variantStrength
          );
          
          // If exact match not found, try case-insensitive or partial match
          if (!variant && freshProduct.variants && item.variantStrength) {
            variant = freshProduct.variants.find(
              (v) => v.strength.toLowerCase() === item.variantStrength!.toLowerCase() ||
                     v.strength === item.variantStrength!.trim()
            );
          }
          
          // If still not found, use first variant as fallback
          if (!variant && freshProduct.variants && freshProduct.variants.length > 0) {
            variant = freshProduct.variants[0];
            console.warn(`Variant ${item.variantStrength} not found for ${freshProduct.name}, using first variant: ${variant.strength}`);
          }
          
          if (!variant) {
            errors.push('Variant no longer available');
            return {
              item,
              isValid: false,
              errors,
            };
          }

          // Check stock status
          if (!variant.inStock) {
            errors.push('Variant is out of stock');
          }

          // Calculate updated price with warehouse multiplier
          const warehouseMultiplier = freshProduct.warehouseOptions?.[item.warehouse]?.priceMultiplier ?? 1.0;
          const variantPrice = variant.price || 0;
          updatedPrice = variantPrice * warehouseMultiplier;
          
          // Ensure price is valid
          if (updatedPrice <= 0 || variantPrice <= 0) {
            console.error('Invalid variant price:', {
              productName: freshProduct.name,
              variantStrength: item.variantStrength,
              variantPrice,
              warehouseMultiplier,
              calculatedPrice: updatedPrice,
            });
            errors.push('Invalid price for variant');
          }
        } else {
          // For non-variant products, check stock
          if (freshProduct.inStock === false) {
            errors.push('Product is out of stock');
          }

          // Calculate updated price with warehouse multiplier
          const warehouseMultiplier = freshProduct.warehouseOptions?.[item.warehouse]?.priceMultiplier ?? 1.0;
          let basePrice = freshProduct.price ?? 0;
          
          // If product has variants but no variantStrength specified, use first variant price
          if (basePrice <= 0 && freshProduct.variants && freshProduct.variants.length > 0) {
            basePrice = freshProduct.variants[0].price || 0;
          }
          
          updatedPrice = basePrice * warehouseMultiplier;
          
          // Ensure price is valid
          if (updatedPrice <= 0 || basePrice <= 0) {
            console.error('Invalid product price:', {
              productName: freshProduct.name,
              basePrice,
              warehouseMultiplier,
              calculatedPrice: updatedPrice,
              hasVariants: !!freshProduct.variants,
            });
            errors.push('Invalid price for product');
          }
        }

        // Check warehouse availability
        const warehouseOption = freshProduct.warehouseOptions?.[item.warehouse];
        if (!warehouseOption?.available) {
          errors.push(`${item.warehouse === 'us' ? 'US' : 'Overseas'} warehouse not available for this product`);
        }

        return {
          item,
          isValid: errors.length === 0,
          errors,
          updatedProduct: freshProduct,
          updatedPrice,
        };
      });

      setValidatedItems(validations);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error refreshing cart items:', err);
      
      // On error, still set validated items to empty array so UI doesn't hang
      // The cart will use existing prices
      setValidatedItems([]);
    } finally {
      clearTimeout(safetyTimeout);
      setLoading(false);
      isRefreshingRef.current = false;
    }
  }, []); // No dependencies - uses refs to access current values

  const refreshCartItemsRef = useRef(refreshCartItems);
  useEffect(() => {
    refreshCartItemsRef.current = refreshCartItems;
  }, [refreshCartItems]);

  useEffect(() => {
    // Only refresh when cart items actually change (not on every render or price update)
    // DO NOT include price in the key - we only want to refresh when items are added/removed or warehouse changes
    const cartKey = JSON.stringify(cartItems.map(item => ({
      id: item.product.id,
      variant: item.variantStrength,
      warehouse: item.warehouse,
    })));
    
    // Only trigger refresh if the key actually changed (items added/removed or warehouse changed)
    // AND we're not already refreshing
    if (cartKey !== lastCartItemsRef.current && !isRefreshingRef.current && cartItems.length > 0) {
      // Update the ref immediately to prevent duplicate calls
      lastCartItemsRef.current = cartKey;
      
      // Small delay to batch multiple rapid changes
      const timeoutId = setTimeout(() => {
        if (!isRefreshingRef.current) {
          refreshCartItemsRef.current();
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    } else if (cartItems.length === 0) {
      // Reset when cart is empty
      lastCartItemsRef.current = '';
      setValidatedItems([]);
      setLoading(false);
      isRefreshingRef.current = false;
    }
  }, [cartItems]); // Only depend on cartItems, not refreshCartItems

  return {
    validatedItems,
    loading,
    error,
    refresh: refreshCartItems,
  };
}

