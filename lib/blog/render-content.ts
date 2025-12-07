/**
 * Content Rendering Utilities
 * 
 * Functions for processing article content with internal linking and formatting
 */

import { products } from '@/data/products';

/**
 * Extract links from markdown-style format
 * Format: [text](/path) -> { text: "text", href: "/path" }
 */
export interface ContentLink {
  text: string;
  href: string;
  startIndex: number;
  endIndex: number;
}

export function extractLinks(content: string): ContentLink[] {
  const linkRegex = /\[([^\]]+)\]\((\/[^\)]+)\)/g;
  const links: ContentLink[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      href: match[2],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return links;
}

/**
 * Process content to add internal product links
 * Automatically links peptide names to their product pages
 * Enhanced to detect peptide names even in different contexts
 */
export function processContentWithProductLinks(
  content: string,
  currentProductSlug?: string
): string {
  let processed = content;

  // Sort products by name length (longest first) to avoid partial matches
  const sortedProducts = [...products].sort((a, b) => {
    const nameA = a.name.split('(')[0].trim();
    const nameB = b.name.split('(')[0].trim();
    return nameB.length - nameA.length;
  });

  // Find all product names in the content and link them
  sortedProducts.forEach((product) => {
    const baseName = product.name.split('(')[0].trim();
    
    // Skip if it's the current product
    if (product.slug === currentProductSlug) return;
    
    // Skip if name is too short (likely to cause false matches)
    if (baseName.length < 3) return;
    
    // Check if the name appears in content (case-insensitive)
    const nameRegex = new RegExp(`\\b${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    
    if (nameRegex.test(content)) {
      // Replace standalone mentions with links
      // Avoid replacing if already in a markdown link [text](/path)
      // Avoid replacing if it's part of a URL
      const linkRegex = new RegExp(
        `(?<!\\[)${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\]\\()`,
        'gi'
      );
      
      processed = processed.replace(linkRegex, (match) => {
        // Check if this match is already inside a markdown link
        const beforeMatch = processed.substring(0, processed.indexOf(match));
        const afterMatch = processed.substring(processed.indexOf(match) + match.length);
        
        // Simple check: if there's a [ before and ]( after, it's already a link
        const lastBracket = beforeMatch.lastIndexOf('[');
        const nextParen = afterMatch.indexOf('](');
        
        if (lastBracket !== -1 && nextParen !== -1) {
          // Might be inside a link, check more carefully
          const between = processed.substring(lastBracket, processed.indexOf(match) + match.length + nextParen);
          if (between.includes('](')) {
            return match; // Already in a link, don't replace
          }
        }
        
        return `[${match}](/products/${product.slug})`;
      });
    }
  });

  return processed;
}

