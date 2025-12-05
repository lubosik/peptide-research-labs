'use client';

import { products, Product } from '@/data/products';
import ProductCard from './ProductCard';

interface RelatedProductsAccordionProps {
  currentProductId: string;
  currentCategory: string;
}

export default function RelatedProductsAccordion({
  currentProductId,
  currentCategory,
}: RelatedProductsAccordionProps) {
  // Filter related products by category, excluding current product
  const relatedProducts = products.filter(
    (product) => product.category === currentCategory && product.id !== currentProductId
  ).slice(0, 4); // Limit to 4 related products

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-gray-700 pt-12">
      <h2 className="text-heading text-3xl font-bold text-white mb-8">
        RELATED PRODUCTS
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

