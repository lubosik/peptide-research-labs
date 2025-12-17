/**
 * Article Image Utilities
 * 
 * Functions for fetching and managing article thumbnails and featured images
 */

export interface ArticleImage {
  thumbnail: string;
  headerImage: string;
  source?: string;
  alt?: string;
}

/**
 * Get image for an article (peptide or regular article)
 * Returns the Vici Research Cover image for all articles
 */
export function getArticleImage(
  slug: string,
  articleType: 'peptide' | 'article' = 'article',
  peptideName?: string
): ArticleImage {
  // Use the Vici Peptides New Article Image for all articles
  return {
    thumbnail: '/images/vici-article-image.png',
    headerImage: '/images/vici-article-image.png',
    source: 'vici-article',
    alt: peptideName ? `${peptideName} Research Article` : 'Vici Peptides Research Article',
  };
}

/**
 * Generate placeholder image URL or return branded placeholder
 */
function getPlaceholderImage(
  slug: string,
  peptideName?: string,
  type: 'thumbnail' | 'header' = 'thumbnail'
): string {
  // Use the Vici Peptides New Article Image for all articles
  return '/images/vici-article-image.png';
}

/**
 * Search for peptide images (placeholder for future web search integration)
 * 
 * This function would:
 * 1. Query web search APIs (e.g., Unsplash, Wikimedia Commons) for:
 *    - "{peptideName} molecular structure"
 *    - "{peptideName} research vial"
 *    - "{peptideName} laboratory"
 * 2. Filter results for scientific/appropriate images
 * 3. Save URLs to /data/thumbnails.json
 * 4. Return the best match
 */
export async function searchPeptideImage(
  peptideName: string
): Promise<string | null> {
  // Placeholder for future implementation
  // Would use web search APIs or image databases
  // For now, return null to use placeholder
  return null;
}

/**
 * Generate branded placeholder image data URL
 * Creates a black background with gold chemical pattern overlay
 */
export function generateBrandedPlaceholder(
  text: string = 'Vici Peptides Research Archive',
  type: 'thumbnail' | 'header' = 'thumbnail'
): string {
  // For now, return a data URL or path to a generated image
  // In production, this could generate an SVG or use a service
  const width = type === 'header' ? 1200 : 400;
  const height = type === 'header' ? 600 : 300;
  
  // Return path to a static placeholder component
  return `/images/blog/placeholders/branded-${type}.svg`;
}

