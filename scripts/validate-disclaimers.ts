/**
 * Disclaimer Validation Script
 * 
 * Validates that all required disclaimers are present on the correct pages.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface DisclaimerRequirement {
  page: string;
  placeholders: string[];
  description: string;
}

const DISCLAIMER_REQUIREMENTS: DisclaimerRequirement[] = [
  {
    page: 'components/layout/ComplianceBanner.tsx',
    placeholders: ['[COMPLIANCE_BANNER_TEXT]'],
    description: 'Compliance banner component (rendered on all pages)',
  },
  {
    page: 'app/shop/page.tsx',
    placeholders: ['[RUO_DISCLAIMER]'],
    description: 'Shop page RUO disclaimer on product cards',
  },
  {
    page: 'app/products/[slug]/page.tsx',
    placeholders: ['[NOT_FDA_APPROVED]', '[NO_MEDICAL_ADVICE]', '[USE_AT_OWN_RISK]'],
    description: 'Product detail page disclaimers',
  },
  {
    page: 'app/cart/page.tsx',
    placeholders: ['[RUO_DISCLAIMER]'],
    description: 'Cart page RUO disclaimer',
  },
  {
    page: 'app/checkout/page.tsx',
    placeholders: ['[RUO_CLAUSE]', '[LIABILITY_LIMITS]', '[BUYER_RESPONSIBILITY]'],
    description: 'Checkout page compliance placeholders',
  },
  {
    page: 'app/checkout/confirmation/page.tsx',
    placeholders: [
      '[NOT_FDA_APPROVED]',
      '[NO_MEDICAL_ADVICE]',
      '[USE_AT_OWN_RISK]',
      '[RUO_CLAUSE]',
      '[LIABILITY_LIMITS]',
    ],
    description: 'Confirmation page disclaimers',
  },
  {
    page: 'app/faq/page.tsx',
    placeholders: ['[NO_MEDICAL_ADVICE]'],
    description: 'FAQ page medical advice disclaimer',
  },
  {
    page: 'app/blog/[slug]/page.tsx',
    placeholders: ['[RESEARCH_REFERENCE_ONLY]'],
    description: 'Blog article research reference disclaimer',
  },
  {
    page: 'components/compliance/AgeGateModal.tsx',
    placeholders: ['[AGE_GATE_TEXT]'],
    description: 'Age gate compliance text',
  },
  {
    page: 'components/layout/Footer.tsx',
    placeholders: ['[COMPLIANCE_BANNER_TEXT]'],
    description: 'Footer compliance disclaimer',
  },
];

function validateDisclaimers() {
  console.log('🔍 Validating Disclaimers...\n');

  const baseDir = process.cwd();
  let allPassed = true;
  const results: Array<{ page: string; passed: boolean; missing: string[] }> = [];

  for (const requirement of DISCLAIMER_REQUIREMENTS) {
    const filePath = join(baseDir, requirement.page);
    let passed = true;
    const missing: string[] = [];

    try {
      const content = readFileSync(filePath, 'utf-8');

      for (const placeholder of requirement.placeholders) {
        if (!content.includes(placeholder)) {
          passed = false;
          missing.push(placeholder);
        }
      }

      results.push({
        page: requirement.page,
        passed,
        missing,
      });

      if (!passed) {
        allPassed = false;
      }
    } catch (error) {
      console.error(`❌ Error reading ${requirement.page}: ${error}`);
      allPassed = false;
      results.push({
        page: requirement.page,
        passed: false,
        missing: requirement.placeholders,
      });
    }
  }

  // Print results
  console.log('📋 Disclaimer Validation Results:\n');

  results.forEach((result) => {
    if (result.passed) {
      console.log(`✅ ${result.page}`);
    } else {
      console.log(`❌ ${result.page}`);
      console.log(`   Missing: ${result.missing.join(', ')}`);
    }
  });

  console.log('\n');

  if (allPassed) {
    console.log('✅ All disclaimers are present!\n');
    return true;
  } else {
    console.log('❌ Some disclaimers are missing!\n');
    return false;
  }
}

if (require.main === module) {
  const passed = validateDisclaimers();
  process.exit(passed ? 0 : 1);
}

export { validateDisclaimers, DISCLAIMER_REQUIREMENTS };

