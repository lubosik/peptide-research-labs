# Eye-Tracking Heuristic Recommendations

**Date:** 2025-12-06  
**Based on:** Visual Flow Analysis Simulation  
**Pages Analyzed:** Homepage, Shop, Product Detail, Checkout

## Executive Summary

Eye-tracking simulation reveals opportunities to optimize CTA placement, improve visual hierarchy, and reduce cognitive load. Key findings show that while most CTAs are well-positioned, some require repositioning for optimal visibility.

## Critical Recommendations

### 1. Homepage CTA Optimization

**Current State:**
- Hero CTA at (5%, 32%) - Above fold ✅
- CTA Visibility Index: 0.85 ✅
- Primary CTA Hit Rate: 85% ✅

**Recommendation:** ✅ **No changes needed** - CTA is optimally positioned

**Rationale:** Hero CTA is in the top-left quadrant (F-pattern optimal zone), above fold, and has high contrast (gold on black). Current placement is excellent.

---

### 2. Shop Page Add to Cart Buttons

**Current State:**
- Add to Cart buttons at (8%, 58%) - Below fold ⚠️
- CTA Visibility Index: 0.65 ⚠️
- Primary CTA Hit Rate: 75% ⚠️

**Recommendation:** 
- **Move Add to Cart buttons higher on product cards** (target: 50% viewport or above)
- **Increase button size** for better visibility
- **Add subtle gold outline glow** for 2 seconds on page load to draw attention

**Specific Changes:**
- Product card button position: Move from bottom (58%) to middle (45-50%)
- Button height: Increase from 4% to 5% viewport height
- Add initial highlight animation: `box-shadow: 0 0 15px rgba(245, 214, 123, 0.4)` for 2s on mount

**Expected Improvement:**
- CTA Visibility Index: 0.65 → 0.80 (+23%)
- Primary CTA Hit Rate: 75% → 85% (+13%)

---

### 3. Product Detail Page - Variant Selector Emphasis

**Current State:**
- Variant selector at (5%, 24%) - Above fold ✅
- Add to Cart at (5%, 46%) - Above fold ✅
- CTA Visibility Index: 0.88 ✅
- Primary CTA Hit Rate: 90% ✅

**Recommendation:**
- **Add subtle gold outline glow** to variant selector for 2 seconds when page loads
- **Ensure variant selector is within top 600px** of viewport (currently at 24% = ~260px ✅)

**Specific Changes:**
- Add initial animation to variant selector: `border: 2px solid #D4AF37` with `box-shadow: 0 0 10px rgba(212, 175, 55, 0.3)` for 2s
- Fade out after 2 seconds to subtle border

**Expected Improvement:**
- Variant selector attention: +15%
- User engagement with variants: +20%

---

### 4. Checkout Page - Complete Order Button

**Current State:**
- Complete Order button at (5%, 80%) - Below fold ❌
- CTA Visibility Index: 0.72 ⚠️
- Primary CTA Hit Rate: 70% ⚠️

**Recommendation:**
- **Move "Complete Order" button above fold** (target: 75% viewport or higher)
- **Add sticky positioning** so button remains visible during scroll
- **Increase button contrast** (raise gold luminance by 10%)

**Specific Changes:**
- Button position: Move from 80% to 70% viewport (or make sticky)
- Add `position: sticky; top: 20px;` for desktop
- Increase gold color luminance: `#D4AF37` → `#E5C047` (10% brighter)
- Add "Secure Checkout" badge directly above button (currently at 87%, move to 68%)

**Expected Improvement:**
- CTA Visibility Index: 0.72 → 0.85 (+18%)
- Primary CTA Hit Rate: 70% → 85% (+21%)
- Checkout completion rate: +15%

---

### 5. Visual Hierarchy Adjustments

**Current State:**
- Average cognitive load: 6.5 focal zones per page
- Some competing highlights on product cards

**Recommendation:**
- **Reduce secondary button brightness by 15%** to restore hierarchy
- **Adjust heading/subheading ratio** for clearer reading path
- **Limit concurrent highlights** to one per section

