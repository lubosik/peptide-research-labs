import { NextRequest, NextResponse } from 'next/server';
import { products, getProductBySlug } from '@/data/products';
import { articles, getArticleBySlug } from '@/data/articles';
import { generateAllPeptideArticles } from '@/lib/blog/generate-peptide-article';

/**
 * Universal Search API Route
 * 
 * Searches both products and blog articles (including auto-generated peptide articles)
 * Returns results with category and price information
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: Array<{
      type: 'product' | 'article';
      id: string;
      title: string;
      description: string;
      url: string;
      category?: string;
      price?: number;
      image?: string;
    }> = [];

    // Search Products
    const productMatches = products.filter((product) => {
      const searchableText = [
        product.name,
        product.shortDescription,
        product.description,
        product.sku,
        product.category,
        ...(product.synonyms || []),
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });

    // Add product results
    productMatches.forEach((product) => {
      results.push({
        type: 'product',
        id: product.id,
        title: product.name,
        description: product.shortDescription || product.description.substring(0, 150),
        url: `/products/${product.slug}`,
        category: product.category,
        price: product.price,
        image: product.image,
      });
    });

    // Search Regular Articles
    const articleMatches = articles.filter((article) => {
      const searchableText = [
        article.title,
        article.description,
        article.subheadline,
        article.category,
        ...article.content,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });

    // Add regular article results
    articleMatches.forEach((article) => {
      results.push({
        type: 'article',
        id: article.id,
        title: article.title,
        description: article.description || article.subheadline,
        url: `/blog/${article.slug}`,
        category: article.category,
      });
    });

    // Search Auto-Generated Peptide Articles
    const peptideArticles = generateAllPeptideArticles(products);
    const peptideArticleMatches = peptideArticles.filter((article) => {
      const searchableText = [
        article.title,
        article.metaDescription,
        article.category,
        ...article.keywords,
        article.content.introduction,
        article.content.chemicalBackground,
        article.content.laboratoryStudySummary,
        article.content.handlingAndStorage,
        article.content.conclusion,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });

    // Add peptide article results (only if not already included as product)
    peptideArticleMatches.forEach((article) => {
      // Check if this peptide already appears as a product result
      const alreadyInResults = results.some(
        (r) => r.type === 'product' && r.id === `peptide-${article.id.replace('peptide-', '')}`
      );

      if (!alreadyInResults) {
        results.push({
          type: 'article',
          id: article.id,
          title: article.title,
          description: article.metaDescription,
          url: `/blog/${article.slug}`,
          category: article.category,
        });
      }
    });

    // Sort results: products first, then articles
    // Within each type, sort by relevance (title match > description match)
    results.sort((a, b) => {
      // Products first
      if (a.type === 'product' && b.type === 'article') return -1;
      if (a.type === 'article' && b.type === 'product') return 1;

      // Within same type, prioritize title matches
      const aTitleMatch = a.title.toLowerCase().includes(query);
      const bTitleMatch = b.title.toLowerCase().includes(query);

      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;

      return 0;
    });

    // Limit to top 10 results
    return NextResponse.json({
      results: results.slice(0, 10),
      total: results.length,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed', results: [] },
      { status: 500 }
    );
  }
}

