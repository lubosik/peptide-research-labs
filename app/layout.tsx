import type { Metadata } from 'next';
import { Lato, Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComplianceBanner from '@/components/layout/ComplianceBanner';
import { CartProvider } from '@/lib/context/CartContext';
import { ToastProvider } from '@/components/ui/ToastProvider';
import AgeGateModal from '@/components/compliance/AgeGateModal';
import MarketingPopup from '@/components/compliance/MarketingPopup';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/structured-data';

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
});

const montserrat = Montserrat({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Peptide Research Labs',
    template: '%s | Peptide Research Labs',
  },
  description: 'Research peptides for laboratory use only. Advancing scientific discovery through high-purity biochemical reagents.',
  keywords: ['research peptides', 'laboratory reagents', 'biochemical compounds', 'peptide research'],
  authors: [{ name: 'Peptide Research Labs' }],
  creator: 'Peptide Research Labs',
  publisher: 'Peptide Research Labs',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Peptide Research Labs',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" className={`${lato.variable} ${montserrat.variable}`}>
      <head>
        <link
          rel="icon"
          href="/images/Peptide_Research_Labs_symbol-removebg-preview.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/images/Peptide_Research_Labs_symbol-removebg-preview.png"
        />
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <ToastProvider>
            <AgeGateModal />
            <MarketingPopup />
            <Header />
            <ComplianceBanner />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}

