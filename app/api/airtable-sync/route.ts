import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'airtable_sync.log');

/**
 * Ensure logs directory exists
 */
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * Log sync event to file
 */
function logSyncEvent(message: string, data?: any) {
  ensureLogDir();
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}${data ? ` | Data: ${JSON.stringify(data)}` : ''}\n`;
  
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

/**
 * Airtable webhook sync endpoint
 * Handles webhook notifications and triggers revalidation
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Verify webhook secret if configured
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.AIRTABLE_WEBHOOK_SECRET;
    
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      logSyncEvent('Unauthorized webhook request', { authHeader: authHeader ? 'present' : 'missing' });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { base, webhook, payload } = body;

    const tableId = process.env.AIRTABLE_TABLE_ID;
    const changedRecords = tableId && payload?.changedTablesById?.[tableId]?.changedRecordsById || {};
    const recordIds = Object.keys(changedRecords);

    logSyncEvent('Webhook received', {
      baseId: base?.id,
      webhookId: webhook?.id,
      payloadType: payload?.type,
      recordCount: recordIds.length,
    });

    if (recordIds.length === 0) {
      logSyncEvent('No relevant record changes detected');
      return NextResponse.json({
        success: true,
        message: 'No changes to sync',
      });
    }

    // Revalidate all relevant routes
    const revalidatedPaths: string[] = [];
    
    try {
      // Revalidate shop page
      revalidatePath('/shop');
      revalidatedPaths.push('/shop');
      
      // Revalidate all category pages (we'll need to get category slugs)
      // For now, revalidate common categories
      const categories = [
        'beauty-anti-aging-antioxidant',
        'weight-loss-blood-sugar-control-metabolic-regulation',
        'hormones-growth-factors-bodybuilding',
        'repair-healing-anti-inflammatory',
        'cognitive-neurological-nootropic',
        'sexual-health-libido-enhancement',
        'other-research-compounds',
      ];
      
      categories.forEach(cat => {
        revalidatePath(`/categories/${cat}`);
        revalidatedPaths.push(`/categories/${cat}`);
      });

      // Revalidate product pages (we'll need to fetch slugs for changed records)
      // For now, we'll revalidate all product pages
      revalidatePath('/products', 'layout');
      revalidatedPaths.push('/products/*');

      logSyncEvent('Revalidation successful', {
        recordCount: recordIds.length,
        revalidatedPaths: revalidatedPaths.length,
      });

      // Update webhook status
      updateWebhookStatus({
        lastSync: new Date().toISOString(),
        recordCount: recordIds.length,
        status: 'success',
      });

      return NextResponse.json({
        success: true,
        message: 'Site revalidated',
        revalidatedPaths,
        recordCount: recordIds.length,
      });
    } catch (revalidateError) {
      logSyncEvent('Revalidation failed', { error: String(revalidateError) });
      updateWebhookStatus({
        lastSync: new Date().toISOString(),
        recordCount: recordIds.length,
        status: 'error',
        error: String(revalidateError),
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Revalidation failed',
          details: String(revalidateError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    logSyncEvent('Webhook processing error', { error: String(error) });
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Update webhook status file
 */
function updateWebhookStatus(status: {
  lastSync: string;
  recordCount: number;
  status: 'success' | 'error';
  error?: string;
}) {
  const statusFile = path.join(process.cwd(), 'config', 'webhookStatus.json');
  const statusDir = path.dirname(statusFile);

  if (!fs.existsSync(statusDir)) {
    fs.mkdirSync(statusDir, { recursive: true });
  }

  const currentStatus = {
    ...status,
    updatedAt: new Date().toISOString(),
  };

  try {
    fs.writeFileSync(statusFile, JSON.stringify(currentStatus, null, 2));
  } catch (error) {
    console.error('Failed to update webhook status:', error);
  }
}

