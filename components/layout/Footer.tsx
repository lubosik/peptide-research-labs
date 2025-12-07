'use client';

import Link from 'next/link';
import { getComplianceText } from '@/lib/utils/compliance-text';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const complianceText = getComplianceText('COMPLIANCE_BANNER_TEXT');

  return (
    <footer className="bg-secondary-charcoal text-pure-white mt-auto border-t border-luxury-gold/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-heading text-lg font-semibold mb-4 text-accent-gold-light">Vici Peptides</h3>
            <p className="text-sm text-pure-white mb-4">
              Advancing scientific discovery through research peptides for laboratory use only.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-heading text-lg font-semibold mb-4 text-accent-gold-light">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-heading text-lg font-semibold mb-4 text-accent-gold-light">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-pure-white hover:text-luxury-gold transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-heading text-lg font-semibold mb-4 text-accent-gold-light">Contact</h3>
            <ul className="space-y-2 text-pure-white text-sm">
              <li>
                <Link href="/contact" className="hover:text-luxury-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Disclaimer */}
        <div className="mt-8 pt-8 border-t border-luxury-gold/20">
          <p className="text-sm text-neutral-gray text-center">
            {complianceText}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-neutral-gray text-sm">
          <p>&copy; {currentYear} Vici Peptides. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

