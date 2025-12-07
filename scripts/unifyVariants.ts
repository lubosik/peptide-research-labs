/**
 * Phase 35: Data Migration Script
 * Merges duplicate product entries into unified products with variants array
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface ProductVariant {
  strength: string;
  quantityPerOrder: number;
  price: number;
  sku: string;
  inStock: boolean;
  specification?: string;
}

interface LegacyProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  inStock: boolean;
  category: string;
  sku?: string;
  specification?: string;
  warehouseOptions?: any;
  chemicalFormula?: string;
  molarMass?: string;
  casNumber?: string;
  synonyms?: string[];
  pubchemId?: string;
  shelfLife?: string;
  researchApplications?: string;
  storageRequirements?: string;
  handlingGuidelines?: string;
}

interface UnifiedProduct extends LegacyProduct {
  variants: ProductVariant[];
}

// Extract base name from product name
function extractBaseName(name: string): string {
  return name
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses content
    .replace(/\s*\d+mg/gi, '') // Remove strength in mg
    .replace(/\s*\d+ml/gi, '') // Remove volume in ml
    .replace(/\s*\d+iu/gi, '') // Remove IU
    .replace(/\s*×\s*\d+\s*vials?/gi, '') // Remove vial count
    .trim();
}

// Extract strength from product name/specification
function extractStrength(name: string, specification?: string): string {
  // Try specification first
  if (specification) {
    const specMatch = specification.match(/(\d+(?:\.\d+)?)\s*(mg|ml|iu)/i);
    if (specMatch) {
      return `${specMatch[1]}${specMatch[2].toLowerCase()}`;
    }
  }
  
  // Try name
  const nameMatch = name.match(/(\d+(?:\.\d+)?)\s*(mg|ml|iu)/i);
  if (nameMatch) {
    return `${nameMatch[1]}${nameMatch[2].toLowerCase()}`;
  }
  
  // Handle special cases like "BPC 5mg + TB 5mg"
  const comboMatch = name.match(/(\d+mg)\s*\+\s*(\w+)\s*(\d+mg)/i);
  if (comboMatch) {
    return `${comboMatch[1]} + ${comboMatch[3]}`;
  }
  
  return 'standard';
}

// Generate unified slug from base name
function generateUnifiedSlug(baseName: string): string {
  return baseName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Read the products file
const productsPath = join(process.cwd(), 'data', 'products.ts');
const productsContent = readFileSync(productsPath, 'utf-8');

// Extract products array using regex (simple approach)
// This is a simplified parser - in production you'd want a proper AST parser
const productMatches: LegacyProduct[] = [];
const productRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],[^}]*?description:\s*['"]([^'"]+)['"],[^}]*?shortDescription:\s*['"]([^'"]+)['"],[^}]*?price:\s*([\d.]+),[^}]*?image:\s*['"]([^'"]+)['"],[^}]*?inStock:\s*(true|false),[^}]*?category:\s*['"]([^'"]+)['"](?:,[^}]*?sku:\s*['"]([^'"]*)['"])?(?:,[^}]*?specification:\s*['"]([^'"]*)['"])?/gs;

let match;
while ((match = productRegex.exec(productsContent)) !== null) {
  productMatches.push({
    id: match[1],
    slug: match[2],
    name: match[3],
    description: match[4],
    shortDescription: match[5],
    price: parseFloat(match[6]),
    image: match[7],
    inStock: match[8] === 'true',
    category: match[9],
    sku: match[10] || undefined,
    specification: match[11] || undefined,
  });
}

console.log(`📦 Found ${productMatches.length} products to process`);

// Group products by base name
const productGroups = new Map<string, LegacyProduct[]>();

productMatches.forEach((product) => {
  const baseName = extractBaseName(product.name);
  if (!productGroups.has(baseName)) {
    productGroups.set(baseName, []);
  }
  productGroups.get(baseName)!.push(product);
});

// Separate products with variants from single products
const productsWithVariants: Map<string, LegacyProduct[]> = new Map();
const singleProducts: LegacyProduct[] = [];

productGroups.forEach((products, baseName) => {
  if (products.length > 1) {
    productsWithVariants.set(baseName, products);
  } else {
    singleProducts.push(products[0]);
  }
});

console.log(`🔀 Found ${productsWithVariants.size} product groups with variants`);
console.log(`📋 Found ${singleProducts.length} single products`);

// Create unified products
const unifiedProducts: UnifiedProduct[] = [];
const mergeLog: string[] = [];

mergeLog.push(`# Variant Merge Log`);
mergeLog.push(`Generated: ${new Date().toISOString()}`);
mergeLog.push(`\n## Summary`);
mergeLog.push(`- Products with variants: ${productsWithVariants.size}`);
mergeLog.push(`- Single products: ${singleProducts.length}`);
mergeLog.push(`- Total original products: ${productMatches.length}`);
mergeLog.push(`\n## Merged Products\n`);

// Process products with variants
productsWithVariants.forEach((products, baseName) => {
  // Use the first product as the base (it has the most complete data)
  const baseProduct = products[0];
  
  // Create variants from all products
  const variants: ProductVariant[] = products.map((product) => {
    const strength = extractStrength(product.name, product.specification);
    return {
      strength,
      quantityPerOrder: 1, // Always 1 vial per order
      price: product.price,
      sku: product.sku || product.id,
      inStock: product.inStock,
      specification: product.specification,
    };
  });
  
  // Sort variants by price (lowest first)
  variants.sort((a, b) => a.price - b.price);
  
  // Generate unified slug
  const unifiedSlug = generateUnifiedSlug(baseName);
  
  // Create unified product
  const unifiedProduct: UnifiedProduct = {
    ...baseProduct,
    id: baseProduct.id, // Keep first product's ID
    slug: unifiedSlug,
    name: baseName, // Base name without strength
    variants,
    // Remove legacy fields (they're in variants now)
    price: undefined,
    sku: undefined,
    inStock: undefined,
    specification: undefined,
  };
  
  unifiedProducts.push(unifiedProduct);
  
  // Log the merge
  mergeLog.push(`### ${baseName}`);
  mergeLog.push(`- Unified ID: ${unifiedProduct.id}`);
  mergeLog.push(`- Unified Slug: ${unifiedSlug}`);
  mergeLog.push(`- Variants: ${variants.length}`);
  mergeLog.push(`- Merged Products:`);
  products.forEach((p) => {
    mergeLog.push(`  - ${p.id} (${p.slug}): ${p.name} - $${p.price.toFixed(2)}`);
  });
  mergeLog.push(`- Variant Details:`);
  variants.forEach((v) => {
    mergeLog.push(`  - ${v.strength}: $${v.price.toFixed(2)} (SKU: ${v.sku}, Stock: ${v.inStock ? 'Yes' : 'No'})`);
  });
  mergeLog.push('');
});

// Process single products (convert to variant format for consistency)
singleProducts.forEach((product) => {
  const strength = extractStrength(product.name, product.specification);
  const variant: ProductVariant = {
    strength,
    quantityPerOrder: 1,
    price: product.price,
    sku: product.sku || product.id,
    inStock: product.inStock,
    specification: product.specification,
  };
  
  const unifiedProduct: UnifiedProduct = {
    ...product,
    variants: [variant],
    // Keep legacy fields for backward compatibility during transition
    price: product.price,
    sku: product.sku,
    inStock: product.inStock,
    specification: product.specification,
  };
  
  unifiedProducts.push(unifiedProduct);
});

console.log(`✅ Created ${unifiedProducts.length} unified products`);

// Write merge log
const logsDir = join(process.cwd(), 'logs');
mkdirSync(logsDir, { recursive: true });
const logPath = join(logsDir, 'variant_merge.log');
writeFileSync(logPath, mergeLog.join('\n'), 'utf-8');
console.log(`📝 Merge log written to: ${logPath}`);

// Generate TypeScript output
// Note: This is a simplified output - the actual migration will need to preserve
// all the original product data (chemical info, warehouse options, etc.)
// For now, we'll create a migration summary

const migrationSummary = {
  totalOriginalProducts: productMatches.length,
  totalUnifiedProducts: unifiedProducts.length,
  productsWithVariants: productsWithVariants.size,
  singleProducts: singleProducts.length,
  mergedGroups: Array.from(productsWithVariants.entries()).map(([baseName, products]) => ({
    baseName,
    unifiedId: products[0].id,
    unifiedSlug: generateUnifiedSlug(baseName),
    variantCount: products.length,
    originalIds: products.map(p => p.id),
  })),
};

const summaryPath = join(process.cwd(), 'docs', 'migration-summary.json');
writeFileSync(summaryPath, JSON.stringify(migrationSummary, null, 2), 'utf-8');
console.log(`📊 Migration summary written to: ${summaryPath}`);

console.log(`\n✅ Migration analysis complete!`);
console.log(`\n⚠️  Note: This script analyzes the data structure.`);
console.log(`   The actual product data migration will be done manually or with a more sophisticated parser`);
console.log(`   that preserves all product fields (chemical info, warehouse options, etc.).`);

