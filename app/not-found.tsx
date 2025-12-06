import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="bg-primary-black min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-secondary-charcoal rounded-lg border border-luxury-gold/30 shadow-xl p-8" style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.2)' }}>
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-accent-gold-light mb-4">404</h1>
            <h2 className="text-2xl font-bold text-accent-gold-light mb-4">
              Page Not Found
            </h2>
          </div>
          <p className="text-pure-white mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-luxury-gold text-primary-black rounded-lg font-semibold hover:bg-accent-gold-light transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 bg-transparent border border-luxury-gold text-luxury-gold rounded-lg font-semibold hover:bg-luxury-gold hover:text-primary-black transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

