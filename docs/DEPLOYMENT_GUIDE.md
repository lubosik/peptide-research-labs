# Vercel Deployment Guide - Airtable Sync & ConvertKit Integration

## Environment Variables for Vercel

Add these environment variables in your Vercel project settings:

### Required Variables:
```
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=app96XbxO38aKcHM1
AIRTABLE_TABLE_ID=tblQQrvrTG4kVnIzz
NEXT_PUBLIC_SITE_URL=https://peptide-research-labs.vercel.app
CONVERTKIT_API_KEY=your_convertkit_api_key_here
```

### Optional Variables:
```
CONVERTKIT_FORM_ID=your_form_id_here  # If you want to subscribe to a specific form
AIRTABLE_WEBHOOK_SECRET=your_secret_here  # For webhook authentication
```

## Airtable Live Sync Setup

### How It Works:

1. **Real-time Updates**: 
   - API routes are set to `force-dynamic` with no caching
   - Client-side hooks automatically refresh every 30 seconds
   - Webhook triggers instant revalidation when Airtable changes

2. **Webhook Registration**:
   After deployment, register the webhook by calling:
   ```
   POST https://peptide-research-labs.vercel.app/api/webhook/register
   ```
   
   Or check status:
   ```
   GET https://peptide-research-labs.vercel.app/api/webhook/test
   ```

3. **Testing the Sync**:
   - Update a product price in Airtable (e.g., Epitalon from $35 to $36)
   - Changes should appear on the site within 30 seconds (automatic refresh)
   - Or instantly if webhook is registered and triggers revalidation

### Troubleshooting:

- **Prices not updating?**
  1. Check webhook status: `GET /api/webhook/test`
  2. Register webhook: `POST /api/webhook/register`
  3. Check logs: `/logs/airtable_sync.log` (if accessible)
  4. Verify environment variables in Vercel

- **Webhook not receiving events?**
  - Ensure the webhook URL is: `https://peptide-research-labs.vercel.app/api/airtable-sync`
  - Check Airtable webhook settings in your base
  - Verify API key has proper permissions

## ConvertKit Newsletter Integration

### How It Works:

1. **Newsletter Popup**: 
   - Appears after age gate is accepted
   - Shows after 30 seconds or 25% scroll
   - Offers "10% off for life" discount

2. **Subscription Flow**:
   - User enters email in MarketingPopup
   - Form submits to `/api/newsletter/subscribe`
   - Endpoint calls ConvertKit V4 API to create subscriber
   - User receives success message

3. **API Endpoint**: `/api/newsletter/subscribe`
   - Method: POST
   - Body: `{ "email": "user@example.com", "firstName": "Optional" }`
   - Returns: Success/error status

### Testing ConvertKit:

1. Fill out the newsletter popup form
2. Check ConvertKit dashboard for new subscriber
3. Verify email received (if automation is set up)

## Post-Deployment Checklist

- [ ] Add all environment variables to Vercel
- [ ] Deploy to Vercel
- [ ] Register Airtable webhook: `POST /api/webhook/register`
- [ ] Test Airtable sync by updating a product price
- [ ] Test ConvertKit subscription via newsletter popup
- [ ] Verify webhook status: `GET /api/webhook/test`
- [ ] Monitor sync logs for any errors

## Manual Webhook Registration

If automatic registration fails, you can manually register:

```bash
curl -X POST https://peptide-research-labs.vercel.app/api/webhook/register
```

Or use the test endpoint to check status:

```bash
curl https://peptide-research-labs.vercel.app/api/webhook/test
```

## Support

If issues persist:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test API endpoints directly
4. Check Airtable base permissions
5. Verify ConvertKit API key is valid

