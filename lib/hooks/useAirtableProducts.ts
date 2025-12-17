import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/data/products';
import { convertAirtableToProducts } from '@/lib/airtableProductAdapter';

interface AirtableProductData {
  product: Product;
  isDiscontinued: boolean;
  airtableInStock: boolean;
}

export function useAirtableProducts() {
  const [products, setProducts] = useState<AirtableProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Add cache-busting timestamp to ensure fresh data
      const response = await fetch(`/api/products?t=${Date.now()}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      // Convert Airtable products to our Product interface
      const convertedProducts = convertAirtableToProducts(data.products);
      
      // Helper function to generate slug from product name (same as in airtableClient)
      const generateSlugFromName = (name: string): string => {
        if (!name) return '';
        const baseName = name.split('(')[0].trim();
        return baseName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      };

      // Map to include Airtable-specific fields
      const productsWithAirtableData: AirtableProductData[] = convertedProducts.map((product) => {
        // Find all variants for this product by matching slug (handle both explicit and generated slugs)
        const productVariants = data.products.filter((ap: any) => {
          const apSlug = ap.productSlug || generateSlugFromName(ap.productName || '');
          return apSlug === product.slug;
        });
        
        // Use the first variant's status, or check if any variant is in stock
        const firstVariant = productVariants[0];
        const hasInStockVariant = productVariants.some((ap: any) => ap.inStock === true);
        const hasDiscontinuedVariant = productVariants.some((ap: any) => ap.isDiscontinued === true);
        
        return {
          product,
          isDiscontinued: hasDiscontinuedVariant || (firstVariant?.isDiscontinued || false),
          airtableInStock: hasInStockVariant || (firstVariant?.inStock !== undefined ? firstVariant.inStock : (product.inStock ?? true)),
        };
      });
      
      setProducts(productsWithAirtableData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    
    // Set up periodic refresh every 30 seconds to catch Airtable changes
    const interval = setInterval(() => {
      fetchProducts();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchProducts]);

  return { products, loading, error, refresh: fetchProducts };
}

export function useAirtableProductsByCategory(category: string) {
  const [products, setProducts] = useState<AirtableProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const encodedCategory = encodeURIComponent(category);
      // Add cache-busting timestamp to ensure fresh data
      const response = await fetch(`/api/products/category/${encodedCategory}?t=${Date.now()}`, {
        cache: 'no-store',
        next: { revalidate: 0 },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      // Convert Airtable products to our Product interface
      const convertedProducts = convertAirtableToProducts(data.products);
      
      // Helper function to generate slug from product name (same as in airtableClient)
      const generateSlugFromName = (name: string): string => {
        if (!name) return '';
        const baseName = name.split('(')[0].trim();
        return baseName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      };

      // Map to include Airtable-specific fields
      const productsWithAirtableData: AirtableProductData[] = convertedProducts.map((product) => {
        // Find all variants for this product by matching slug (handle both explicit and generated slugs)
        const productVariants = data.products.filter((ap: any) => {
          const apSlug = ap.productSlug || generateSlugFromName(ap.productName || '');
          return apSlug === product.slug;
        });
        const firstVariant = productVariants[0];
        const hasInStockVariant = productVariants.some((ap: any) => ap.inStock === true);
        const hasDiscontinuedVariant = productVariants.some((ap: any) => ap.isDiscontinued === true);
        
        return {
          product,
          isDiscontinued: hasDiscontinuedVariant || (firstVariant?.isDiscontinued || false),
          airtableInStock: hasInStockVariant || (firstVariant?.inStock !== undefined ? firstVariant.inStock : (product.inStock ?? true)),
        };
      });
      
      setProducts(productsWithAirtableData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    if (category) {
      fetchProducts();
      
      // Set up periodic refresh every 30 seconds
      const interval = setInterval(() => {
        fetchProducts();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [category, fetchProducts]);

  return { products, loading, error, refresh: fetchProducts };
}
