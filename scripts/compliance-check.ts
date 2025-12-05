/**
 * Compliance Check Script
 * 
 * Validates that all pages contain required disclaimers and
 * checks for banned phrases in content.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Banned phrases that must NOT appear in content
const BANNED_PHRASES = [
  'muscle growth',
  'fat loss',
  'lean mass',
  'GH boost',
  'recovery enhancer',
  'bodybuilding',
  'weight loss',
  'performance enhancement',
  'athletic performance',
  'fitness',
  'health benefits',
  'therapeutic use',
  'medical treatment',
  'dietary supplement',
];

// Required compliance placeholders
const REQUIRED_PLACEHOLDERS = [
  '[COMPLIANCE_BANNER_TEXT]',
  '[RUO_DISCLAIMER]',
  '[NOT_FDA_APPROVED]',
  '[NO_MEDICAL_ADVICE]',
  '[USE_AT_OWN_RISK]',
  '[AGE_GATE_TEXT]',
  '[RESEARCH_REFERENCE_ONLY]',
  '[RUO_CLAUSE]',
  '[LIABILITY_LIMITS]',
  '[BUYER_RESPONSIBILITY]',
];

// Pages that must have specific placeholders
const PAGE_REQUIREMENTS: Record<string, string[]> = {
  // app/page.tsx doesn't need [COMPLIANCE_BANNER_TEXT] - it's in ComplianceBanner component
  'app/shop/page.tsx': ['[RUO_DISCLAIMER]'],
  'app/products/[slug]/page.tsx': ['[NOT_FDA_APPROVED]', '[NO_MEDICAL_ADVICE]', '[USE_AT_OWN_RISK]'],
  'app/cart/page.tsx': ['[RUO_DISCLAIMER]'],
  'app/checkout/page.tsx': ['[RUO_CLAUSE]', '[LIABILITY_LIMITS]', '[BUYER_RESPONSIBILITY]'],
  'app/checkout/confirmation/page.tsx': [
    '[NOT_FDA_APPROVED]',
    '[NO_MEDICAL_ADVICE]',
    '[USE_AT_OWN_RISK]',
    '[RUO_CLAUSE]',
    '[LIABILITY_LIMITS]',
  ],
  'app/faq/page.tsx': ['[NO_MEDICAL_ADVICE]'],
  'app/blog/[slug]/page.tsx': ['[RESEARCH_REFERENCE_ONLY]'],
  'components/compliance/AgeGateModal.tsx': ['[AGE_GATE_TEXT]'],
  'components/layout/ComplianceBanner.tsx': ['[COMPLIANCE_BANNER_TEXT]'],
  'components/layout/Footer.tsx': ['[COMPLIANCE_BANNER_TEXT]'],
};

interface CheckResult {
  file: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

function checkFile(filePath: string): CheckResult {
  const result: CheckResult = {
    file: filePath,
    passed: true,
    errors: [],
    warnings: [],
  };

  try {
    const content = readFileSync(filePath, 'utf-8');

    // Check for banned phrases
    for (const phrase of BANNED_PHRASES) {
      const regex = new RegExp(phrase, 'gi');
      const matches = content.match(regex);
      if (matches) {
        // Allow in comments, compliance guide references, and negative contexts
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (regex.test(line)) {
            // Check if it's in a comment or string literal that's acceptable
            const isComment = line.trim().startsWith('//') || line.trim().startsWith('*');
            const isInComplianceDoc = line.includes('compliance-guidelines') || line.includes('PHASE');
            
            // Allow if used in negative context (NOT, are not, cannot, etc.) - this is compliance language
            const negativeContext = /(not|are not|cannot|must not|do not|should not|never|no|non-|unapproved|prohibited|forbidden|illegal)/i;
            const isNegativeContext = negativeContext.test(line);
            
            if (!isComment && !isInComplianceDoc && !isNegativeContext) {
              result.errors.push(
                `Banned phrase "${phrase}" found in ${filePath} at line ${i + 1}: ${line.trim().substring(0, 80)}`
              );
            }
          }
        }
      }
    }

    // Check for required placeholders based on file
    const relativePath = filePath.replace(process.cwd() + '/', '');
    const required = PAGE_REQUIREMENTS[relativePath];
    if (required) {
      for (const placeholder of required) {
        if (!content.includes(placeholder)) {
          result.errors.push(`Missing required placeholder: ${placeholder} in ${relativePath}`);
        }
      }
    }

    if (result.errors.length > 0) {
      result.passed = false;
    }
  } catch (error) {
    result.passed = false;
    result.errors.push(`Error reading file: ${error}`);
  }

  return result;
}

function getAllTsxFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (!file.includes('node_modules') && !file.includes('.next')) {
        getAllTsxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function runComplianceCheck() {
  console.log('🔍 Running Compliance Check...\n');

  const appDir = join(process.cwd(), 'app');
  const componentsDir = join(process.cwd(), 'components');
  const dataDir = join(process.cwd(), 'data');

  const files = [
    ...getAllTsxFiles(appDir),
    ...getAllTsxFiles(componentsDir),
    ...getAllTsxFiles(dataDir),
  ];

  const results: CheckResult[] = [];
  let totalPassed = 0;
  let totalFailed = 0;

  for (const file of files) {
    const result = checkFile(file);
    results.push(result);
    if (result.passed) {
      totalPassed++;
    } else {
      totalFailed++;
    }
  }

  // Print results
  console.log(`\n📊 Compliance Check Results:\n`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}\n`);

  const failedResults = results.filter((r) => !r.passed);
  if (failedResults.length > 0) {
    console.log('❌ Failed Files:\n');
    failedResults.forEach((result) => {
      console.log(`  ${result.file}`);
      result.errors.forEach((error) => {
        console.log(`    - ${error}`);
      });
    });
    process.exit(1);
  } else {
    console.log('✅ All compliance checks passed!\n');
    process.exit(0);
  }
}

// Run if executed directly
if (require.main === module) {
  runComplianceCheck();
}

export { runComplianceCheck, checkFile, BANNED_PHRASES, REQUIRED_PLACEHOLDERS };

