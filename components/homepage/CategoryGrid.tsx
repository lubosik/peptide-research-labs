'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

interface CategoryTile {
  name: string;
  slug: string;
  displayName: string; // Simplified name for display
}

const categoryTiles: CategoryTile[] = [
  {
    name: 'Beauty / Anti-Aging / Antioxidant',
    slug: 'beauty-anti-aging-antioxidant',
    displayName: 'BEAUTY / ANTI-AGING',
  },
  {
    name: 'Hormones / Growth Factors / Bodybuilding',
    slug: 'hormones-growth-factors-bodybuilding',
    displayName: 'HORMONES / GROWTH FACTORS / BODYBUILDING',
  },
  {
    name: 'Mental / Neurological / Sleep',
    slug: 'mental-neurological-sleep',
    displayName: 'MENTAL / NEUROLOGICAL / SLEEP',
  },
  {
    name: 'Repair / Healing / Anti-inflammatory',
    slug: 'repair-healing-anti-inflammatory',
    displayName: 'REPAIR / HEALING / ANTI-INFLAMMATORY',
  },
  {
    name: 'Quality Assurance',
    slug: 'quality-assurance',
    displayName: 'QUALITY ASSURANCE',
  },
  {
    name: 'Others',
    slug: 'others',
    displayName: 'OTHERS',
  },
];

export default function CategoryGrid() {
  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <FadeInOnScroll direction="up" delay={0.1}>
            <h2 className="text-heading text-3xl md:text-4xl font-bold text-charcoal text-center mb-12 md:mb-16">
              Shop by Category
            </h2>
          </FadeInOnScroll>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categoryTiles.map((category, index) => {
              // Quality Assurance links to about page, others link to category pages
              const href = category.slug === 'quality-assurance' ? '/about' : `/categories/${category.slug}`;
              
              return (
                <FadeInOnScroll key={category.slug} direction="up" delay={0.1 + index * 0.1}>
                  <Link href={href}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="relative bg-taupe rounded-lg p-8 md:p-12 h-48 md:h-56 flex items-center justify-center cursor-pointer transition-all duration-400 group"
                      style={{
                        boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#CFC7BC'; // stone
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 43, 43, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#E6DED4'; // taupe
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(43, 43, 43, 0.1)';
                      }}
                    >
                      <h3 className="text-heading text-lg md:text-xl font-bold text-charcoal text-center uppercase tracking-wide leading-tight group-hover:text-charcoal transition-colors duration-400">
                        {category.displayName}
                      </h3>
                    </motion.div>
                  </Link>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

