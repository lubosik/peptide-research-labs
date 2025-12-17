'use client';

import { motion } from 'framer-motion';
import FadeInOnScroll from '@/components/animations/FadeInOnScroll';

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero Section */}
      <section className="bg-taupe border-b border-stone py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInOnScroll direction="up" delay={0.1}>
              <h1 className="text-heading text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                About Vici Peptides
              </h1>
              <p className="text-lg md:text-xl text-charcoal leading-relaxed">
                Advancing scientific discovery through high-purity research peptides for laboratory use only.
              </p>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Mission */}
            <FadeInOnScroll direction="up" delay={0.1}>
              <div>
                <h2 className="text-heading text-3xl md:text-4xl font-bold text-charcoal mb-6">
                  Our Mission
                </h2>
                <p className="text-charcoal leading-relaxed text-lg">
                  Vici Peptides is dedicated to providing researchers with the highest quality research peptides 
                  and biochemical compounds. We understand the critical importance of purity, consistency, and 
                  reliability in scientific research, and we are committed to supporting the scientific community 
                  with products that meet the most stringent quality standards.
                </p>
              </div>
            </FadeInOnScroll>

            {/* Quality Assurance */}
            <FadeInOnScroll direction="up" delay={0.2}>
              <div>
                <h2 className="text-heading text-3xl md:text-4xl font-bold text-charcoal mb-6">
                  Quality Assurance
                </h2>
                <p className="text-charcoal leading-relaxed text-lg mb-4">
                  Every product in our catalog undergoes rigorous third-party testing to verify purity, identity, 
                  and quality. We maintain comprehensive documentation for all batches, including Certificates of 
                  Analysis (CoA) that detail analytical results from independent laboratories.
                </p>
                <ul className="list-disc list-inside text-charcoal leading-relaxed space-y-2 text-lg ml-4">
                  <li>Third-party purity verification for all products</li>
                  <li>Comprehensive batch tracking and documentation</li>
                  <li>Certificates of Analysis (CoA) available for all products</li>
                  <li>FDA-registered manufacturing partners</li>
                  <li>Strict quality control protocols</li>
                </ul>
              </div>
            </FadeInOnScroll>

            {/* Regulatory Compliance */}
            <FadeInOnScroll direction="up" delay={0.3}>
              <div>
                <h2 className="text-heading text-3xl md:text-4xl font-bold text-charcoal mb-6">
                  Regulatory Compliance
                </h2>
                <p className="text-charcoal leading-relaxed text-lg mb-4">
                  All products sold by Vici Peptides are strictly for laboratory research use only. We maintain 
                  full compliance with FDA regulations and state-level requirements, ensuring proper labeling, 
                  documentation, and adherence to research-only classification standards.
                </p>
                <div className="bg-taupe border border-stone rounded-lg p-6 mt-6">
                  <p className="text-charcoal font-semibold mb-2">Important Notice:</p>
                  <p className="text-charcoal">
                    All products are sold for Research Use Only (RUO). Not for human or veterinary use. 
                    Not approved by the FDA for any therapeutic purpose. These products are intended solely 
                    for laboratory research applications.
                  </p>
                </div>
              </div>
            </FadeInOnScroll>

            {/* Supply Chain */}
            <FadeInOnScroll direction="up" delay={0.4}>
              <div>
                <h2 className="text-heading text-3xl md:text-4xl font-bold text-charcoal mb-6">
                  Trusted Supply Chain
                </h2>
                <p className="text-charcoal leading-relaxed text-lg">
                  We partner exclusively with FDA-registered API manufacturers and maintain comprehensive batch 
                  tracking throughout our supply chain. Our commitment to transparency means that full 
                  documentation is available for every product, from manufacturing to delivery, ensuring researchers 
                  have complete visibility into the origin and quality of their research materials.
                </p>
              </div>
            </FadeInOnScroll>

            {/* Research Support */}
            <FadeInOnScroll direction="up" delay={0.5}>
              <div>
                <h2 className="text-heading text-3xl md:text-4xl font-bold text-charcoal mb-6">
                  Research Support
                </h2>
                <p className="text-charcoal leading-relaxed text-lg">
                  We are committed to supporting the research community. Our team is available to assist with 
                  product selection, technical questions, and documentation requests. We understand that research 
                  timelines are critical, and we work to ensure timely delivery of high-quality research materials 
                  to support your scientific investigations.
                </p>
              </div>
            </FadeInOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
}

