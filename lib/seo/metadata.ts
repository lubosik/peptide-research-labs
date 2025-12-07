/**
 * SEO Metadata Utilities
 * 
 * Functions for generating meta tags, canonical URLs, and Open Graph data
 */

import { Metadata } from 'next';

const baseUrl = 'https://vicipetides.com';
const siteName = 'Vici Peptides';

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string;
}

/**
 * Generate comprehensive metadata for a page
 */
export function generateMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    path = '',
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    keywords,
  } = options;

  // OpenGraph only supports 'website' or 'article', default to 'website' for products
  const ogType: 'website' | 'article' = type === 'article' ? 'article' : 'website';

  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/images/og-default.jpg`;

  const metadata: Metadata = {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: keywords
      ? keywords.split(',').map(k => k.trim())
      : [
          'research peptides',
          'laboratory reagents',
          'biochemical compounds',
          'peptide research',
          'laboratory supplies',
          'research-grade peptides',
          'biochemical reagents',
          'laboratory research',
        ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      url,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    verification: {
      // Add verification codes when available
      // google: 'verification-code',
      // yandex: 'verification-code',
    },
  };

  return metadata;
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string = ''): string {
  return `${baseUrl}${path}`;
}

