# Layout Plan: Peptide Research Labs
## Structural Analysis & Design Architecture

**Source Reference:** somachems.com (structural analysis only - no content copied)
**Date:** December 4, 2025
**Purpose:** Map site structure, spacing, and layout proportions to inform Peptide Research Labs build

---

## 1. Navigation Hierarchy

### 1.1 Primary Navigation (Header)
**Structure:**
- **Left Section:**
  - Hamburger menu icon (mobile only)
  - Logo (text + icon combination)
  - Site name/branding

- **Center Section:**
  - Category dropdown button ("ALL CATEGORIES")
  - Search input field (prominent, full-width on mobile)

- **Right Section:**
  - Navigation links: HOME, SHOP ALL, SHOP BY CATEGORY (dropdown), CONTACT US
  - Shopping cart icon (with badge if items present)
  - User account/profile icon

**Spacing:**
- Header height: ~80px (desktop), ~64px (mobile)
- Horizontal padding: 16px-24px per section
- Link spacing: 24px-32px between items
- Sticky positioning: Yes (remains at top on scroll)

### 1.2 Footer Navigation
**Structure:**
- Multi-column layout (4 columns on desktop, stacked on mobile)
- Columns: Company Info, Quick Links, Legal/Compliance, Contact
- Newsletter signup section
- Social media links (if applicable)
- Compliance disclaimer (full width, above copyright)

**Spacing:**
- Footer padding: 48px-64px vertical
- Column gap: 32px-48px
- Section spacing: 24px vertical

---

## 2. Homepage Structure

### 2.1 Hero Section
**Layout:**
- **Desktop:** Two-column layout
  - Left (60%): Headline + subheadline + CTA button
  - Right (40%): Hero image (3D laboratory vials/peptide bottles)
- **Mobile:** Stacked layout (image below text)

**Content:**
- Headline: "Advancing Scientific Discovery Through Research Peptides"
- Subheadline: Supporting text about research quality
- CTA Button: "Browse Products" or "Shop Now"
- Hero Image: 3D styled stock image of laboratory equipment

**Spacing:**
- Section padding: 80px-120px vertical
- Content max-width: 1200px
- Headline size: 3rem-4rem (desktop), 2rem-2.5rem (mobile)
- Image aspect ratio: 16:9 or 4:3

### 2.2 Feature Cards Section
**Layout:**
- Three cards in a row (desktop)
- Single column (mobile)
- Equal width cards with consistent spacing

**Cards:**
1. **"Purity & Verification"**
   - Icon/image
   - Title
   - Description text
   - Optional CTA link

2. **"Regulatory Compliance"**
   - Icon/image
   - Title
   - Description text
   - Optional CTA link

3. **"Trusted Supply Chain"**
   - Icon/image
   - Title
   - Description text
   - Optional CTA link

**Spacing:**
- Card gap: 32px-48px
- Card padding: 32px-40px
- Section padding: 64px-80px vertical
- Card border radius: 8px-12px
- Card shadow: Subtle elevation

### 2.3 Additional Homepage Sections (Optional)
- Featured products preview
- Research blog preview
- Trust indicators/testimonials
- Newsletter signup

**Spacing Between Sections:**
- Consistent vertical rhythm: 64px-96px between major sections
- Generous white space for clean, professional appearance

---

## 3. Product Catalog Pages

### 3.1 Shop All Page (`/shop` or `/shop-all`)
**Layout:**
- **Top Section:**
  - Page title: "SHOP ALL" (large, bold)
  - Results count: "SHOWING ALL X RESULTS"
  - Sort dropdown: "SORT BY" with options (Default Sorting, Price, Name, etc.)

- **Product Grid:**
  - **Desktop:** 4 columns
  - **Tablet:** 2-3 columns
  - **Mobile:** 1-2 columns
  - Gap between cards: 24px-32px

**Product Card Structure:**
- Product image (top, full width)
- Product name (below image)
- Price (prominent, below name)
- Action button ("ADD TO CART", "SELECT OPTIONS", or "READ MORE")
- Optional: Stock status badge
- Optional: Quick view overlay on hover

**Card Dimensions:**
- Image aspect ratio: 1:1 (square) or 4:3
- Card padding: 16px-20px
- Card border: 1px solid (light gray)
- Hover effect: Slight elevation, border color change

