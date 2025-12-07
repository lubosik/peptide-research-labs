'use client';

import Image from 'next/image';
import { getArticleImage } from '@/lib/blog/get-article-image';

interface ArticleImageProps {
  slug: string;
  articleType?: 'peptide' | 'article';
  peptideName?: string;
  type: 'thumbnail' | 'header';
  className?: string;
  alt?: string;
}

/**
 * Article Image Component
 * 
 * Displays article images with lazy loading and fallback to branded placeholder
 */
export default function ArticleImage({
  slug,
  articleType = 'article',
  peptideName,
  type,
  className = '',
  alt,
}: ArticleImageProps) {
  const imageData = getArticleImage(slug, articleType, peptideName);
  const imageUrl = type === 'header' ? imageData.headerImage : imageData.thumbnail;
  const imageAlt = alt || imageData.alt || 'Research Article Image';

  // Check if it's a placeholder
  const isPlaceholder = imageData.source === 'placeholder' || !imageUrl.startsWith('http');

  return (
    <div className={`relative ${className}`}>
      {isPlaceholder ? (
        // Branded Placeholder
        <div className="relative w-full h-full bg-gradient-to-br from-primary-black via-secondary-charcoal to-primary-black overflow-hidden">
          {/* Gold chemical pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(212, 175, 55, 0.3) 10px,
                rgba(212, 175, 55, 0.3) 20px
              )`,
            }}
          ></div>
          
          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center p-4">
              <svg
                className="w-16 h-16 md:w-24 md:h-24 mx-auto text-luxury-gold opacity-40 mb-4"
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
              <p className="text-luxury-gold text-xs md:text-sm font-semibold opacity-60">
                Vici Peptides Research Archive
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Actual Image with lazy loading
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          loading="lazy"
          sizes={type === 'header' ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        />
      )}
    </div>
  );
}

