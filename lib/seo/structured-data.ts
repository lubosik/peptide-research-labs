/**
 * Structured Data (JSON-LD) Generators
 * 
 * Implements schema.org markup for SEO optimization
 * Uses ResearchOrganization instead of LocalBusiness
 * Adapted for biochemical reagents and laboratory supplies
 */

import { Product } from '@/data/products';
import { Article } from '@/data/articles';

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    '@type': string;
    addressCountry: string;
    addressLocality?: string;
    addressRegion?: string;
  };
  sameAs?: string[];
  contactPoint?: {
    '@type': string;
    contactType: string;
    email?: string;
  };
}

export interface ProductSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image?: string;
  brand?: {
    '@type': string;
    name: string;
  };
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  aggregateRating?: {
    '@type': string;
    ratingValue: string;
    reviewCount: string;
  };
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image?: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
}

export interface FAQSchema {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

/**
 * Generate ResearchOrganization schema
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: 'Vici Peptides',
    url: 'https://vicipetides.com',
    logo: 'https://vicipetides.com/images/vici-logo.png',
    description:
      'Vici Peptides is a research organization providing high-purity biochemical reagents and laboratory supplies for scientific research. We supply research peptides, laboratory-grade compounds, and biochemical reagents exclusively for laboratory research purposes.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
    },
  };
}

/**
 * Generate Product schema for research peptides
 */
export function generateProductSchema(product: Product): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || `https://vicipetides.com${product.image}`,
    brand: {
      '@type': 'Brand',
      name: 'Vici Peptides',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://vicipetides.com/products/${product.slug}`,
    },
  };
}

/**
 * Generate Article schema for blog posts
 */
export function generateArticleSchema(article: Article): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.headerImage
      ? `https://vicipetides.com${article.headerImage}`
      : undefined,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vici Peptides',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vicipetides.com/images/vici-logo.png',
      },
    },
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are Peptides?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Peptides are short chains of amino acids linked by peptide bonds, forming the building blocks of proteins and playing crucial roles in biological systems. In laboratory research, synthetic peptides serve as valuable tools for investigating cellular mechanisms, signaling pathways, and experimental applications.',
        },
      },
      {
        '@type': 'Question',
        name: 'What Does "Research Use Only" (RUO) Mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Research Use Only means these products are intended strictly for laboratory research purposes. Products labeled "Research Use Only" are meant for use in controlled laboratory settings by qualified researchers. They are NOT approved for human or veterinary use, and are NOT dietary supplements or medical treatments.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are There Age Restrictions for Purchasing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes. You must be 18 years or older to purchase products from Vici Peptides. By making a purchase, you confirm that you are of legal age and purchasing strictly for legitimate laboratory research purposes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the Purity of Your Products?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'All products from Vici Peptides undergo rigorous third-party testing to verify purity and identity. We work exclusively with FDA-registered API manufacturers and maintain comprehensive batch tracking. Certificates of Analysis (CoA) are available for all products upon request.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I Get a Certificate of Analysis (CoA)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Yes. Certificates of Analysis are available for all products upon request. CoAs provide third-party testing results verifying product purity, identity, and quality. To request a CoA, please contact us through our contact page with your order number and product information.',
        },
      },
    ],
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vici Peptides',
    url: 'https://vicipetides.com',
    description:
      'Research peptides and biochemical reagents for laboratory use only. High-purity peptides for scientific research.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://vicipetides.com/shop?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

