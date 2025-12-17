import { Metadata } from 'next';
import Link from 'next/link';
import { generateFAQSchema } from '@/lib/seo/structured-data';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Frequently Asked Questions',
  description: 'FAQ about research peptides, laboratory use, and Vici Peptides products.',
  path: '/faq',
});

export default function FAQPage() {
  const faqSchema = generateFAQSchema();

  return (
    <div className="bg-ivory min-h-screen py-12 md:py-16">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-heading text-4xl font-bold text-charcoal mb-8">
            Frequently Asked Questions
          </h1>

          <div className="bg-ivory rounded-lg border border-taupe shadow-md p-8 md:p-12 space-y-8" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
            {/* What are Peptides? */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                What are Peptides?
              </h2>
              <p className="text-charcoal leading-relaxed">
                Peptides are short chains of amino acids linked by peptide bonds. They are naturally
                occurring biological molecules that play various roles in cellular signaling, hormone
                regulation, and other physiological processes. In laboratory research, synthetic peptides
                are used to study these mechanisms and investigate potential applications in scientific
                research.
              </p>
              <p className="text-charcoal leading-relaxed mt-4">
                Research peptides are synthesized in laboratories and used by researchers to study
                biological processes, cellular mechanisms, and experimental applications in controlled
                laboratory settings.
              </p>
            </section>

            {/* How are Peptides Used in Research? */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                How are Peptides Used in Laboratory Research?
              </h2>
              <p className="text-charcoal leading-relaxed">
                Peptides are used in various laboratory research applications, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-charcoal mt-2 ml-4">
                <li>
                  <strong>Cell Culture Studies:</strong> Investigating cellular responses and signaling
                  pathways
                </li>
                <li>
                  <strong>Biochemical Research:</strong> Studying enzyme activity and protein interactions
                </li>
                <li>
                  <strong>Tissue Regeneration Studies:</strong> Researching cellular repair mechanisms in
                  experimental models
                </li>
                <li>
                  <strong>Hormone Research:</strong> Studying growth hormone release and metabolic
                  processes in laboratory settings
                </li>
                <li>
                  <strong>Collagen and Tissue Research:</strong> Investigating extracellular matrix
                  formation and tissue structure
                </li>
              </ul>
              <p className="text-charcoal leading-relaxed mt-4">
                All research is conducted in controlled laboratory environments by qualified researchers
                following established scientific protocols.
              </p>
            </section>

            {/* Research Use Only */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                What Does "Research Use Only" (RUO) Mean?
              </h2>
              <div className="p-6 bg-red-50 border-l-4 border-red-200 rounded">
                <p className="text-charcoal leading-relaxed font-semibold mb-2">
                  Research Use Only means these products are intended strictly for laboratory research
                  purposes.
                </p>
                <p className="text-charcoal leading-relaxed">
                  Products labeled "Research Use Only" are meant for use in controlled laboratory
                  settings by qualified researchers. They are NOT approved for human or veterinary use,
                  and are NOT dietary supplements or medical treatments.
                </p>
                <p className="text-charcoal leading-relaxed mt-4">
                  These products have not been evaluated by the FDA for safety or efficacy in humans or
                  animals. They are sold exclusively for laboratory research and experimental purposes.
                </p>
              </div>
            </section>

            {/* Purity and Quality */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                What is the Purity of Your Products?
              </h2>
              <p className="text-charcoal leading-relaxed">
                All products from Vici Peptides undergo rigorous third-party testing to verify
                purity and identity. We work exclusively with FDA-registered API manufacturers and
                maintain comprehensive batch tracking.
              </p>
              <p className="text-charcoal leading-relaxed mt-4">
                Certificates of Analysis (CoA) are available for all products upon request. Each batch is
                independently verified in a laboratory to ensure research-grade quality standards.
                Analytical results are provided for research reference only.
              </p>
            </section>

            {/* Storage Requirements */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                How Should I Store Research Peptides?
              </h2>
              <p className="text-charcoal leading-relaxed">
                Storage requirements vary by product and are specified on each product page. Common
                storage conditions include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-charcoal mt-2 ml-4">
                <li>
                  <strong>Frozen Storage:</strong> -20°C for long-term stability
                </li>
                <li>
                  <strong>Refrigerated Storage:</strong> 2-8°C for short-term storage
                </li>
                <li>
                  <strong>Room Temperature:</strong> Some peptides are stable at room temperature when
                  properly sealed
                </li>
              </ul>
              <p className="text-charcoal leading-relaxed mt-4 p-4 bg-taupe border-l-4 border-stone rounded">
                <strong>Important:</strong> Always follow the storage instructions provided with each
                product. For laboratory storage conditions only. Improper storage may affect product
                stability and research results.
              </p>
            </section>

            {/* Age Requirements */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Are There Age Restrictions for Purchasing?
              </h2>
              <p className="text-charcoal leading-relaxed">
                Yes. You must be 18 years or older to purchase products from Vici Peptides. By
                making a purchase, you confirm that you are of legal age and purchasing strictly for
                legitimate laboratory research purposes.
              </p>
              <p className="text-charcoal leading-relaxed mt-4">
                Some states have additional restrictions on sales of certain products to minors. Customers
                are responsible for ensuring compliance with their local laws.
              </p>
            </section>

            {/* Certificates of Analysis */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Can I Get a Certificate of Analysis (CoA)?
              </h2>
              <p className="text-charcoal leading-relaxed">
                Yes. Certificates of Analysis are available for all products upon request. CoAs provide
                third-party testing results verifying product purity, identity, and quality. To request a
                CoA, please contact us through our{' '}
                <Link href="/contact" className="text-charcoal hover:text-charcoal/80 underline underline-offset-2">
                  contact page
                </Link>
                {' '}with your order number and product information.
              </p>
            </section>

            {/* No Medical Advice */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Medical and Health Information
              </h2>
              <div className="p-6 bg-taupe border-l-4 border-stone rounded">
                <p className="text-charcoal leading-relaxed font-semibold mb-2">
                  [NO_MEDICAL_ADVICE]
                </p>
                <p className="text-charcoal leading-relaxed">
                  The information on this website is for general research reference only and is not
                  medical, legal, or nutritional advice. Nothing on this website should be construed as
                  prescribing, diagnosing, or treating any medical condition.
                </p>
                <p className="text-charcoal leading-relaxed mt-4">
                  We do not provide dosing instructions, administration advice, or medical guidance. All
                  products are sold for laboratory research purposes only. If you have questions about
                  medical conditions or treatments, please consult a qualified healthcare professional.
                </p>
              </div>
            </section>

            {/* Shipping and Returns */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                What is Your Shipping and Return Policy?
              </h2>
              <p className="text-charcoal leading-relaxed">
                Please see our{' '}
                <Link href="/shipping" className="text-charcoal hover:text-charcoal/80 underline underline-offset-2">
                  Shipping Policy
                </Link>
                {' '}page for detailed information about shipping methods, delivery times, and return
                policies. In summary:
              </p>
              <ul className="list-disc list-inside space-y-1 text-charcoal mt-2 ml-4">
                <li>All products ship with RUO labeling</li>
                <li>Standard shipping: 3-5 business days (domestic)</li>
                <li>No returns on opened products</li>
                <li>Defective products will be replaced</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Still Have Questions?
              </h2>
              <p className="text-charcoal leading-relaxed">
                If you have additional questions, please contact us through our{' '}
                <Link href="/contact" className="text-charcoal hover:text-charcoal/80 underline underline-offset-2">
                  contact page
                </Link>
                . We're here to help with your research needs.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

