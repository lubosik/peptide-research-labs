/**
 * Generate MDX Article from Peptide Product
 * 
 * This script generates a complete MDX article for a peptide product
 * following the structure defined in Phases 74-79.
 */

import { Product } from '@/data/products';
import { generatePeptideArticle } from '@/lib/blog/generate-peptide-article';
import { products } from '@/data/products';
import * as fs from 'fs';
import * as path from 'path';

interface ArticleGenerationResult {
  slug: string;
  title: string;
  filePath: string;
  success: boolean;
  error?: string;
}

/**
 * Generate MDX content from PeptideArticle
 */
function generateMDXContent(peptideArticle: any, product: Product): string {
  const { title, subtitle, content, tableOfContents, crossLinkedResearch, externalCitations, references, disclaimer } = peptideArticle;
  
  // Build table of contents
  const tocItems = tableOfContents.map((item: any) => `- [${item.title}](#${item.id})`).join('\n');
  
  // Build content sections
  const sections = [
    { id: 'introduction', title: 'Introduction', content: content.introduction },
    { id: 'mechanism-of-action', title: 'Mechanism of Action', content: content.mechanismOfAction },
    { id: 'chemical-background', title: 'Chemical Background', content: content.chemicalBackground },
    { id: 'laboratory-applications', title: 'Laboratory Applications', content: content.laboratoryApplications },
    { id: 'handling-storage', title: 'Handling and Storage Guidelines', content: content.handlingAndStorage },
    { id: 'conclusion', title: 'Conclusion', content: content.conclusion },
  ];
  
  // Build cross-linked research section
  const crossLinks = crossLinkedResearch && crossLinkedResearch.length > 0
    ? `## Cross-Linked Research\n\nRelated research peptides in the same category:\n\n${crossLinkedResearch.map((item: any) => `- [${item.name}](/blog/${item.slug})`).join('\n')}\n`
    : '';
  
  // Build external citations section
  const citations = externalCitations && externalCitations.length > 0
    ? `## External Citations\n\nReference authoritative research sources:\n\n${externalCitations.map((item: any) => `- [${item.title}](${item.url}) (${item.source})`).join('\n')}\n`
    : '';
  
  // Build references section
  const refs = references && references.length > 0
    ? `## References\n\n${references.map((ref: any) => ref.url ? `- [${ref.citation}](${ref.url})` : `- ${ref.citation}`).join('\n')}\n`
    : '';
  
  // Build MDX content
  const mdx = `---
title: "${title}"
subtitle: "${subtitle}"
author: "Vici Peptides Editorial"
publishedDate: "${peptideArticle.publishedDate}"
category: "${peptideArticle.category}"
keywords: ${JSON.stringify(peptideArticle.keywords)}
relatedProductSlug: "${product.slug}"
---

import { ArticleImage } from '@/components/blog/ArticleImage';

# ${title}

${subtitle ? `> ${subtitle}` : ''}

## Table of Contents

${tocItems}

${sections.map(section => `## ${section.title}\n\n${section.content}\n`).join('\n')}

${crossLinks}

${citations}

${refs}

---

## Research Use Only Disclaimer

<div className="p-6 bg-red-900/30 border-l-4 border-red-500 rounded">
  <h3 className="text-heading text-lg font-semibold text-red-400 mb-2">
    Research Use Only Disclaimer
  </h3>
  <div className="text-sm text-red-300 whitespace-pre-line">
    ${disclaimer}
  </div>
</div>

---

## Related Product

[View ${product.name} Product Page](/products/${product.slug})
`;

  return mdx;
}

/**
 * Generate and save MDX article for a product
 */
export function generateArticleMDX(product: Product, outputDir: string = './content/articles'): ArticleGenerationResult {
  try {
    // Generate peptide article
    const peptideArticle = generatePeptideArticle(product, products);
    
    // Generate MDX content
    const mdxContent = generateMDXContent(peptideArticle, product);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write MDX file
    const filePath = path.join(outputDir, `${product.slug}.mdx`);
    fs.writeFileSync(filePath, mdxContent, 'utf-8');
    
    return {
      slug: product.slug,
      title: peptideArticle.title,
      filePath,
      success: true,
    };
  } catch (error: any) {
    return {
      slug: product.slug,
      title: product.name,
      filePath: '',
      success: false,
      error: error.message,
    };
  }
}

// CLI usage
if (require.main === module) {
  const productSlug = process.argv[2];
  
  if (!productSlug) {
    console.error('Usage: ts-node generate-article-mdx.ts <product-slug>');
    process.exit(1);
  }
  
  const product = products.find(p => p.slug === productSlug);
  
  if (!product) {
    console.error(`Product not found: ${productSlug}`);
    process.exit(1);
  }
  
  const result = generateArticleMDX(product);
  
  if (result.success) {
    console.log(`✅ Article generated: ${result.filePath}`);
    console.log(`   Title: ${result.title}`);
  } else {
    console.error(`❌ Error generating article: ${result.error}`);
    process.exit(1);
  }
}

