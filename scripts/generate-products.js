/**
 * Script to generate product entries from PDF JSON data
 * This will create a comprehensive products.ts file with all peptides
 */

const fs = require('fs');
const path = require('path');

// Read the JSON data
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/peptides-from-pdf.json'), 'utf8'));

// Helper function to generate slug from name and specification
function generateSlug(name, specification) {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const specMatch = specification.match(/(\d+(?:\.\d+)?)(mg|ml|iu|g)/i);
  const specSlug = specMatch ? `${specMatch[1]}${specMatch[2].toLowerCase()}` : '';
  return specSlug ? `${nameSlug}-${specSlug}` : nameSlug;
}

// Helper function to generate ID from SKU
function generateId(sku) {
  return sku.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Peptide research data (comprehensive scientific information)
const peptideData = {
  'Epitalon': {
    chemicalFormula: 'C14H20N4O9',
    molarMass: '388.33 g/mol',
    casNumber: '307297-39-8',
    synonyms: ['Epithalamin', 'Ala-Glu-Asp-Gly', 'AEDG'],
    pubchemId: '9941958',
    shelfLife: '24 months',
    researchApplications: 'Epitalon is used in laboratory research to investigate cellular aging mechanisms and telomere maintenance. Research applications include studies on telomere length modulation, cellular senescence delay, pineal gland function, melatonin secretion regulation, and aging-related gene expression in experimental models.',
    storageRequirements: 'Store lyophilized powder at 2-8°C in airtight, light-blocking containers. Protect from light, air, and moisture.',
    handlingGuidelines: 'Handle using sterile techniques and appropriate laboratory personal protective equipment (PPE). Use in well-ventilated areas.',
  },
  'MOTS-C': {
    chemicalFormula: 'C77H120N20O26S',
    molarMass: '1861.0 g/mol',
    casNumber: 'N/A',
    synonyms: ['Mitochondrial ORF of the Twelve S rRNA-c', 'MOTS-c'],
    pubchemId: 'N/A',
    shelfLife: '36 months',
    researchApplications: 'MOTS-C is used in laboratory research to investigate metabolic regulation and mitochondrial function. Research applications include studies on insulin sensitivity, glucose homeostasis, metabolic syndrome, and mitochondrial biogenesis.',
    storageRequirements: 'Store lyophilized powder at -20°C in a dry environment. Protect from light and moisture.',
    handlingGuidelines: 'Handle using sterile techniques and appropriate laboratory personal protective equipment (PPE).',
  },
  'NAD+': {
    chemicalFormula: 'C21H27N7O14P2',
    molarMass: '663.43 g/mol',
    casNumber: '53-84-9',
    synonyms: ['Nicotinamide adenine dinucleotide', 'NAD', 'Coenzyme I'],
    pubchemId: '5892',
    shelfLife: '24 months',
    researchApplications: 'NAD+ is used in laboratory research to investigate cellular metabolism, energy production, and aging mechanisms. Research applications include studies on sirtuin activation, mitochondrial function, DNA repair pathways, and cellular senescence.',
    storageRequirements: 'Store lyophilized powder at -20°C in a dry environment. Protect from light, air, and moisture.',
    handlingGuidelines: 'Handle using sterile techniques. NAD+ is sensitive to light and should be protected from direct exposure.',
  },
  // Add more peptide data as needed - this is a template
};

// Generate product entries
let productEntries = [];

jsonData.categories.forEach((category, catIndex) => {
  category.products.forEach((product, prodIndex) => {
    const slug = generateSlug(product.name, product.specification);
    const id = generateId(product.sku);
    const baseData = peptideData[product.name] || {
      chemicalFormula: 'N/A',
      molarMass: 'N/A',
      casNumber: 'N/A',
      synonyms: [],
      pubchemId: 'N/A',
      shelfLife: '36 months',
      researchApplications: `${product.name} is used in laboratory research for scientific investigations. Research applications include studies on biochemical processes, cellular mechanisms, and experimental models.`,
      storageRequirements: 'Store lyophilized powder at -20°C in a dry environment. Protect from light and moisture.',
      handlingGuidelines: 'Handle using sterile techniques and appropriate laboratory personal protective equipment (PPE).',
    };

    const description = `${product.name.toUpperCase()} IS A RESEARCH COMPOUND USED IN LABORATORY INVESTIGATIONS. RESEARCH APPLICATIONS INCLUDE STUDIES ON BIOCHEMICAL PROCESSES, CELLULAR MECHANISMS, AND EXPERIMENTAL MODELS. FOR LABORATORY RESEARCH USE ONLY.`;
    const shortDescription = `${product.name} for laboratory research applications`;

    const productEntry = {
      id: `'${id}'`,
      slug: `'${slug}'`,
      name: `'${product.name}'`,
      sku: `'${product.sku}'`,
      specification: `'${product.specification}'`,
      description: `'${description}'`,
      shortDescription: `'${shortDescription}'`,
      price: product.price.toFixed(2),
      image: `'/images/products/${slug}-placeholder.jpg'`,
      inStock: 'true',
      category: `'${category.categoryName}'`,
      warehouseOptions: 'defaultWarehouseOptions',
      chemicalFormula: `'${baseData.chemicalFormula}'`,
      molarMass: `'${baseData.molarMass}'`,
      casNumber: `'${baseData.casNumber}'`,
      synonyms: JSON.stringify(baseData.synonyms),
      pubchemId: `'${baseData.pubchemId}'`,
      shelfLife: `'${baseData.shelfLife}'`,
      researchApplications: `'${baseData.researchApplications}'`,
      storageRequirements: `'${baseData.storageRequirements}'`,
      handlingGuidelines: `'${baseData.handlingGuidelines}'`,
    };

    productEntries.push(productEntry);
  });
});

// Generate TypeScript code
let tsCode = productEntries.map((p, index) => {
  return `  {
    id: ${p.id},
    slug: ${p.slug},
    name: ${p.name},
    sku: ${p.sku},
    specification: ${p.specification},
    description: ${p.description},
    shortDescription: ${p.shortDescription},
    price: ${p.price},
    image: ${p.image},
    inStock: ${p.inStock},
    category: ${p.category},
    warehouseOptions: ${p.warehouseOptions},
    chemicalFormula: ${p.chemicalFormula},
    molarMass: ${p.molarMass},
    casNumber: ${p.casNumber},
    synonyms: ${p.synonyms},
    pubchemId: ${p.pubchemId},
    shelfLife: ${p.shelfLife},
    researchApplications: ${p.researchApplications},
    storageRequirements: ${p.storageRequirements},
    handlingGuidelines: ${p.handlingGuidelines},
  }${index < productEntries.length - 1 ? ',' : ''}`;
}).join('\n');

console.log(`Generated ${productEntries.length} product entries`);
console.log('\n--- TypeScript Code ---\n');
console.log(tsCode);

