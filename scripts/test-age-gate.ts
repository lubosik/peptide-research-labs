/**
 * Age Gate Validation Script
 * 
 * Validates that age gate modal is properly implemented
 * with session storage and required confirmations.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

function validateAgeGate() {
  console.log('🔍 Validating Age Gate Implementation...\n');

  const ageGateFile = join(process.cwd(), 'components/compliance/AgeGateModal.tsx');
  const content = readFileSync(ageGateFile, 'utf-8');

  const checks = [
    {
      name: 'Age Gate Text Placeholder Present',
      test: content.includes('[AGE_GATE_TEXT]'),
      required: true,
    },
    {
      name: 'Session Storage Check',
      test: /sessionStorage.*ageGate|ageGate.*sessionStorage/i.test(content),
      required: true,
    },
    {
      name: '18+ Confirmation',
      test: /18|eighteen|age.*18/i.test(content),
      required: true,
    },
    {
      name: 'Laboratory Research Confirmation',
      test: /laboratory.*research|research.*only|laboratory.*use/i.test(content),
      required: true,
    },
    {
      name: 'I Agree Button',
      test: /I Agree|agree.*button/i.test(content),
      required: true,
    },
    {
      name: 'Exit Site Button',
      test: /Exit Site|exit.*button/i.test(content),
      required: true,
    },
    {
      name: 'Full Screen Overlay',
      test: /fixed.*inset|full.*screen|z-\[100\]/i.test(content),
      required: true,
    },
    {
      name: 'Blocks Content Until Agreed',
      test: /isOpen|!isOpen|setIsOpen/i.test(content),
      required: true,
    },
  ];

  let allPassed = true;
  console.log('📋 Age Gate Validation:\n');

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

  // Check if integrated in layout
  const layoutFile = join(process.cwd(), 'app/layout.tsx');
  const layoutContent = readFileSync(layoutFile, 'utf-8');
  const isIntegrated = layoutContent.includes('AgeGateModal');

  if (isIntegrated) {
    console.log(`✅ Age Gate integrated in root layout`);
  } else {
    console.log(`❌ Age Gate NOT integrated in root layout`);
    allPassed = false;
  }

  console.log('\n');

  if (allPassed) {
    console.log('✅ Age gate validation passed!\n');
    return true;
  } else {
    console.log('❌ Age gate validation failed!\n');
    return false;
  }
}

if (require.main === module) {
  const passed = validateAgeGate();
  process.exit(passed ? 0 : 1);
}

export { validateAgeGate };

