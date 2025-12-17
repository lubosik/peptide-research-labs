/**
 * Script to get unique peptide names from Airtable
 * Run with: npx tsx scripts/get-unique-peptides.ts
 */

import { getAllProducts } from '../lib/airtableClient';

async function getUniquePeptides() {
  try {
    const allProducts = await getAllProducts();
    
    // Filter to only LIVE, in-stock, non-discontinued products
    const activeProducts = allProducts.filter((product) => {
      return (
        product.inStock === true &&
        product.isDiscontinued !== true &&
        product.apiVisibilityStatus === 'LIVE'
      );
    });
    
    // Get unique base names (remove variant info)
    const uniqueNames = new Set<string>();
    activeProducts.forEach((product) => {
      const baseName = product.productName.split('(')[0].trim();
      if (baseName) {
        uniqueNames.add(baseName);
      }
    });
    
    // Sort alphabetically
    const sorted = Array.from(uniqueNames).sort();
    
    console.log(`\n=== UNIQUE PEPTIDES FOR IMAGES ===\n`);
    console.log(`Total unique peptides: ${sorted.length}\n`);
    sorted.forEach((name, i) => {
      console.log(`${(i + 1).toString().padStart(3, ' ')}. ${name}`);
    });
    console.log(`\n=== END OF LIST ===\n`);
    
    return sorted;
  } catch (error) {
    console.error('Error fetching peptides:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  getUniquePeptides()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to get peptides:', error);
      process.exit(1);
    });
}

export default getUniquePeptides;