**Spacing:**
- Grid container padding: 32px-48px
- Card gap: 24px-32px
- Section padding: 48px-64px vertical

### 3.2 Category Pages
**Layout:**
- Similar to Shop All page
- Category title and description at top
- Same product grid structure
- Optional: Category-specific filters in sidebar

---

## 4. Product Detail Pages

### 4.1 Layout Structure
**Desktop: Two-Column Layout**
- **Left Column (50-60%):**
  - Image gallery (main image + thumbnails)
  - Zoom functionality
  - Multiple product views

- **Right Column (40-50%):**
  - Product name (large, bold)
  - Size/variant selector
  - Price (prominent)
  - Stock status
  - Add to Cart button
  - Quick info/disclaimers

**Mobile: Stacked Layout**
- Image gallery (full width, top)
- Product info (full width, below)

### 4.2 Product Information Sections
**Below Main Product Area:**

1. **Tabs or Accordion Sections:**
   - **Chemical Information Tab:**
     - Chemical formula
     - Molar mass
     - CAS number
     - Synonyms
     - PubChem ID
     - Shelf life
   
   - **Research Applications Tab:**
     - Neutral scientific descriptions
     - Research context only
     - NO health/performance claims
   
   - **Safety & Handling Tab:**
     - Storage requirements
     - Handling guidelines
     - MSDS link
     - CoA availability

2. **Compliance Disclaimers:**
   - Prominent banner: "For Research Use Only – Not for Human or Veterinary Use"
   - Placeholders: [NOT_FDA_APPROVED], [NO_MEDICAL_ADVICE], [USE_AT_OWN_RISK]
   - Multiple locations: Above description, below price, in tabs

**Spacing:**
- Section padding: 48px-64px vertical
- Tab content padding: 32px-40px
- Image gallery spacing: 16px-24px

---

## 5. Cart and Checkout Flow

### 5.1 Cart Page (`/cart`)
**Layout:**
- **Main Content Area:**
  - Cart items table/list
  - Each item shows:
    - Product image (thumbnail)
    - Product name
    - Quantity selector
    - Price per unit
    - Subtotal
    - Remove button

- **Sidebar (Right):**
  - Order summary
  - Subtotal
  - Shipping (calculated or TBD)
  - Tax (if applicable)
  - Total
  - "Proceed to Checkout" button

**Spacing:**
- Page padding: 48px-64px
- Item spacing: 24px-32px vertical
- Sidebar width: 300px-400px (desktop)

### 5.2 Checkout Page (`/checkout`)
**Layout:**
- **Two-Column Layout:**
  - **Left (60-70%):**
    - Shipping address form
    - Billing address form (or "Same as shipping" checkbox)
    - Email field
    - Phone field
    - Payment method selection
    - Research-Use-Only agreement checkbox (REQUIRED)
  
  - **Right (30-40%):**
    - Order summary (sticky)
    - Items list
    - Totals
    - Applied discounts (if any)

**Form Structure:**
- Name (First, Last)
- Address (Street, City, State, ZIP, Country)
- Email
- Phone
- Payment method
- **Required Checkbox:** "I Agree" to Research-Use-Only terms

**Spacing:**
- Form field spacing: 24px vertical
- Section spacing: 32px-48px
- Checkbox area: Prominent, above payment section

### 5.3 Checkout Confirmation (`/checkout/confirmation`)
**Layout:**
- Order ID (prominent)
- Thank you message
- Purchased items list
- Shipping address
- Order total
- **Reiteration of all disclaimers:**
  - Research Use Only
  - Not FDA Approved
  - No Medical Advice
  - Use at Own Risk

**Spacing:**
- Centered content, max-width: 800px
- Section spacing: 32px-48px

---

## 6. Age Gate and Entry Pop-ups

### 6.1 Age Verification Modal
**Layout:**
- Full-screen overlay
- Centered modal (max-width: 600px)
- Dark backdrop (80% opacity)

**Content:**
- Title: Age verification requirement
- Text: [AGE_GATE_TEXT] from compliance document
- Checkbox: "I confirm I am 18 years or older"
- Checkbox: "I am purchasing strictly for laboratory research"
- Buttons:
  - "I Agree" (primary, orange)
  - "Exit Site" (secondary)

