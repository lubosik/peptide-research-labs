# Airtable Live Sync Setup Guide

## Overview

This document describes the Airtable live synchronization system that automatically propagates product data changes from Airtable to the Next.js production site in real-time.

## Architecture

1. **Airtable Client** (`/lib/airtableClient.ts`): Handles all Airtable API interactions
2. **API Routes** (`/app/api/products/*`): Serve product data with ISR (60s revalidation)
3. **Webhook Sync Endpoint** (`/app/api/airtable-sync`): Receives webhook notifications and triggers revalidation
4. **Webhook Listener** (`/lib/airtableWebhookListener.ts`): Manages webhook registration and polling
5. **Product Adapter** (`/lib/airtableProductAdapter.ts`): Converts Airtable data to application Product interface

## Environment Variables

Create a `.env.local` file with the following variables:

```env
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=app96XbxO38aKcHM1
AIRTABLE_TABLE_ID=tblQQrvrTG4kVnIzz
NEXT_PUBLIC_SITE_URL=https://peptide-research-labs.vercel.app
AIRTABLE_WEBHOOK_SECRET=your_optional_webhook_secret
```

## Webhook Registration

### Option 1: Manual Registration via API

Call the registration endpoint:

```bash
curl -X POST https://peptide-research-labs.vercel.app/api/webhook/register
```

### Option 2: Automatic Registration

The webhook listener will automatically register on first run if no webhook is configured.

## How It Works

1. **Data Flow**:
   - Airtable → Webhook → `/api/airtable-sync` → Revalidation → Next.js ISR
   - Pages fetch from `/api/products` which queries Airtable with 60s cache

2. **Stock Status**:
   - Products with `In_Stock = false` show "OUT OF STOCK" badge
   - Products with `Is_Discontinued = true` are dimmed and unclickable
   - Products with `API_Visibility_Status != "LIVE"` are excluded from queries

3. **Revalidation**:
   - Webhook triggers: Instant revalidation on record changes
   - Time-based: Automatic revalidation every 60 seconds
   - Polling: Fallback polling every 30 seconds

## Monitoring

- **Sync Logs**: `/logs/airtable_sync.log`
- **Webhook Status**: `/config/webhookStatus.json`
- **Webhook Config**: `/config/airtableWebhooks.json`

## Troubleshooting

1. **Webhook not receiving events**: Check webhook health via `/api/webhook/poll`
2. **Data not updating**: Verify environment variables and API key permissions
3. **Revalidation failing**: Check Next.js logs and ensure routes are properly configured

## Next Steps

1. Register the webhook using the registration endpoint
2. Monitor sync logs to verify events are being received
3. Test by updating a product in Airtable and verifying the change appears on the site

