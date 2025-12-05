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
    <div className="bg-white border-b-2 border-primary py-3 overflow-hidden relative">
      <div className="flex whitespace-nowrap animate-scroll-left">
        {/* Animated scrolling text - multiple copies for seamless infinite loop */}
        <span className="text-sm text-accent-gray font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-accent-gray font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-accent-gray font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-accent-gray font-semibold mx-8">
          {complianceText}
        </span>
        <span className="text-sm text-accent-gray font-semibold mx-8">
          {complianceText}
        </span>
      </div>
    </div>
  );
}

