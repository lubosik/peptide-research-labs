'use client';

import { Product } from '@/data/products';
import ProductCard from './ProductCard';
import { useAirtableProducts } from '@/lib/hooks/useAirtableProducts';

interface RelatedProductsAccordionProps {
  currentProductId: string;
  currentCategory: string;
}

export default function RelatedProductsAccordion({
  currentProductId,
  currentCategory,
}: RelatedProductsAccordionProps) {
  const { products: airtableProducts } = useAirtableProducts();

  // Filter related products by category, excluding current product
  const relatedProducts = airtableProducts
    .filter(
      (item) => 
        item.product.category === currentCategory && 
        item.product.id !== currentProductId &&
        !item.isDiscontinued &&
        item.airtableInStock
    )
    .slice(0, 4) // Limit to 4 related products
    .map(item => item.product);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-taupe pt-12">
      <h2 className="text-heading text-3xl font-bold text-charcoal mb-8">
        RELATED PRODUCTS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const airtableItem = airtableProducts.find(item => 
            item.product.id === product.id || 
            item.product.slug === product.slug
          );
          return (
            <ProductCard 
              key={product.id} 
              product={product}
              isDiscontinued={airtableItem?.isDiscontinued || false}
              airtableInStock={airtableItem?.airtableInStock ?? true}
            />
          );
        })}
      </div>
    </div>
  );
}

