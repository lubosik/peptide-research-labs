const fs = require('fs');
const path = require('path');

// Source folder with images
const SOURCE_FOLDER = '/Users/ghost/Downloads/Peps';
// Destination folder on site
const DEST_FOLDER = '/Users/ghost/Downloads/Peptides Site/public/images/products';

// List of all peptide names from the original list (63 peptides)
const PEPTIDE_NAMES = [
  '5-amino-1mq',
  'ACETIC ACID',
  'AICAR',
  'AOD9604',
  'ARA 290',
  'Adipotide',
  'BPC-157',
  'BPC-157 + TB-500',
  'Bac Water',
  'CJC-1295 (without DAC) 5mg + IPA 5mg',
  'CJC-1295 with DAC',
  'CJC-1295 without DAC',
  'Cagrilintide',
  'Cagrilintide 5mg + Semaglutide',
  'Cerebrolysin',
  'DSIP',
  'Dermorphin',
  'Epitalon',
  'FOXO4',
  'GHK-Cu',
  'GHRP-2 Acetate',
  'GHRP-6 Acetate',
  'Glow',
  'Glutathione',
  'Gonadorelin',
  'Gonadorelin Acetate',
  'HCG',
  'HGH',
  'HMG',
  'Hexarelin Acetate',
  'IGF-1LR3',
  'Ipamorelin',
  'KPV',
  'Kisspeptin-10',
  'Klow',
  'L-carnitine',
  'LL37',
  'Lemon Bottle',
  'Lipo-c',
  'MGF',
  'MOTS-C',
  'Mazdutide',
  'Melanotan I',
  'Melanotan II',
  'Melatonin',
  'NAD+',
  'Oxytocin Acetate',
  'PEG-MGF',
  'PT-141',
  'Retatrutide',
  'SS-31',
  'Selank',
  'Semaglutide',
  'Semax',
  'Sermorelin',
  'Snap-8',
  'Survodutide',
  'TB-500 (Thymosin B4 Acetate)',
  'Tesamorelin',
  'Thymalin',
  'Thymosin Alpha-1',
  'Tirzepatide',
  'VIP'
];

// Normalize product name for matching
function normalizeName(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim();
}

// Normalize filename for matching
function normalizeFilename(filename) {
  return filename
    .replace(/\.(jpg|jpeg|png)$/i, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim();
}

// Get all image files from source folder
function getImageFiles() {
  try {
    const files = fs.readdirSync(SOURCE_FOLDER);
    return files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  } catch (error) {
    console.error('Error reading source folder:', error);
    return [];
  }
}

// Match product name to image file
function findMatchingImage(productName, imageFiles) {
  const normalizedProduct = normalizeName(productName);
  
  // Try exact match first
  for (const file of imageFiles) {
    const normalizedFile = normalizeFilename(file);
    if (normalizedFile === normalizedProduct) {
      return file;
    }
  }
  
  // Try partial match (product name contains key parts of filename)
  for (const file of imageFiles) {
    const normalizedFile = normalizeFilename(file);
    // Check if product name is contained in filename or vice versa
    if (normalizedFile.includes(normalizedProduct) || normalizedProduct.includes(normalizedFile)) {
      return file;
    }
  }
  
  // Try fuzzy matching for common patterns
  const productKey = normalizedProduct.replace(/5MG|10MG|2MG|MG|VICIPEPTIDES|VICI/g, '');
  for (const file of imageFiles) {
    const normalizedFile = normalizeFilename(file).replace(/5MG|10MG|2MG|MG|VICIPEPTIDES|VICI/g, '');
    if (normalizedFile === productKey || productKey === normalizedFile) {
      return file;
    }
  }
  
  return null;
}

// Generate destination filename
function getDestinationFilename(productName) {
  return `vici-${productName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')}.png`;
}

// Main function
function main() {
  console.log('🔍 Scanning for peptide images...\n');
  
  const imageFiles = getImageFiles();
  console.log(`Found ${imageFiles.length} image files in source folder\n`);
  
  const matches = [];
  const unmatched = [];
  
  // Match each product with an image
  for (const productName of PEPTIDE_NAMES) {
    const imageFile = findMatchingImage(productName, imageFiles);
    if (imageFile) {
      matches.push({ productName, imageFile });
      console.log(`✅ ${productName} → ${imageFile}`);
    } else {
      unmatched.push(productName);
      console.log(`❌ ${productName} → NO MATCH`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Matched: ${matches.length}/${PEPTIDE_NAMES.length}`);
  console.log(`   Unmatched: ${unmatched.length}`);
  
  if (unmatched.length > 0) {
    console.log(`\n⚠️  Unmatched products:`);
    unmatched.forEach(name => console.log(`   - ${name}`));
  }
  
  // Copy matched images
  console.log(`\n📦 Copying images...`);
  let copied = 0;
  let skipped = 0;
  
  for (const { productName, imageFile } of matches) {
    const sourcePath = path.join(SOURCE_FOLDER, imageFile);
    const destFilename = getDestinationFilename(productName);
    const destPath = path.join(DEST_FOLDER, destFilename);
    
    try {
      if (fs.existsSync(destPath)) {
        console.log(`⏭️  Skipped (exists): ${destFilename}`);
        skipped++;
      } else {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied: ${destFilename}`);
        copied++;
      }
    } catch (error) {
      console.error(`❌ Error copying ${imageFile}:`, error.message);
    }
  }
  
  console.log(`\n✨ Done! Copied ${copied} images, skipped ${skipped} existing files.`);
  
  // Generate mapping for get-product-image.ts
  console.log(`\n📝 Generating mapping code...`);
  const mappingCode = matches.map(({ productName, imageFile }) => {
    const destFilename = getDestinationFilename(productName);
    return `  // ${productName} → ${imageFile}
  if (name.includes('${productName.toUpperCase().replace(/'/g, "\\'")}') || name.includes('${normalizeName(productName)}')) {
    return '/images/products/${destFilename}';
  }`;
  }).join('\n');
  
  console.log('\n' + '='.repeat(60));
  console.log('Add this to get-product-image.ts:');
  console.log('='.repeat(60));
  console.log(mappingCode);
  console.log('='.repeat(60));
}

main();

