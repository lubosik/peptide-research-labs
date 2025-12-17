'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Product } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { useAirtableProducts } from '@/lib/hooks/useAirtableProducts';

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const { products: airtableProducts } = useAirtableProducts();

  // Create a map of products with their Airtable data
  const productsWithAirtableData = products.map(product => {
    const airtableItem = airtableProducts.find(item => 
      item.product.id === product.id || 
      item.product.slug === product.slug ||
      item.product.name === product.name
    );
    return {
      product,
      isDiscontinued: airtableItem?.isDiscontinued || false,
      airtableInStock: airtableItem?.airtableInStock ?? true,
    };
  });

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-heading text-3xl md:text-4xl font-bold text-charcoal mb-8">
            {title}
          </h2>
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            className="product-carousel"
          >
            {productsWithAirtableData.map(({ product, isDiscontinued, airtableInStock }) => (
              <SwiperSlide key={product.id}>
                <ProductCard 
                  product={product} 
                  className="h-full"
                  isDiscontinued={isDiscontinued}
                  airtableInStock={airtableInStock}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

