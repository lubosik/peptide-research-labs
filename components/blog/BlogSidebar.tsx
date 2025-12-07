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
        className="lg:hidden w-full bg-secondary-charcoal border-2 border-luxury-gold/30 rounded-lg px-4 py-3 mb-4 flex items-center justify-between text-pure-white hover:border-luxury-gold transition-all duration-400"
      >
        <span className="font-semibold">Blog Sidebar</span>
        <svg
          className={`w-5 h-5 text-luxury-gold transition-transform duration-400 ${isMobileOpen ? 'rotate-180' : ''}`}
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
        <div className="bg-secondary-charcoal border border-luxury-gold/30 rounded-lg p-4">
          <h3 className="text-heading font-semibold text-accent-gold-light mb-3">
            Search Articles
          </h3>
          <SearchBar
            placeholder="Search by peptide name or keyword..."
            className="w-full"
          />
        </div>

        {/* Category Filters */}
        <div className="bg-secondary-charcoal border border-luxury-gold/30 rounded-lg p-4">
          <h3 className="text-heading font-semibold text-accent-gold-light mb-3">
            Filter by Category
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange('All Articles')}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-400 ${
                selectedCategory === 'All Articles'
                  ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/50'
                  : 'text-pure-white hover:bg-luxury-gold/10 hover:text-luxury-gold'
              }`}
            >
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-400 ${
                  selectedCategory === category
                    ? 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/50'
                    : 'text-pure-white hover:bg-luxury-gold/10 hover:text-luxury-gold'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Most Read Articles */}
        <div className="bg-secondary-charcoal border border-luxury-gold/30 rounded-lg p-4">
          <h3 className="text-heading font-semibold text-accent-gold-light mb-3">
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
                    <span className="text-luxury-gold font-bold text-sm min-w-[24px]">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-pure-white group-hover:text-luxury-gold transition-colors duration-400 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-neutral-gray mt-1">
                        {article.readTime}
                      </p>
                    </div>
                  </div>
                </Link>
                {index < mostReadArticles.length - 1 && (
                  <div className="mt-3 border-b border-luxury-gold/10"></div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Updates */}
        <div className="bg-secondary-charcoal border border-luxury-gold/30 rounded-lg p-4">
          <h3 className="text-heading font-semibold text-accent-gold-light mb-3">
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
                      <h4 className="text-sm font-semibold text-pure-white group-hover:text-luxury-gold transition-colors duration-400 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-neutral-gray mt-1">
                        {formatDate(article.publishedDate)}
                      </p>
                    </div>
                  </div>
                </Link>
                {index < recentUpdates.length - 1 && (
                  <div className="mt-3 border-b border-luxury-gold/10"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

