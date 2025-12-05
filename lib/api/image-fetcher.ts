/**
 * Image Fetcher Module
 * 
 * Fetches stock images from Unsplash API and caches them locally.
 * Falls back to Pexels if Unsplash fails.
 */

interface ImageResult {
  id: string;
  url: string;
  downloadUrl: string;
  alt: string;
  photographer: string;
  source: 'unsplash' | 'pexels';
}

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';
const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || '';

// Search terms for different image types
const IMAGE_SEARCH_TERMS: Record<string, string[]> = {
  'laboratory-vials': ['laboratory vials', 'scientific vials', 'test tubes', 'lab equipment'],
  'peptide-molecule': ['peptide molecule', 'molecular structure', 'biochemistry', 'protein structure'],
  'scientific-beakers': ['scientific beakers', 'laboratory glassware', 'chemistry lab', 'lab beakers'],
  'research-equipment': ['research equipment', 'laboratory equipment', 'scientific instruments', 'lab tools'],
  'product-placeholder': ['laboratory vials', 'scientific research', 'biochemistry', 'lab equipment'],
};

/**
 * Fetch image from Unsplash
 */
async function fetchFromUnsplash(query: string): Promise<ImageResult | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const image = data.results[0];
      return {
        id: image.id,
        url: image.urls.regular,
        downloadUrl: image.links.download_location,
        alt: image.alt_description || `${query} image`,
        photographer: image.user.name,
        source: 'unsplash',
      };
    }
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
  }

  return null;
}

/**
 * Fetch image from Pexels (fallback)
 */
async function fetchFromPexels(query: string): Promise<ImageResult | null> {
  if (!PEXELS_API_KEY) {
    console.warn('Pexels API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return {
        id: photo.id.toString(),
        url: photo.src.large,
        downloadUrl: photo.src.original,
        alt: photo.alt || `${query} image`,
        photographer: photo.photographer,
        source: 'pexels',
      };
    }
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
  }

  return null;
}

/**
 * Download and cache image locally
 */
async function downloadAndCacheImage(
  imageResult: ImageResult,
  filename: string
): Promise<string | null> {
  try {
    // In a real implementation, this would download the image server-side
    // For now, we'll return the URL and let Next.js Image component handle optimization
    // In production, you'd want to download and save to /public/stock/
    
    // Return the URL - Next.js Image will optimize it
    return imageResult.url;
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
}

/**
 * Get or fetch image for a specific type
 */
export async function getStockImage(
  imageType: keyof typeof IMAGE_SEARCH_TERMS
): Promise<string | null> {
  const searchTerms = IMAGE_SEARCH_TERMS[imageType];
  if (!searchTerms || searchTerms.length === 0) {
    return null;
  }

  // Try each search term until we get a result
  for (const term of searchTerms) {
    // Try Unsplash first
    let imageResult = await fetchFromUnsplash(term);
    
    // Fallback to Pexels
    if (!imageResult) {
      imageResult = await fetchFromPexels(term);
    }

    if (imageResult) {
      const filename = `${imageType}-${imageResult.id}.jpg`;
      const cachedUrl = await downloadAndCacheImage(imageResult, filename);
      return cachedUrl;
    }
  }

  return null;
}

/**
 * Get multiple images for a gallery
 */
export async function getStockImages(
  imageType: keyof typeof IMAGE_SEARCH_TERMS,
  count: number = 3
): Promise<string[]> {
  const images: string[] = [];
  const searchTerms = IMAGE_SEARCH_TERMS[imageType];

  for (let i = 0; i < count && i < searchTerms.length; i++) {
    const term = searchTerms[i];
    let imageResult = await fetchFromUnsplash(term);
    
    if (!imageResult) {
      imageResult = await fetchFromPexels(term);
    }

    if (imageResult) {
      const filename = `${imageType}-${imageResult.id}-${i}.jpg`;
      const cachedUrl = await downloadAndCacheImage(imageResult, filename);
      if (cachedUrl) {
        images.push(cachedUrl);
      }
    }
  }

  return images;
}

/**
 * Generate alt text for images
 */
export function generateImageAlt(imageType: string, context?: string): string {
  const altTexts: Record<string, string> = {
    'laboratory-vials': 'Research peptide vial placeholder image',
    'peptide-molecule': 'Peptide molecule structure macro image',
    'scientific-beakers': 'Scientific beakers and laboratory glassware',
    'research-equipment': 'Laboratory research equipment and instruments',
    'product-placeholder': 'Research peptide product placeholder image',
  };

  const baseAlt = altTexts[imageType] || 'Laboratory research image';
  return context ? `${baseAlt} - ${context}` : baseAlt;
}

