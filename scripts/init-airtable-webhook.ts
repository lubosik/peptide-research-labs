/**
 * Initialize Airtable Webhook
 * Run this script to register the webhook with Airtable
 * Can be called on deployment or manually
 */

import { registerWebhook, loadWebhookConfig } from '../lib/airtableWebhookListener';

async function init() {
  console.log('🔍 Checking for existing webhook...');
  
  const existing = loadWebhookConfig();
  
  if (existing?.webhookId) {
    console.log(`✅ Webhook already registered: ${existing.webhookId}`);
    console.log(`   Notification URL: ${existing.notificationURL}`);
    return;
  }

  console.log('📝 Registering new webhook...');
  const webhookId = await registerWebhook();
  
  if (webhookId) {
    console.log(`✅ Webhook registered successfully: ${webhookId}`);
    console.log('   The webhook will now automatically sync Airtable changes to your site.');
  } else {
    console.error('❌ Failed to register webhook. Please check your environment variables.');
    process.exit(1);
  }
}

init().catch(console.error);

