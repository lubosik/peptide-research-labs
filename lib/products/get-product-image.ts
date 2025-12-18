/**
 * Product Image Utilities
 * 
 * Functions for getting product images from local storage
 */

/**
 * Get image path for a product
 * Returns local image path for the 4 products with images, placeholder for others
 */
export function getProductImage(productName: string): string {
  const name = productName.toUpperCase();
  
  if (name.includes('5-AMINO-1MQ') || name.includes('5AMINO-1MQ') || name.includes('5 AMINO 1MQ')) {
    return '/images/products/vici-5-amino-1mq.png';
  }
  if (name.includes('ACETIC ACID') || name.startsWith('ACETIC ACID')) {
    return '/images/products/vici-acetic-acid.png';
  }
  if (name.includes('ADIPOTIDE') || name.startsWith('ADIPOTIDE')) {
    return '/images/products/vici-adipotide.png';
  }
  if (name.includes('AICAR') || name.startsWith('AICAR')) {
    return '/images/products/vici-aicar.png';
  }
  
  // Placeholder for products without images
  return '/images/products/placeholder.jpg';
}

