# Chimera Order Reference Analysis

**Date:** 2024  
**Reference Site:** https://chimeraorder.lovable.app/  
**Purpose:** Analysis of warehouse selection UX and data flow for Peptide Research Labs implementation

---

## 1. Site Structure & Flow

### 1.1 Overall Architecture
- **Framework:** Appears to be a modern React-based SPA (likely Next.js or similar)
- **Navigation:** Single-page application with tab-based category navigation
- **URL Structure:** 
  - Base: `/` (Overseas Warehouse - default)
  - US Warehouse: `/us-warehouse` (dedicated route/page)
  - Product pages: Likely `/products/[slug]` pattern

### 1.2 Header & Navigation
- **Logo:** Top-left positioning
- **Warehouse Selector:** Prominent buttons in header
  - "Overseas Warehouse (Current)" - active state indicator
  - "US Warehouse" - inactive state
  - Visual distinction (flag icons or similar)
- **Social Links:** Email, Discord, Telegram, Website links
- **Category Tabs:** Horizontal tab navigation
  - Cognitive Enhancement
  - General Health
  - Muscle Growth & Recovery
  - Other / Uncategorized
  - Sexual Health
  - Weight Loss

---

## 2. Warehouse Selection Implementation

### 2.1 UI/UX Pattern

#### Header-Level Selection
- **Location:** Prominent placement in header, below logo/tagline
- **Visual Design:**
  - Two button-style toggles
  - Active state clearly indicated ("Current" label)
  - Flag icons or visual indicators for each warehouse
- **Interaction:**
  - Clicking switches entire site context
  - URL changes to `/us-warehouse` when US selected
  - Returns to `/` (or `/overseas-warehouse`) for overseas

#### Page-Level Context
- **US Warehouse Page:**
  - Dedicated hero section: "US DOMESTIC WAREHOUSE"
  - Subtitle: "Fast domestic handling with professional storage standards. Limited stock available."
  - "Back to Overseas Warehouse" button
  - Note: "💡 Combine US Warehouse items with Overseas Warehouse products in one order"
  - Link to browse Overseas Warehouse

### 2.2 Data Flow

#### State Management
- **Global Context:** Warehouse selection appears to be global state
- **Persistence:** Likely stored in:
  - URL parameter/route (`/us-warehouse` vs `/`)
  - localStorage (for persistence across sessions)
  - React Context or global state management

#### Price Calculation
- **Dynamic Pricing:** Prices update based on warehouse selection
- **Multiplier Logic:** 
  - Overseas: Base price (multiplier = 1.0)
  - US: Higher price (estimated 1.25x or similar markup)
- **Real-time Updates:** Prices reflect immediately when warehouse changes

### 2.3 Product Display

#### Product Cards
- Each product shows:
  - Product name
  - Specification selector (dropdown)
  - Price (dynamically calculated)
  - Add to cart functionality
- **Specification Selection:** Dropdown for different sizes/quantities
- **Price Display:** Updates based on:
  - Selected warehouse
  - Selected specification

---

## 3. Product Detail Layout

### 3.1 Page Structure
- **Image Gallery:** Left column (or top on mobile)
- **Product Info:** Right column (or bottom on mobile)
  - Product title
  - Price (warehouse-aware)
  - Specification selector
  - Quantity selector
  - Add to cart button
  - Description/compliance text

### 3.2 Warehouse Selection on Product Page
- **Location:** Likely in product info panel
- **Format:** Radio buttons or toggle
- **Visual Feedback:** 
  - Selected warehouse highlighted
  - Price updates immediately
  - Description text changes

---

## 4. Pricing Differentiation

### 4.1 Price Multipliers
- **Overseas Warehouse:**
  - Base price (multiplier: 1.0)
  - Description: "Shipped directly from our verified international partner facilities."
  - Lower cost, longer shipping time

- **US Warehouse:**
  - Marked-up price (multiplier: ~1.25 or custom)
  - Description: "Re-tested and quality-verified in U.S. laboratories prior to domestic shipment."
  - Higher cost, faster shipping, quality verification

### 4.2 Price Display Logic
```javascript
// Pseudocode
const basePrice = product.basePrice;
const warehouseMultiplier = selectedWarehouse === 'us' ? 1.25 : 1.0;
const finalPrice = basePrice * warehouseMultiplier;
```

### 4.3 Visual Indicators
- **Price Updates:** Smooth transition/animation
- **Warehouse Badge:** Visual indicator showing selected warehouse
- **Tooltip/Info:** Hover or click for warehouse description

---

## 5. Checkout Data Flow

### 5.1 Cart Integration
- **Warehouse Persistence:** Selected warehouse stored with cart items
- **Mixed Orders:** Ability to combine items from both warehouses
- **Cart Display:** Shows warehouse for each item

### 5.2 Checkout Process
1. **Cart Review:**
   - Items grouped by warehouse
   - Warehouse indicator per item
   - Separate shipping calculations per warehouse

2. **Order Summary:**
   - Subtotal per warehouse
   - Shipping costs (may differ)
   - Total calculation

3. **Payment Processing:**
   - Warehouse information included in order metadata
   - Fulfillment routing based on warehouse

### 5.3 Shipping Logic
- **Overseas Warehouse:**
  - International shipping
  - Longer transit times
  - Lower shipping costs (or included)

- **US Warehouse:**
  - Domestic shipping
  - Faster transit times
  - Expedited handling fee (if applicable)
  - "Expedited U.S. Re-Test Handling" surcharge

