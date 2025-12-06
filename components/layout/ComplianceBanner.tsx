'use client';

import { getComplianceText } from '@/lib/utils/compliance-text';

/**
 * Compliance Banner Component
 * 
 * Persistent disclaimer banner that appears directly under the header.
 * Animated scrolling text in an infinite loop.
 */
export default function ComplianceBanner() {
  const complianceText = getComplianceText('COMPLIANCE_BANNER_TEXT');

  return (
    <div 
      className="border-b border-luxury-gold/20 py-3 overflow-hidden relative"
      style={{
        background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.1) 0%, rgba(245, 214, 123, 0.05) 50%, rgba(212, 175, 55, 0.1) 100%)',
        backgroundSize: '200% 100%',
        animation: 'gradientShift 6s linear infinite',
      }}
    >
      <div className="flex whitespace-nowrap animate-scroll-left">
        {/* Animated scrolling text - multiple copies for seamless infinite loop */}
        <span className="text-sm text-accent-gold-light font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-accent-gold-light font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-accent-gold-light font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-accent-gold-light font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-accent-gold-light font-semibold mx-8">
          {complianceText}
        </span>
      </div>
    </div>
  );
}

