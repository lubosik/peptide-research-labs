/**
 * Script to analyze product variants and generate mapping document
 * Phase 33: Analysis & Preparation
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  sku?: string;
  specification?: string;
  inStock: boolean;
  category: string;
}

interface VariantGroup {
  baseName: string;
  variants: Array<{
    id: string;
    slug: string;
    name: string;
    strength: string;
    price: number;
    sku?: string;
    specification?: string;
    inStock: boolean;
  }>;
}

// Extract base name from product name
function extractBaseName(name: string): string {
  // Remove patterns like "(10mg × 10 vials)", "(5mg × 10 vials)", etc.
  return name
    .replace(/\s*\([^)]*\)/g, '') // Remove parentheses content
    .replace(/\s*\d+mg/gi, '') // Remove strength
    .replace(/\s*×\s*\d+\s*vials?/gi, '') // Remove vial count
    .replace(/\s*\d+ml/gi, '') // Remove volume
    .replace(/\s*\d+iu/gi, '') // Remove IU
    .trim();
}

// Extract strength from product name
function extractStrength(name: string, specification?: string): string {
  // Try to extract from specification first
  if (specification) {
    const specMatch = specification.match(/(\d+(?:\.\d+)?)\s*(mg|ml|iu)/i);
    if (specMatch) {
      return `${specMatch[1]}${specMatch[2].toLowerCase()}`;
    }
  }
  
  // Try to extract from name
  const nameMatch = name.match(/(\d+(?:\.\d+)?)\s*(mg|ml|iu)/i);
  if (nameMatch) {
    return `${nameMatch[1]}${nameMatch[2].toLowerCase()}`;
  }
  
  return 'standard';
}

// Read products file
const productsPath = join(process.cwd(), 'data', 'products.ts');
const productsContent = readFileSync(productsPath, 'utf-8');

// Extract product data using regex (simple approach for analysis)
const productMatches = productsContent.matchAll(
  /\{\s*id:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"],[^}]*price:\s*([\d.]+),[^}]*sku:\s*['"]([^'"]*)['"]?,[^}]*specification:\s*['"]([^'"]*)['"]?,[^}]*inStock:\s*(true|false),[^}]*category:\s*['"]([^'"]+)['"]/gs
);

const products: Product[] = [];
for (const match of productMatches) {
  products.push({
    id: match[1],
    slug: match[2],
    name: match[3],
    price: parseFloat(match[4]),
    sku: match[5] || undefined,
    specification: match[6] || undefined,
    inStock: match[7] === 'true',
    category: match[8],
  });
}

// Group products by base name
const variantMap = new Map<string, VariantGroup>();

products.forEach((product) => {
  const baseName = extractBaseName(product.name);
  const strength = extractStrength(product.name, product.specification);
  
  if (!variantMap.has(baseName)) {
    variantMap.set(baseName, {
      baseName,
      variants: [],
    });
  }
  
  variantMap.get(baseName)!.variants.push({
    id: product.id,
    slug: product.slug,
    name: product.name,
    strength,
    price: product.price,
    sku: product.sku,
    specification: product.specification,
    inStock: product.inStock,
  });
});

// Filter to only products with multiple variants
const variantGroups = Array.from(variantMap.values())
  .filter((group) => group.variants.length > 1)
  .sort((a, b) => a.baseName.localeCompare(b.baseName));

// Generate markdown document
let markdown = `# Product Variant Mapping

**Generated:** ${new Date().toISOString()}
**Phase:** 33 - Analysis & Preparation

## Overview

This document identifies all peptides that currently exist in multiple variant forms (different strengths/sizes). These will be unified into single canonical product entries with selectable variant options.

**Total Products with Variants:** ${variantGroups.length}
**Total Variant Entries:** ${variantGroups.reduce((sum, g) => sum + g.variants.length, 0)}

## Variant Groups

`;

variantGroups.forEach((group, index) => {
  markdown += `### ${index + 1}. ${group.baseName}\n\n`;
  markdown += `**Category:** ${group.variants[0].category || 'Unknown'}\n\n`;
  markdown += `**Variants:** ${group.variants.length}\n\n`;
  markdown += `| ID | Slug | Strength | Price | SKU | In Stock |\n`;
  markdown += `|----|------|----------|-------|-----|----------|\n`;
  
  group.variants.forEach((variant) => {
    markdown += `| ${variant.id} | ${variant.slug} | ${variant.strength} | $${variant.price.toFixed(2)} | ${variant.sku || 'N/A'} | ${variant.inStock ? 'Yes' : 'No'} |\n`;
  });
  
  markdown += `\n**Unified Product Structure:**\n`;
  markdown += `- Base Name: "${group.baseName}"\n`;
  markdown += `- Slug: "${group.variants[0].slug.split('-').slice(0, -1).join('-')}" (to be determined)\n`;
  markdown += `- Variants: ${group.variants.map(v => v.strength).join(', ')}\n`;
  markdown += `- Price Range: $${Math.min(...group.variants.map(v => v.price)).toFixed(2)} - $${Math.max(...group.variants.map(v => v.price)).toFixed(2)}\n`;
  markdown += `\n---\n\n`;
});

markdown += `## Migration Notes

1. Each variant will become a selectable option in the unified product
2. All variants will use \`quantityPerOrder: 1\` (one vial per order)
3. The base product will display the lowest price with "from $XX.XX" format
4. Variant selection will update price, SKU, and stock status dynamically
5. Cart items will store variant details separately

## Next Steps

- Phase 34: Refactor Product schema to include variants array
- Phase 35: Create migration script to merge duplicate entries
- Phase 36: Update front-end shop grid to show unified products
`;

// Write to docs directory
const outputPath = join(process.cwd(), 'docs', 'variant-mapping.md');
writeFileSync(outputPath, markdown, 'utf-8');

console.log(`✅ Variant mapping document created: ${outputPath}`);
console.log(`📊 Found ${variantGroups.length} products with variants`);
console.log(`📦 Total variant entries: ${variantGroups.reduce((sum, g) => sum + g.variants.length, 0)}`);

