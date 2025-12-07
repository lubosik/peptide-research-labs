import Link from 'next/link';
import { Product, getProductMinPrice } from '@/data/products';

interface RelatedProductsProps {
  currentProduct: Product;
  products: Product[];
  limit?: number;
}

export default function RelatedProducts({
  currentProduct,
  products,
  limit = 4,
}: RelatedProductsProps) {
  // Filter out current product and get related products (same category or random)
  const related = products
    .filter((p) => p.id !== currentProduct.id)
    .filter((p) => p.category === currentProduct.category || Math.random() > 0.5)
    .slice(0, limit);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-heading text-2xl font-bold text-accent-gray mb-6">
        Related Research Peptides
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-accent-gray opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="text-heading font-semibold text-accent-gray mb-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-text-gray line-clamp-2 mb-2">
              {product.shortDescription}
            </p>
            <p className="text-primary font-semibold">${getProductMinPrice(product).toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

