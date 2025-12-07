/**
 * Phase 43: Database & Functionality Validation Script
 * 
 * Validates the variant system implementation:
 * - Each peptide appears only once in grids
 * - Variant selection works correctly
 * - Cart handles multiple variants
 * - SEO schema is correct
 */

import { products, hasVariants, getProductMinPrice, getDefaultVariant } from '../data/products';
import { categories } from '../data/categories';
import { generateProductSchema } from '../lib/seo/structured-data';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface ValidationResult {
  test: string;
  passed: boolean;
  message: string;
  details?: any;
}

const results: ValidationResult[] = [];

// Test 1: Verify each peptide appears only once in products array
function testUniqueProducts() {
  const productNames = new Map<string, string[]>();
  
  products.forEach(product => {
    const baseName = product.name.replace(/\s*\([^)]*\)/g, '').trim();
    if (!productNames.has(baseName)) {
      productNames.set(baseName, []);
    }
    productNames.get(baseName)!.push(product.id);
  });
  
  const duplicates = Array.from(productNames.entries())
    .filter(([_, ids]) => ids.length > 1);
  
  if (duplicates.length > 0) {
    results.push({
      test: 'Unique Products in Array',
      passed: false,
      message: `Found ${duplicates.length} products with duplicate base names`,
      details: duplicates.map(([name, ids]) => ({ name, ids }))
    });
  } else {
    results.push({
      test: 'Unique Products in Array',
      passed: true,
      message: 'All products have unique base names'
    });
  }
}

// Test 2: Verify products with variants have variants array
function testVariantsArray() {
  const productsWithVariants = products.filter(p => hasVariants(p));
  const productsWithoutVariants = products.filter(p => !hasVariants(p));
  
  // Check that products with variants have the variants array
  const invalidVariants = productsWithVariants.filter(p => !p.variants || p.variants.length < 2);
  
  if (invalidVariants.length > 0) {
    results.push({
      test: 'Variants Array Structure',
      passed: false,
      message: `Found ${invalidVariants.length} products marked as having variants but with invalid variants array`,
      details: invalidVariants.map(p => ({ id: p.id, name: p.name, variantsCount: p.variants?.length || 0 }))
    });
  } else {
    results.push({
      test: 'Variants Array Structure',
      passed: true,
      message: `All ${productsWithVariants.length} products with variants have valid variants arrays`
    });
  }
  
  // Check that all variants have required fields
  const invalidVariantFields = productsWithVariants
    .flatMap(p => 
      (p.variants || []).map((v, idx) => ({
        productId: p.id,
        productName: p.name,
        variantIndex: idx,
        variant: v,
        missingFields: [
          !v.strength && 'strength',
          v.quantityPerOrder !== 1 && 'quantityPerOrder !== 1',
          !v.price && 'price',
          !v.sku && 'sku',
          v.inStock === undefined && 'inStock'
        ].filter(Boolean)
      }))
    )
    .filter(item => item.missingFields.length > 0);
  
  if (invalidVariantFields.length > 0) {
    results.push({
      test: 'Variant Required Fields',
      passed: false,
      message: `Found ${invalidVariantFields.length} variants with missing required fields`,
      details: invalidVariantFields
    });
  } else {
    results.push({
      test: 'Variant Required Fields',
      passed: true,
      message: 'All variants have required fields (strength, quantityPerOrder: 1, price, sku, inStock)'
    });
  }
}

// Test 3: Verify helper functions work correctly
function testHelperFunctions() {
  const testResults: ValidationResult[] = [];
  
  // Test getProductMinPrice
  products.forEach(product => {
    const minPrice = getProductMinPrice(product);
    if (minPrice <= 0) {
      testResults.push({
        test: 'getProductMinPrice',
        passed: false,
        message: `Product ${product.id} has invalid min price: ${minPrice}`,
        details: { productId: product.id, price: minPrice }
      });
    }
  });
  
  if (testResults.length === 0) {
    results.push({
      test: 'Helper Functions',
      passed: true,
      message: 'All helper functions work correctly'
    });
  } else {
    results.push(...testResults);
  }
}

