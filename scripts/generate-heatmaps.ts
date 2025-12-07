/**
 * Generate Heatmap JSON Files
 */

import { homepageAnalysis, shopAnalysis, productAnalysis, checkoutAnalysis } from './eye-tracking-simulation';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const homepage = homepageAnalysis;
const shop = shopAnalysis;
const product = productAnalysis;
const checkout = checkoutAnalysis;

const outputDir = join(process.cwd(), 'reports', 'visual-heatmaps');

// Ensure directory exists
import { mkdirSync } from 'fs';
try {
  mkdirSync(outputDir, { recursive: true });
} catch (e) {
  // Directory may already exist
}

writeFileSync(
  join(outputDir, 'homepage.json'),
  JSON.stringify(homepage.heatmap, null, 2)
);

writeFileSync(
  join(outputDir, 'shop.json'),
  JSON.stringify(shop.heatmap, null, 2)
);

writeFileSync(
  join(outputDir, 'product.json'),
  JSON.stringify(product.heatmap, null, 2)
);

writeFileSync(
  join(outputDir, 'checkout.json'),
  JSON.stringify(checkout.heatmap, null, 2)
);

console.log('Heatmap JSON files generated successfully!');

