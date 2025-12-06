import Link from 'next/link';
import { articles } from '@/data/articles';
import { products } from '@/data/products';
import { generateAllPeptideArticles } from '@/lib/blog/generate-peptide-article';
import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Research Blog - Scientific Articles',
  description: 'Scientific articles and research insights about peptides and laboratory research. Educational content for researchers.',
  path: '/blog',
});

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
    })),
  ];

  return (
    <div className="bg-primary-black min-h-screen">
      {/* Page Header */}
      <section className="bg-secondary-charcoal border-b border-luxury-gold/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-accent-gold-light mb-4">
              Research Blog
            </h1>
            <p className="text-lg text-pure-white">
              Scientific insights and research articles about peptides and laboratory applications
            </p>
            <p className="text-sm text-neutral-gray mt-2">
              Showing {allArticles.length} articles
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 md:py-16 bg-primary-black">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {allArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-secondary-charcoal rounded-xl border border-luxury-gold/20 overflow-hidden shadow-md hover:shadow-xl hover:shadow-golden-glow transition-all duration-300 flex flex-col hover-glow"
                >
                  {/* Thumbnail */}
                  <Link href={`/blog/${article.slug}`}>
                    <div className="relative w-full h-48 bg-gradient-to-br from-primary-black to-secondary-charcoal flex items-center justify-center">
                      <div className="text-center p-4">
                        <svg
                          className="w-24 h-24 mx-auto text-luxury-gold opacity-40"
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
                        <p className="text-xs text-neutral-gray mt-2 opacity-50">
                          Article Image
                        </p>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block bg-luxury-gold/20 text-luxury-gold text-xs font-semibold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${article.slug}`}>
                      <h2 className="text-heading text-xl font-bold text-accent-gold-light mb-3 hover:text-luxury-gold transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p className="text-pure-white text-sm mb-4 flex-grow line-clamp-3">
                      {article.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-neutral-gray mb-4">
                      <span>{article.author}</span>
                      <span>{article.readTime}</span>
                    </div>

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-block bg-luxury-gold text-primary-black text-center py-3 px-6 rounded-lg font-semibold hover:bg-accent-gold-light transition-colors duration-200 text-sm"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

