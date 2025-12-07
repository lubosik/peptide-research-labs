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
  subtitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  author: string;
  publishedDate: string;
  readTime: string;
  content: {
    introduction: string;
    mechanismOfAction: string;
    chemicalBackground: string;
    laboratoryApplications: string;
    handlingAndStorage: string;
    conclusion: string;
  };
  crossLinkedResearch: Array<{
    name: string;
    slug: string;
  }>;
  externalCitations: Array<{
    title: string;
    url: string;
    source: string;
    year?: string;
  }>;
  references: Array<{
    id: string;
    citation: string;
    url?: string;
  }>;
  disclaimer: string;
}

/**
 * Generate a blog article for a peptide product
 */
export function generatePeptideArticle(product: Product, allProducts?: Product[]): PeptideArticle {
  // Extract base name (remove specification)
  const baseName = product.name.split('(')[0].trim();
  
  // Generate title - Phase 74 format
  const title = `Research Overview: ${baseName}`;
  
  // Generate subtitle (SEO-optimized tagline)
  const subtitle = product.shortDescription || `Comprehensive laboratory research overview of ${baseName}, including mechanism of action, chemical properties, and research applications.`;
  
  // Generate meta description
  const metaDescription = `Learn about ${baseName}, a research compound used in laboratory investigations. Discover its mechanism of action, chemical properties, research applications, and handling guidelines for scientific use.`;
  
  // Generate keywords
  const keywords = [
    baseName,
    ...(product.synonyms || []),
    product.category,
    'peptide research',
    'laboratory research',
    'research compound',
    'mechanism of action',
    ...(product.chemicalFormula ? ['chemical formula'] : []),
  ].filter(Boolean);

  // Generate content sections with enhanced research-oriented content
  const introduction = `${baseName} is a research compound used in laboratory investigations to study various biochemical and cellular processes. This article provides a comprehensive overview of the compound's mechanism of action, chemical properties, research applications, and handling guidelines for scientific research purposes. Researchers utilize ${baseName} in controlled laboratory settings to investigate cellular mechanisms, biochemical pathways, and experimental models. The compound falls within the ${product.category} category and is employed in research settings to advance scientific understanding of biological processes.`;

  // Mechanism of Action section - Enhanced with stability and biological function
  const mechanismOfAction = product.researchApplications
    ? `The mechanism of action of ${baseName} involves its interaction with specific cellular receptors and biochemical pathways. In laboratory research, ${baseName} has been studied for its effects on various cellular processes. ${product.researchApplications.split('.')[0]}. 

Researchers investigate how ${baseName} modulates cellular signaling, receptor binding, and downstream biochemical cascades in experimental models. The compound's biological activity is typically evaluated through in vitro assays and ex vivo tissue studies, providing insights into its potential research applications.

The stability of ${baseName}${product.shelfLife ? ` (shelf life: ${product.shelfLife})` : ''} is an important consideration for laboratory research. Proper storage and handling are essential to maintain the compound's biological activity and structural integrity throughout experimental procedures. Researchers typically assess the compound's stability under various conditions, including temperature, pH, and storage duration, to ensure reliable experimental results.

The biological function of ${baseName} in research contexts involves its interaction with cellular targets, which may include receptors, enzymes, or other molecular components. Understanding these interactions helps researchers design experiments to investigate specific biological processes and pathways.`
    : `The mechanism of action of ${baseName} involves its interaction with specific cellular receptors and biochemical pathways. In laboratory research, ${baseName} has been studied for its effects on various cellular processes. Researchers investigate how ${baseName} modulates cellular signaling, receptor binding, and downstream biochemical cascades in experimental models. The compound's biological activity is typically evaluated through in vitro assays and ex vivo tissue studies, providing insights into its potential research applications.

The stability of ${baseName}${product.shelfLife ? ` (shelf life: ${product.shelfLife})` : ''} is an important consideration for laboratory research. Proper storage and handling are essential to maintain the compound's biological activity and structural integrity throughout experimental procedures. Researchers typically assess the compound's stability under various conditions, including temperature, pH, and storage duration, to ensure reliable experimental results.

The biological function of ${baseName} in research contexts involves its interaction with cellular targets, which may include receptors, enzymes, or other molecular components. Understanding these interactions helps researchers design experiments to investigate specific biological processes and pathways.`;

  const chemicalBackground = product.chemicalFormula
    ? `${baseName} has the chemical formula ${product.chemicalFormula}${product.molarMass ? ` with a molar mass of ${product.molarMass}` : ''}.${product.casNumber ? ` The CAS registry number is ${product.casNumber}.` : ''}${product.synonyms && product.synonyms.length > 0 ? ` The compound is also known by the following synonyms: ${product.synonyms.join(', ')}.` : ''}${product.pubchemId ? ` Additional chemical information can be found in PubChem (ID: ${product.pubchemId}).` : ''} The structural properties of ${baseName} contribute to its biological activity and research applications.`
    : `${baseName} is a research compound used in laboratory investigations. Chemical properties and structural information are available in the product specifications and material safety data sheets.`;

  // Laboratory Applications - Enhanced with lab-handling relevance
  const laboratoryApplications = product.researchApplications
    ? `${baseName} is used in laboratory research to investigate various biochemical and cellular processes. ${product.researchApplications} 

Researchers typically employ ${baseName} in in vitro cell culture studies, ex vivo tissue experiments, and biochemical assays to understand its effects on cellular mechanisms and signaling pathways. The compound's lab-handling relevance is significant, as proper preparation, storage, and administration protocols are essential for obtaining reliable and reproducible research results.

In vitro applications of ${baseName} involve studies conducted in controlled laboratory environments using cell cultures, tissue samples, or isolated biological systems. These studies allow researchers to investigate the compound's effects on specific cellular processes, receptor interactions, and biochemical pathways under controlled conditions.

Ex vivo applications involve experiments conducted on tissues or organs removed from their natural biological environment but maintained in conditions that preserve their biological activity. These studies provide insights into how ${baseName} interacts with intact biological systems while maintaining experimental control.

Researchers working with ${baseName} should follow established laboratory protocols, maintain sterile conditions during reconstitution and handling, and adhere to all safety guidelines. Proper documentation of experimental procedures, storage conditions, and handling protocols is essential for research reproducibility and scientific rigor.`
    : `${baseName} is used in laboratory research to investigate various biochemical and cellular processes. Research applications include studies on cellular mechanisms, biochemical pathways, and experimental models in controlled laboratory settings. 

Researchers typically employ ${baseName} in in vitro cell culture studies, ex vivo tissue experiments, and biochemical assays to understand its effects on cellular mechanisms and signaling pathways. The compound's lab-handling relevance is significant, as proper preparation, storage, and administration protocols are essential for obtaining reliable and reproducible research results.

In vitro applications of ${baseName} involve studies conducted in controlled laboratory environments using cell cultures, tissue samples, or isolated biological systems. These studies allow researchers to investigate the compound's effects on specific cellular processes, receptor interactions, and biochemical pathways under controlled conditions.

Ex vivo applications involve experiments conducted on tissues or organs removed from their natural biological environment but maintained in conditions that preserve their biological activity. These studies provide insights into how ${baseName} interacts with intact biological systems while maintaining experimental control.

Researchers working with ${baseName} should follow established laboratory protocols, maintain sterile conditions during reconstitution and handling, and adhere to all safety guidelines. Proper documentation of experimental procedures, storage conditions, and handling protocols is essential for research reproducibility and scientific rigor.`;

  const handlingAndStorage = product.storageRequirements && product.handlingGuidelines
    ? `**Storage Requirements:** ${product.storageRequirements}\n\n**Handling Guidelines:** ${product.handlingGuidelines}`
    : `**Storage Requirements:** Store lyophilized powder at -20°C in a dry environment. Protect from light and moisture. Reconstituted solution should be stored at 4°C for up to 14 days. Maintain sterile conditions during reconstitution.\n\n**Handling Guidelines:** Handle using sterile techniques and appropriate laboratory personal protective equipment (PPE). Use in well-ventilated areas. Avoid inhalation, ingestion, or skin contact. Follow standard laboratory safety protocols.`;

  const conclusion = `This overview provides comprehensive information about ${baseName} for laboratory research purposes. Researchers should consult the complete product documentation, material safety data sheets, and relevant scientific literature before conducting experiments with this compound. Understanding the mechanism of action, chemical properties, stability characteristics, biological function, and proper handling procedures is essential for safe and effective laboratory research.

For researchers interested in obtaining ${baseName} for laboratory use, please visit our product page at /products/${product.slug} to view available strengths and specifications. All materials are provided for research purposes only and must be handled in accordance with applicable laboratory safety protocols and regulations.`;

  // Generate cross-linked research (related peptides from same category)
  const crossLinkedResearch: Array<{ name: string; slug: string }> = [];
  if (allProducts) {
    const relatedProducts = allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3); // Limit to 3 related peptides
    
    crossLinkedResearch.push(...relatedProducts.map(p => ({
      name: p.name.split('(')[0].trim(),
      slug: p.slug,
    })));
  }

  // Generate external citations with proper references
  const externalCitations: Array<{ title: string; url: string; source: string; year?: string }> = [];
  
  // Add PubChem citation if available
  if (product.pubchemId) {
    externalCitations.push({
      title: `${baseName} - PubChem Compound Summary`,
      url: `https://pubchem.ncbi.nlm.nih.gov/compound/${product.pubchemId}`,
      source: 'PubChem (NCBI)',
    });
  }
  
  // Add generic research database citations
  externalCitations.push(
    {
      title: `PubMed Search: ${baseName} Research Literature`,
      url: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(baseName)}`,
      source: 'PubMed (NCBI)',
    },
    {
      title: `${baseName} - Chemical Information Database`,
      url: `https://www.ncbi.nlm.nih.gov/`,
      source: 'NCBI',
    }
  );

  // Add CAS Registry citation if available
  if (product.casNumber) {
    externalCitations.push({
      title: `CAS Registry: ${baseName} (${product.casNumber})`,
      url: `https://commonchemistry.cas.org/detail?cas_rn=${product.casNumber}`,
      source: 'CAS Registry',
    });
  }

  // Generate references section
  const references: Array<{ id: string; citation: string; url?: string }> = [];
  
  // Add PubChem reference
  if (product.pubchemId) {
    references.push({
      id: 'pubchem',
      citation: `National Center for Biotechnology Information. PubChem Compound Summary for CID ${product.pubchemId}, ${baseName}. PubChem. https://pubchem.ncbi.nlm.nih.gov/compound/${product.pubchemId}`,
      url: `https://pubchem.ncbi.nlm.nih.gov/compound/${product.pubchemId}`,
    });
  }
  
  // Add CAS Registry reference
  if (product.casNumber) {
    references.push({
      id: 'cas',
      citation: `Chemical Abstracts Service. CAS Registry Number ${product.casNumber} - ${baseName}. CAS Registry.`,
      url: `https://commonchemistry.cas.org/detail?cas_rn=${product.casNumber}`,
    });
  }
  
  // Add general research references
  references.push({
    id: 'pubmed',
    citation: `PubMed. Search results for "${baseName}" in research literature. National Library of Medicine. https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(baseName)}`,
    url: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(baseName)}`,
  });

  const disclaimer = `**Important Disclaimer:** All materials are sold strictly for laboratory research use only. Not for human administration. ${baseName} is not approved by the FDA for any therapeutic purpose. All research should be conducted in accordance with applicable laws and regulations.`;

  return {
    id: `peptide-${product.id}`,
    slug: product.slug,
    title,
    subtitle,
    metaDescription,
    keywords,
    category: product.category,
    author: 'Vici Peptides Editorial',
    publishedDate: new Date().toISOString().split('T')[0],
    readTime: '8 min read',
    content: {
      introduction,
      mechanismOfAction,
      chemicalBackground,
      laboratoryApplications,
      handlingAndStorage,
      conclusion,
    },
    crossLinkedResearch,
    externalCitations,
    references,
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
  
  return Array.from(baseNames.values()).map(product => generatePeptideArticle(product, products));
}

