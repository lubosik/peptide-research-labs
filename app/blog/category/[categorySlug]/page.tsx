'use client';

import Link from 'next/link';
import { use } from 'react';
import { articles } from '@/data/articles';
import { products } from '@/data/products';
import { generateAllPeptideArticles } from '@/lib/blog/generate-peptide-article';
import { getCategoryByName } from '@/data/categories';

interface CategoryBlogPageProps {
  params: Promise<{ categorySlug: string }>;
}

export default function CategoryBlogPage({ params }: CategoryBlogPageProps) {
  const { categorySlug } = use(params);
  
  // Convert slug to category name
  const categoryNameMap: Record<string, string> = {
    'beauty-anti-aging-antioxidant': 'Beauty / Anti-Aging / Antioxidant',
    'weight-loss-blood-sugar-metabolic-regulation': 'Weight Loss / Blood Sugar Control / Metabolic Regulation',
    'repair-healing-anti-inflammatory': 'Repair / Healing / Anti-inflammatory',
    'hormones-growth-factors-bodybuilding': 'Hormones / Growth Factors / Bodybuilding',
    'mental-neurological-sleep': 'Mental / Neurological / Sleep',
    'sexual-health-enhancement': 'Sexual Health / Sexual Enhancement',
    'others': 'Others',
  };
  
  const categoryName = categoryNameMap[categorySlug];
  
  if (!categoryName) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Category Not Found</h1>
          <p className="text-stone">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Generate peptide articles
  const peptideArticles = generateAllPeptideArticles(products);
  
  // Filter articles by category
  const categoryArticles = articles.filter((a) => a.category === categoryName);
  const categoryPeptideArticles = peptideArticles.filter((pa) => pa.category === categoryName);
  
  // Combine and format
  const allCategoryArticles = [
    ...categoryArticles,
    ...categoryPeptideArticles.map((pa) => ({
      id: pa.id,
      slug: pa.slug,
      title: pa.title,
      description: pa.metaDescription,
      category: pa.category,
      author: pa.author,
      publishedDate: pa.publishedDate,
      readTime: pa.readTime,
    })),
  ];

  return (
    <div className="bg-ivory min-h-screen">
      {/* Page Header */}
      <section className="bg-ivory border-b border-taupe py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm mb-4">
              <ol className="flex items-center space-x-2 text-stone">
                <li>
                  <Link href="/" className="hover:text-charcoal transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog" className="hover:text-charcoal transition-colors">
                    Blog
                  </Link>
                </li>
                <li>/</li>
                <li className="text-charcoal font-medium">{categoryName}</li>
              </ol>
            </nav>
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-charcoal mb-4">
              {categoryName} Articles
            </h1>
            <p className="text-lg text-charcoal">
              Research articles and insights about {categoryName.toLowerCase()} compounds
            </p>
            <p className="text-sm text-stone mt-2">
              Showing {allCategoryArticles.length} {allCategoryArticles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16 bg-ivory">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {allCategoryArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {allCategoryArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-ivory rounded-xl border border-taupe overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col"
                    style={{
                      boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
                    }}
                  >
                    {/* Thumbnail */}
                    <Link href={`/blog/${article.slug}`}>
                      <div className="relative w-full h-48 bg-taupe flex items-center justify-center">
                        <div className="text-center p-4">
                          <svg
                            className="w-24 h-24 mx-auto text-charcoal opacity-30"
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
                          <p className="text-xs text-stone mt-2 opacity-50">
                            Article Image
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block bg-taupe text-charcoal text-xs font-semibold px-3 py-1 rounded-full border border-stone">
                          {article.category}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${article.slug}`}>
                        <h2 className="text-heading text-xl font-bold text-charcoal mb-3 hover:text-charcoal/80 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>

                      {/* Description */}
                      <p className="text-charcoal text-sm mb-4 flex-grow line-clamp-3">
                        {article.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-stone mb-4">
                        <span>{article.author}</span>
                        <span>{article.readTime}</span>
                      </div>

                      {/* Read More Button */}
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-block bg-ivory border-2 border-charcoal text-charcoal text-center py-3 px-6 rounded-lg font-semibold hover:bg-charcoal hover:text-ivory transition-all duration-400 text-sm uppercase tracking-wide"
                      >
                        Read More
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-ivory rounded-lg border border-taupe p-12 text-center">
                <p className="text-lg text-charcoal">No articles found in this category.</p>
                <Link
                  href="/blog"
                  className="mt-4 inline-block px-6 py-2 bg-ivory border-2 border-charcoal text-charcoal rounded-lg hover:bg-charcoal hover:text-ivory transition-all duration-400 uppercase tracking-wide"
                >
                  View All Articles
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

