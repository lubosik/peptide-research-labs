'use client';

import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

export default function ShopPage() {
  return (
    <div className="bg-neutral-light min-h-screen">
      {/* Page Header */}
      <section className="bg-gray-50 border-b border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-accent-gray mb-4">
              SHOP ALL
            </h1>
            <p className="text-lg text-text-gray">
              SHOWING ALL {products.length} RESULTS
            </p>
          </div>
        </div>
      </section>

      {/* Sort Bar */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto flex justify-end">
            <div className="flex items-center space-x-4">
              <span className="text-text-gray font-medium">SORT BY:</span>
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-text-gray bg-white focus:outline-none focus:border-primary">
                <option>DEFAULT SORTING</option>
                <option>PRICE: LOW TO HIGH</option>
                <option>PRICE: HIGH TO LOW</option>
                <option>NAME: A TO Z</option>
                <option>NAME: Z TO A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

