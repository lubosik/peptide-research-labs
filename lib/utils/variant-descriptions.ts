/**
 * Variant Description Utilities
 * 
 * Provides variant-specific descriptions for product variants
 * Descriptions explain differences in potency, formulation, or concentration
 */

import variantDetailsData from '@/data/variantDetails.json';

interface VariantDescriptions {
  variantDescriptions: Record<string, Record<string, string>>;
}

const variantData = variantDetailsData as VariantDescriptions;

/**
 * Get variant-specific description for a product and strength
 */
export function getVariantDescription(productName: string, strength: string): string | null {
  const productDescriptions = variantData.variantDescriptions[productName];
  if (!productDescriptions) {
    return null;
  }
  
  return productDescriptions[strength] || null;
}

/**
 * Get all variant descriptions for a product
 */
export function getProductVariantDescriptions(productName: string): Record<string, string> | null {
  return variantData.variantDescriptions[productName] || null;
}

/**
 * Check if variant descriptions exist for a product
 */
export function hasVariantDescriptions(productName: string): boolean {
  return productName in variantData.variantDescriptions;
}

