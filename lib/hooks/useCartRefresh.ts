'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const refreshCartItems = useCallback(async () => {
    if (cartItems.length === 0) {
      setValidatedItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all products from Airtable
      const response = await fetch(`/api/products?t=${Date.now()}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products from Airtable');
      }

      const data = await response.json();
      const allProducts = convertAirtableToProducts(data.products);

      // Validate each cart item
      const validations: CartItemValidation[] = cartItems.map((item) => {
        const errors: string[] = [];
        
        // Find the product in fresh Airtable data
        const freshProduct = allProducts.find((p) => p.slug === item.product.slug);
        
        if (!freshProduct) {
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
          const variant = freshProduct.variants?.find(
            (v) => v.strength === item.variantStrength
          );
          
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
          updatedPrice = variant.price * warehouseMultiplier;
        } else {
          // For non-variant products, check stock
          if (freshProduct.inStock === false) {
            errors.push('Product is out of stock');
          }

          // Calculate updated price with warehouse multiplier
          const warehouseMultiplier = freshProduct.warehouseOptions?.[item.warehouse]?.priceMultiplier ?? 1.0;
          updatedPrice = (freshProduct.price ?? 0) * warehouseMultiplier;
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error refreshing cart items:', err);
    } finally {
      setLoading(false);
    }
  }, [cartItems]);

  useEffect(() => {
    refreshCartItems();
  }, [refreshCartItems]);

  return {
    validatedItems,
    loading,
    error,
    refresh: refreshCartItems,
  };
}