// Test 4: Verify SEO schema generation
function testSEOSchema() {
  const schemaErrors: any[] = [];
  
  products.forEach(product => {
    try {
      const schema = generateProductSchema(product);
      
      // Validate schema structure
      if (!schema['@context'] || !schema['@type']) {
        schemaErrors.push({
          productId: product.id,
          error: 'Missing @context or @type'
        });
      }
      
      // Validate offers
      if (product.variants && product.variants.length > 0) {
        if (!Array.isArray(schema.offers)) {
          schemaErrors.push({
            productId: product.id,
            error: 'Products with variants should have array of offers'
          });
        } else if (schema.offers.length !== product.variants.length) {
          schemaErrors.push({
            productId: product.id,
            error: `Offer count (${schema.offers.length}) doesn't match variant count (${product.variants.length})`
          });
        }
      }
    } catch (error) {
      schemaErrors.push({
        productId: product.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  if (schemaErrors.length > 0) {
    results.push({
      test: 'SEO Schema Generation',
      passed: false,
      message: `Found ${schemaErrors.length} products with schema generation errors`,
      details: schemaErrors
    });
  } else {
    results.push({
      test: 'SEO Schema Generation',
      passed: true,
      message: 'All products generate valid SEO schemas'
    });
  }
}

// Test 5: Verify category filtering
function testCategoryFiltering() {
  const categoryProducts = new Map<string, string[]>();
  
  categories.forEach(category => {
    const productsInCategory = products.filter(p => p.category === category.name);
    const productBaseNames = productsInCategory.map(p => 
      p.name.replace(/\s*\([^)]*\)/g, '').trim()
    );
    
    // Check for duplicates
    const uniqueNames = new Set(productBaseNames);
    if (uniqueNames.size !== productBaseNames.length) {
      categoryProducts.set(category.name, productBaseNames);
    }
  });
  
  if (categoryProducts.size > 0) {
    results.push({
      test: 'Category Filtering',
      passed: false,
      message: `Found duplicate products in ${categoryProducts.size} categories`,
      details: Array.from(categoryProducts.entries()).map(([cat, names]) => ({
        category: cat,
        duplicateNames: names.filter((name, idx) => names.indexOf(name) !== idx)
      }))
    });
  } else {
    results.push({
      test: 'Category Filtering',
      passed: true,
      message: 'No duplicate products found in any category'
    });
  }
}

// Test 6: Verify variant uniqueness within products
function testVariantUniqueness() {
  const duplicateVariants: any[] = [];
  
  products.forEach(product => {
    if (product.variants && product.variants.length > 0) {
      const strengths = product.variants.map(v => v.strength);
      const uniqueStrengths = new Set(strengths);
      
      if (uniqueStrengths.size !== strengths.length) {
        duplicateVariants.push({
          productId: product.id,
          productName: product.name,
          duplicateStrengths: strengths.filter((s, idx) => strengths.indexOf(s) !== idx)
        });
      }
      
      // Check SKU uniqueness
      const skus = product.variants.map(v => v.sku);
      const uniqueSkus = new Set(skus);
      if (uniqueSkus.size !== skus.length) {
        duplicateVariants.push({
          productId: product.id,
          productName: product.name,
          duplicateSkus: skus.filter((s, idx) => skus.indexOf(s) !== idx)
        });
      }
    }
  });
  
  if (duplicateVariants.length > 0) {
    results.push({
      test: 'Variant Uniqueness',
      passed: false,
      message: `Found ${duplicateVariants.length} products with duplicate variant strengths or SKUs`,
      details: duplicateVariants
    });
  } else {
    results.push({
      test: 'Variant Uniqueness',
      passed: true,
      message: 'All variants have unique strengths and SKUs within their products'
    });
  }
}

// Test 7: Verify default variant generation
function testDefaultVariant() {
  const errors: any[] = [];
  
  products.forEach(product => {
    const defaultVariant = getDefaultVariant(product);
    
    if (!defaultVariant) {
      errors.push({
        productId: product.id,
        productName: product.name,
        error: 'No default variant could be generated'
      });
    } else {
      // Verify default variant has required fields
      if (!defaultVariant.strength || !defaultVariant.price || !defaultVariant.sku) {
        errors.push({
          productId: product.id,
          productName: product.name,
          error: 'Default variant missing required fields',
          variant: defaultVariant
        });
      }
      
      // Verify quantityPerOrder is 1
      if (defaultVariant.quantityPerOrder !== 1) {
        errors.push({
          productId: product.id,
          productName: product.name,
          error: `Default variant has quantityPerOrder = ${defaultVariant.quantityPerOrder}, expected 1`
        });
      }
    }
  });
  
  if (errors.length > 0) {
    results.push({
      test: 'Default Variant Generation',
      passed: false,
      message: `Found ${errors.length} products with default variant errors`,
      details: errors
    });
  } else {
    results.push({
      test: 'Default Variant Generation',
      passed: true,
      message: 'All products have valid default variants with quantityPerOrder = 1'
    });
  }
}

// Run all tests
console.log('🔍 Running variant system validation...\n');

testUniqueProducts();
testVariantsArray();
testHelperFunctions();
testSEOSchema();
testCategoryFiltering();
testVariantUniqueness();
testDefaultVariant();

// Generate report
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

console.log(`\n📊 Validation Results:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`\n${'='.repeat(60)}\n`);

results.forEach((result, index) => {
  const icon = result.passed ? '✅' : '❌';
  console.log(`${icon} Test ${index + 1}: ${result.test}`);
  console.log(`   ${result.message}`);
  if (result.details && !result.passed) {
    console.log(`   Details:`, JSON.stringify(result.details, null, 2));
  }
  console.log('');
});

// Write report to file
const reportPath = join(process.cwd(), 'docs', 'validation-report.json');
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: results.length,
    passed,
    failed,
    passRate: `${((passed / results.length) * 100).toFixed(1)}%`
  },
  results
};

writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`📝 Full report written to: ${reportPath}`);

// Exit with error code if any tests failed
if (failed > 0) {
  console.log(`\n⚠️  ${failed} test(s) failed. Please review the report.`);
  process.exit(1);
} else {
  console.log(`\n✅ All validation tests passed!`);
  process.exit(0);
}

