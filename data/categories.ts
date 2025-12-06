/**
 * Category Data
 * 
 * Categories for organizing products with slugs and scientific summaries.
 */

export interface Category {
  name: string;
  slug: string;
  description: string;
  scientificSummary: string;
}

export const categories: Category[] = [
  {
    name: 'Beauty / Anti-Aging / Antioxidant',
    slug: 'beauty-anti-aging-antioxidant',
    description: 'Research compounds for cellular aging, antioxidant defense, and longevity mechanisms',
    scientificSummary: 'This category encompasses research compounds investigated for their potential roles in cellular aging processes, antioxidant defense mechanisms, and longevity pathways. Products in this category are used in laboratory research to study telomere maintenance, oxidative stress modulation, mitochondrial function, and age-related cellular processes in experimental models.',
  },
  {
    name: 'Weight Loss / Blood Sugar Control / Metabolic Regulation',
    slug: 'weight-loss-blood-sugar-metabolic-regulation',
    description: 'Research compounds for metabolic regulation, glucose homeostasis, and weight management mechanisms',
    scientificSummary: 'This category includes research compounds studied for their potential roles in metabolic regulation, glucose homeostasis, and weight management mechanisms. Products are used in laboratory research to investigate insulin signaling, glucagon-like peptide (GLP-1) receptor activation, gastric emptying, appetite regulation, and metabolic syndrome pathways in experimental models.',
  },
  {
    name: 'Repair / Healing / Anti-inflammatory',
    slug: 'repair-healing-anti-inflammatory',
    description: 'Research compounds for tissue regeneration, wound healing, and anti-inflammatory mechanisms',
    scientificSummary: 'This category contains research compounds investigated for their potential roles in tissue regeneration, wound healing, and anti-inflammatory processes. Products are used in laboratory research to study cellular repair mechanisms, angiogenesis, collagen synthesis, inflammatory response modulation, and tissue regeneration pathways in experimental models.',
  },
  {
    name: 'Hormones / Growth Factors / Bodybuilding',
    slug: 'hormones-growth-factors-bodybuilding',
    description: 'Research compounds for growth hormone secretion, growth factor signaling, and hormonal regulation',
    scientificSummary: 'This category encompasses research compounds studied for their potential roles in growth hormone secretion, growth factor signaling, and hormonal regulation. Products are used in laboratory research to investigate pituitary function, growth hormone-releasing hormone (GHRH) activity, insulin-like growth factor (IGF) signaling, reproductive hormone regulation, and growth factor pathways in experimental models.',
  },
  {
    name: 'Mental / Neurological / Sleep',
    slug: 'mental-neurological-sleep',
    description: 'Research compounds for cognitive function, neuroprotection, and sleep regulation',
    scientificSummary: 'This category includes research compounds investigated for their potential roles in cognitive function, neuroprotection, and sleep regulation. Products are used in laboratory research to study memory enhancement mechanisms, neuroprotective effects, circadian rhythm modulation, neurotransmitter function, and neurological processes in experimental models.',
  },
  {
    name: 'Sexual Health / Sexual Enhancement',
    slug: 'sexual-health-enhancement',
    description: 'Research compounds for reproductive function and melanocortin receptor activation',
    scientificSummary: 'This category contains research compounds studied for their potential roles in reproductive function and melanocortin receptor activation. Products are used in laboratory research to investigate sexual function mechanisms, melanocortin receptor signaling, reproductive hormone regulation, and pigmentation processes in experimental models.',
  },
  {
    name: 'Others',
    slug: 'others',
    description: 'Additional research compounds and laboratory supplies',
    scientificSummary: 'This category includes additional research compounds, laboratory supplies, and research tools used in scientific investigations. Products may include diluents, buffers, inhibitors, and other compounds used in laboratory research applications.',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryByName(name: string): Category | undefined {
  return categories.find((category) => category.name === name);
}

export function getAllCategorySlugs(): string[] {
  return categories.map((category) => category.slug);
}

