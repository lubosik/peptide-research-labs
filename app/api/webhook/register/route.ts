import { NextResponse } from 'next/server';
import { registerWebhook } from '@/lib/airtableWebhookListener';

/**
 * Manual webhook registration endpoint
 * Call this once to set up the webhook
 */
export async function POST() {
  try {
    const webhookId = await registerWebhook();
    
    if (webhookId) {
      return NextResponse.json({
        success: true,
        message: 'Webhook registered successfully',
        webhookId,
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

