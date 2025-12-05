/**
 * Product Data
 * 
 * Sample products for development. In production, this will be replaced
 * with database queries or API calls.
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  inStock: boolean;
  category: string;
  // Chemical Information
  chemicalFormula?: string;
  molarMass?: string;
  casNumber?: string;
  synonyms?: string[];
  pubchemId?: string;
  shelfLife?: string;
  // Research Applications
  researchApplications?: string;
  // Safety & Handling
  storageRequirements?: string;
  handlingGuidelines?: string;
}

export const products: Product[] = [
  {
    id: '1',
    slug: 'bpc-157',
    name: 'BPC-157',
    description: 'BPC-157 IS A SYNTHETIC PENTADECAPEPTIDE COMPOUND STUDIED FOR ITS POTENTIAL ROLE IN CELLULAR REPAIR MECHANISMS AND TISSUE REGENERATION PROCESSES. RESEARCH APPLICATIONS INCLUDE INVESTIGATIONS INTO TENDON AND LIGAMENT HEALING, GASTROINTESTINAL CYTOPROTECTION, NEUROPROTECTIVE EFFECTS, AND ANGIOGENESIS MODULATION IN EXPERIMENTAL MODELS.',
    shortDescription: 'Synthetic pentadecapeptide for laboratory research',
    price: 89.99,
    image: '/images/products/bpc-157-placeholder.jpg',
    inStock: true,
    category: 'Repair Peptides',
    chemicalFormula: 'C62H98N16O22',
    molarMass: '1419.5 g/mol',
    casNumber: '137525-51-0',
    synonyms: ['Body Protection Compound-157', 'PL-14736', 'Bepecin', 'BPC-15', 'PL-10', 'PLD-116', 'Gastric Pentadecapeptide'],
    pubchemId: '9941957',
    shelfLife: '36 months',
    researchApplications: 'BPC-157 has been extensively studied in laboratory research for its potential effects on cellular repair mechanisms. Research applications include investigations into tissue regeneration, wound healing processes, tendon and ligament repair, gastrointestinal cytoprotection, neuroprotective effects in central nervous system injuries, angiogenesis modulation through VEGFR2 activation, and cellular signaling pathways in experimental models. The peptide demonstrates stability in human gastric juice and has been investigated for its role in nitric oxide system modulation, ERK1/2 pathway activation, and focal adhesion kinase signaling.',
    storageRequirements: 'Store lyophilized powder at -20°C in a dry environment. Protect from light and moisture. Reconstituted solution should be stored at 4°C for up to 14 days.',
    handlingGuidelines: 'Handle with appropriate laboratory personal protective equipment (PPE). Use in well-ventilated areas. Avoid inhalation, ingestion, or skin contact. Follow standard laboratory safety protocols. Refer to Material Safety Data Sheet (MSDS) for complete safety information.',
  },
  {
    id: '2',
    slug: 'cjc-1295',
    name: 'CJC-1295',
    description: 'CJC-1295 IS A SYNTHETIC GROWTH HORMONE-RELEASING HORMONE (GHRH) ANALOG DEVELOPED BY CONJUCHEM BIOTECHNOLOGIES, DISTINGUISHED BY ITS DRUG AFFINITY COMPLEX (DAC) TECHNOLOGY THAT DRAMATICALLY EXTENDS ITS HALF-LIFE FROM APPROXIMATELY 30 MINUTES TO 6-8 DAYS THROUGH COVALENT CONJUGATION TO ENDOGENOUS SERUM ALBUMIN. RESEARCH APPLICATIONS INCLUDE INVESTIGATIONS INTO GROWTH HORMONE SECRETION MECHANISMS, METABOLIC REGULATION, CELLULAR GROWTH PROCESSES, HORMONE SIGNALING PATHWAYS, AND SUSTAINED ELEVATION OF GROWTH HORMONE AND INSULIN-LIKE GROWTH FACTOR-1 (IGF-1) LEVELS IN EXPERIMENTAL MODELS.',
    shortDescription: 'Long-acting growth hormone-releasing hormone analog for research',
    price: 129.99,
    image: '/images/products/cjc-1295-placeholder.jpg',
    inStock: true,
    category: 'Growth Hormone Peptides',
    chemicalFormula: 'C165H269N47O46',
    molarMass: '3647.25 g/mol',
    casNumber: '446262-90-4',
    synonyms: ['DAC:GRF', 'Drug Affinity Complex:Growth Hormone-Releasing Factor', 'Modified GRF (1-29)', 'CJC-1295 with DAC', 'Nε30-maleimidopropionyl-[D-Ala2, Gln8, Ala15, Leu27]-Sermorelin-Lys30'],
    pubchemId: '91971820',
    shelfLife: '36 months',
    researchApplications: 'CJC-1295 is extensively studied in laboratory research for its potential effects on growth hormone and IGF-1 axis activation. Research applications include investigations into sustained growth hormone elevation mechanisms, metabolic regulation through GH/IGF-1 signaling, cellular growth processes in experimental models, hormone signaling pathways involving GHRH receptor activation, and the pharmacokinetic properties of Drug Affinity Complex technology. The compound demonstrates extended half-life of 6-8 days following subcutaneous administration, with sustained elevation of growth hormone for 6+ days and IGF-1 for 9-11 days following single injection in experimental models.',
    storageRequirements: 'Store lyophilized powder at -20°C in a dry environment. Protect from light and moisture. Reconstituted solution should be stored at 4°C for up to 14 days. Maintain sterile conditions during reconstitution.',
    handlingGuidelines: 'Handle using sterile techniques and appropriate laboratory personal protective equipment (PPE). Use in well-ventilated areas. Avoid inhalation, ingestion, or skin contact. Follow standard laboratory safety protocols. Refer to Material Safety Data Sheet (MSDS) for complete safety information. The compound may form covalent bonds with serum albumin through maleimide conjugation.',
  },
  {
    id: '3',
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    description: 'GHK-Cu (Copper Peptide) is a tripeptide complex studied in laboratory research for its potential role in collagen synthesis and tissue regeneration processes.',
    shortDescription: 'Copper peptide complex for collagen research',
    price: 69.99,
    image: '/images/products/ghk-cu-placeholder.jpg',
    inStock: true,
    category: 'Cosmetic Peptides',
    chemicalFormula: 'C14H24N6O4Cu',
    molarMass: '403.92 g/mol',
    casNumber: '130120-57-9',
    synonyms: ['Copper Peptide', 'Glycyl-L-Histidyl-L-Lysine Copper'],
    pubchemId: '16129791',
    shelfLife: '24 months',
    researchApplications: 'GHK-Cu is used in laboratory research to study collagen synthesis and tissue regeneration mechanisms. Research applications include investigations into extracellular matrix formation, cellular signaling, and tissue repair processes in experimental models.',
    storageRequirements: 'Store at 2-8°C. Protect from light and moisture.',
    handlingGuidelines: 'Handle with care. Avoid direct skin contact. Use in controlled laboratory environments.',
  },
  {
    id: '4',
    slug: 'ipamorelin',
    name: 'Ipamorelin',
    description: 'Ipamorelin is a growth hormone secretagogue used in laboratory research to study growth hormone release and metabolic regulation.',
    shortDescription: 'Growth hormone secretagogue for research',
    price: 74.99,
    image: '/images/products/ipamorelin-placeholder.jpg',
    inStock: true,
    category: 'Growth Hormone Peptides',
    chemicalFormula: 'C38H49N9O5',
    molarMass: '711.85 g/mol',
    casNumber: '170851-70-4',
    synonyms: ['N-Acetyl-L-alanyl-L-tryptophyl-L-alanyl-L-tryptophyl-D-phenylalanyl-L-lysyl-L-phenylalanyl-L-lysyl-L-tryptophyl-L-alanyl-L-lysyl-L-prolyl-D-alaninamide'],
    pubchemId: '16129791',
    shelfLife: '36 months',
    researchApplications: 'Ipamorelin is used in laboratory research to investigate growth hormone secretion patterns. Research applications include studies on metabolic processes, cellular growth mechanisms, and hormone regulation in experimental settings.',
    storageRequirements: 'Store at -20°C in a dry environment.',
    handlingGuidelines: 'Handle with appropriate laboratory safety equipment. Follow standard laboratory protocols.',
  },
  {
    id: '5',
    slug: 'tb-500',
    name: 'TB-500',
    description: 'TB-500 is a synthetic peptide fragment studied in laboratory research for its potential role in cellular repair and tissue regeneration processes.',
    shortDescription: 'Synthetic peptide fragment for cellular research',
    price: 94.99,
    image: '/images/products/tb-500-placeholder.jpg',
    inStock: true,
    category: 'Repair Peptides',
    chemicalFormula: 'C34H54N10O10',
    molarMass: '746.85 g/mol',
    casNumber: '77591-33-4',
    synonyms: ['Thymosin Beta-4 Fragment', 'LKKTETQ'],
    pubchemId: '16132304',
    shelfLife: '36 months',
    researchApplications: 'TB-500 is used in laboratory research to study cellular repair mechanisms. Research applications include investigations into tissue regeneration, cellular migration, and repair processes in experimental models.',
    storageRequirements: 'Store at -20°C. Protect from light and moisture.',
    handlingGuidelines: 'Handle using sterile techniques. Use appropriate personal protective equipment.',
  },
  {
    id: '6',
    slug: 'epitalon',
    name: 'Epitalon',
    description: 'Epitalon is a synthetic tetrapeptide studied in laboratory research for its potential role in cellular aging and telomere maintenance processes.',
    shortDescription: 'Tetrapeptide for cellular aging research',
    price: 84.99,
    image: '/images/products/epitalon-placeholder.jpg',
    inStock: true,
    category: 'Research Peptides',
    chemicalFormula: 'C14H20N4O9',
    molarMass: '388.33 g/mol',
    casNumber: '307297-39-8',
    synonyms: ['Epithalamin', 'Ala-Glu-Asp-Gly'],
    pubchemId: '9941958',
    shelfLife: '24 months',
    researchApplications: 'Epitalon is used in laboratory research to investigate cellular aging mechanisms. Research applications include studies on telomere maintenance, cellular senescence, and aging-related processes in experimental settings.',
    storageRequirements: 'Store at 2-8°C. Protect from light.',
    handlingGuidelines: 'Handle with care. Use in controlled laboratory environments. Follow standard safety protocols.',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

