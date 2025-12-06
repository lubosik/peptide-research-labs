'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="bg-primary-black min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-secondary-charcoal rounded-lg border border-luxury-gold/30 shadow-xl p-8" style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.2)' }}>
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-luxury-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-accent-gold-light mb-4">
            Something went wrong!
          </h1>
          <p className="text-pure-white mb-6">
            We encountered an unexpected error. Please try again or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-luxury-gold text-primary-black rounded-lg font-semibold hover:bg-accent-gold-light transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-transparent border border-luxury-gold text-luxury-gold rounded-lg font-semibold hover:bg-luxury-gold hover:text-primary-black transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

