'use client';

import Link from 'next/link';
import Image from 'next/image';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';
import ParallaxSection from '@/components/animations/ParallaxSection';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import { products } from '@/data/products';
import { motion } from 'framer-motion';

export default function Home() {
  // Get best-selling and newest products (for demo, using first 6 products)
  const bestSelling = products.slice(0, 6);
  const newest = products.slice(-6).reverse();

  return (
    <div className="bg-slate-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left Column - Headline & CTA (60%) */}
            <FadeInOnScroll direction="right" delay={0.1} className="lg:col-span-3 space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Advancing Scientific Discovery Through Research Peptides
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl"
              >
                Providing high-purity biochemical reagents for laboratory research. Our peptides are 
                manufactured under strict quality controls and verified through third-party testing 
                to ensure research-grade standards.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-4 flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/shop"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-glow-md glow-on-hover gpu-accelerated text-center"
                >
                  Browse Products
                </Link>
                <Link
                  href="/shop"
                  className="inline-block bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl gpu-accelerated text-center"
                >
                  Shop Now
                </Link>
              </motion.div>
            </FadeInOnScroll>

            {/* Right Column - Hero Image (40%) */}
            <ParallaxSection speed={0.3} className="lg:col-span-2">
              <FadeInOnScroll direction="left" delay={0.2}>
                <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden gpu-accelerated bg-transparent">
                  <Image
                    src="/images/peptide-vial-hero.jpg"
                    alt="Research peptide vials for laboratory use"
                    fill
                    priority
                    className="object-contain rounded-lg"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </FadeInOnScroll>
            </ParallaxSection>
          </div>
        </div>
      </section>

      {/* Glowing Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      {/* Best-Selling Research Compounds Carousel */}
      <section className="bg-slate-950 py-12 md:py-16 relative">
        {/* Glowing divider line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <ProductCarousel title="Best-Selling Research Compounds" products={bestSelling} />
      </section>

      {/* Glowing Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      {/* Newest Additions Carousel */}
      <section className="bg-slate-950 py-12 md:py-16 relative">
        {/* Glowing divider line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <ProductCarousel title="Newest Additions" products={newest} />
      </section>

      {/* Glowing Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      {/* Feature Cards Section */}
      <section className="bg-slate-900 py-16 md:py-24 relative">
        {/* Glowing divider line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Card 1: Purity & Verification */}
              <FadeInOnScroll direction="up" delay={0.1}>
                <div className="bg-slate-800 rounded-xl p-8 md:p-10 shadow-md hover:shadow-xl hover:shadow-glow-sm transition-all duration-300 border border-slate-700 glow-on-hover gpu-accelerated">
                <div className="mb-6">
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
                  <h2 className="text-heading text-2xl font-bold text-white mb-4">
                    Purity & Verification
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Every batch undergoes rigorous third-party testing to verify purity and identity. 
                    Certificates of Analysis (CoA) are available for all products, ensuring researchers 
                    receive laboratory-grade materials that meet strict quality standards.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="text-primary font-semibold hover:text-primary-dark transition-all duration-300 inline-flex items-center glow-on-hover"
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
                </Link>
              </div>
              </FadeInOnScroll>

              {/* Card 2: Regulatory Compliance */}
              <FadeInOnScroll direction="up" delay={0.2}>
                <div className="bg-slate-800 rounded-xl p-8 md:p-10 shadow-md hover:shadow-xl hover:shadow-glow-sm transition-all duration-300 border border-slate-700 glow-on-hover gpu-accelerated">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-heading text-2xl font-bold text-white mb-4">
                    Regulatory Compliance
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    All products are sold strictly for laboratory research use only. We maintain full 
                    compliance with FDA regulations and state-level requirements, ensuring proper 
                    labeling, documentation, and adherence to research-only classification standards.
                  </p>
                </div>
                <Link
                  href="/terms"
                  className="text-primary font-semibold hover:text-primary-dark transition-all duration-300 inline-flex items-center glow-on-hover"
                >
                  View Policies
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
                </Link>
              </div>
              </FadeInOnScroll>

              {/* Card 3: Trusted Supply Chain */}
              <FadeInOnScroll direction="up" delay={0.3}>
                <div className="bg-slate-800 rounded-xl p-8 md:p-10 shadow-md hover:shadow-xl hover:shadow-glow-sm transition-all duration-300 border border-slate-700 glow-on-hover gpu-accelerated">
                <div className="mb-6">
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-heading text-2xl font-bold text-white mb-4">
                    Trusted Supply Chain
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    We partner exclusively with FDA-registered API manufacturers and maintain 
                    comprehensive batch tracking. Our supply chain is transparent, with full 
                    documentation available for every product, from manufacturing to delivery.
                  </p>
                </div>
                <Link
                  href="/about"
                  className="text-primary font-semibold hover:text-primary-dark transition-all duration-300 inline-flex items-center glow-on-hover"
                >
                  Our Process
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
                </Link>
              </div>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