**Behavior:**
- Blocks all page content until accepted
- Stores consent in localStorage
- Appears once per session

### 6.2 Marketing Pop-up
**Layout:**
- Centered modal (smaller than age gate, max-width: 500px)
- Light backdrop (50% opacity)
- Dismissible (X button)

**Content:**
- Headline: Newsletter/discount offer
- Email input field
- "Subscribe" button (orange)
- "No Thanks" link

**Behavior:**
- Appears after age gate is accepted
- Timed delay (e.g., 30 seconds) or scroll trigger
- Dismissible, non-blocking

---

## 7. Legal Pages Structure

### 7.1 Terms Page (`/terms`)
**Layout:**
- Single column, max-width: 900px
- Section headings (H2)
- Numbered or bulleted lists
- Placeholders:
  - [RUO_CLAUSE]
  - [LIABILITY_LIMITS]
  - [BUYER_RESPONSIBILITY]

**Spacing:**
- Content padding: 64px-80px vertical
- Section spacing: 32px-48px
- Line height: 1.7-1.8 for readability

### 7.2 Privacy Page (`/privacy`)
**Layout:**
- Similar to Terms page
- Sections: Data collection, usage, cookies, GDPR, analytics
- Generic boilerplate structure

### 7.3 Shipping Page (`/shipping`)
**Layout:**
- Similar structure
- Key points:
  - RUO labeling on shipments
  - No returns on opened products
  - Shipping methods
  - Geographic restrictions

### 7.4 FAQ Page (`/faq`)
**Layout:**
- Accordion or expandable sections
- Categories (if multiple)
- Placeholder: [NO_MEDICAL_ADVICE]
- Neutral scientific explanations

---

## 8. Blog Framework

### 8.1 Blog Listing (`/blog`)
**Layout:**
- Responsive grid
- **Desktop:** 3 columns
- **Tablet:** 2 columns
- **Mobile:** 1 column

**Article Card:**
- Thumbnail image (top)
- Category/tag badge (optional)
- Title (bold, 2-3 lines max)
- Short description (2-3 sentences)
- Publication date (optional)
- "Read More" button (orange)

**Spacing:**
- Grid gap: 32px-40px
- Card padding: 24px-32px
- Section padding: 64px-80px vertical

### 8.2 Article Detail (`/blog/[slug]`)
**Layout:**
- **Desktop:**
  - **Main Content (70%):**
    - Header image (full width)
    - Title (large, bold)
    - Sub-headline
    - Publication date, author (optional)
    - Article body (generous line spacing)
    - Disclaimer at bottom: [RESEARCH_REFERENCE_ONLY]
  
  - **Sidebar (30%):**
    - Table of contents (sticky)
    - Related articles
    - Newsletter signup (optional)

- **Mobile:**
  - Stacked layout
  - Table of contents as accordion

**Spacing:**
- Content max-width: 800px
- Line height: 1.8-2.0
- Paragraph spacing: 24px-32px
- Image margins: 32px-48px

---

## 9. Design Principles & Spacing System

### 9.1 Spacing Scale
- **Micro:** 4px, 8px (tight spacing)
- **Small:** 16px, 24px (component internal)
- **Medium:** 32px, 48px (section spacing)
- **Large:** 64px, 80px, 96px (major section breaks)
- **Extra Large:** 120px+ (hero sections)

### 9.2 Typography Scale
- **Display:** 3.5rem-4rem (hero headlines)
- **H1:** 2.5rem-3rem (page titles)
- **H2:** 2rem-2.5rem (section headings)
- **H3:** 1.5rem-1.75rem (subsection headings)
- **Body:** 1rem (16px base)
- **Small:** 0.875rem (14px)

