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
      // Check if it's an Airtable page URL (not an image URL)
      if (productImageUrl.includes('airtable.com/app') && productImageUrl.includes('/att')) {
        console.error(`[StockImage] ERROR: Received Airtable page URL instead of image URL for "${context}":`, productImageUrl);
        setImageUrl(FALLBACK_IMAGES[imageType]);
      } else {
        setImageUrl(productImageUrl);
        // Always log for the 4 specific products
        if (context && ['5-amino-1mq', 'ACETIC ACID', 'Adipotide', 'AICAR'].some(name => 
          context.toUpperCase().includes(name.toUpperCase())
        )) {
          console.log(`[StockImage] ✓ Setting image URL for "${context}"`);
          console.log(`[StockImage] URL: ${productImageUrl}`);
          console.log(`[StockImage] Is local image: ${productImageUrl.startsWith('/images/products/vici-')}`);
          console.log(`[StockImage] Is Airtable URL: ${productImageUrl.includes('airtableusercontent.com')}`);
        }
      }
    } else {
      setImageUrl(FALLBACK_IMAGES[imageType]);
      if (context && ['5-amino-1mq', 'ACETIC ACID', 'Adipotide', 'AICAR'].some(name => 
        context.toUpperCase().includes(name.toUpperCase())
      )) {
        console.error(`[StockImage] ✗ No valid image URL for "${context}"!`);
        console.error(`[StockImage] Received productImageUrl:`, productImageUrl);
        console.error(`[StockImage] Using fallback: ${FALLBACK_IMAGES[imageType]}`);
      }
    }
    setIsLoading(false);
  }, [imageType, productImageUrl, context]);
  
  // Check if image is from Airtable (external URL) - calculate from current imageUrl
  // Airtable URLs are from v5.airtableusercontent.com or dl.airtable.com
  const isAirtableUrl = imageUrl && (
    imageUrl.includes('v5.airtableusercontent.com') ||
    imageUrl.includes('dl.airtable.com') ||
    imageUrl.includes('airtableusercontent.com')
  );
  
  // Check if it's a local image (starts with /images/)
  const isLocalImage = imageUrl && imageUrl.startsWith('/images/');

  if (fill) {
    // For local images, use Next.js Image component (optimized)
    if (isLocalImage) {
      return (
        <div className={`relative ${className} bg-transparent`} style={{ width: '100%', height: '100%' }}>
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-contain"
            sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            priority={priority}
            unoptimized={false}
            onError={(e) => {
              console.error(`[StockImage] Local image failed to load for "${context || 'unknown'}":`, imageUrl);
              const target = e.currentTarget;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.style.background = 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.5))';
              }
            }}
            onLoad={() => {
              setIsLoading(false);
              if (context && ['5-amino-1mq', 'ACETIC ACID', 'Adipotide', 'AICAR'].some(name => 
                context.toUpperCase().includes(name.toUpperCase())
              )) {
                console.log(`[StockImage] ✓ Successfully loaded LOCAL image for "${context}": ${imageUrl}`);
              }
            }}
          />
        </div>
      );
    }
    
    // For Airtable URLs, use regular img tag to avoid Next.js Image optimization issues
    if (isAirtableUrl) {
      return (
        <div className={`relative ${className} bg-transparent`} style={{ width: '100%', height: '100%' }}>
          <img
            src={imageUrl}
            alt={alt}
            className="object-contain w-full h-full"
            style={{ objectFit: 'contain' }}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              console.error(`[StockImage] Airtable image failed to load for "${context || 'unknown'}":`, imageUrl);
              console.error(`[StockImage] Try opening this URL directly: ${imageUrl}`);
              const target = e.currentTarget;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.style.background = 'linear-gradient(to bottom right, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.5))';
              }
            }}
            onLoad={() => {
              setIsLoading(false);
              if (context && ['5-amino-1mq', 'ACETIC ACID', 'Adipotide', 'AICAR'].some(name => 
                context.toUpperCase().includes(name.toUpperCase())
              )) {
                console.log(`[StockImage] Successfully loaded Airtable image for "${context}"`);
              }
            }}
          />
        </div>
      );
    }
    
    // For non-Airtable URLs, use Next.js Image component
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

  // For local images, use Next.js Image component (optimized)
  if (isLocalImage) {
    return (
      <div className={`relative ${className}`} style={{ width: width || 800, height: height || 600 }}>
        <Image
          src={imageUrl}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className="object-cover"
          priority={priority}
          unoptimized={false}
          onError={(e) => {
            console.error(`[StockImage] Local image failed to load for "${context || 'unknown'}":`, imageUrl);
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.style.background = 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)';
            }
          }}
          onLoad={() => {
            setIsLoading(false);
            if (context && ['5-amino-1mq', 'ACETIC ACID', 'Adipotide', 'AICAR'].some(name => 
              context.toUpperCase().includes(name.toUpperCase())
            )) {
              console.log(`[StockImage] ✓ Successfully loaded LOCAL image for "${context}": ${imageUrl}`);
            }
          }}
          sizes={sizes}
        />
      </div>
    );
  }
  
  // For Airtable URLs, use regular img tag
  if (isAirtableUrl) {
    return (
      <div className={`relative ${className}`} style={{ width: width || 800, height: height || 600 }}>
        <img
          src={imageUrl}
          alt={alt}
          className="object-cover w-full h-full"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => {
            console.error(`[StockImage] Airtable image failed to load for "${context || 'unknown'}":`, imageUrl);
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.style.background = 'linear-gradient(to bottom right, #f3f4f6, #e5e7eb)';
            }
          }}
          onLoad={() => {
            setIsLoading(false);
            if (context) {
              console.log(`[StockImage] Successfully loaded Airtable image for "${context}"`);
            }
          }}
        />
      </div>
    );
  }
  
  // For other URLs (fallback images), use Next.js Image component
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
          console.error(`[StockImage] Image failed to load for "${context || 'unknown'}":`, imageUrl);
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

