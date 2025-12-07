import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, articles } from '@/data/articles';
import { products, getProductBySlug, getProductMinPrice } from '@/data/products';
import { Metadata } from 'next';
import TableOfContents from '@/components/blog/TableOfContents';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { generateArticleSchema } from '@/lib/seo/structured-data';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';
import { generatePeptideArticle } from '@/lib/blog/generate-peptide-article';
import ArticleImage from '@/components/blog/ArticleImage';
import { extractLinks, processContentWithProductLinks } from '@/lib/blog/render-content';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articleSlugs = articles.map((article) => ({
    slug: article.slug,
  }));
  
  // Add peptide article slugs (one per unique base name)
  const peptideSlugs = Array.from(
    new Set(products.map((p) => p.name.split('(')[0].trim()))
  ).map((baseName) => {
    const product = products.find((p) => p.name.startsWith(baseName));
    return product ? { slug: product.slug } : null;
  }).filter(Boolean) as { slug: string }[];
  
  return [...articleSlugs, ...peptideSlugs];
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  // Try regular article first
  const article = getArticleBySlug(params.slug);
  
  if (article) {
    return generateSEOMetadata({
      title: article.title,
      description: article.description,
      path: `/blog/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedDate,
      modifiedTime: article.publishedDate,
    });
  }
  
  // Try peptide article
  const product = getProductBySlug(params.slug);
  if (product) {
    const peptideArticle = generatePeptideArticle(product, products);
    return generateSEOMetadata({
      title: peptideArticle.title,
      description: peptideArticle.metaDescription,
      path: `/blog/${peptideArticle.slug}`,
      type: 'article',
      publishedTime: peptideArticle.publishedDate,
      modifiedTime: peptideArticle.publishedDate,
      keywords: peptideArticle.keywords.join(', '),
    });
  }

  return {
    title: 'Article Not Found',
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  // Try regular article first
  const article = getArticleBySlug(params.slug);
  let isPeptideArticle = false;
  let peptideArticle = null;
  let relatedProduct = null;

  // If not found, try peptide article
  if (!article) {
    const product = getProductBySlug(params.slug);
    if (product) {
      peptideArticle = generatePeptideArticle(product, products);
      relatedProduct = product;
      isPeptideArticle = true;
    } else {
      notFound();
    }
  }

  // Ensure we have either article or peptideArticle
  if (!article && !peptideArticle) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Use peptide article if available, otherwise use regular article (guaranteed to exist at this point)
  const displayArticle = (isPeptideArticle && peptideArticle) ? {
    id: peptideArticle.id,
    slug: peptideArticle.slug,
    title: peptideArticle.title,
    subheadline: peptideArticle.subtitle || peptideArticle.metaDescription,
    description: peptideArticle.metaDescription,
    thumbnail: '',
    headerImage: '',
    category: peptideArticle.category,
    author: peptideArticle.author,
    publishedDate: peptideArticle.publishedDate,
    readTime: peptideArticle.readTime,
    content: [
      peptideArticle.content.introduction,
      peptideArticle.content.mechanismOfAction,
      peptideArticle.content.chemicalBackground,
      peptideArticle.content.laboratoryApplications,
      peptideArticle.content.handlingAndStorage,
      peptideArticle.content.conclusion,
    ],
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 2 },
      { id: 'mechanism-of-action', title: 'Mechanism of Action', level: 2 },
      { id: 'chemical-background', title: 'Chemical Background', level: 2 },
      { id: 'laboratory-applications', title: 'Laboratory Applications', level: 2 },
      { id: 'handling-storage', title: 'Handling and Storage Guidelines', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ],
    // Add peptide-specific data
    crossLinkedResearch: peptideArticle.crossLinkedResearch || [],
    externalCitations: peptideArticle.externalCitations || [],
    disclaimer: peptideArticle.disclaimer,
    relatedProductSlug: peptideArticle.slug,
  } : (article as NonNullable<typeof article>);

  // Generate schema for article (BlogPosting for peptide articles, Article for regular)
  const articleSchema = isPeptideArticle && peptideArticle
    ? generateArticleSchema(
        displayArticle as any,
        true, // isBlogPosting
        peptideArticle.keywords,
        peptideArticle.category
      )
    : article
    ? generateArticleSchema(displayArticle as typeof article, false)
    : null;

  return (
    <div className="bg-primary-black min-h-screen">
      {/* Structured Data */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {/* Breadcrumbs */}
      <section className="bg-secondary-charcoal border-b border-luxury-gold/20 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm">
              <ol className="flex items-center space-x-2 text-pure-white">
                <li>
                  <Link href="/" className="hover:text-luxury-gold transition-colors">
                    Home
                  </Link>
                </li>
                <li className="text-luxury-gold">/</li>
                <li>
                  <Link href="/blog" className="hover:text-luxury-gold transition-colors">
                    All Articles
                  </Link>
                </li>
                <li className="text-luxury-gold">/</li>
                <li className="text-accent-gold-light font-medium line-clamp-1">{displayArticle.title}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Header Image - Black-to-charcoal gradient with faint gold overlay */}
      <section className="relative w-full h-64 md:h-96">
        {/* Faint gold overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 via-transparent to-luxury-gold/5 z-10 pointer-events-none"></div>
        <ArticleImage
          slug={displayArticle.slug}
          articleType={isPeptideArticle ? 'peptide' : 'article'}
          peptideName={isPeptideArticle && relatedProduct ? relatedProduct.name.split('(')[0].trim() : undefined}
          type="header"
          className="w-full h-full"
          alt={displayArticle.title}
        />
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-16 bg-primary-black">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content (70%) */}
              <div className="lg:col-span-3">
                <article className="bg-secondary-charcoal rounded-lg border border-luxury-gold/20 shadow-xl p-8 md:p-12" style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.2)' }}>
                  {/* Article Header */}
                  <header className="mb-8">
                    <div className="mb-4">
                      <span className="inline-block bg-luxury-gold/20 text-luxury-gold text-sm font-semibold px-4 py-2 rounded-full">
                        {displayArticle.category}
                      </span>
                    </div>
                    <h1 className="text-heading text-3xl md:text-4xl font-bold text-accent-gold-light mb-4">
                      {displayArticle.title}
                    </h1>
                    <p className="text-xl text-pure-white mb-6 leading-relaxed">
                      {displayArticle.subheadline}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-neutral-gray border-b border-luxury-gold/20 pb-6">
                      <div>
                        <span className="font-semibold text-pure-white">Author:</span> {displayArticle.author}
                      </div>
                      <div>
                        <span className="font-semibold text-pure-white">Published:</span> {formatDate(displayArticle.publishedDate)}
                      </div>
                      <div>
                        <span className="font-semibold text-pure-white">Read Time:</span> {displayArticle.readTime}
                      </div>
                    </div>
                  </header>

                  {/* Article Body */}
                  <div className="prose prose-lg max-w-none">
                    {displayArticle.content.map((paragraph, index) => {
                      // Check if this paragraph should be a heading based on table of contents
                      const tocItem = displayArticle.tableOfContents.find(
                        (item, tocIndex) => tocIndex === index
                      );

                      // Process content with internal links
                      const processedContent = isPeptideArticle && relatedProduct
                        ? processContentWithProductLinks(paragraph, relatedProduct.slug)
                        : paragraph;

                      // Extract links from processed content
                      const links = extractLinks(processedContent);
                      
                      // Render content with links
                      const renderContent = () => {
                        if (links.length === 0) {
                          return processedContent;
                        }

                        const parts: (string | React.ReactElement)[] = [];
                        let lastIndex = 0;

                        links.forEach((link, linkIndex) => {
                          // Add text before the link
                          if (link.startIndex > lastIndex) {
                            parts.push(processedContent.substring(lastIndex, link.startIndex));
                          }

                          // Determine if it's an external link
                          const isExternal = link.href.startsWith('http');
                          const isInternalProduct = link.href.startsWith('/products/');
                          
                          // Add the link with enhanced styling
                          parts.push(
                            <Link
                              key={linkIndex}
                              href={link.href}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noopener noreferrer' : undefined}
                              className="text-luxury-gold hover:text-accent-gold-light hover:underline transition-all duration-400 underline-offset-2 decoration-luxury-gold/50 hover:decoration-luxury-gold"
                            >
                              {link.text}
                              {isExternal && (
                                <svg
                                  className="inline-block w-3 h-3 ml-1 mb-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              )}
                            </Link>
                          );

                          lastIndex = link.endIndex;
                        });

                        // Add remaining text
                        if (lastIndex < processedContent.length) {
                          parts.push(processedContent.substring(lastIndex));
                        }

                        return <>{parts}</>;
                      };

                      if (tocItem) {
                        return (
                          <div key={index} id={tocItem.id} className="scroll-mt-24">
                            <h2 className="text-heading text-2xl font-bold text-accent-gold-light mt-12 mb-6 first:mt-0">
                              {tocItem.title}
                            </h2>
                            <div className="text-pure-white leading-relaxed mb-6 whitespace-pre-line">
                              {renderContent()}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <p key={index} className="text-pure-white leading-relaxed mb-6">
                          {renderContent()}
                        </p>
                      );
                    })}
                  </div>

                  {/* Cross-Linked Research (Related Peptides) */}
                  {isPeptideArticle && peptideArticle && peptideArticle.crossLinkedResearch && peptideArticle.crossLinkedResearch.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-luxury-gold/20">
                      <h2 id="cross-linked-research" className="text-heading text-2xl font-bold text-accent-gold-light mb-6 scroll-mt-24">
                        Cross-Linked Research
                      </h2>
                      <p className="text-pure-white mb-4 leading-relaxed">
                        Related research peptides in the same category:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {peptideArticle.crossLinkedResearch.map((related) => (
                          <Link
                            key={related.slug}
                            href={`/blog/${related.slug}`}
                            className="p-4 bg-secondary-charcoal border border-luxury-gold/30 rounded-lg hover:border-luxury-gold/60 hover:bg-luxury-gold/5 transition-all duration-400 group"
                          >
                            <h3 className="text-heading font-semibold text-accent-gold-light mb-2 group-hover:text-luxury-gold transition-colors duration-400">
                              {related.name}
                            </h3>
                            <p className="text-sm text-neutral-gray flex items-center gap-1 group-hover:text-luxury-gold/70 transition-colors duration-400">
                              Read research overview
                              <svg
                                className="w-4 h-4 inline-block transition-transform duration-400 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Citations */}
                  {isPeptideArticle && peptideArticle && peptideArticle.externalCitations && peptideArticle.externalCitations.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-luxury-gold/20">
                      <h2 id="external-citations" className="text-heading text-2xl font-bold text-accent-gold-light mb-6 scroll-mt-24">
                        External Citations
                      </h2>
                      <p className="text-pure-white mb-4 leading-relaxed">
                        Reference authoritative research sources:
                      </p>
                      <ul className="space-y-3">
                        {peptideArticle.externalCitations.map((citation, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <svg
                              className="w-5 h-5 text-luxury-gold mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            <div className="flex-1">
                              <a
                                href={citation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-luxury-gold hover:text-accent-gold-light hover:underline transition-all duration-400 underline-offset-2 decoration-luxury-gold/50 hover:decoration-luxury-gold inline-flex items-center gap-1"
                              >
                                {citation.title}
                                <svg
                                  className="w-3 h-3 mb-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                              <span className="text-neutral-gray text-sm ml-2">({citation.source})</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* References Section */}
                  {isPeptideArticle && peptideArticle && peptideArticle.references && peptideArticle.references.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-luxury-gold/20">
                      <h2 id="references" className="text-heading text-2xl font-bold text-accent-gold-light mb-6 scroll-mt-24">
                        References
                      </h2>
                      <p className="text-pure-white mb-4 leading-relaxed text-sm">
                        The following references provide authoritative information about this research compound:
                      </p>
                      <ol className="space-y-3 list-decimal list-inside">
                        {peptideArticle.references.map((ref, index) => (
                          <li key={ref.id || index} className="text-pure-white text-sm leading-relaxed">
                            {ref.url ? (
                              <a
                                href={ref.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-luxury-gold hover:text-accent-gold-light hover:underline transition-colors duration-400"
                              >
                                {ref.citation}
                              </a>
                            ) : (
                              <span>{ref.citation}</span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Peptide Article Disclaimer */}
                  {isPeptideArticle && peptideArticle && (
                    <div className="mt-12 pt-8 border-t-2 border-luxury-gold/30">
                      <div className="p-6 bg-red-900/30 border-l-4 border-red-500 rounded">
                        <h3 className="text-heading text-lg font-semibold text-red-400 mb-2">
                          Research Use Only Disclaimer
                        </h3>
                        <div className="text-sm text-red-300 whitespace-pre-line">
                          {peptideArticle.disclaimer}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Product Link (if peptide article) - Gold divider and link back */}
                  {isPeptideArticle && relatedProduct && (
                    <div className="mt-12 pt-8 border-t-2 border-luxury-gold">
                      <div className="p-6 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg">
                        <h3 className="text-heading text-lg font-semibold text-accent-gold-light mb-3">
                          Related Product
                        </h3>
                        <p className="text-sm text-pure-white mb-4">
                          This article discusses {relatedProduct.name}. View product details and available strengths.
                        </p>
                        <Link
                          href={`/products/${relatedProduct.slug}`}
                          className="inline-flex items-center gap-2 bg-luxury-gold text-primary-black px-6 py-3 rounded-lg font-semibold hover:bg-accent-gold-light transition-all duration-400"
                        >
                          View {relatedProduct.name}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Research Reference Disclaimer */}
                  <div className="mt-12 pt-8 border-t border-luxury-gold/20">
                    <div className="p-6 bg-luxury-gold/20 border-l-4 border-luxury-gold rounded">
                      <h3 className="text-heading text-lg font-semibold text-accent-gold-light mb-2">
                        Research Reference Disclaimer
                      </h3>
                      <p className="text-sm text-pure-white">
                        {getComplianceText('RESEARCH_REFERENCE_ONLY')}
                      </p>
                      <p className="text-sm text-pure-white mt-2">
                        The information presented in this article is for general research reference only
                        and is not medical, legal, or nutritional advice. All content is intended for
                        educational purposes in the context of laboratory research. Nothing in this
                        article should be construed as prescribing, diagnosing, or treating any medical
                        condition.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Related Articles */}
                {!isPeptideArticle && (
                  <div className="mt-12">
                    <h2 className="text-heading text-2xl font-bold text-accent-gold-light mb-6">
                      Related Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {articles
                        .filter((a) => a.id !== displayArticle.id)
                        .slice(0, 2)
                        .map((relatedArticle) => (
                          <Link
                            key={relatedArticle.id}
                            href={`/blog/${relatedArticle.slug}`}
                            className="bg-secondary-charcoal rounded-lg border border-luxury-gold/20 p-6 hover:shadow-lg hover:shadow-golden-glow transition-all"
                          >
                            <h3 className="text-heading text-lg font-semibold text-accent-gold-light mb-2 hover:text-luxury-gold transition-colors">
                              {relatedArticle.title}
                            </h3>
                            <p className="text-sm text-pure-white line-clamp-2">
                              {relatedArticle.description}
                            </p>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}

                {/* Related Products Section */}
                <div className="mt-12 pt-12 border-t border-luxury-gold/20">
                  <h2 className="text-heading text-2xl font-bold text-accent-gold-light mb-6">
                    {isPeptideArticle ? 'Related Research Peptides' : 'Related Research Peptides'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products
                      .filter((p) => isPeptideArticle ? p.id !== relatedProduct?.id : true)
                      .filter((p) => isPeptideArticle && relatedProduct ? p.category === relatedProduct.category : true)
                      .slice(0, 4)
                      .map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="bg-secondary-charcoal rounded-lg border border-luxury-gold/20 p-4 hover:shadow-lg hover:shadow-golden-glow transition-all"
                        >
                          <div className="relative w-full h-32 bg-gradient-to-br from-primary-black to-secondary-charcoal rounded-lg mb-3 flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-luxury-gold opacity-40"
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
                          <h3 className="text-heading font-semibold text-accent-gold-light mb-2 hover:text-luxury-gold transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-pure-white line-clamp-2 mb-2">
                            {product.shortDescription}
                          </p>
                          <p className="text-luxury-gold font-semibold">${getProductMinPrice(product).toFixed(2)}</p>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>

              {/* Sidebar (30%) */}
              <div className="lg:col-span-1">
                <TableOfContents items={displayArticle.tableOfContents} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

