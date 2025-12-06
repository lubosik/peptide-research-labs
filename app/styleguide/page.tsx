import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Style Guide',
  description: 'Design system and style guide for Vici Peptides.',
  path: '/styleguide',
});

export default function StyleGuidePage() {
  return (
    <div className="bg-neutral-light min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-heading text-4xl font-bold text-accent-gray mb-8">
            Style Guide
          </h1>
          <p className="text-lg text-text-gray mb-12">
            Complete design system documentation for Vici Peptides
          </p>

          {/* Color System */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Color System
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Primary Orange */}
                <div>
                  <div className="w-full h-32 bg-primary rounded-lg mb-4 shadow-md"></div>
                  <h3 className="text-heading font-semibold text-accent-gray mb-2">Primary Orange</h3>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Hex:</strong> #E67E22
                  </p>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Tailwind:</strong> bg-primary, text-primary, border-primary
                  </p>
                  <p className="text-sm text-text-gray">
                    Used for: CTAs, hover states, accents, active states
                  </p>
                </div>

                {/* Secondary Amber */}
                <div>
                  <div className="w-full h-32 bg-secondary rounded-lg mb-4 shadow-md"></div>
                  <h3 className="text-heading font-semibold text-accent-gray mb-2">Secondary Amber</h3>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Hex:</strong> #F39C12
                  </p>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Tailwind:</strong> bg-secondary, text-secondary
                  </p>
                  <p className="text-sm text-text-gray">
                    Used for: Secondary actions, highlights, compliance banners
                  </p>
                </div>

                {/* Accent Gray */}
                <div>
                  <div className="w-full h-32 bg-accent-gray rounded-lg mb-4 shadow-md"></div>
                  <h3 className="text-heading font-semibold text-accent-gray mb-2">Accent Gray</h3>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Hex:</strong> #2C3E50
                  </p>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Tailwind:</strong> bg-accent-gray, text-accent-gray
                  </p>
                  <p className="text-sm text-text-gray">
                    Used for: Headings, important text, footer background
                  </p>
                </div>

                {/* Text Gray */}
                <div>
                  <div className="w-full h-32 bg-text-gray rounded-lg mb-4 shadow-md"></div>
                  <h3 className="text-heading font-semibold text-accent-gray mb-2">Text Gray</h3>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Hex:</strong> #34495E
                  </p>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Tailwind:</strong> text-text-gray
                  </p>
                  <p className="text-sm text-text-gray">
                    Used for: Body text, descriptions, secondary content
                  </p>
                </div>

                {/* Neutral Light */}
                <div>
                  <div className="w-full h-32 bg-neutral-light border-2 border-gray-300 rounded-lg mb-4"></div>
                  <h3 className="text-heading font-semibold text-accent-gray mb-2">Neutral Light</h3>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Hex:</strong> #FFFFFF
                  </p>
                  <p className="text-sm text-text-gray mb-2">
                    <strong>Tailwind:</strong> bg-neutral-light
                  </p>
                  <p className="text-sm text-text-gray">
                    Used for: Backgrounds, cards, main content areas
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Typography
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-8">
              {/* Font Families */}
              <div>
                <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                  Font Families
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-text-gray mb-2">
                      <strong>Body Font:</strong> Lato (300, 400, 700)
                    </p>
                    <p className="font-sans text-lg">
                      The quick brown fox jumps over the lazy dog. 1234567890
                    </p>
                    <p className="text-sm text-text-gray mt-2">
                      <strong>Usage:</strong> All body text, descriptions, paragraphs
                    </p>
                  </div>
                  <div>
                    <p className="text-text-gray mb-2">
                      <strong>Heading Font:</strong> Montserrat SemiBold (600, 700)
                    </p>
                    <p className="text-heading text-lg">
                      The quick brown fox jumps over the lazy dog. 1234567890
                    </p>
                    <p className="text-sm text-text-gray mt-2">
                      <strong>Usage:</strong> All headings (H1-H6), titles, labels
                    </p>
                    <p className="text-sm text-text-gray">
                      <strong>Tailwind Class:</strong> text-heading
                    </p>
                  </div>
                </div>
              </div>

              {/* Type Scale */}
              <div>
                <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                  Type Scale
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-heading text-6xl font-bold text-accent-gray mb-2">
                      Display (6xl)
                    </p>
                    <p className="text-sm text-text-gray">text-6xl - Hero headlines</p>
                  </div>
                  <div>
                    <p className="text-heading text-5xl font-bold text-accent-gray mb-2">
                      H1 (5xl)
                    </p>
                    <p className="text-sm text-text-gray">text-5xl - Page titles</p>
                  </div>
                  <div>
                    <p className="text-heading text-4xl font-bold text-accent-gray mb-2">
                      H2 (4xl)
                    </p>
                    <p className="text-sm text-text-gray">text-4xl - Section headings</p>
                  </div>
                  <div>
                    <p className="text-heading text-3xl font-bold text-accent-gray mb-2">
                      H3 (3xl)
                    </p>
                    <p className="text-sm text-text-gray">text-3xl - Subsection headings</p>
                  </div>
                  <div>
                    <p className="text-heading text-2xl font-bold text-accent-gray mb-2">
                      H4 (2xl)
                    </p>
                    <p className="text-sm text-text-gray">text-2xl - Card titles</p>
                  </div>
                  <div>
                    <p className="text-heading text-xl font-semibold text-accent-gray mb-2">
                      H5 (xl)
                    </p>
                    <p className="text-sm text-text-gray">text-xl - Small headings</p>
                  </div>
                  <div>
                    <p className="text-lg text-text-gray mb-2">Body Large (lg)</p>
                    <p className="text-sm text-text-gray">text-lg - Large body text</p>
                  </div>
                  <div>
                    <p className="text-base text-text-gray mb-2">Body (base)</p>
                    <p className="text-sm text-text-gray">text-base - Default body text (16px)</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-gray mb-2">Body Small (sm)</p>
                    <p className="text-sm text-text-gray">text-sm - Small text (14px)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Spacing System */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Spacing System
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Spacing Scale
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-primary/10 p-1 mb-2" style={{ width: '4px' }}></div>
                      <p className="text-text-gray">
                        <strong>Micro (4px):</strong> p-1, gap-1 - Tight spacing
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-2 mb-2" style={{ width: '8px' }}></div>
                      <p className="text-text-gray">
                        <strong>Micro (8px):</strong> p-2, gap-2 - Tight spacing
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-4 mb-2" style={{ width: '16px' }}></div>
                      <p className="text-text-gray">
                        <strong>Small (16px):</strong> p-4, gap-4 - Component internal
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-6 mb-2" style={{ width: '24px' }}></div>
                      <p className="text-text-gray">
                        <strong>Small (24px):</strong> p-6, gap-6 - Component internal
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-8 mb-2" style={{ width: '32px' }}></div>
                      <p className="text-text-gray">
                        <strong>Medium (32px):</strong> p-8, gap-8 - Section spacing
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-12 mb-2" style={{ width: '48px' }}></div>
                      <p className="text-text-gray">
                        <strong>Medium (48px):</strong> p-12, gap-12 - Section spacing
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-16 mb-2" style={{ width: '64px' }}></div>
                      <p className="text-text-gray">
                        <strong>Large (64px):</strong> p-16, gap-16 - Major section breaks
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-20 mb-2" style={{ width: '80px' }}></div>
                      <p className="text-text-gray">
                        <strong>Large (80px):</strong> p-20, gap-20 - Major section breaks
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-24 mb-2" style={{ width: '96px' }}></div>
                      <p className="text-text-gray">
                        <strong>Large (96px):</strong> p-24, gap-24 - Major section breaks
                      </p>
                    </div>
                    <div>
                      <div className="bg-primary/10 p-32 mb-2" style={{ width: '128px' }}></div>
                      <p className="text-text-gray">
                        <strong>Extra Large (120px+):</strong> p-32 - Hero sections
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Buttons
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <div className="space-y-8">
                {/* Primary Button */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Primary Button
                  </h3>
                  <div className="space-y-4">
                    <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-xl">
                      Primary Button
                    </button>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm text-text-gray">
                        className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-xl"
                      </code>
                    </div>
                    <p className="text-sm text-text-gray">
                      Used for: Main CTAs, primary actions, "Add to Cart", "Proceed to Checkout"
                    </p>
                  </div>
                </div>

                {/* Secondary Button */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Secondary Button
                  </h3>
                  <div className="space-y-4">
                    <button className="bg-gray-200 text-accent-gray px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors duration-200">
                      Secondary Button
                    </button>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm text-text-gray">
                        className="bg-gray-200 text-accent-gray px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors duration-200"
                      </code>
                    </div>
                    <p className="text-sm text-text-gray">
                      Used for: Secondary actions, "Exit Site", "No Thanks"
                    </p>
                  </div>
                </div>

                {/* Disabled Button */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Disabled Button
                  </h3>
                  <div className="space-y-4">
                    <button
                      disabled
                      className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed"
                    >
                      Disabled Button
                    </button>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm text-text-gray">
                        className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed"
                      </code>
                    </div>
                    <p className="text-sm text-text-gray">
                      Used for: Unavailable actions, out of stock, form validation
                    </p>
                  </div>
                </div>

                {/* Link Button */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Link Button (Text with Arrow)
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="#"
                      className="text-primary font-semibold hover:text-primary-dark transition-colors duration-200 inline-flex items-center"
                    >
                      Learn More
                      <svg
                        className="w-5 h-5 ml-2"
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
                    </a>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm text-text-gray">
                        className="text-primary font-semibold hover:text-primary-dark transition-colors duration-200 inline-flex items-center"
                      </code>
                    </div>
                    <p className="text-sm text-text-gray">
                      Used for: Feature card links, "Read More", navigation links
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Cards
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <div className="space-y-8">
                {/* Product Card */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Product Card
                  </h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 max-w-sm">
                    <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-text-gray text-sm">Product Image</span>
                    </div>
                    <div className="p-5">
                      <h4 className="text-heading text-xl font-bold text-accent-gray mb-2">
                        Product Name
                      </h4>
                      <p className="text-sm text-text-gray mb-4">
                        Short product description for laboratory research.
                      </p>
                      <p className="text-2xl font-bold text-accent-gray mb-4">$79.99</p>
                      <button className="w-full bg-primary text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 text-sm">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <code className="text-sm text-text-gray">
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200"
                    </code>
                  </div>
                </div>

                {/* Feature Card */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Feature Card
                  </h3>
                  <div className="bg-white rounded-xl p-8 md:p-10 shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-100 max-w-sm">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                      Feature Title
                    </h4>
                    <p className="text-text-gray leading-relaxed mb-6">
                      Feature description explaining the benefit or value proposition.
                    </p>
                    <a
                      href="#"
                      className="text-primary font-semibold hover:text-primary-dark transition-colors duration-200 inline-flex items-center"
                    >
                      Learn More
                      <svg
                        className="w-5 h-5 ml-2"
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
                    </a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <code className="text-sm text-text-gray">
                      className="bg-white rounded-xl p-8 md:p-10 shadow-md hover:shadow-xl transition-shadow duration-200 border border-gray-100"
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Elements */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Form Elements
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <div className="space-y-8">
                {/* Text Input */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Text Input
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-gray mb-2">
                        Label
                      </label>
                      <input
                        type="text"
                        placeholder="Placeholder text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm text-text-gray">
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                      </code>
                    </div>
                  </div>
                </div>

                {/* Select Dropdown */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Select Dropdown
                  </h3>
                  <div className="space-y-4">
                    <select className="w-full border border-gray-300 rounded-lg px-4 py-3 text-text-gray bg-white focus:outline-none focus:border-primary">
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm text-text-gray">
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-text-gray bg-white focus:outline-none focus:border-primary"
                      </code>
                    </div>
                  </div>
                </div>

                {/* Checkbox */}
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Checkbox
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        className="mt-1 mr-3"
                      />
                      <span className="text-text-gray">
                        Checkbox label text with description that can span multiple lines if needed.
                      </span>
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <code className="text-sm text-text-gray">
                        className="mt-1 mr-3" (checkbox)
                        <br />
                        className="flex items-start" (label container)
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Component Spacing */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Component Spacing Patterns
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Section Spacing
                  </h3>
                  <div className="space-y-2 text-text-gray">
                    <p>
                      <strong>Section Padding:</strong> py-12 md:py-16 (48px-64px vertical)
                    </p>
                    <p>
                      <strong>Container Padding:</strong> px-4 (16px horizontal)
                    </p>
                    <p>
                      <strong>Max Width:</strong> max-w-7xl mx-auto (1280px)
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Card Spacing
                  </h3>
                  <div className="space-y-2 text-text-gray">
                    <p>
                      <strong>Card Padding:</strong> p-8 md:p-10 (32px-40px)
                    </p>
                    <p>
                      <strong>Card Gap:</strong> gap-8 md:gap-12 (32px-48px)
                    </p>
                    <p>
                      <strong>Card Border Radius:</strong> rounded-lg or rounded-xl (8px-12px)
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                    Grid Spacing
                  </h3>
                  <div className="space-y-2 text-text-gray">
                    <p>
                      <strong>Product Grid Gap:</strong> gap-6 md:gap-8 (24px-32px)
                    </p>
                    <p>
                      <strong>Form Field Spacing:</strong> space-y-4 (16px vertical)
                    </p>
                    <p>
                      <strong>List Item Spacing:</strong> space-y-2 (8px vertical)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* UI Patterns */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Reusable UI Patterns
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-8">
              {/* Hover Transitions */}
              <div>
                <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                  Hover Transitions
                </h3>
                <div className="space-y-4">
                  <a
                    href="#"
                    className="text-text-gray hover:text-primary transition-colors duration-200 font-medium"
                  >
                    Link with Orange Hover
                  </a>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm text-text-gray">
                      className="text-text-gray hover:text-primary transition-colors duration-200"
                    </code>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                  Badges
                </h3>
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                    Category Badge
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm">
                    In Stock
                  </span>
                  <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold text-sm">
                    Out of Stock
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm text-text-gray">
                    Category: className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full"
                    <br />
                    Status: className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold text-sm"
                  </code>
                </div>
              </div>

              {/* Compliance Banners */}
              <div>
                <h3 className="text-heading text-xl font-semibold text-accent-gray mb-4">
                  Compliance Banners
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="text-sm text-red-800 font-semibold">Red Banner - Critical</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <p className="text-sm text-yellow-800 font-semibold">Yellow Banner - Warning</p>
                  </div>
                  <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <p className="text-sm text-orange-800 font-semibold">Orange Banner - Important</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm text-text-gray">
                      Red: className="p-4 bg-red-50 border-l-4 border-red-500 rounded"
                      <br />
                      Yellow: className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded"
                      <br />
                      Orange: className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded"
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Responsive Breakpoints */}
          <section className="mb-16">
            <h2 className="text-heading text-3xl font-bold text-accent-gray mb-6">
              Responsive Breakpoints
            </h2>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
              <div className="space-y-4 text-text-gray">
                <div>
                  <p className="font-semibold text-accent-gray mb-2">Mobile: &lt; 768px</p>
                  <p>Single column layouts, stacked navigation, full-width cards</p>
                </div>
                <div>
                  <p className="font-semibold text-accent-gray mb-2">Tablet: 768px - 1024px</p>
                  <p>2-column grids, horizontal navigation, side-by-side layouts</p>
                </div>
                <div>
                  <p className="font-semibold text-accent-gray mb-2">Desktop: &gt; 1024px</p>
                  <p>3-4 column grids, full navigation, multi-column layouts, sidebars</p>
                </div>
                <div className="mt-6">
                  <p className="font-semibold text-accent-gray mb-2">Tailwind Classes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>sm: - 640px and up</li>
                    <li>md: - 768px and up</li>
                    <li>lg: - 1024px and up</li>
                    <li>xl: - 1280px and up</li>
                    <li>2xl: - 1536px and up</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

