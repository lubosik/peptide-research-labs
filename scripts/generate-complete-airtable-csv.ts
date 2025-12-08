import { products } from '../data/products';
import * as fs from 'fs';
import * as path from 'path';

// CSV escaping function
function escapeCSV(value: string | number | boolean | undefined | null | string[]): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (Array.isArray(value)) {
    return escapeCSV(value.join(', '));
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

// Generate warehouse location
function generateWarehouseLocation(): string {
  return 'Both';
}

// Generate popularity score (1-100)
function generatePopularityScore(index: number, baseScore: number = 70): number {
  // Base score with some variation
  return Math.max(1, Math.min(100, baseScore + (index % 30) - 15));
}

// Generate stock quantity
function generateStockQuantity(): number {
  return Math.floor(Math.random() * 200) + 50; // 50-250 units
}

// Generate SEO title
function generateSEOTitle(productName: string, strength: string): string {
  return `Buy ${productName} ${strength} Research Peptide – Vici Peptides`;
}

// Generate SEO description
function generateSEODescription(productName: string, strength: string, shortDesc: string): string {
  return `High-purity ${productName} ${strength} research peptide available for laboratory research use only from Vici Peptides. ${shortDesc}`;
}

// Convert full description to proper case
function formatFullDescription(description: string): string {
  if (!description) return '';
  
  // Convert uppercase description to proper case for readability
  const properCase = description
    .split('. ')
    .map(sentence => {
      if (sentence.length === 0) return sentence;
      return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
    })
    .join('. ');
  
  return properCase;
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
  // Try to extract from SKU or name
  const skuMatch = product.sku?.match(/(\d+(?:mg|ml|iu))/i);
  if (skuMatch) return skuMatch[1];
  return 'N/A';
}

// Main CSV generation
function generateCSV() {
  const csvRows: string[] = [];
  
  // CSV Header - exact order from user specification
  const headers = [
    'Product_ID',
    'Product_Name',
    'Variant_Strength',
    'Category',
    'Price_USD',
    'In_Stock',
    'Warehouse_Location',
    'SKU_Code',
    'Short_Description',
    'Full_Description',
    'Molecular_Formula',
    'Molar_Mass',
    'CAS_Number',
    'Synonyms',
    'PubChem_ID',
    'Image_URL',
    'Certificate_of_Analysis_URL',
    'SEO_Title',
    'SEO_Description',
    'Featured',
    'Popularity_Score',
    'Stock_Quantity',
    'Unit_Size',
    'Specification',
    'Temperature_Storage',
    'Shelf_Life',
    'Shipping_Restrictions',
    'Is_Discontinued',
    'Research_Applications',
    'Storage_Requirements',
    'Handling_Guidelines',
    'Notes',
    'Product_Slug'
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
        const sku = variant.sku || product.sku || '';
        const specification = variant.specification || product.specification || `${strength} vial`;
        
        // Format synonyms array
        const synonyms = product.synonyms ? product.synonyms.join(', ') : '';
        
        // Generate popularity score (higher for featured products)
        const basePopularity = product.category?.includes('Weight Loss') ? 85 : 
                              product.category?.includes('Beauty') ? 75 : 70;
        const popularity = generatePopularityScore(rowIndex, basePopularity);
        
        const row = [
          productIdCounter++, // Product_ID (will be autonumber in Airtable, but include for reference)
          product.name, // Product_Name
          strength, // Variant_Strength
          product.category || '', // Category
          price.toFixed(2), // Price_USD
          inStock ? 'TRUE' : 'FALSE', // In_Stock
          generateWarehouseLocation(), // Warehouse_Location
          sku, // SKU_Code
          product.shortDescription || '', // Short_Description
          formatFullDescription(product.description || ''), // Full_Description
          product.chemicalFormula || '', // Molecular_Formula
          product.molarMass || '', // Molar_Mass
          product.casNumber || 'N/A', // CAS_Number
          synonyms, // Synonyms
          product.pubchemId || 'N/A', // PubChem_ID
          generateImageURL(product.slug), // Image_URL
          '', // Certificate_of_Analysis_URL (empty for now)
          generateSEOTitle(product.name, strength), // SEO_Title
          generateSEODescription(product.name, strength, product.shortDescription || ''), // SEO_Description
          rowIndex < 15 ? 'TRUE' : 'FALSE', // Featured (first 15 products)
          popularity, // Popularity_Score
          generateStockQuantity(), // Stock_Quantity
          '1 Vial', // Unit_Size
          specification, // Specification
          product.storageRequirements?.split('.')[0] || 'Store at −20°C in a dry, dark place', // Temperature_Storage
          product.shelfLife || '36 months', // Shelf_Life
          'Ships to verified research institutions only', // Shipping_Restrictions
          'FALSE', // Is_Discontinued
          product.researchApplications || '', // Research_Applications
          product.storageRequirements || 'Store lyophilized powder at -20°C in a dry environment. Protect from light and moisture.', // Storage_Requirements
          product.handlingGuidelines || 'Handle using sterile techniques and appropriate laboratory personal protective equipment (PPE).', // Handling_Guidelines
          'Data imported from master peptide catalog.', // Notes
          product.slug // Product_Slug
        ];
        
        csvRows.push(row.map(escapeCSV).join(','));
        rowIndex++;
      }
    } else {
      // Product without variants - create single row
      const strength = extractStrength(null, product);
      const price = product.price || 0;
      const inStock = product.inStock !== undefined ? product.inStock : true;
      const sku = product.sku || '';
      const specification = product.specification || `${strength} vial`;
      
      // Format synonyms array
      const synonyms = product.synonyms ? product.synonyms.join(', ') : '';
      
      // Generate popularity score
      const basePopularity = product.category?.includes('Weight Loss') ? 85 : 
                            product.category?.includes('Beauty') ? 75 : 70;
      const popularity = generatePopularityScore(rowIndex, basePopularity);
      
      const row = [
        productIdCounter++, // Product_ID
        product.name, // Product_Name
        strength, // Variant_Strength
        product.category || '', // Category
        price.toFixed(2), // Price_USD
        inStock ? 'TRUE' : 'FALSE', // In_Stock
        generateWarehouseLocation(), // Warehouse_Location
        sku, // SKU_Code
        product.shortDescription || '', // Short_Description
        formatFullDescription(product.description || ''), // Full_Description
        product.chemicalFormula || '', // Molecular_Formula
        product.molarMass || '', // Molar_Mass
        product.casNumber || 'N/A', // CAS_Number
        synonyms, // Synonyms
        product.pubchemId || 'N/A', // PubChem_ID
        generateImageURL(product.slug), // Image_URL
        '', // Certificate_of_Analysis_URL
        generateSEOTitle(product.name, strength), // SEO_Title
        generateSEODescription(product.name, strength, product.shortDescription || ''), // SEO_Description
        rowIndex < 15 ? 'TRUE' : 'FALSE', // Featured
        popularity, // Popularity_Score
        generateStockQuantity(), // Stock_Quantity
        '1 Vial', // Unit_Size
        specification, // Specification
        product.storageRequirements?.split('.')[0] || 'Store at −20°C in a dry, dark place', // Temperature_Storage
        product.shelfLife || '36 months', // Shelf_Life
        'Ships to verified research institutions only', // Shipping_Restrictions
        'FALSE', // Is_Discontinued
        product.researchApplications || '', // Research_Applications
        product.storageRequirements || 'Store lyophilized powder at -20°C in a dry environment. Protect from light and moisture.', // Storage_Requirements
        product.handlingGuidelines || 'Handle using sterile techniques and appropriate laboratory personal protective equipment (PPE).', // Handling_Guidelines
        'Data imported from master peptide catalog.', // Notes
        product.slug // Product_Slug
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
  
  console.log('✅ Vici Peptides CSV export complete.');
  console.log('');
  console.log('Files generated:');
  console.log('- /exports/vici_peptides_airtable_import.csv');
  console.log('- /exports/vici_peptides_airtable_import_preview.csv');
  console.log('');
  console.log(`Total rows: ${csvRows.length - 1} (excluding header)`);
  console.log(`Total columns: ${headers.length}`);
  console.log('');
  console.log('Next step: Import full CSV into Airtable > Map all fields > Configure formulas manually.');
}

// Run the generator
generateCSV();

