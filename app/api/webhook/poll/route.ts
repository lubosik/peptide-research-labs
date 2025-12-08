import { NextResponse } from 'next/server';
import { pollWebhookNotifications, loadWebhookConfig } from '@/lib/airtableWebhookListener';

/**
 * Manual webhook polling endpoint
 * Can be called by cron jobs or external schedulers
 */
export async function POST() {
  try {
    const config = loadWebhookConfig();
    
    if (!config?.webhookId) {
      return NextResponse.json(
        {
          success: false,
          error: 'No webhook configured',
        },
        { status: 400 }
      );
    }

    await pollWebhookNotifications(config.webhookId);
    
    return NextResponse.json({
      success: true,
      message: 'Webhook polled successfully',
      webhookId: config.webhookId,
    });
  } catch (error) {
    console.error('Error polling webhook:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to poll webhook',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

