import { NextResponse } from 'next/server';
import { registerWebhook, loadWebhookConfig } from '@/lib/airtableWebhookListener';

/**
 * Test webhook registration and return status
 */
export async function GET() {
  try {
    const config = loadWebhookConfig();
    
    if (!config?.webhookId) {
      return NextResponse.json({
        registered: false,
        message: 'No webhook registered. Use POST to register one.',
      });
    }

    return NextResponse.json({
      registered: true,
      webhookId: config.webhookId,
      notificationURL: config.notificationURL,
      baseId: config.baseId,
      tableId: config.tableId,
      createdAt: config.createdAt,
      lastChecked: config.lastChecked,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to check webhook status',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Register or re-register webhook
 */
export async function POST() {
  try {
    const webhookId = await registerWebhook();
    
    if (webhookId) {
      return NextResponse.json({
        success: true,
        message: 'Webhook registered successfully',
        webhookId,
        notificationURL: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://peptide-research-labs.vercel.app'}/api/airtable-sync`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to register webhook',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error registering webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register webhook',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

