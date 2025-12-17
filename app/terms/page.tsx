import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Terms & Conditions',
  description: 'Terms and conditions for Vici Peptides - Research use only products.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="bg-ivory min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-heading text-4xl font-bold text-charcoal mb-8">
            Terms & Conditions
          </h1>

          <div className="bg-ivory rounded-lg border border-taupe shadow-md p-8 md:p-12 space-y-8" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
            {/* Introduction */}
            <section>
              <p className="text-charcoal leading-relaxed">
                Please read these Terms and Conditions carefully before using our website or purchasing
                products from Vici Peptides. By accessing our website or making a purchase, you
                agree to be bound by these terms.
              </p>
            </section>

            {/* Research Use Only Clause */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Research Use Only (RUO) Clause
              </h2>
              <div className="p-6 bg-red-50 border-l-4 border-red-200 rounded">
                <p className="text-charcoal leading-relaxed font-semibold mb-2">
                  [RUO_CLAUSE]
                </p>
                <p className="text-charcoal leading-relaxed">
                  All products sold by Vici Peptides are for laboratory research purposes only.
                  They are not intended for human or animal use, and must not be used in drugs,
                  cosmetics, or any products intended for ingestion, injection, or topical application.
                </p>
                <p className="text-text-gray leading-relaxed mt-4">
                  All products sold on this website are intended strictly for laboratory research purposes
                  only. They are not for human consumption, not for medical use, not for veterinary use.
                  These products are not approved by the FDA.
                </p>
              </div>
            </section>

            {/* Liability Limits */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Liability Limits
              </h2>
              <div className="p-6 bg-taupe border-l-4 border-stone rounded">
                <p className="text-charcoal leading-relaxed font-semibold mb-2">
                  [LIABILITY_LIMITS]
                </p>
                <p className="text-charcoal leading-relaxed">
                  Seller makes no warranties about product use; buyer assumes all risk. We do not assume
                  any responsibility for misuse or mishandling. Use at your own risk.
                </p>
                <p className="text-text-gray leading-relaxed mt-4">
                  Vici Peptides makes no representations or warranties, express or implied,
                  regarding the products sold on this website. All products are sold "as is" without
                  warranty of any kind, either express or implied, including but not limited to warranties
                  of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </div>
            </section>

            {/* Buyer Responsibility */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Buyer Responsibility
              </h2>
              <div className="p-6 bg-taupe border-l-4 border-stone rounded">
                <p className="text-charcoal leading-relaxed font-semibold mb-2">
                  [BUYER_RESPONSIBILITY]
                </p>
                <p className="text-charcoal leading-relaxed">
                  Buyer is responsible for compliance with all applicable laws. By purchasing, you affirm
                  you are a qualified researcher and understand the risks and handling requirements
                  associated with these materials.
                </p>
                <p className="text-text-gray leading-relaxed mt-4">
                  Customers are responsible for ensuring compliance with their local laws, including but
                  not limited to import/export regulations, research use requirements, and age
                  restrictions. International customers must check local regulations before purchasing.
                </p>
              </div>
            </section>

            {/* Product Use Restrictions */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Product Use Restrictions
              </h2>
              <ul className="list-disc list-inside space-y-2 text-charcoal">
                <li>Products are for laboratory research purposes only</li>
                <li>Not for human or veterinary use</li>
                <li>Not for use in drugs, cosmetics, or consumer products</li>
                <li>Not approved by the FDA for any therapeutic use</li>
                <li>No dosing instructions or administration advice will be provided</li>
                <li>Products must not be resold or redistributed without proper labeling</li>
              </ul>
            </section>

            {/* Age Restrictions */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Age Restrictions
              </h2>
              <p className="text-charcoal leading-relaxed">
                You must be 18 years or older to purchase products from this website. By making a
                purchase, you confirm that you are of legal age and purchasing strictly for legitimate
                laboratory research purposes.
              </p>
            </section>

            {/* Copyright and Trademark */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Copyright and Trademark
              </h2>
              <p className="text-charcoal leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the
                property of Vici Peptides and is protected by copyright and trademark laws. You
                may not reproduce, distribute, or use any content without prior written permission.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Governing Law
              </h2>
              <p className="text-charcoal leading-relaxed">
                These Terms and Conditions shall be governed by and construed in accordance with the
                laws of the United States. Any disputes arising from these terms or your use of this
                website shall be resolved in the appropriate courts.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Changes to Terms
              </h2>
              <p className="text-charcoal leading-relaxed">
                Vici Peptides reserves the right to modify these Terms and Conditions at any time.
                Changes will be effective immediately upon posting to this page. Your continued use of
                the website after changes are posted constitutes acceptance of the modified terms.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Contact Information
              </h2>
              <p className="text-charcoal leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us through
                our <Link href="/contact" className="text-charcoal hover:text-charcoal/80 underline underline-offset-2">contact page</Link>.
              </p>
            </section>

            {/* Last Updated */}
            <section className="pt-8 border-t border-taupe">
              <p className="text-sm text-stone">
                Last updated: December 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

