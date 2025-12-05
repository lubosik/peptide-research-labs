# Peptide Research Labs

Full-stack website for research peptide e-commerce platform.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and other configuration.

### Development

**Frontend (Next.js):**
```bash
npm run dev
```
Runs on http://localhost:3000

**Backend (Express):**
```bash
npm run dev:server
```
Runs on http://localhost:3001

### Build

```bash
npm run build
npm start
```

## Project Structure

```
peptide-research-labs/
├── app/              # Next.js App Router pages
├── server/           # Express backend
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── middleware/   # Express middleware
├── lib/              # Shared utilities
│   └── config/       # Configuration files
└── public/           # Static assets
```

## Compliance

This project adheres to research peptide industry compliance guidelines. See `lib/config/compliance-guidelines.md` for details.

## SEO Schema

All structured data uses `schema.org/ResearchOrganization` type. See `lib/config/seo-schema-instructions.md` for implementation details.

