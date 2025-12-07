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
 * Returns placeholder if no image found
 */
export function getArticleImage(
  slug: string,
  articleType: 'peptide' | 'article' = 'article',
  peptideName?: string
): ArticleImage {
  // In production, this would check /data/thumbnails.json
  // For now, return placeholder
  return {
    thumbnail: getPlaceholderImage(slug, peptideName),
    headerImage: getPlaceholderImage(slug, peptideName, 'header'),
    source: 'placeholder',
    alt: peptideName ? `${peptideName} Research Article` : 'Research Article',
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
  // For now, return a placeholder path
  // In production, this would:
  // 1. Check if image exists in /data/thumbnails.json
  // 2. If not, generate a branded placeholder
  // 3. Or fetch from external source
  
  // Branded placeholder path
  return `/images/blog/placeholders/${slug}-${type}.jpg`;
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

