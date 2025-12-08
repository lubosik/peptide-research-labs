import { products } from '../data/products';
import * as fs from 'fs';
import * as path from 'path';

// CSV escaping function
function escapeCSV(value: string | number | boolean | undefined | null): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const str = String(value);
  
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

// Generate product slug for image URL
function generateImageURL(slug: string): string {
  return `https://cdn.vicipeptides.com/images/placeholders/${slug}.jpg`;
}

// Generate warehouse location (randomly assign)
function generateWarehouseLocation(index: number): string {
  return index % 2 === 0 ? 'US Warehouse' : 'Overseas Warehouse';
}

// Generate popularity score (1-100)
function generatePopularityScore(index: number): number {
  // Base score between 50-100, with some variation
  return 50 + (index % 50) + Math.floor(Math.random() * 20);
}

// Generate stock quantity
function generateStockQuantity(): number {
  return Math.floor(Math.random() * 200) + 50; // 50-250 units
}

// Generate unit size from strength
function generateUnitSize(strength: string): string {
  if (strength.includes('ml')) {
    return `1 Vial (${strength})`;
  }
  if (strength.includes('iu')) {
    return `1 Vial (${strength})`;
  }
  return `1 Vial (${strength})`;
}

// Generate SEO title
function generateSEOTitle(productName: string): string {
  return `Buy ${productName} Research Peptide – Vici Peptides`;
}

// Generate SEO description
function generateSEODescription(productName: string): string {
  return `High-purity ${productName} research peptide available for laboratory research use only from Vici Peptides.`;
}

// Generate full description from product description
function generateFullDescription(description: string, shortDesc: string): string {
  // Convert uppercase description to proper case for readability
  const properCase = description
    .split('. ')
    .map(sentence => {
      if (sentence.length === 0) return sentence;
      return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
    })
    .join('. ');
  
  return `${properCase}\n\n${shortDesc}`;
}

// Extract strength from variant or product
function extractStrength(variant: any, product: any): string {
  if (variant?.strength) {
    return variant.strength;
  }
  // Try to extract from specification
  if (product.specification) {
    const match = product.specification.match(/(\d+(?:\.\d+)?(?:mg|ml|iu))/i);
    if (match) return match[1];
  }
  return 'N/A';
}

// Main CSV generation
function generateCSV() {
  const csvRows: string[] = [];
  
  // CSV Header
  const headers = [
    'Product_ID',
    'Product_Name',
    'Category',
    'Strength',
    'Price_USD',
    'In_Stock',
    'Warehouse_Location',
    'Short_Description',
    'Full_Description',
    'Molecular_Formula',
    'CAS_Number',
    'Image_URL',
    'Certificate_of_Analysis_URL',
    'SEO_Title',
    'SEO_Description',
    'Featured',
    'Popularity_Score',
    'Stock_Quantity',
    'Unit_Size',
    'Temperature_Storage',
    'Shipping_Restrictions',
    'Compliance_Tag',
    'Is_Discontinued',
    'Notes'
  ];
  
  csvRows.push(headers.map(escapeCSV).join(','));
  
  let productIdCounter = 1;
  let rowIndex = 0;
  
  // Process each product
  for (const product of products) {
    // If product has variants, create a row for each variant
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const strength = extractStrength(variant, product);
        const price = variant.price || product.price || 0;
        const inStock = variant.inStock !== undefined ? variant.inStock : (product.inStock !== undefined ? product.inStock : true);
        
        const row = [
          productIdCounter++, // Product_ID (will be autonumber in Airtable, but include for reference)
          product.name, // Product_Name
          product.category, // Category
          strength, // Strength
          price.toFixed(2), // Price_USD
          inStock ? 'TRUE' : 'FALSE', // In_Stock
          generateWarehouseLocation(rowIndex), // Warehouse_Location
          product.shortDescription || '', // Short_Description
          generateFullDescription(product.description || '', product.shortDescription || ''), // Full_Description
          product.chemicalFormula || '', // Molecular_Formula
          product.casNumber || 'N/A', // CAS_Number
          generateImageURL(product.slug), // Image_URL
          '', // Certificate_of_Analysis_URL (empty for now)
          generateSEOTitle(product.name), // SEO_Title
          generateSEODescription(product.name), // SEO_Description
          rowIndex < 10 ? 'TRUE' : 'FALSE', // Featured (first 10 products)
          generatePopularityScore(rowIndex), // Popularity_Score
          generateStockQuantity(), // Stock_Quantity
          generateUnitSize(strength), // Unit_Size
          'Store at −20°C in a dry, dark place', // Temperature_Storage
          'Ships to verified research institutions only', // Shipping_Restrictions
          'RUO', // Compliance_Tag
          'FALSE', // Is_Discontinued
          'Data imported from master peptide catalog.' // Notes
        ];
        
        csvRows.push(row.map(escapeCSV).join(','));
        rowIndex++;
      }
    } else {
      // Product without variants - create single row
      const strength = extractStrength(null, product);
      const price = product.price || 0;
      const inStock = product.inStock !== undefined ? product.inStock : true;
      
      const row = [
        productIdCounter++, // Product_ID
        product.name, // Product_Name
        product.category, // Category
        strength, // Strength
        price.toFixed(2), // Price_USD
        inStock ? 'TRUE' : 'FALSE', // In_Stock
        generateWarehouseLocation(rowIndex), // Warehouse_Location
        product.shortDescription || '', // Short_Description
        generateFullDescription(product.description || '', product.shortDescription || ''), // Full_Description
        product.chemicalFormula || '', // Molecular_Formula
        product.casNumber || 'N/A', // CAS_Number
        generateImageURL(product.slug), // Image_URL
        '', // Certificate_of_Analysis_URL
        generateSEOTitle(product.name), // SEO_Title
        generateSEODescription(product.name), // SEO_Description
        rowIndex < 10 ? 'TRUE' : 'FALSE', // Featured
        generatePopularityScore(rowIndex), // Popularity_Score
        generateStockQuantity(), // Stock_Quantity
        generateUnitSize(strength), // Unit_Size
        'Store at −20°C in a dry, dark place', // Temperature_Storage
        'Ships to verified research institutions only', // Shipping_Restrictions
        'RUO', // Compliance_Tag
        'FALSE', // Is_Discontinued
        'Data imported from master peptide catalog.' // Notes
      ];
      
      csvRows.push(row.map(escapeCSV).join(','));
      rowIndex++;
    }
  }
  
  // Ensure exports directory exists
  const exportsDir = path.join(process.cwd(), 'exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }
  
  // Write full CSV
  const fullCSVPath = path.join(exportsDir, 'vici_peptides_airtable_import.csv');
  fs.writeFileSync(fullCSVPath, csvRows.join('\n'), 'utf-8');
  
  // Write preview CSV (first 11 rows: header + 10 data rows)
  const previewCSVPath = path.join(exportsDir, 'vici_peptides_airtable_import_preview.csv');
  const previewRows = csvRows.slice(0, Math.min(11, csvRows.length));
  fs.writeFileSync(previewCSVPath, previewRows.join('\n'), 'utf-8');
  
  console.log('CSV export complete.');
  console.log(`Full file: ${fullCSVPath}`);
  console.log(`Preview file: ${previewCSVPath}`);
  console.log(`Total rows: ${csvRows.length - 1} (excluding header)`);
  console.log('\nNext step: Upload CSV to Airtable → Map columns manually → Configure formula fields inside Airtable.');
  console.log('Type "continue" when base setup is complete to begin live API connection (Phase 85).');
}

// Run the generator
generateCSV();

