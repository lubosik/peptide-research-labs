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
      className="border-b border-taupe py-3 overflow-hidden relative bg-ivory"
      style={{
        background: 'linear-gradient(90deg, rgba(207, 199, 188, 0.15) 0%, rgba(230, 222, 212, 0.1) 50%, rgba(207, 199, 188, 0.15) 100%)',
        backgroundSize: '200% 100%',
        animation: 'gradientShift 6s linear infinite',
      }}
    >
      <div className="flex whitespace-nowrap animate-scroll-left">
        {/* Animated scrolling text - multiple copies for seamless infinite loop */}
        <span className="text-sm text-charcoal font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-charcoal font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-charcoal font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-charcoal font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-charcoal font-semibold mx-8">
          {complianceText}
        </span>
      </div>
    </div>
  );
}

