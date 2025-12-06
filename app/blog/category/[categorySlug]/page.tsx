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
      <div className="bg-neutral-light min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-accent-gray mb-4">Category Not Found</h1>
          <p className="text-text-gray">The category you're looking for doesn't exist.</p>
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
    <div className="bg-neutral-light min-h-screen">
      {/* Page Header */}
      <section className="bg-gray-50 border-b border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm mb-4">
              <ol className="flex items-center space-x-2 text-text-gray">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>/</li>
                <li className="text-accent-gray font-medium">{categoryName}</li>
              </ol>
            </nav>
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-accent-gray mb-4">
              {categoryName} Articles
            </h1>
            <p className="text-lg text-text-gray">
              Research articles and insights about {categoryName.toLowerCase()} compounds
            </p>
            <p className="text-sm text-text-gray mt-2">
              Showing {allCategoryArticles.length} {allCategoryArticles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {allCategoryArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {allCategoryArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col"
                  >
                    {/* Thumbnail */}
                    <Link href={`/blog/${article.slug}`}>
                      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center p-4">
                          <svg
                            className="w-24 h-24 mx-auto text-accent-gray opacity-30"
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
                          <p className="text-xs text-text-gray mt-2 opacity-50">
                            Article Image
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {article.category}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${article.slug}`}>
                        <h2 className="text-heading text-xl font-bold text-accent-gray mb-3 hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                      </Link>

                      {/* Description */}
                      <p className="text-text-gray text-sm mb-4 flex-grow line-clamp-3">
                        {article.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-text-gray mb-4">
                        <span>{article.author}</span>
                        <span>{article.readTime}</span>
                      </div>

                      {/* Read More Button */}
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-block bg-primary text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 text-sm"
                      >
                        Read More
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-lg text-text-gray">No articles found in this category.</p>
                <Link
                  href="/blog"
                  className="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
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

