import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, articles } from '@/data/articles';
import { products } from '@/data/products';
import { Metadata } from 'next';
import TableOfContents from '@/components/blog/TableOfContents';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { generateArticleSchema } from '@/lib/seo/structured-data';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return generateSEOMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedDate,
    modifiedTime: article.publishedDate,
  });
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
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

  const articleSchema = generateArticleSchema(article);

  return (
    <div className="bg-neutral-light min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Breadcrumbs */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm">
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
                <li className="text-accent-gray font-medium line-clamp-1">{article.title}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Header Image */}
      <section className="relative w-full h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8">
            <svg
              className="w-32 h-32 md:w-48 md:h-48 mx-auto text-accent-gray opacity-30"
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
            <p className="text-sm text-text-gray mt-4 opacity-50">
              Article Header Image
            </p>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Main Content (70%) */}
              <div className="lg:col-span-3">
                <article className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 md:p-12">
                  {/* Article Header */}
                  <header className="mb-8">
                    <div className="mb-4">
                      <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full">
                        {article.category}
                      </span>
                    </div>
                    <h1 className="text-heading text-3xl md:text-4xl font-bold text-accent-gray mb-4">
                      {article.title}
                    </h1>
                    <p className="text-xl text-text-gray mb-6 leading-relaxed">
                      {article.subheadline}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-text-gray border-b border-gray-200 pb-6">
                      <div>
                        <span className="font-semibold">Author:</span> {article.author}
                      </div>
                      <div>
                        <span className="font-semibold">Published:</span> {formatDate(article.publishedDate)}
                      </div>
                      <div>
                        <span className="font-semibold">Read Time:</span> {article.readTime}
                      </div>
                    </div>
                  </header>

                  {/* Article Body */}
                  <div className="prose prose-lg max-w-none">
                    {article.content.map((paragraph, index) => {
                      // Check if this paragraph should be a heading based on table of contents
                      const tocItem = article.tableOfContents.find(
                        (item, tocIndex) => tocIndex === index
                      );

                      if (tocItem) {
                        return (
                          <div key={index} id={tocItem.id} className="scroll-mt-24">
                            <h2 className="text-heading text-2xl font-bold text-accent-gray mt-12 mb-6 first:mt-0">
                              {tocItem.title}
                            </h2>
                            <p className="text-text-gray leading-relaxed mb-6">
                              {paragraph}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <p key={index} className="text-text-gray leading-relaxed mb-6">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Research Reference Disclaimer */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                      <h3 className="text-heading text-lg font-semibold text-yellow-800 mb-2">
                        Research Reference Disclaimer
                      </h3>
                      <p className="text-sm text-yellow-700">
                        {getComplianceText('RESEARCH_REFERENCE_ONLY')}
                      </p>
                      <p className="text-sm text-yellow-700 mt-2">
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
                <div className="mt-12">
                  <h2 className="text-heading text-2xl font-bold text-accent-gray mb-6">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {articles
                      .filter((a) => a.id !== article.id)
                      .slice(0, 2)
                      .map((relatedArticle) => (
                        <Link
                          key={relatedArticle.id}
                          href={`/blog/${relatedArticle.slug}`}
                          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="text-heading text-lg font-semibold text-accent-gray mb-2 hover:text-primary transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-sm text-text-gray line-clamp-2">
                            {relatedArticle.description}
                          </p>
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Related Products Section */}
                <div className="mt-12 pt-12 border-t border-gray-200">
                  <h2 className="text-heading text-2xl font-bold text-accent-gray mb-6">
                    Related Research Peptides
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 4).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="relative w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-accent-gray opacity-30"
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
                        <h3 className="text-heading font-semibold text-accent-gray mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-text-gray line-clamp-2 mb-2">
                          {product.shortDescription}
                        </p>
                        <p className="text-primary font-semibold">${product.price.toFixed(2)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar (30%) */}
              <div className="lg:col-span-1">
                <TableOfContents items={article.tableOfContents} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