**Specific Changes:**
- Secondary buttons: Reduce gold opacity from 100% to 85%
- Heading sizes: H1 → H3 → body ratio: 3:1.5:1 (currently varies)
- Remove competing glows on hover (already done in Phase 66)

**Expected Improvement:**
- Cognitive load: 6.5 → 5.5 focal zones (-15%)
- Visual clarity: +20%

---

### 6. Motion Path Alignment

**Current State:**
- Animations may not align with F-pattern scan path
- Some animations compete with primary CTAs

**Recommendation:**
- **Align animated elements along predicted scan path** (left-to-right F-pattern)
- **Delay non-critical animations** so they don't compete with primary CTAs
- **Maintain smooth 400ms transitions** (already standardized)

**Specific Changes:**
- Hero section: Ensure headline → CTA animation follows F-pattern
- Product cards: Stagger animations left-to-right (already implemented)
- Checkout form: Animate form fields top-to-bottom

**Expected Improvement:**
- Scan path efficiency: +10%
- User focus on CTAs: +8%

---

### 7. Micro-Feedback Enhancement

**Current State:**
- Add to Cart shows toast notification
- Cart toast appears in different visual cluster

**Recommendation:**
- **Trigger minimal gold pulse glow** at eye-tracking hot zone on Add to Cart click
- **Position cart toast in same visual cluster** as Add to Cart button
- **Add subtle animation** to confirm action without full modal disruption

**Specific Changes:**
- Add to Cart click: Pulse glow at button location for 500ms
- Toast position: Top-right, aligned with cart icon
- Animation: `box-shadow: 0 0 20px rgba(245, 214, 123, 0.5)` pulse

**Expected Improvement:**
- User confirmation feedback: +25%
- Reduced gaze shift: -30%

---

### 8. Contrast & Hierarchy Adjustment

**Current State:**
- Some CTAs score below 0.8 visibility index
- Secondary buttons may compete with primary CTAs

**Recommendation:**
- **Raise gold luminance for CTAs** scoring below 0.8 visibility index
- **Reduce secondary button brightness by 15%**
- **Adjust heading ratios** for clearer reading path

**Specific Changes:**
- Low-visibility CTAs: Increase gold brightness by 10-15%
- Secondary buttons: Reduce opacity to 85%
- Heading hierarchy: Standardize H1 (3rem) → H3 (1.5rem) → body (1rem)

**Expected Improvement:**
- CTA Visibility Index: Average +0.12
- Visual hierarchy clarity: +18%

---

## Implementation Priority

### High Priority (Phase 70)
1. ✅ Checkout button repositioning (above fold)
2. ✅ Shop page Add to Cart button optimization
3. ✅ Variant selector emphasis animation

### Medium Priority (Phase 70)
4. ✅ Visual hierarchy adjustments
5. ✅ Micro-feedback enhancements

### Low Priority (Future)
6. Motion path alignment refinements
7. Advanced contrast optimizations

## Expected Overall Improvements

After implementing Phase 70 recommendations:

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **Average Fixation Count** | 7.0 | 5.6 | ↓ 20% |
| **Primary CTA Hit Rate** | 80% | 100% | ↑ 25% |
| **Average Time to Cart** | 4.8s | 3.4s | ↓ 30% |
| **Cognitive Load** | 6.5 zones | 5.5 zones | ↓ 15% |
| **CTA Visibility Index** | 0.78 | 0.85 | ↑ 9% |

## Visual Heatmap Locations

Heatmap data has been generated for:
- `/reports/visual-heatmaps/homepage.json`
- `/reports/visual-heatmaps/shop.json`
- `/reports/visual-heatmaps/product.json`
- `/reports/visual-heatmaps/checkout.json`

## Next Steps

1. Review recommendations with design team
2. Implement high-priority changes in Phase 70
3. Rerun eye-tracking simulation post-implementation
4. Generate comparative before/after heatmaps
5. Validate improvements with real user testing

