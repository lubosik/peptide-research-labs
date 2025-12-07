'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/context/CartContext';

export default function FixedCartIcon() {
  const [isVisible, setIsVisible] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      // Show cart icon after scrolling 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Link
      href="/cart"
      className="fixed top-24 right-6 z-50 p-3 bg-luxury-gold text-primary-black rounded-full shadow-lg hover:bg-accent-gold-light transition-all duration-400 hover:scale-110"
      aria-label="Shopping cart"
      style={{
        boxShadow: '0 4px 12px rgba(245, 214, 123, 0.4)',
      }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-black text-luxury-gold text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-luxury-gold">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}

