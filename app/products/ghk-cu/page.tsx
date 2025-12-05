import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/data/products';
import { Metadata } from 'next';
import { generateProductSchema } from '@/lib/seo/structured-data';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import ProductDetailLayout from '@/components/products/ProductDetailLayout';

export async function generateMetadata(): Promise<Metadata> {
  const product = getProductBySlug('ghk-cu');
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return generateSEOMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
    type: 'website',
  });
}

export default function GHKCuProductPage() {
  const product = getProductBySlug('ghk-cu');

  if (!product) {
    notFound();
  }

  const productSchema = generateProductSchema(product);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <ProductDetailLayout product={product} />
    </>
  );
}

