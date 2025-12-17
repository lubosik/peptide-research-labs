import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Shipping Policy',
  description: 'Shipping policy for Vici Peptides - RUO labeling, returns, and shipping information.',
  path: '/shipping',
});

export default function ShippingPage() {
  return (
    <div className="bg-ivory min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-heading text-4xl font-bold text-charcoal mb-8">
            Shipping Policy
          </h1>

          <div className="bg-ivory rounded-lg border border-taupe shadow-md p-8 md:p-12 space-y-8" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
            {/* Introduction */}
            <section>
              <p className="text-charcoal leading-relaxed">
                This Shipping Policy outlines how we ship products, shipping methods, delivery times,
                and our return policy. Please read carefully before placing an order.
              </p>
            </section>

            {/* RUO Labeling */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Research Use Only (RUO) Labeling
              </h2>
              <div className="p-6 bg-red-50 border-l-4 border-red-200 rounded">
                <p className="text-charcoal leading-relaxed font-semibold mb-2">
                  All products are shipped with Research Use Only (RUO) labeling.
                </p>
                <p className="text-charcoal leading-relaxed">
                  Every shipment includes clear labeling stating that products are "For Laboratory Research
                  Purposes Only" and "Not for Human or Veterinary Use." All packaging and documentation
                  will reflect the research-only classification of these materials.
                </p>
                <p className="text-text-gray leading-relaxed mt-4">
                  Products are marked as "Laboratory Reagents – not for human use" on all shipping
                  paperwork to ensure proper customs handling and compliance with import/export
                  regulations.
                </p>
              </div>
            </section>

            {/* Shipping Methods */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Shipping Methods
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-heading text-lg font-semibold text-charcoal mb-2">
                    Domestic Shipping (United States)
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-charcoal ml-4">
                    <li>
                      <strong>Standard Shipping:</strong> 3-5 business days via FedEx Ground or USPS
                      Priority
                    </li>
                    <li>
                      <strong>Express Shipping:</strong> 1-2 business days via FedEx Overnight or USPS
                      Express
                    </li>
                    <li>
                      <strong>Shipping Cost:</strong> Calculated at checkout based on weight and
                      destination
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-heading text-lg font-semibold text-charcoal mb-2">
                    International Shipping
                  </h3>
                  <p className="text-text-gray leading-relaxed mb-2">
                    International shipping is available to select countries. Shipping times vary by
                    destination:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-charcoal ml-4">
                    <li>Canada: 5-10 business days</li>
                    <li>Europe: 7-14 business days</li>
                    <li>Other countries: 10-21 business days</li>
                  </ul>
                  <p className="text-charcoal leading-relaxed mt-4 p-4 bg-taupe border-l-4 border-stone rounded">
                    <strong>Important:</strong> International customers are responsible for ensuring
                    compliance with their local import and research laws. Some countries may have
                    restrictions on importing research peptides. Please check your local regulations
                    before ordering.
                  </p>
                </div>
              </div>
            </section>

            {/* Packaging and Storage */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Packaging and Storage
              </h2>
              <p className="text-text-gray leading-relaxed mb-4">
                Peptides are shipped in appropriate packaging to maintain stability:
              </p>
              <ul className="list-disc list-inside space-y-2 text-charcoal ml-4">
                <li>
                  Products are typically shipped freeze-dried (lyophilized) in sealed vials
                </li>
                <li>
                  Temperature-sensitive items may include cool packs or cold chain packaging
                </li>
                <li>
                  All shipments use sturdy packaging to prevent damage during transit
                </li>
                <li>
                  Products are labeled with storage requirements (e.g., -20°C, refrigerated)
                </li>
              </ul>
              <p className="text-charcoal leading-relaxed mt-4 p-4 bg-taupe border-l-4 border-stone rounded">
                <strong>Storage Note:</strong> Upon receiving your order, store products according to the
                provided storage requirements. For laboratory storage conditions only. Improper storage
                may affect product stability and research results.
              </p>
            </section>

            {/* Delivery Times */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Delivery Times
              </h2>
              <p className="text-charcoal leading-relaxed">
                Delivery times are estimates and begin after your order is processed and shipped. Processing
                typically takes 1-2 business days. Delivery may be delayed due to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-text-gray mt-2 ml-4">
                <li>Weather conditions or natural disasters</li>
                <li>Customs delays (international orders)</li>
                <li>Holidays or peak shipping periods</li>
                <li>Incorrect or incomplete shipping addresses</li>
              </ul>
            </section>

            {/* Tracking */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Order Tracking
              </h2>
              <p className="text-charcoal leading-relaxed">
                Once your order ships, you will receive a tracking number via email. You can use this
                number to track your shipment through the carrier's website. If you have questions about
                your shipment, please contact us through our{' '}
                <Link href="/contact" className="text-charcoal hover:text-charcoal/80 underline underline-offset-2">
                  contact page
                </Link>
                .
              </p>
            </section>

            {/* Returns and Refunds */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Returns and Refunds
              </h2>
              <div className="p-6 bg-taupe border-l-4 border-stone rounded">
                <p className="text-charcoal leading-relaxed font-semibold mb-4">
                  Returns are limited due to the nature of research materials.
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">No Returns on Opened Products</h3>
                    <p className="text-charcoal leading-relaxed">
                      We cannot accept returns on opened products or products that have been used,
                      as this compromises product integrity and safety.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Defective Products</h3>
                    <p className="text-charcoal leading-relaxed">
                      If you receive a defective product, please contact us within 3 business days of
                      delivery. We will require written notice and may request photos or documentation.
                      If the defect is confirmed, we will replace the product at no additional cost.
                      Replacement shipping costs are handled on a case-by-case basis.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Unopened Products</h3>
                    <p className="text-charcoal leading-relaxed">
                      Unopened products in original packaging may be eligible for return within 14 days
                      of delivery, subject to a restocking fee. Contact us before returning any product.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Return Shipping</h3>
                    <p className="text-charcoal leading-relaxed">
                      All return shipping costs are the responsibility of the customer, unless the return
                      is due to our error or a defective product.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Lost or Damaged Packages */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Lost or Damaged Packages
              </h2>
              <p className="text-charcoal leading-relaxed">
                If your package is lost or damaged during shipping, please contact us immediately. We will
                work with the shipping carrier to resolve the issue. In most cases, we will replace lost
                or damaged items at no additional cost to you.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-charcoal mb-4 border-b border-taupe pb-3">
                Questions About Shipping
              </h2>
              <p className="text-charcoal leading-relaxed">
                If you have questions about shipping, delivery, or returns, please contact us through our{' '}
                <Link href="/contact" className="text-charcoal hover:text-charcoal/80 underline underline-offset-2">
                  contact page
                </Link>
                .
              </p>
            </section>

            {/* Last Updated */}
            <section className="pt-8 border-t border-taupe">
              <p className="text-sm text-stone">Last updated: December 2025</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

