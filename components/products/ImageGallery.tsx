'use client';

import { useState } from 'react';
import StockImage from '@/components/images/StockImage';

interface ImageGalleryProps {
  productName: string;
  productSlug: string;
}

export default function ImageGallery({ productName, productSlug }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Generate multiple images for gallery (using stock images for now)
  const galleryImages = [
    { type: 'product-placeholder' as const, alt: `${productName} - Main view` },
    { type: 'laboratory-vials' as const, alt: `${productName} - Laboratory vials` },
    { type: 'scientific-beakers' as const, alt: `${productName} - Scientific equipment` },
    { type: 'research-equipment' as const, alt: `${productName} - Research equipment` },
  ];

  return (
    <div>
      {/* Main Image */}
      <div 
        className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden mb-4 bg-taupe"
        style={{
          filter: 'drop-shadow(0 8px 24px rgba(230, 222, 212, 0.4))',
        }}
      >
        {selectedImage === 0 ? (
          <StockImage
            imageType={galleryImages[0].type}
            context={productName}
            fill
            priority
            className="rounded-lg object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <StockImage
            imageType={galleryImages[selectedImage].type}
            context={productName}
            fill
            className="rounded-lg object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-4">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-full h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
              selectedImage === index
                ? 'border-charcoal shadow-md'
                : 'border-taupe hover:border-stone'
            }`}
            style={{
              backgroundColor: selectedImage === index ? '#E6DED4' : '#F6F1EB',
            }}
          >
            <StockImage
              imageType={image.type}
              context={productName}
              fill
              className="rounded-lg object-contain"
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

