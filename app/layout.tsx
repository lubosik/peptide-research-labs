import type { Metadata } from 'next';
import { Lato, Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ComplianceBanner from '@/components/layout/ComplianceBanner';
import { CartProvider } from '@/lib/context/CartContext';
import { WarehouseProvider } from '@/lib/context/WarehouseContext';
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
    default: 'Vici Peptides',
    template: '%s | Vici Peptides',
  },
  description: 'Research peptides for laboratory use only. Advancing scientific discovery through high-purity biochemical reagents.',
  keywords: ['research peptides', 'laboratory reagents', 'biochemical compounds', 'peptide research'],
  authors: [{ name: 'Vici Peptides' }],
  creator: 'Vici Peptides',
  publisher: 'Vici Peptides',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Vici Peptides',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/vici-favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/vici-favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
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
        <WarehouseProvider>
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
        </WarehouseProvider>
      </body>
    </html>
  );
}