---

## 6. Implementation Plan for Peptide Research Labs

### 6.1 Data Model Extensions

#### Product Schema Update
```typescript
interface Product {
  // ... existing fields
  warehouseOptions: {
    overseas: {
      priceMultiplier: number; // Default: 1.0
      description: string;
      available: boolean;
    };
    us: {
      priceMultiplier: number; // Default: 1.25
      description: string;
      available: boolean;
    };
  };
}
```

#### Default Values
```typescript
const defaultWarehouseOptions = {
  overseas: {
    priceMultiplier: 1.0,
    description: "Shipped directly from our verified international partner facilities.",
    available: true,
  },
  us: {
    priceMultiplier: 1.25,
    description: "Re-tested and quality-verified in U.S. laboratories prior to domestic shipment.",
    available: true,
  },
};
```

### 6.2 UI Components

#### WarehouseSelector Component
- **Location:** Header (global) + Product pages
- **Type:** Radio button group or toggle switch
- **States:**
  - Overseas (default)
  - US Warehouse
- **Visual:** Flag icons, active state highlighting

#### PriceDisplay Component
- **Dynamic Calculation:** `basePrice * warehouseMultiplier`
- **Formatting:** Currency formatting, smooth transitions
- **Warehouse Badge:** Small indicator showing selected warehouse

### 6.3 State Management

#### WarehouseContext
```typescript
interface WarehouseContextType {
  selectedWarehouse: 'overseas' | 'us';
  setSelectedWarehouse: (warehouse: 'overseas' | 'us') => void;
  getPrice: (basePrice: number) => number;
  getWarehouseDescription: () => string;
}
```

#### Persistence
- **localStorage:** Store `selectedWarehouse` preference
- **URL State:** Optional route-based selection (`/us-warehouse`)
- **Cart Items:** Include `warehouse` field in cart item schema

### 6.4 Checkout Integration

#### Cart Item Schema
```typescript
interface CartItem {
  // ... existing fields
  warehouse: 'overseas' | 'us';
  calculatedPrice: number; // basePrice * multiplier
}
```

#### Order Summary Display
- Group items by warehouse
- Show warehouse badge per item
- Calculate shipping separately per warehouse
- Display "Expedited U.S. Re-Test Handling" fee if applicable

### 6.5 Improved UX Enhancements

#### Tooltips & Information
- **Hover Tooltip:** Explain warehouse differences
- **Info Modal:** Detailed comparison (optional)
- **Shipping Estimates:** Show estimated delivery times

#### Visual Feedback
- **Smooth Transitions:** Animate price changes
- **Loading States:** Show loading during warehouse switch
- **Error Handling:** Handle unavailable warehouse scenarios

#### Accessibility
- **ARIA Labels:** Proper labeling for screen readers
- **Keyboard Navigation:** Full keyboard support
- **Focus Management:** Maintain focus during warehouse switch

---

## 7. Technical Considerations

### 7.1 Performance
- **Client-Side Calculation:** Price calculation on client for instant updates
- **Caching:** Cache warehouse selection in localStorage
- **Optimistic Updates:** Update UI immediately, sync with server

### 7.2 SEO
- **Structured Data:** Include warehouse information in Product schema
- **Meta Tags:** Warehouse-specific meta descriptions (if using routes)
- **Canonical URLs:** Handle warehouse selection in URL structure

### 7.3 Analytics
- **Tracking:** Track warehouse selection events
- **Conversion:** Monitor conversion rates per warehouse
- **A/B Testing:** Test different price multipliers

---

## 8. Implementation Checklist

### Phase 25: Warehouse Selection Implementation

- [ ] **Data Model:**
  - [ ] Extend Product schema with `warehouseOptions`
  - [ ] Add default multipliers (overseas: 1.0, us: 1.25)
  - [ ] Add descriptions for each warehouse

- [ ] **UI Components:**
  - [ ] Create `WarehouseSelector` component
  - [ ] Create `PriceDisplay` component (warehouse-aware)
  - [ ] Update `ProductInfoPanel` to include warehouse selector
  - [ ] Update `ProductCard` to show warehouse-aware pricing

- [ ] **State Management:**
  - [ ] Create `WarehouseContext` provider
  - [ ] Implement localStorage persistence
  - [ ] Add price calculation utilities

- [ ] **Checkout Integration:**
  - [ ] Update cart item schema to include warehouse
  - [ ] Update cart display to show warehouse per item
  - [ ] Update order summary to group by warehouse
  - [ ] Add shipping calculation logic per warehouse

- [ ] **Testing:**
  - [ ] Test warehouse selection persistence
  - [ ] Test price calculation accuracy
  - [ ] Test checkout flow with warehouse selection
  - [ ] Test mixed warehouse orders

---

## 9. Notes & Observations

### Strengths of Chimera Implementation
1. **Clear Visual Distinction:** Easy to see which warehouse is selected
2. **Global Context:** Warehouse selection affects entire site
3. **Dedicated Pages:** Separate route for US warehouse provides clear separation
4. **Combination Support:** Ability to mix warehouses in one order

### Areas for Improvement (Our Implementation)
1. **Better Tooltips:** More detailed explanations of warehouse differences
2. **Shipping Estimates:** Show estimated delivery times upfront
3. **Availability Indicators:** Show stock availability per warehouse
4. **Price Comparison:** Side-by-side price comparison (optional)
5. **Mobile Optimization:** Ensure warehouse selector is mobile-friendly

---

**End of Analysis**

