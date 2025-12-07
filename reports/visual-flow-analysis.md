# Visual Flow Analysis Report

**Date:** 2025-12-06
**Method:** Heuristic Eye-Tracking Simulation
**Pages Analyzed:** Homepage, Shop, Product Detail, Checkout

## Summary Metrics

| Page | Primary Focal Point % | Avg Scan Path Length | CTA Visibility Index | Cognitive Load | Avg Fixation Count | Primary CTA Hit Rate % | Avg Time to Cart (s) |
|------|----------------------|---------------------|---------------------|----------------|-------------------|----------------------|---------------------|
| Homepage | 100.0% | 7 | 0.92 | 5 | 7 | 85% | 3.5s |
| Shop | 72.2% | 7 | 0.50 | 6 | 7 | 50% | 12.5s |
| Product | 100.0% | 6 | 0.92 | 6 | 6 | 90% | 2.8s |
| Checkout | 76.0% | 4 | 0.43 | 4 | 4 | 70% | N/A |

## Page-by-Page Analysis

### Homepage

**Primary Focal Point:** (32.5%, 21.0%) - 100.0% intensity

**Key Findings:**
- Hero CTA positioned at (5%, 32%) - Above fold, left-aligned (F-pattern optimal)
- CTA Visibility Index: 0.92 (✅ Excellent)
- Primary CTA Hit Rate: 85% (✅ Excellent)
- Average Time to Cart: 3.5s
- Cognitive Load: 5 focal zones

**Scan Path:** F-pattern detected
1. Hero headline (top-left)
2. Hero CTA button
3. Best-selling products section
4. Product cards (left to right)

### Shop Page

**Primary Focal Point:** (50.0%, 14.5%) - 72.2% intensity

**Key Findings:**
- Filter bar visible at top (12% viewport) - ✅ Good visibility
- Search bar at (5%, 5%) - ✅ Optimal position
- Product cards in 3-column grid starting at (5%, 22%)
- Add to Cart buttons at (8%, 58%) - Below fold, may need optimization
- CTA Visibility Index: 0.50 (❌ Needs Improvement)
- Primary CTA Hit Rate: 50% (❌ Needs Improvement)

**Scan Path:** F-pattern with filter interaction
1. Search bar
2. Filter bar
3. Product grid (left to right, top to bottom)

### Product Detail Page

**Primary Focal Point:** (27.5%, 11.0%) - 100.0% intensity

**Key Findings:**
- Product title at (5%, 8%) - ✅ Above fold
- Price at (5%, 16%) - ✅ High visibility (gold color)
- Variant selector at (5%, 24%) - ✅ Above fold
- Warehouse selector at (5%, 38%) - ✅ Above fold
- Add to Cart button at (5%, 46%) - ✅ Above fold, optimal position
- CTA Visibility Index: 0.92 (✅ Excellent)
- Primary CTA Hit Rate: 90% (✅ Excellent)
- Average Time to Cart: 2.8s

**Scan Path:** Vertical F-pattern
1. Product title
2. Price
3. Variant selector
4. Warehouse selector
5. Add to Cart button

### Checkout Page

**Primary Focal Point:** (35.0%, 50.0%) - 76.0% intensity

**Key Findings:**
- Order summary on right (70%, 15%) - ✅ Visible during form fill
- Checkout form on left (5%, 15%) - ✅ Standard layout
- Complete Order button at (5%, 80%) - ⚠️ Below fold, may need optimization
- Secure Checkout badge at (5%, 87%) - ✅ Trust signal visible
- CTA Visibility Index: 0.43 (❌ Needs Improvement)
- Primary CTA Hit Rate: 70% (⚠️ Good)

**Scan Path:** Form-filling pattern
1. Order summary (right side)
2. Form fields (top to bottom)
3. Complete Order button
4. Secure Checkout badge

## User Archetype Behaviors


### New Visitor

**Behavior:** Explores homepage, scans products, reads descriptions

**Predicted Scan Path:**
1. (10%, 20%) at 0ms
2. (15%, 35%) at 500ms
3. (20%, 70%) at 1200ms
4. (35%, 70%) at 1800ms

**Click Intent Zones:**
- (15%, 35%) - hero-cta
- (20%, 70%) - product-card

---

### Returning Buyer

**Behavior:** Direct navigation to shop, quick product selection

**Predicted Scan Path:**
1. (10%, 10%) at 0ms
2. (20%, 25%) at 300ms
3. (35%, 25%) at 600ms

**Click Intent Zones:**
- (20%, 25%) - product-card

---

### Researcher

**Behavior:** Reads descriptions, checks specifications, reviews articles

**Predicted Scan Path:**
1. (5%, 10%) at 0ms
2. (5%, 20%) at 800ms
3. (5%, 30%) at 1600ms
4. (5%, 40%) at 2400ms

**Click Intent Zones:**
- (5%, 30%) - variant-selector

---

### Bulk Purchaser

**Behavior:** Focuses on price, warehouse options, quantity selectors

**Predicted Scan Path:**
1. (5%, 16%) at 0ms
2. (5%, 24%) at 400ms
3. (5%, 38%) at 800ms
4. (5%, 46%) at 1200ms

**Click Intent Zones:**
- (5%, 16%) - price
- (5%, 38%) - warehouse-selector

---

### Mobile User

**Behavior:** Vertical scanning, taps on large touch targets

**Predicted Scan Path:**
1. (50%, 10%) at 0ms
2. (50%, 25%) at 600ms
3. (50%, 40%) at 1200ms
4. (50%, 60%) at 1800ms

**Click Intent Zones:**
- (50%, 60%) - floating-add-to-cart


## Cognitive Load Analysis

**Average Cognitive Load:** 5.3 focal zones per page

**Interpretation:**
- Low cognitive load: < 5 focal zones
- Medium cognitive load: 5-8 focal zones
- High cognitive load: > 8 focal zones

**Current Status:** ⚠️ Medium cognitive load

## Recommendations

See `/docs/eye-tracking-recommendations.md` for detailed recommendations based on these findings.

## Heatmap Data

Heatmap data has been generated for each page. Visual heatmaps can be created from the focal point data:
- Homepage: 5 focal points
- Shop: 6 focal points
- Product: 6 focal points
- Checkout: 4 focal points


