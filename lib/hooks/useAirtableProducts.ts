import { useState, useEffect } from 'react';
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

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Convert Airtable products to our Product interface
        const convertedProducts = convertAirtableToProducts(data.products);
        
        // Map to include Airtable-specific fields
        const productsWithAirtableData: AirtableProductData[] = convertedProducts.map((product) => {
          // Find the first variant or product in Airtable data to get stock/discontinued status
          const airtableProduct = data.products.find((ap: any) => ap.productSlug === product.slug);
          
          return {
            product,
            isDiscontinued: airtableProduct?.isDiscontinued || false,
            airtableInStock: airtableProduct?.inStock !== undefined ? airtableProduct.inStock : (product.inStock ?? true),
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
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

export function useAirtableProductsByCategory(category: string) {
  const [products, setProducts] = useState<AirtableProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const encodedCategory = encodeURIComponent(category);
        const response = await fetch(`/api/products/category/${encodedCategory}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Convert Airtable products to our Product interface
        const convertedProducts = convertAirtableToProducts(data.products);
        
        // Map to include Airtable-specific fields
        const productsWithAirtableData: AirtableProductData[] = convertedProducts.map((product) => {
          const airtableProduct = data.products.find((ap: any) => ap.productSlug === product.slug);
          
          return {
            product,
            isDiscontinued: airtableProduct?.isDiscontinued || false,
            airtableInStock: airtableProduct?.inStock !== undefined ? airtableProduct.inStock : (product.inStock ?? true),
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
    }

    if (category) {
      fetchProducts();
    }
  }, [category]);

  return { products, loading, error };
}

