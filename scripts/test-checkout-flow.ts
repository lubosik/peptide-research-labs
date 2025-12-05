/**
 * Checkout Flow Validation Script
 * 
 * Validates that checkout flow requires RUO agreement
 * and cannot proceed without confirmation.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

function validateCheckoutFlow() {
  console.log('🔍 Validating Checkout Flow...\n');

  const checkoutFile = join(process.cwd(), 'app/checkout/page.tsx');
  const content = readFileSync(checkoutFile, 'utf-8');

  const checks = [
    {
      name: 'RUO Agreement Checkbox Present',
      test: /ruoAgreed|ruo.*agree|research.*use.*only.*agree/i.test(content),
      required: true,
    },
    {
      name: 'Checkbox is Required',
      test: /required.*ruo|ruo.*required|checkbox.*required/i.test(content) || content.includes('required'),
      required: true,
    },
    {
      name: 'Submit Button Disabled Without Agreement',
      test: /disabled.*ruo|!ruoAgreed|ruoAgreed.*disabled/i.test(content),
      required: true,
    },
    {
      name: 'Validation Prevents Submission',
      test: /if.*!ruoAgreed|validate.*ruo|ruo.*validation/i.test(content),
      required: true,
    },
    {
      name: 'RUO Clause Placeholder Present',
      test: content.includes('[RUO_CLAUSE]'),
      required: true,
    },
    {
      name: 'Liability Limits Placeholder Present',
      test: content.includes('[LIABILITY_LIMITS]'),
      required: true,
    },
    {
      name: 'Buyer Responsibility Placeholder Present',
      test: content.includes('[BUYER_RESPONSIBILITY]'),
      required: true,
    },
  ];

  let allPassed = true;
  console.log('📋 Checkout Flow Validation:\n');

  checks.forEach((check) => {
    if (check.test) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      if (check.required) {
        allPassed = false;
      }
    }
  });

  console.log('\n');

  if (allPassed) {
    console.log('✅ Checkout flow validation passed!\n');
    return true;
  } else {
    console.log('❌ Checkout flow validation failed!\n');
    return false;
  }
}

if (require.main === module) {
  const passed = validateCheckoutFlow();
  process.exit(passed ? 0 : 1);
}

export { validateCheckoutFlow };

