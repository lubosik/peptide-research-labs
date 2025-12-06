/**
 * Blog Article Generator for Peptides
 * 
 * Generates blog post content for each peptide product.
 */

import { Product } from '@/data/products';

export interface PeptideArticle {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  author: string;
  publishedDate: string;
  readTime: string;
  content: {
    introduction: string;
    chemicalBackground: string;
    laboratoryStudySummary: string;
    handlingAndStorage: string;
    conclusion: string;
  };
  disclaimer: string;
}

/**
 * Generate a blog article for a peptide product
 */
export function generatePeptideArticle(product: Product): PeptideArticle {
  // Extract base name (remove specification)
  const baseName = product.name.split('(')[0].trim();
  
  // Generate title
  const title = `What Is ${baseName}? Research Insights & Laboratory Applications`;
  
  // Generate meta description
  const metaDescription = `Learn about ${baseName}, a research compound used in laboratory investigations. Discover its chemical properties, research applications, and handling guidelines for scientific use.`;
  
  // Generate keywords
  const keywords = [
    baseName,
    ...(product.synonyms || []),
    product.category,
    'peptide research',
    'laboratory research',
    'research compound',
    ...(product.chemicalFormula ? ['chemical formula'] : []),
  ].filter(Boolean);

  // Generate content sections
  const introduction = `${baseName} is a research compound used in laboratory investigations to study various biochemical and cellular processes. This article provides an overview of the compound's chemical properties, research applications, and handling guidelines for scientific research purposes.`;

  const chemicalBackground = product.chemicalFormula
    ? `${baseName} has the chemical formula ${product.chemicalFormula}${product.molarMass ? ` with a molar mass of ${product.molarMass}` : ''}.${product.casNumber ? ` The CAS registry number is ${product.casNumber}.` : ''}${product.synonyms && product.synonyms.length > 0 ? ` The compound is also known by the following synonyms: ${product.synonyms.join(', ')}.` : ''}${product.pubchemId ? ` Additional chemical information can be found in PubChem (ID: ${product.pubchemId}).` : ''}`
    : `${baseName} is a research compound used in laboratory investigations. Chemical properties and structural information are available in the product specifications and material safety data sheets.`;

  const laboratoryStudySummary = product.researchApplications
    ? product.researchApplications
    : `${baseName} is used in laboratory research to investigate various biochemical and cellular processes. Research applications include studies on cellular mechanisms, biochemical pathways, and experimental models in controlled laboratory settings.`;

  const handlingAndStorage = product.storageRequirements && product.handlingGuidelines
    ? `**Storage Requirements:** ${product.storageRequirements}\n\n**Handling Guidelines:** ${product.handlingGuidelines}`
    : `**Storage Requirements:** Store lyophilized powder at -20°C in a dry environment. Protect from light and moisture. Reconstituted solution should be stored at 4°C for up to 14 days. Maintain sterile conditions during reconstitution.\n\n**Handling Guidelines:** Handle using sterile techniques and appropriate laboratory personal protective equipment (PPE). Use in well-ventilated areas. Avoid inhalation, ingestion, or skin contact. Follow standard laboratory safety protocols.`;

  const conclusion = `This overview provides basic information about ${baseName} for laboratory research purposes. Researchers should consult the complete product documentation, material safety data sheets, and relevant scientific literature before conducting experiments with this compound.`;

  const disclaimer = `**Important Disclaimer:** This article is for informational purposes only. ${baseName} is sold for laboratory research use only. Not for human or veterinary consumption. Not approved by the FDA for any therapeutic purpose. All research should be conducted in accordance with applicable laws and regulations.`;

  return {
    id: `peptide-${product.id}`,
    slug: product.slug,
    title,
    metaDescription,
    keywords,
    category: product.category,
    author: 'Vici Peptides',
    publishedDate: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    content: {
      introduction,
      chemicalBackground,
      laboratoryStudySummary,
      handlingAndStorage,
      conclusion,
    },
    disclaimer,
  };
}

/**
 * Generate all peptide articles
 */
export function generateAllPeptideArticles(products: Product[]): PeptideArticle[] {
  // Group products by base name to avoid duplicate articles
  const baseNames = new Map<string, Product>();
  
  products.forEach((product) => {
    const baseName = product.name.split('(')[0].trim();
    if (!baseNames.has(baseName)) {
      baseNames.set(baseName, product);
    }
  });
  
  return Array.from(baseNames.values()).map(generatePeptideArticle);
}

