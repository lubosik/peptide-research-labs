'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';

interface BlogSidebarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  allArticles: any[];
}

export default function BlogSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  allArticles,
}: BlogSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Get most read articles (placeholder - in production would use view count)
  // For now, sort by published date (newest first) as a proxy
  const mostReadArticles = [...allArticles]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 5);

  // Get recent updates (articles sorted by published date)
  const recentUpdates = [...allArticles]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden w-full bg-ivory border-2 border-taupe rounded-lg px-4 py-3 mb-4 flex items-center justify-between text-charcoal hover:border-charcoal transition-all duration-400"
      >
        <span className="font-semibold">Blog Sidebar</span>
        <svg
          className={`w-5 h-5 text-charcoal transition-transform duration-400 ${isMobileOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Sidebar Content - Accordion on mobile */}
      <div
        className={`${
          isMobileOpen ? 'block' : 'hidden'
        } lg:block space-y-6`}
      >
        {/* Search Bar */}
        <div className="bg-ivory border border-taupe rounded-lg p-4">
          <h3 className="text-heading font-semibold text-charcoal mb-3">
            Search Articles
          </h3>
          <SearchBar
            placeholder="Search by peptide name or keyword..."
            className="w-full"
          />
        </div>

        {/* Category Filters */}
        <div className="bg-ivory border border-taupe rounded-lg p-4">
          <h3 className="text-heading font-semibold text-charcoal mb-3">
            Filter by Category
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange('All Articles')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-400 font-serif ${
                selectedCategory === 'All Articles'
                  ? 'bg-taupe text-charcoal border border-stone'
                  : 'text-charcoal hover:bg-taupe'
              }`}
            >
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-400 font-serif ${
                  selectedCategory === category
                    ? 'bg-taupe text-charcoal border border-stone'
                    : 'text-charcoal hover:bg-taupe'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Most Read Articles */}
        <div className="bg-ivory border border-taupe rounded-lg p-4">
          <h3 className="text-heading font-semibold text-charcoal mb-3">
            Most Read Articles
          </h3>
          <ul className="space-y-3">
            {mostReadArticles.map((article, index) => (
              <li key={article.id}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="block group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-charcoal font-bold text-sm min-w-[24px]">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-charcoal group-hover:text-charcoal/80 transition-colors duration-400 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-stone mt-1">
                        {article.readTime}
                      </p>
                    </div>
                  </div>
                </Link>
                {index < mostReadArticles.length - 1 && (
                  <div className="mt-3 border-b border-taupe"></div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Updates */}
        <div className="bg-ivory border border-taupe rounded-lg p-4">
          <h3 className="text-heading font-semibold text-charcoal mb-3">
            Recent Updates
          </h3>
          <ul className="space-y-3">
            {recentUpdates.map((article, index) => (
              <li key={article.id}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="block group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-charcoal group-hover:text-charcoal/80 transition-colors duration-400 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-stone mt-1">
                        {formatDate(article.publishedDate)}
                      </p>
                    </div>
                  </div>
                </Link>
                {index < recentUpdates.length - 1 && (
                  <div className="mt-3 border-b border-taupe"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

