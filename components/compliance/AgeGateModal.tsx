'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getComplianceText } from '@/lib/utils/compliance-text';

export default function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Check if user has already agreed in this session
    const sessionAgreed = sessionStorage.getItem('ageGateAgreed');
    if (sessionAgreed === 'true') {
      setIsOpen(false);
      return;
    }

    // Show modal if not agreed
    setIsOpen(true);
  }, []);

  const handleAgree = () => {
    setHasAgreed(true);
    sessionStorage.setItem('ageGateAgreed', 'true');
    setIsOpen(false);
  };

  const handleExit = () => {
    // Redirect to external site or show exit message
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-8 md:p-12 relative">
        {/* Close button (disabled - user must choose) */}
        
        {/* Header */}
        <div className="text-center mb-8">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-heading text-3xl font-bold text-accent-gray mb-4">
            Age Verification Required
          </h2>
          <p className="text-lg text-text-gray">
            You must be 18 years or older to access this website.
          </p>
        </div>

        {/* Compliance Text */}
        <div className="mb-8 p-6 bg-secondary/10 border-2 border-secondary rounded-lg">
          <p className="text-sm text-text-gray leading-relaxed mb-4">
            {getComplianceText('AGE_GATE_TEXT')}
          </p>
          <div className="space-y-3">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-text-gray">
                I confirm I am 18 years or older
              </p>
            </div>
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-text-gray">
                I am purchasing strictly for laboratory research purposes only
              </p>
            </div>
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-text-gray">
                I understand these products are not for human or veterinary use
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAgree}
            className="flex-1 bg-primary text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            I Agree
          </button>
          <button
            onClick={handleExit}
            className="flex-1 bg-gray-200 text-accent-gray py-4 px-8 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Exit Site
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-text-gray text-center mt-6">
          By clicking "I Agree", you confirm your understanding and acceptance of our terms.
        </p>
      </div>
    </div>
  );
}

