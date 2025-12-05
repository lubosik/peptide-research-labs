import { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for Peptide Research Labs - How we collect and use your data.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="bg-neutral-light min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-heading text-4xl font-bold text-accent-gray mb-8">
            Privacy Policy
          </h1>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-text-gray leading-relaxed">
                Peptide Research Labs ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your
                information when you visit our website or make a purchase.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-heading text-lg font-semibold text-accent-gray mb-2">
                    Personal Information
                  </h3>
                  <p className="text-text-gray leading-relaxed">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-text-gray mt-2 ml-4">
                    <li>Name and contact information (email, phone, address)</li>
                    <li>Payment information (processed securely through third-party processors)</li>
                    <li>Order history and purchase preferences</li>
                    <li>Age verification information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-heading text-lg font-semibold text-accent-gray mb-2">
                    Automatically Collected Information
                  </h3>
                  <p className="text-text-gray leading-relaxed">
                    When you visit our website, we automatically collect certain information about your
                    device and browsing behavior, including:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-text-gray mt-2 ml-4">
                    <li>IP address and location data</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                How We Use Your Information
              </h2>
              <p className="text-text-gray leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-gray ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our website and user experience</li>
                <li>Comply with legal obligations and prevent fraud</li>
                <li>Verify age and research-use-only compliance</li>
              </ul>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-text-gray leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our website and
                store certain information. Cookies are small data files stored on your device.
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="text-heading text-lg font-semibold text-accent-gray mb-2">
                    Types of Cookies We Use
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-text-gray ml-4">
                    <li>
                      <strong>Essential Cookies:</strong> Required for the website to function properly
                      (e.g., cart functionality, age verification)
                    </li>
                    <li>
                      <strong>Analytics Cookies:</strong> Help us understand how visitors use our website
                      (e.g., Google Analytics)
                    </li>
                    <li>
                      <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and
                      track campaign effectiveness
                    </li>
                  </ul>
                </div>
                <p className="text-text-gray leading-relaxed mt-4">
                  You can control cookies through your browser settings. However, disabling certain
                  cookies may limit your ability to use some features of our website.
                </p>
              </div>
            </section>

            {/* Analytics */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                Analytics
              </h2>
              <p className="text-text-gray leading-relaxed">
                We use analytics services, such as Google Analytics, to help us understand how visitors
                interact with our website. These services may use cookies and other tracking technologies
                to collect information about your use of our website. This information is used to
                compile reports and help us improve our website.
              </p>
              <p className="text-text-gray leading-relaxed mt-4">
                You can opt out of Google Analytics by installing the Google Analytics Opt-out Browser
                Add-on, available at{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark"
                >
                  https://tools.google.com/dlpage/gaoptout
                </a>
                .
              </p>
            </section>

            {/* GDPR Compliance */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                GDPR Compliance (European Users)
              </h2>
              <p className="text-text-gray leading-relaxed mb-4">
                If you are located in the European Economic Area (EEA), you have certain data protection
                rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-gray ml-4">
                <li>
                  <strong>Right to Access:</strong> You can request copies of your personal data
                </li>
                <li>
                  <strong>Right to Rectification:</strong> You can request correction of inaccurate data
                </li>
                <li>
                  <strong>Right to Erasure:</strong> You can request deletion of your personal data
                </li>
                <li>
                  <strong>Right to Restrict Processing:</strong> You can request limitation of data
                  processing
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> You can request transfer of your data
                </li>
                <li>
                  <strong>Right to Object:</strong> You can object to processing of your personal data
                </li>
              </ul>
              <p className="text-text-gray leading-relaxed mt-4">
                To exercise these rights, please contact us through our{' '}
                <Link href="/contact" className="text-primary hover:text-primary-dark">
                  contact page
                </Link>
                .
              </p>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                Data Sharing and Disclosure
              </h2>
              <p className="text-text-gray leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-gray ml-4">
                <li>
                  <strong>Service Providers:</strong> Third-party companies that help us operate our
                  website and process orders (e.g., payment processors, shipping companies)
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a merger, acquisition, or
                  sale of assets
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                Data Security
              </h2>
              <p className="text-text-gray leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal
                information. However, no method of transmission over the Internet or electronic storage
                is 100% secure. While we strive to protect your data, we cannot guarantee absolute
                security.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                Children's Privacy
              </h2>
              <p className="text-text-gray leading-relaxed">
                Our website is not intended for individuals under 18 years of age. We do not knowingly
                collect personal information from children. If you are a parent or guardian and believe
                your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-text-gray leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-heading text-2xl font-bold text-accent-gray mb-4">
                Contact Us
              </h2>
              <p className="text-text-gray leading-relaxed">
                If you have questions about this Privacy Policy, please contact us through our{' '}
                <Link href="/contact" className="text-primary hover:text-primary-dark">
                  contact page
                </Link>
                .
              </p>
            </section>

            {/* Last Updated */}
            <section className="pt-8 border-t border-gray-200">
              <p className="text-sm text-text-gray">Last updated: December 2025</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

