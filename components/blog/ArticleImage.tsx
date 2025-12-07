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
  const imageAlt = alt || imageData.alt || 'Vici Peptides Research Article';

  // Always use the actual image
  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
        loading="lazy"
        sizes={type === 'header' ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      />
    </div>
  );
}

