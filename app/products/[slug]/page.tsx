import { notFound } from 'next/navigation';
import Link from 'next/link';
import { hasVariants, getProductMinPrice } from '@/data/products';
import { Metadata } from 'next';
import ImageGallery from '@/components/products/ImageGallery';
import ProductInfoPanel from '@/components/products/ProductInfoPanel';
import DynamicProductTabs from '@/components/products/DynamicProductTabs';
import RelatedProductsAccordion from '@/components/products/RelatedProductsAccordion';
import { generateProductSchema } from '@/lib/seo/structured-data';
import { generateMetadata as generateSEOMetadata, getCanonicalUrl } from '@/lib/seo/metadata';
import { getProductVariantsBySlug } from '@/lib/airtableClient';
import { convertAirtableToProduct } from '@/lib/airtableProductAdapter';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  // Fetch products from Airtable for static generation
  const { getAllProducts } = await import('@/lib/airtableClient');
  try {
    const airtableProducts = await getAllProducts();
    // Get unique slugs
    const slugs = [...new Set(airtableProducts.map(p => p.productSlug))];
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Fallback to empty array
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const variants = await getProductVariantsBySlug(slug);
    if (variants.length === 0) {
      return {
        title: 'Product Not Found',
      };
    }
    
    const product = convertAirtableToProduct(variants[0]);
    const hasMultipleVariants = variants.length > 1;
    
    // Build description with variant information
    let description = product.description;
    
    if (hasMultipleVariants) {
      const variantStrengths = variants.map(v => v.variantStrength).join(', ');
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
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Not Found',
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const variants = await getProductVariantsBySlug(slug);
    if (variants.length === 0) {
      notFound();
    }
    
    const product = convertAirtableToProduct(variants[0]);
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
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
