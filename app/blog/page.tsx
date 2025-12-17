'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import { products, getProductBySlug } from '@/data/products';
import { generateAllPeptideArticles } from '@/lib/blog/generate-peptide-article';
import { motion } from 'framer-motion';
import ArticleImage from '@/components/blog/ArticleImage';
import BlogSidebar from '@/components/blog/BlogSidebar';

const ARTICLES_PER_PAGE = 12;

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
        pa.content.mechanismOfAction,
        pa.content.chemicalBackground,
        pa.content.laboratoryApplications,
        pa.content.handlingAndStorage,
      ],
      tableOfContents: [
        { id: 'introduction', title: 'Introduction', level: 2 },
        { id: 'mechanism-of-action', title: 'Mechanism of Action', level: 2 },
        { id: 'chemical-background', title: 'Chemical Background', level: 2 },
        { id: 'laboratory-applications', title: 'Laboratory Applications', level: 2 },
        { id: 'handling-storage', title: 'Handling and Storage Guidelines', level: 2 },
      ],
      // Link to product if it's a peptide article
      relatedProductSlug: pa.slug, // Peptide articles use product slug
    })),
  ];

  // Get all unique categories
  const categories = getAllCategories(articles, peptideArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Articles');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter articles by category
  const filteredArticles = useMemo(() => {
    let filtered = allArticles;
    if (selectedCategory !== 'All Articles') {
      filtered = allArticles.filter(article => article.category === selectedCategory);
    }
    return filtered;
  }, [selectedCategory, allArticles]);

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Get product link for article (if it's a peptide article)
  const getProductLink = (article: any) => {
    const product = getProductBySlug(article.relatedProductSlug || article.slug);
    return product ? `/products/${product.slug}` : null;
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-ivory py-20 md:py-30">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center justify-center space-x-2 text-stone">
                <li>
                  <Link href="/" className="hover:text-charcoal transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-charcoal font-medium">Blog</li>
              </ol>
            </nav>

            <h1 className="text-heading text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Research Articles & Peptide Insights
            </h1>
            <p className="text-lg md:text-xl text-charcoal max-w-3xl mx-auto">
              Explore our continuously updated database of laboratory research overviews and analytical summaries.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-ivory border-b border-taupe py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label htmlFor="categoryFilter" className="text-sm font-semibold text-charcoal">
                  Filter by Topic:
                </label>
                <select
                  id="categoryFilter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-ivory border border-taupe text-charcoal rounded-lg px-4 py-2 focus:outline-none focus:border-charcoal transition-all duration-400 font-serif"
                >
                  <option value="All Articles">All Articles</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-stone">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid with Sidebar */}
      <section className="py-12 md:py-16 bg-ivory">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Results Count */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm text-stone">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                {selectedCategory !== 'All Articles' && (
                  <span className="ml-2 text-charcoal">in {selectedCategory}</span>
                )}
              </p>
            </div>

            {/* Main Content Grid with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Articles Grid - 2 columns on desktop when sidebar visible, 3 when sidebar hidden */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {paginatedArticles.map((article, index) => {
                const productLink = getProductLink(article);
                return (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-ivory rounded-lg border border-taupe overflow-hidden flex flex-col hover:border-charcoal hover:shadow-md transition-all duration-400"
                    style={{
                      boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
                    }}
                  >
                    {/* Thumbnail Image */}
                    <Link href={`/blog/${article.slug}`} className="block">
                      <div className="relative w-full h-48 overflow-hidden bg-taupe">
                        <ArticleImage
                          slug={article.slug}
                          articleType={(article as any).relatedProductSlug ? 'peptide' : 'article'}
                          peptideName={(article as any).relatedProductSlug ? article.title.replace('Research Overview: ', '') : undefined}
                          type="thumbnail"
                          className="w-full h-full object-cover"
                          alt={article.title}
                        />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Title - Charcoal text */}
                      <Link href={`/blog/${article.slug}`}>
                        <h2 className="text-heading text-xl font-bold text-charcoal mb-3 hover:text-charcoal/80 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-charcoal text-sm mb-4 line-clamp-3 leading-relaxed">
                        {article.description || article.subheadline}
                      </p>

                      {/* Read Article Button */}
                      <div className="mt-auto pt-4">
                        <Link
                          href={`/blog/${article.slug}`}
                          className="inline-block w-full bg-ivory border-2 border-charcoal text-charcoal text-center py-3 px-4 rounded-lg font-semibold hover:bg-charcoal hover:text-ivory transition-all duration-400 text-sm min-h-[44px] flex items-center justify-center uppercase tracking-wide"
                        >
                          Read Article
                        </Link>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-stone mt-4 pt-4 border-t border-taupe">
                        <span>{article.category}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
                </div>

                {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-ivory border border-taupe text-charcoal rounded-lg hover:bg-taupe hover:border-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-400 font-serif"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-all duration-400 min-w-[44px] font-serif ${
                            currentPage === page
                              ? 'bg-charcoal text-ivory font-semibold'
                              : 'bg-ivory border border-taupe text-charcoal hover:bg-taupe hover:border-charcoal'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-stone">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-ivory border border-taupe text-charcoal rounded-lg hover:bg-taupe hover:border-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-400 font-serif"
                >
                  Next
                </button>
              </div>
            )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <BlogSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  allArticles={allArticles}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
