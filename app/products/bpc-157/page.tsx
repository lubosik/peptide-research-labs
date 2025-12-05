import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, products } from '@/data/products';
import { Metadata } from 'next';
import ImageGallery from '@/components/products/ImageGallery';
import ProductInfoPanel from '@/components/products/ProductInfoPanel';
import DynamicProductTabs from '@/components/products/DynamicProductTabs';
import RelatedProductsAccordion from '@/components/products/RelatedProductsAccordion';
import { generateProductSchema } from '@/lib/seo/structured-data';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import ProductDetailLayout from '@/components/products/ProductDetailLayout';

export async function generateMetadata(): Promise<Metadata> {
  const product = getProductBySlug('bpc-157');
  
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

export default function BPC157ProductPage() {
  const product = getProductBySlug('bpc-157');

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

