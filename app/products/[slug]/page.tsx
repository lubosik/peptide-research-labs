import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, products } from '@/data/products';
import { Metadata } from 'next';
import ImageGallery from '@/components/products/ImageGallery';
import ProductInfoPanel from '@/components/products/ProductInfoPanel';
import DynamicProductTabs from '@/components/products/DynamicProductTabs';
import RelatedProductsAccordion from '@/components/products/RelatedProductsAccordion';
import { generateProductSchema } from '@/lib/seo/structured-data';
import { generateMetadata as generateSEOMetadata, getCanonicalUrl } from '@/lib/seo/metadata';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  
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

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const productSchema = generateProductSchema(product);

  return (
    <div className="bg-slate-950 min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Product Header Section */}
      <section className="bg-slate-900 border-b border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/shop" className="hover:text-primary transition-colors">
                    Shop
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium">{product.name}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Image Gallery */}
              <ImageGallery productName={product.name} productSlug={product.slug} />

              {/* Right Column - Product Info */}
              <ProductInfoPanel product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <DynamicProductTabs product={product} />
        </div>
      </section>

      {/* Related Products Accordion */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <RelatedProductsAccordion
            currentProductId={product.id}
            currentCategory={product.category}
          />
        </div>
      </section>
    </div>
  );
}
