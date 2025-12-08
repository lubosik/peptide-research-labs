import * as fs from 'fs';
import * as path from 'path';

const WEBHOOK_CONFIG_FILE = path.join(process.cwd(), 'config', 'airtableWebhooks.json');
const STATUS_FILE = path.join(process.cwd(), 'config', 'webhookStatus.json');

/**
 * Webhook configuration interface
 */
interface WebhookConfig {
  webhookId?: string;
  baseId: string;
  tableId: string;
  notificationURL: string;
  createdAt?: string;
  lastChecked?: string;
}

/**
 * Load webhook configuration
 */
export function loadWebhookConfig(): WebhookConfig | null {
  try {
    if (fs.existsSync(WEBHOOK_CONFIG_FILE)) {
      const content = fs.readFileSync(WEBHOOK_CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error loading webhook config:', error);
  }
  return null;
}

/**
 * Save webhook configuration
 */
export function saveWebhookConfig(config: WebhookConfig): void {
  const configDir = path.dirname(WEBHOOK_CONFIG_FILE);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  try {
    fs.writeFileSync(
      WEBHOOK_CONFIG_FILE,
      JSON.stringify({ ...config, updatedAt: new Date().toISOString() }, null, 2)
    );
  } catch (error) {
    console.error('Error saving webhook config:', error);
  }
}

/**
 * Register a new webhook with Airtable
 */
export async function registerWebhook(): Promise<string | null> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peptide-research-labs.vercel.app';

  if (!apiKey || !baseId || !tableId) {
    console.error('Missing required Airtable environment variables');
    return null;
  }

  const notificationURL = `${siteURL}/api/airtable-sync`;

  try {
    const response = await fetch(`https://api.airtable.com/v0/bases/${baseId}/webhooks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationUrl: notificationURL,
        specification: {
          options: {
            filters: {
              dataTypes: ['tableData'],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to register webhook:', errorText);
      return null;
    }

    const data = await response.json();
    const webhookId = data.id;

    // Save webhook configuration
    saveWebhookConfig({
      webhookId,
      baseId,
      tableId,
      notificationURL,
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Webhook registered successfully: ${webhookId}`);
    return webhookId;
  } catch (error) {
    console.error('Error registering webhook:', error);
    return null;
  }
}

/**
 * Check webhook health and status
 */
export async function checkWebhookHealth(webhookId: string): Promise<boolean> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    return false;
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/bases/${baseId}/webhooks/${webhookId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isHookEnabled === true;
  } catch (error) {
    console.error('Error checking webhook health:', error);
    return false;
  }
}

/**
 * Poll Airtable for webhook notifications
 * This is a fallback mechanism if push notifications fail
 */
export async function pollWebhookNotifications(webhookId: string): Promise<void> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://peptide-research-labs.vercel.app';

  if (!apiKey || !baseId) {
    return;
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/bases/${baseId}/webhooks/${webhookId}/payloads`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch webhook notifications');
      return;
    }

    const data = await response.json();
    const payloads = data.payloads || [];

    if (payloads.length > 0) {
      // Process each payload
      for (const payload of payloads) {
        try {
          await fetch(`${siteURL}/api/airtable-sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.AIRTABLE_WEBHOOK_SECRET || ''}`,
            },
            body: JSON.stringify({
              base: { id: baseId },
              webhook: { id: webhookId },
              payload: payload,
            }),
          });
        } catch (error) {
          console.error('Error processing webhook payload:', error);
        }
      }

      // Acknowledge payloads
      const cursor = data.cursor;
      if (cursor) {
        await fetch(
          `https://api.airtable.com/v0/bases/${baseId}/webhooks/${webhookId}/payloads/${cursor}/ack`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
            },
          }
        );
      }
    }

    // Update last checked timestamp
    const config = loadWebhookConfig();
    if (config) {
      saveWebhookConfig({
        ...config,
        lastChecked: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error polling webhook notifications:', error);
  }
}

/**
 * Initialize webhook listener (runs every 30 seconds)
 * This should be called from a background process or API route
 */
export function startWebhookListener(): void {
  const config = loadWebhookConfig();
  
  if (!config?.webhookId) {
    console.log('No webhook configured. Registering new webhook...');
    registerWebhook().then((webhookId) => {
      if (webhookId) {
        // Start polling after registration
        setInterval(() => {
          pollWebhookNotifications(webhookId);
        }, 30000); // Poll every 30 seconds
      }
    });
    return;
  }

  // Check webhook health periodically
  setInterval(async () => {
    const isHealthy = await checkWebhookHealth(config.webhookId!);
    if (!isHealthy) {
      console.warn('Webhook health check failed. Attempting to re-register...');
      await registerWebhook();
    }
  }, 300000); // Check every 5 minutes

  // Poll for notifications every 30 seconds
  setInterval(() => {
    pollWebhookNotifications(config.webhookId!);
  }, 30000);
}

