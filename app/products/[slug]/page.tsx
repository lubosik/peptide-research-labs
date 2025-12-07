import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, products, hasVariants, getProductMinPrice } from '@/data/products';
import { Metadata } from 'next';
import ImageGallery from '@/components/products/ImageGallery';
import ProductInfoPanel from '@/components/products/ProductInfoPanel';
import DynamicProductTabs from '@/components/products/DynamicProductTabs';
import RelatedProductsAccordion from '@/components/products/RelatedProductsAccordion';
import { generateProductSchema } from '@/lib/seo/structured-data';
import { generateMetadata as generateSEOMetadata, getCanonicalUrl } from '@/lib/seo/metadata';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  // Build description with variant information
  let description = product.description;
  const hasMultipleVariants = hasVariants(product);
  
  if (hasMultipleVariants && product.variants) {
    const variantStrengths = product.variants.map(v => v.strength).join(', ');
    const minPrice = getProductMinPrice(product);
    description = `${product.shortDescription || product.description.substring(0, 200)} Available in multiple strengths: ${variantStrengths}. Starting from $${minPrice.toFixed(2)}. For laboratory research use only.`;
  } else {
    const price = product.price ?? getProductMinPrice(product);
    description = `${product.shortDescription || product.description.substring(0, 200)} $${price.toFixed(2)}. For laboratory research use only.`;
  }

  return generateSEOMetadata({
    title: product.name,
    description: description,
    path: `/products/${product.slug}`,
    type: 'website',
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productSchema = generateProductSchema(product);

  return (
    <div className="bg-primary-black min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Product Header Section */}
      <section className="bg-secondary-charcoal border-b border-luxury-gold/20 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-neutral-gray">
                <li>
                  <Link href="/" className="hover:text-luxury-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/shop" className="hover:text-luxury-gold transition-colors">
                    Shop
                  </Link>
                </li>
                <li>/</li>
                <li className="text-pure-white font-medium">{product.name}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Product Section - Reduced Padding for Above Fold */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
