'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { generateImageAlt } from '@/lib/api/image-fetcher';

interface StockImageProps {
  imageType: 'laboratory-vials' | 'peptide-molecule' | 'scientific-beakers' | 'research-equipment' | 'product-placeholder';
  context?: string;
  productImageUrl?: string; // Optional product-specific image URL (from Airtable)
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

// Fallback placeholder images (using Unsplash direct URLs as fallback)
// Using proper Unsplash Source API format for better reliability
// Images with transparent/no background preferred for hero section
const FALLBACK_IMAGES: Record<string, string> = {
  'laboratory-vials': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&bg=transparent',
  'peptide-molecule': 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&bg=transparent',
  'scientific-beakers': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&bg=transparent',
  'research-equipment': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&bg=transparent',
  'product-placeholder': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&bg=transparent',
};

export default function StockImage({
  imageType,
  context,
  productImageUrl,
  className = '',
  width,
  height,
  priority = false,
  fill = false,
  sizes,
}: StockImageProps) {
  // Use product image if provided, otherwise use fallback
  const defaultUrl = productImageUrl && productImageUrl !== '/images/products/placeholder.jpg' 
    ? productImageUrl 
    : FALLBACK_IMAGES[imageType];
  const [imageUrl, setImageUrl] = useState<string>(defaultUrl);
  const [isLoading, setIsLoading] = useState(true);
  const alt = generateImageAlt(imageType, context);

  useEffect(() => {
    // Use product image if provided, otherwise use fallback
    if (productImageUrl && productImageUrl !== '/images/products/placeholder.jpg') {
      setImageUrl(productImageUrl);
      // Debug: log when product image is being used
      if (context) {
        console.log(`[StockImage] Using product image for "${context}": ${productImageUrl.substring(0, 80)}...`);
      }
    } else {
      setImageUrl(FALLBACK_IMAGES[imageType]);
      if (productImageUrl && context) {
        console.warn(`[StockImage] No valid image URL for "${context}", using fallback`);
      }
    }
    setIsLoading(false);
  }, [imageType, productImageUrl, context]);

  if (fill) {
    return (
      <div className={`relative ${className} bg-transparent`}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-contain"
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          priority={priority}
          unoptimized={false}
          onError={(e) => {
            console.error(`[StockImage] Image failed to load for "${context || 'unknown'}":`, imageUrl);
            console.error(`[StockImage] Error details:`, e);
            // Fallback to a gradient background if image fails
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.style.background = 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.5))';
            }
          }}
          onLoad={() => {
            setIsLoading(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className="object-cover"
        priority={priority}
        unoptimized={false}
        onError={(e) => {
          console.error('Image failed to load:', imageUrl);
          const target = e.currentTarget;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.style.background = 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)';
          }
        }}
        onLoad={() => setIsLoading(false)}
        sizes={sizes}
      />
    </div>
  );
}