### 9.3 Color Application
- **Primary Orange (#E67E22):** CTAs, hover states, accents
- **Secondary Amber (#F39C12):** Secondary actions, highlights
- **Accent Gray (#2C3E50):** Headings, important text
- **Text Gray (#34495E):** Body text, secondary content
- **Neutral Light (#FFFFFF):** Backgrounds, cards

### 9.4 Visual Hierarchy
- Large, clean white areas
- Generous spacing between sections
- Orange hover transitions on interactive elements
- Subtle shadows for depth
- Clear visual separation between sections

---

## 10. Responsive Breakpoints

### 10.1 Mobile First Approach
- **Mobile:** < 768px
  - Single column layouts
  - Stacked navigation
  - Full-width cards
  - Hamburger menu

- **Tablet:** 768px - 1024px
  - 2-column grids
  - Horizontal navigation
  - Side-by-side product layouts

- **Desktop:** > 1024px
  - 3-4 column grids
  - Full navigation visible
  - Multi-column layouts
  - Sidebars visible

---

## 11. Component Patterns

### 11.1 Buttons
- **Primary:** Orange background (#E67E22), white text, rounded corners (8px)
- **Secondary:** Outlined, orange border, transparent background
- **Hover:** Slight darkening, smooth transition (200ms)
- **Padding:** 12px-16px vertical, 24px-32px horizontal

### 11.2 Cards
- White background
- Border: 1px solid light gray
- Border radius: 8px-12px
- Padding: 24px-32px
- Shadow: Subtle (0 2px 8px rgba(0,0,0,0.1))
- Hover: Elevation increase, border color change

### 11.3 Forms
- Input padding: 12px-16px
- Border: 1px solid gray
- Border radius: 6px-8px
- Focus: Orange border (#E67E22)
- Label above input
- Error states: Red border, error message below

---

## 12. Compliance Integration Points

### 12.1 Persistent Elements
- **Header Banner:** [COMPLIANCE_BANNER_TEXT] - Always visible
- **Footer Disclaimer:** Full compliance statement
- **Product Pages:** Multiple disclaimer placements
- **Checkout:** Required agreement checkbox

### 12.2 Placeholder Locations
- Homepage hero: [COMPLIANCE_BANNER_TEXT]
- Product cards: [RUO_DISCLAIMER]
- Product detail: [NOT_FDA_APPROVED], [NO_MEDICAL_ADVICE], [USE_AT_OWN_RISK]
- Terms page: [RUO_CLAUSE], [LIABILITY_LIMITS], [BUYER_RESPONSIBILITY]
- FAQ page: [NO_MEDICAL_ADVICE]
- Blog articles: [RESEARCH_REFERENCE_ONLY]
- Age gate: [AGE_GATE_TEXT]

---

## 13. Professional Biotech Aesthetic

### 13.1 Visual Language
- Clean, clinical appearance
- Scientific precision implied through:
  - Sharp, geometric shapes
  - Consistent spacing
  - Professional typography
  - High-quality product imagery
  - Laboratory equipment visuals

### 13.2 Trust Indicators
- Purity percentages
- CoA availability
- Third-party testing mentions
- Regulatory compliance badges
- Professional documentation links

### 13.3 Content Tone
- Neutral, scientific language
- Research-focused descriptions
- No health/performance claims
- Emphasis on laboratory use
- Professional, authoritative voice

---

## 14. Implementation Notes

### 14.1 Layout Architecture
- Use CSS Grid for product grids
- Flexbox for component layouts
- Tailwind utility classes for spacing
- Custom components for reusable patterns

### 14.2 Performance Considerations
- Lazy load images below fold
- Optimize hero images (WebP format)
- Minimize layout shift
- Fast page transitions

### 14.3 Accessibility
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (WCAG AA)

---

## 15. Page Structure Summary

### Homepage
1. Header (sticky)
2. Compliance Banner
3. Hero Section (headline + image)
4. Feature Cards (3 cards)
5. Optional: Featured Products
6. Optional: Blog Preview
7. Footer

### Shop All
1. Header
2. Compliance Banner
3. Page Title + Results Count + Sort
4. Product Grid (4 columns desktop)
5. Pagination (if needed)
6. Footer

### Product Detail
1. Header
2. Compliance Banner
3. Product Gallery + Info (2 columns)
4. Tabs: Chemical Info, Research Apps, Safety
5. Related Products (optional)
6. Footer

### Cart
1. Header
2. Compliance Banner
3. Cart Items List
4. Order Summary Sidebar
5. Footer

### Checkout
1. Header
2. Compliance Banner
3. Address Forms + Order Summary
4. Payment Section
5. Required Agreement Checkbox
6. Footer

---

**Layout Plan Complete**

This document provides the structural foundation for building Peptide Research Labs with professional biotech aesthetics, proper spacing, and compliance integration points. All measurements and proportions are based on analysis of somachems.com structure, adapted for the Peptide Research Labs brand identity and color system.

