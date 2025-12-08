'use client';

import { useState, useEffect } from 'react';

export default function MarketingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Check if popup has been dismissed in this session
    const dismissed = sessionStorage.getItem('marketingPopupDismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Check if age gate has been agreed to
    const ageGateAgreed = sessionStorage.getItem('ageGateAgreed');
    if (ageGateAgreed !== 'true') {
      return; // Don't show until age gate is passed
    }

    // Show popup after 30 seconds or on scroll (whichever comes first)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000); // 30 seconds

    // Also show on scroll (after user scrolls 25% of page)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 25 && !isDismissed) {
        setIsOpen(true);
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDismissed]);

  const handleClose = () => {
    setIsOpen(false);
    setIsDismissed(true);
    sessionStorage.setItem('marketingPopupDismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Subscribe to ConvertKit newsletter
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Thank you for subscribing! Check your email for your discount code.');
        handleClose();
      } else {
        // If already subscribed, still show success
        if (data.alreadySubscribed) {
          alert('You are already subscribed! Check your email for your discount code.');
          handleClose();
        } else {
          alert('There was an error subscribing. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      alert('There was an error subscribing. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-text-gray hover:text-accent-gray transition-colors"
          aria-label="Close popup"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-heading text-2xl font-bold text-accent-gray mb-2">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-text-gray mb-6">
            Get exclusive discounts and stay updated on the latest research peptides and laboratory supplies.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {/* No Thanks Link */}
          <button
            onClick={handleClose}
            className="mt-4 text-sm text-text-gray hover:text-primary transition-colors"
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}

