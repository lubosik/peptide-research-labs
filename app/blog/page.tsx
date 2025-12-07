'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import { products, getProductBySlug } from '@/data/products';
import { generateAllPeptideArticles } from '@/lib/blog/generate-peptide-article';
import { motion } from 'framer-motion';

// Get unique categories from all articles
function getAllCategories(articles: any[], peptideArticles: any[]): string[] {
  const categories = new Set<string>();
  articles.forEach(article => categories.add(article.category));
  peptideArticles.forEach(article => categories.add(article.category));
  return Array.from(categories).sort();
}

export default function BlogPage() {
  // Generate peptide articles (one per unique base name)
  const peptideArticles = generateAllPeptideArticles(products);
  
  // Combine regular articles and peptide articles
  const allArticles = [
    ...articles,
    ...peptideArticles.map((pa) => ({
      id: pa.id,
      slug: pa.slug,
      title: pa.title,
      subheadline: pa.metaDescription,
      description: pa.metaDescription,
      thumbnail: '',
      headerImage: '',
      category: pa.category,
      author: pa.author,
      publishedDate: pa.publishedDate,
      readTime: pa.readTime,
      content: [
        pa.content.introduction,
        pa.content.chemicalBackground,
        pa.content.laboratoryStudySummary,
        pa.content.handlingAndStorage,
        pa.content.conclusion,
      ],
      tableOfContents: [
        { id: 'introduction', title: 'Introduction', level: 2 },
        { id: 'chemical-background', title: 'Chemical Background', level: 2 },
        { id: 'laboratory-study', title: 'Laboratory Study Summary', level: 2 },
        { id: 'handling-storage', title: 'Handling and Storage Guidelines', level: 2 },
        { id: 'conclusion', title: 'Conclusion', level: 2 },
      ],
      // Link to product if it's a peptide article
      relatedProductSlug: pa.slug, // Peptide articles use product slug
    })),
  ];

  // Get all unique categories
  const categories = getAllCategories(articles, peptideArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Articles');

  // Filter articles by category
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All Articles') {
      return allArticles;
    }
    return allArticles.filter(article => article.category === selectedCategory);
  }, [selectedCategory, allArticles]);

  // Get product link for article (if it's a peptide article)
  const getProductLink = (article: any) => {
    const product = getProductBySlug(article.relatedProductSlug || article.slug);
    return product ? `/products/${product.slug}` : null;
  };

  return (
    <div className="bg-primary-black min-h-screen">
      {/* Page Header with Breadcrumb */}
      <section className="bg-secondary-charcoal border-b border-luxury-gold/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-neutral-gray">
                <li>
                  <Link href="/" className="hover:text-luxury-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-pure-white font-medium">Blog</li>
              </ol>
            </nav>

            <h1 className="text-heading text-4xl md:text-5xl font-bold text-accent-gold-light mb-4">
              Research Blog
            </h1>
            <p className="text-lg text-pure-white">
              Scientific insights and research articles about peptides and laboratory applications
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-primary-black border-b border-luxury-gold/10 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label htmlFor="categoryFilter" className="text-sm font-semibold text-pure-white">
                  Filter by Topic:
                </label>
                <select
                  id="categoryFilter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-secondary-charcoal border border-luxury-gold/30 text-pure-white rounded-lg px-4 py-2 focus:outline-none focus:border-luxury-gold transition-all duration-400"
                >
                  <option value="All Articles">All Articles</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-neutral-gray">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid - Simplified */}
      <section className="py-12 md:py-16 bg-primary-black">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => {
                const productLink = getProductLink(article);
                return (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-secondary-charcoal rounded-lg border border-luxury-gold/20 overflow-hidden flex flex-col hover:border-luxury-gold/40 transition-all duration-400"
                  >
                    {/* Image */}
                    <Link href={`/blog/${article.slug}`}>
                      <div className="relative w-full h-48 bg-gradient-to-br from-primary-black to-secondary-charcoal flex items-center justify-center">
                        <div className="text-center p-4">
                          <svg
                            className="w-20 h-20 mx-auto text-luxury-gold opacity-40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>

                    {/* Content - Simplified */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Title */}
                      <Link href={`/blog/${article.slug}`}>
                        <h2 className="text-heading text-xl font-bold text-accent-gold-light mb-3 hover:text-luxury-gold transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>

                      {/* 2-Line Excerpt */}
                      <p className="text-pure-white text-sm mb-4 line-clamp-2 leading-relaxed">
                        {article.description}
                      </p>

                      {/* Product Link (if applicable) */}
                      {productLink && (
                        <div className="mb-4">
                          <Link
                            href={productLink}
                            className="inline-flex items-center gap-2 text-sm text-luxury-gold hover:text-accent-gold-light transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            View Product
                          </Link>
                        </div>
                      )}

                      {/* Meta Info - Simplified */}
                      <div className="flex items-center justify-between text-xs text-neutral-gray mt-auto">
                        <span>{article.category}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
