'use client';

import Link from 'next/link';
import Image from 'next/image';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';
import ParallaxSection from '@/components/animations/ParallaxSection';
import ProductCarousel from '@/components/homepage/ProductCarousel';
import CategoryGrid from '@/components/homepage/CategoryGrid';
import { useAirtableProducts } from '@/lib/hooks/useAirtableProducts';
import { getProductMinPrice } from '@/data/products';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const { products: airtableProducts, loading } = useAirtableProducts();
  const { selectedWarehouse } = useWarehouse();

  // Get best-selling products (top 8 by price as proxy for popularity)
  const bestSelling = useMemo(() => {
    if (loading || airtableProducts.length === 0) return [];
    return [...airtableProducts]
      .filter(item => !item.isDiscontinued && item.airtableInStock)
      .sort((a, b) => {
        const priceA = getProductMinPrice(a.product);
        const priceB = getProductMinPrice(b.product);
        const warehouseMultiplier = selectedWarehouse === 'us' ? 1.25 : 1.0;
        return (priceB * warehouseMultiplier) - (priceA * warehouseMultiplier);
      })
      .slice(0, 8)
      .map(item => item.product);
  }, [airtableProducts, selectedWarehouse, loading]);

  // Get newest additions (last 8 products, reversed)
  const newest = useMemo(() => {
    if (loading || airtableProducts.length === 0) return [];
    return [...airtableProducts]
      .filter(item => !item.isDiscontinued && item.airtableInStock)
      .slice(-8)
      .reverse()
      .map(item => item.product);
  }, [airtableProducts, loading]);

  return (
    <div className="bg-ivory">
      {/* Hero Section */}
      <section className="min-h-[95vh] sm:min-h-[90vh] flex items-center justify-center relative mb-30 bg-ivory">
        <div className="container mx-auto px-4 py-16 sm:py-16 md:py-24 lg:py-40">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-center">
              {/* Left Column - Brand Name & CTA */}
              <div className="text-left space-y-6 sm:space-y-6 md:space-y-8 lg:space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
                  className="space-y-2 sm:space-y-2 md:space-y-3"
                  style={{
                    transform: 'perspective(1000px)',
                  }}
                >
                  {/* VICI - Larger - Mobile optimized */}
                  <h1 
                    className="text-heading text-5xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-charcoal leading-none tracking-tight"
                    style={{
                      textShadow: '2px 2px 4px rgba(43, 43, 43, 0.1), 0 0 20px rgba(230, 222, 212, 0.2)',
                      transform: 'perspective(1000px) rotateX(2deg)',
                    }}
                  >
                    VICI
                  </h1>
                  {/* PEPTIDES - Smaller, uppercase - Mobile optimized */}
                  <h2 
                    className="text-heading text-xl sm:text-lg md:text-3xl lg:text-5xl xl:text-6xl font-normal text-charcoal uppercase tracking-wider"
                    style={{
                      textShadow: '1px 1px 3px rgba(43, 43, 43, 0.1), 0 0 15px rgba(230, 222, 212, 0.15)',
                      transform: 'perspective(1000px) rotateX(-1deg)',
                    }}
                  >
                    PEPTIDES
                  </h2>
                </motion.div>
                
                {/* CTA Button - Mobile optimized */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' }}
                  className="pt-4 sm:pt-4 md:pt-6"
                >
                  <Link
                    href="/shop"
                    className="inline-block bg-ivory border-2 border-charcoal text-charcoal px-6 py-3 sm:px-6 sm:py-3 md:px-10 md:py-5 font-semibold text-sm sm:text-base md:text-xl hover:bg-charcoal hover:text-ivory transition-all duration-400 text-center min-h-[44px] sm:min-h-[40px] md:min-h-[56px] flex items-center justify-center uppercase tracking-wide"
                    style={{
                      boxShadow: '0 4px 12px rgba(43, 43, 43, 0.15), 0 0 20px rgba(230, 222, 212, 0.2)',
                      transform: 'perspective(1000px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'perspective(1000px) translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(43, 43, 43, 0.2), 0 0 25px rgba(230, 222, 212, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(1000px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 43, 43, 0.15), 0 0 20px rgba(230, 222, 212, 0.2)';
                    }}
                  >
                    SHOP PEPTIDES
                  </Link>
                </motion.div>
              </div>

              {/* Right Column - Hero Vials Image - Mobile optimized */}
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.1, delay: 0.3, ease: 'easeOut' }}
                  className="relative w-full h-auto"
                  style={{
                    transform: 'perspective(1200px) rotateY(-5deg) rotateX(3deg)',
                    filter: 'drop-shadow(0 12px 32px rgba(230, 222, 212, 0.5)) drop-shadow(0 4px 12px rgba(43, 43, 43, 0.15))',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'perspective(1200px) rotateY(-3deg) rotateX(2deg) scale(1.02)';
                    e.currentTarget.style.filter = 'drop-shadow(0 16px 40px rgba(230, 222, 212, 0.6)) drop-shadow(0 6px 16px rgba(43, 43, 43, 0.2))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1200px) rotateY(-5deg) rotateX(3deg)';
                    e.currentTarget.style.filter = 'drop-shadow(0 12px 32px rgba(230, 222, 212, 0.5)) drop-shadow(0 4px 12px rgba(43, 43, 43, 0.15))';
                  }}
                >
                  <Image
                    src="/images/vici-hero-vials.png"
                    alt="Vici Peptides research vials"
                    width={1000}
                    height={750}
                    priority
                    className="object-contain w-full h-auto"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 50vw"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Best-Selling Research Compounds - Above the Fold */}
      <section className="bg-ivory py-12 md:py-16 relative mb-30">
        <FadeInOnScroll direction="up" delay={0.1}>
          <ProductCarousel title="Best-Selling Research Compounds" products={bestSelling} />
        </FadeInOnScroll>
      </section>

      {/* Newest Additions Carousel */}
      <section className="bg-ivory py-12 md:py-16 relative mb-30">
        <FadeInOnScroll direction="up" delay={0.1}>
          <ProductCarousel title="Newest Additions" products={newest} />
        </FadeInOnScroll>
      </section>

      {/* Feature Cards Section */}
      <section className="bg-taupe py-16 md:py-24 relative">
        {/* Subtle divider line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Card 1: Purity & Verification */}
              <FadeInOnScroll direction="up" delay={0.1}>
                <div className="bg-ivory rounded-xl p-8 md:p-10 shadow-md transition-all duration-400 border border-taupe"
                  style={{
                    boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 43, 43, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(43, 43, 43, 0.1)';
                  }}
                >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-taupe rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-charcoal"
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
                  <h2 className="text-heading text-2xl font-bold text-charcoal mb-4">
                    Purity & Verification
                  </h2>
                  <p className="text-charcoal leading-relaxed">
                    Every batch undergoes rigorous third-party testing to verify purity and identity. 
                    Certificates of Analysis (CoA) are available for all products, ensuring researchers 
                    receive laboratory-grade materials that meet strict quality standards.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="text-charcoal font-semibold hover:text-charcoal/80 transition-all duration-400 inline-flex items-center"
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
                <div className="bg-ivory rounded-xl p-8 md:p-10 shadow-md transition-all duration-400 border border-taupe"
                  style={{
                    boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 43, 43, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(43, 43, 43, 0.1)';
                  }}
                >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-taupe rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-charcoal"
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
                  <h2 className="text-heading text-2xl font-bold text-charcoal mb-4">
                    Regulatory Compliance
                  </h2>
                  <p className="text-charcoal leading-relaxed">
                    All products are sold strictly for laboratory research use only. We maintain full 
                    compliance with FDA regulations and state-level requirements, ensuring proper 
                    labeling, documentation, and adherence to research-only classification standards.
                  </p>
                </div>
                <Link
                  href="/terms"
                  className="text-charcoal font-semibold hover:text-charcoal/80 transition-all duration-300 inline-flex items-center glow-on-hover"
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
                <div className="bg-ivory rounded-xl p-8 md:p-10 shadow-md transition-all duration-400 border border-taupe"
                  style={{
                    boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 43, 43, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(43, 43, 43, 0.1)';
                  }}
                >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-taupe rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-charcoal"
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
                  <h2 className="text-heading text-2xl font-bold text-charcoal mb-4">
                    Trusted Supply Chain
                  </h2>
                  <p className="text-charcoal leading-relaxed">
                    We partner exclusively with FDA-registered API manufacturers and maintain 
                    comprehensive batch tracking. Our supply chain is transparent, with full 
                    documentation available for every product, from manufacturing to delivery.
                  </p>
                </div>
                <Link
                  href="/about"
                  className="text-charcoal font-semibold hover:text-charcoal/80 transition-all duration-300 inline-flex items-center glow-on-hover"
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


