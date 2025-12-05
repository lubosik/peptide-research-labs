# Peptide Research Labs

Research peptides for laboratory use only. Advancing scientific discovery through high-purity biochemical reagents.

## Tech Stack

- **Framework:** Next.js 16 (App Router, SSR/SSG)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Node.js with Express
- **Database:** MongoDB (planned)

## Features

- Product catalog with detailed product pages
- Shopping cart and checkout flow
- Age verification and compliance disclaimers
- Blog with research articles
- SEO optimized with structured data
- Responsive design
- Dark theme with orange accent colors

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file with:

```
# Database (when implemented)
MONGODB_URI=your_mongodb_connection_string

# Payment Processing
BAR2PAY_API_KEY=your_bar2pay_api_key
BAR2PAY_SANDBOX=true

# Image APIs (optional)
UNSPLASH_ACCESS_KEY=your_unsplash_key
PEXELS_API_KEY=your_pexels_key
```

## Project Structure

```
/app              # Next.js app router pages
/components       # React components
/data            # Static data (products, articles)
/lib             # Utilities and configurations
/public          # Static assets
```

## Compliance

All products are sold strictly for Research Use Only (RUO). Not for human or veterinary use.

## License

Proprietary - All rights reserved
