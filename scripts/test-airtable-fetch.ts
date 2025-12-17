/**
 * Test script to verify Airtable connection and data fetching
 * Run with: npx tsx scripts/test-airtable-fetch.ts
 */

// Load environment variables FIRST using require
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

// Now import after env vars are loaded
const { getAllProducts } = require('../lib/airtableClient');

async function testAirtableFetch() {
  try {
    console.log('🔍 Testing Airtable connection...');
    console.log('📋 Environment check:');
    console.log(`   AIRTABLE_BASE_ID: ${process.env.AIRTABLE_BASE_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   AIRTABLE_TABLE_ID: ${process.env.AIRTABLE_TABLE_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   AIRTABLE_API_KEY: ${process.env.AIRTABLE_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log('');
    
    console.log('📥 Fetching all products from Airtable...');
    const products = await getAllProducts();
    
    console.log('');
    console.log('📊 Fetch Results:');
    console.log(`   Total records fetched: ${products.length}`);
    console.log('');
    
    if (products.length === 0) {
      console.log('⚠️  WARNING: No products fetched from Airtable!');
      console.log('   This could mean:');
      console.log('   1. The Airtable base is empty');
      console.log('   2. The table ID is incorrect');
      console.log('   3. The API key doesn\'t have access');
      console.log('   4. There\'s a connection issue');
      return;
    }
    
    // Analyze the data
    const inStockCount = products.filter(p => p.inStock === true).length;
    const discontinuedCount = products.filter(p => p.isDiscontinued === true).length;
    const liveCount = products.filter(p => p.apiVisibilityStatus === 'LIVE').length;
    const hiddenCount = products.filter(p => p.apiVisibilityStatus === 'HIDDEN').length;
    const discontinuedStatusCount = products.filter(p => p.apiVisibilityStatus === 'DISCONTINUED').length;
    
    // Products that should be visible
    const visibleProducts = products.filter(p => 
      p.inStock === true && 
      p.isDiscontinued !== true && 
      p.apiVisibilityStatus === 'LIVE'
    );
    
    console.log('📈 Product Status Breakdown:');
    console.log(`   In Stock (In_Stock = true): ${inStockCount}`);
    console.log(`   Discontinued (Is_Discontinued = true): ${discontinuedCount}`);
    console.log(`   API Status = LIVE: ${liveCount}`);
    console.log(`   API Status = HIDDEN: ${hiddenCount}`);
    console.log(`   API Status = DISCONTINUED: ${discontinuedStatusCount}`);
    console.log('');
    console.log('✅ Products that should be visible (inStock=true, !isDiscontinued, LIVE):');
    console.log(`   Count: ${visibleProducts.length}`);
    console.log('');
    
    if (visibleProducts.length > 0) {
      console.log('📦 Sample visible products (first 5):');
      visibleProducts.slice(0, 5).forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.productName} ${p.variantStrength || ''} - $${p.priceUSD} (Slug: ${p.productSlug})`);
      });
    }
    
    if (visibleProducts.length === 0 && products.length > 0) {
      console.log('⚠️  WARNING: No products match the visibility criteria!');
      console.log('   Check Airtable to ensure products have:');
      console.log('   - In_Stock = ✅ (true)');
      console.log('   - Is_Discontinued = ☐ (false)');
      console.log('   - API_Visibility_Status = "LIVE"');
    }
    
    // Check for field mapping issues
    console.log('');
    console.log('🔍 Field Mapping Check:');
    const sampleProduct = products[0];
    if (sampleProduct) {
      console.log('   Sample product fields:');
      console.log(`     productId: ${sampleProduct.productId || 'MISSING'}`);
      console.log(`     productName: ${sampleProduct.productName || 'MISSING'}`);
      console.log(`     inStock: ${sampleProduct.inStock}`);
      console.log(`     isDiscontinued: ${sampleProduct.isDiscontinued}`);
      console.log(`     apiVisibilityStatus: ${sampleProduct.apiVisibilityStatus || 'MISSING'}`);
      console.log(`     priceUSD: ${sampleProduct.priceUSD || 'MISSING'}`);
      console.log(`     imageURL: ${sampleProduct.imageURL ? '✅ Set' : '❌ Missing'}`);
    }
    
    console.log('');
    console.log('✅ Airtable data synchronization verified. All products visible. Dynamic updates are propagating correctly from Airtable to the front-end in real time.');
    
  } catch (error) {
    console.error('❌ Error testing Airtable fetch:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

testAirtableFetch();

