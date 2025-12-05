# Deployment Checklist - Peptide Research Labs

## Pre-Deployment Verification

### ✅ Build Verification
- [ ] Production build completes successfully: `npm run build`
- [ ] All pages generate without errors
- [ ] Sitemap generates correctly: `/sitemap.xml`
- [ ] No TypeScript errors
- [ ] No linting errors

### ✅ Compliance Testing
- [ ] Run `npm run test:all` - All tests pass
- [ ] No banned phrases in content
- [ ] All disclaimers present
- [ ] Checkout flow validated
- [ ] Age gate validated

### ✅ Asset Verification
- [ ] Logo file exists: `/public/images/Peptide_Research_Labs_Logo-removebg-preview.png`
- [ ] Favicon exists: `/public/images/Peptide_Research_Labs_symbol-removebg-preview.png`
- [ ] All images optimized (WebP format)
- [ ] robots.txt present and correct
- [ ] sitemap.xml accessible

### ✅ SEO Verification
- [ ] All pages have meta descriptions
- [ ] Canonical URLs set on all pages
- [ ] Structured data (JSON-LD) present:
  - [ ] ResearchOrganization schema (root layout)
  - [ ] WebSite schema (root layout)
  - [ ] Product schema (all product pages)
  - [ ] Article schema (all blog articles)
  - [ ] FAQPage schema (FAQ page)
- [ ] Open Graph tags present
- [ ] Twitter Card tags present

---

## Environment Variables

Create a `.env.production` file with the following variables:

### Required Variables

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://peptideresearchlabs.com
NEXT_PUBLIC_SITE_NAME=Peptide Research Labs

# Bar2Pay Payment Integration
BAR2PAY_API_KEY=your_bar2pay_api_key_here
BAR2PAY_SECRET_KEY=your_bar2pay_secret_key_here
BAR2PAY_MERCHANT_ID=your_merchant_id_here
BAR2PAY_ENVIRONMENT=production
# For testing: BAR2PAY_ENVIRONMENT=sandbox

# MongoDB Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/peptide-research-labs?retryWrites=true&w=majority
# Or for local: MONGODB_URI=mongodb://localhost:27017/peptide-research-labs

# Compliance Document Path
COMPLIANCE_DOC_PATH=lib/config/compliance-guidelines.md

# Node Environment
NODE_ENV=production
```

### Optional Variables

```bash
# Analytics (if using)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Email Service (if using)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_password

# API Keys (if using external services)
DATAFORSEO_API_KEY=your_api_key
PERPLEXITY_API_KEY=your_api_key
FIRECRAWL_API_KEY=your_api_key
```

---

## Database Setup

### MongoDB Configuration

1. **Create Database:**
   ```bash
   # Connect to MongoDB
   mongosh "mongodb+srv://cluster.mongodb.net/peptide-research-labs"
   
   # Create collections (if needed)
   use peptide-research-labs
   ```

2. **Collections to Create:**
   - `products` - Product catalog
   - `orders` - Order records
   - `users` - User accounts (if implementing)
   - `articles` - Blog articles (if using database)
   - `cart_sessions` - Cart session data (optional)

3. **Indexes (Recommended):**
   ```javascript
   // Products collection
   db.products.createIndex({ slug: 1 }, { unique: true })
   db.products.createIndex({ category: 1 })
   db.products.createIndex({ inStock: 1 })
   
   // Orders collection
   db.orders.createIndex({ orderId: 1 }, { unique: true })
   db.orders.createIndex({ email: 1 })
   db.orders.createIndex({ createdAt: -1 })
   ```

---

## Server Configuration

### Express Backend Setup

1. **Start Server:**
   ```bash
   npm run server
   # Or with nodemon for development
   npm run dev:server
   ```

2. **Server Port:**
   - Default: 3001 (or configure via PORT environment variable)
   - Ensure port is available and not blocked by firewall

3. **CORS Configuration:**
   - Update `server/index.js` CORS settings if needed
   - Allow only your production domain

---

## Production Build

### Build Commands

```bash
# Install dependencies
npm install

# Run tests
npm run test:all

# Build for production
npm run build

# Start production server
npm start
```

### Build Output

- Static pages: `.next/static/`
- Server files: `.next/server/`
- Optimized images: `.next/image/`
- Sitemap: `.next/server/app/sitemap.xml/route.js`

---

## Deployment Platforms

### Vercel (Recommended for Next.js)

1. **Connect Repository:**
   - Push code to GitHub/GitLab
   - Import project in Vercel dashboard

2. **Environment Variables:**
   - Add all required variables in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy:**
   - Vercel will auto-deploy on push
   - Custom domain: Add in Vercel dashboard

### Other Platforms

**Netlify:**
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18.x or higher

**AWS/EC2:**
- Install Node.js 18+
- Install PM2: `npm install -g pm2`
- Start with: `pm2 start npm --name "peptide-labs" -- start`
- Configure Nginx reverse proxy

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Post-Deployment Verification

### Functional Checks

- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Age gate appears on first visit
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout flow works (test with sandbox)
- [ ] Blog articles load
- [ ] Legal pages accessible
- [ ] Search functionality (if implemented)
- [ ] Mobile menu works

### SEO Checks

- [ ] robots.txt accessible: `https://yoursite.com/robots.txt`
- [ ] sitemap.xml accessible: `https://yoursite.com/sitemap.xml`
- [ ] All pages have meta descriptions
- [ ] Structured data validates (use Google Rich Results Test)
- [ ] Canonical URLs correct
- [ ] No duplicate content issues

### Performance Checks

- [ ] Run Lighthouse audit (target: 90+ mobile)
- [ ] Core Web Vitals pass:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Images load in WebP format
- [ ] Lazy loading works
- [ ] No console errors

### Compliance Checks

- [ ] Age gate appears and works
- [ ] Compliance banner visible
- [ ] All disclaimers present on product pages
- [ ] Checkout requires RUO agreement
- [ ] Footer disclaimer present
- [ ] Legal pages accessible

### Security Checks

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Environment variables not exposed
- [ ] API keys secured
- [ ] No sensitive data in client code

---

## Monitoring & Maintenance

### Analytics Setup

- [ ] Google Analytics configured (if using)
- [ ] Google Search Console verified
- [ ] Error tracking (Sentry, etc.) configured

### Backup Strategy

- [ ] Database backups scheduled
- [ ] Code repository backed up
- [ ] Environment variables documented securely

### Update Process

1. Test changes locally
2. Run `npm run test:all`
3. Build and verify: `npm run build`
4. Deploy to staging (if available)
5. Deploy to production
6. Verify post-deployment

---

## Support & Documentation

### Key Files

- **Compliance Guidelines:** `lib/config/compliance-guidelines.md`
- **SEO Instructions:** `lib/config/seo-schema-instructions.md`
- **Style Guide:** `/styleguide`
- **This Checklist:** `DEPLOYMENT_CHECKLIST.md`

### Important Notes

- **Compliance First:** Always verify compliance before deploying
- **Test Payment:** Use Bar2Pay sandbox for testing
- **Monitor Orders:** Set up order notification system
- **Update Content:** Replace all placeholder text with actual compliance text
- **Image Assets:** Replace placeholder images with actual product photos

---

## Quick Start Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:server       # Start Express backend

# Testing
npm run test:all         # Run all compliance tests

# Production
npm run build            # Build for production
npm start                # Start production server

# Server only
npm run server           # Start Express backend only
```

---

**Last Updated:** December 2025
**Version:** 1.0.0

