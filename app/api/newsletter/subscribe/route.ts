import { NextRequest, NextResponse } from 'next/server';

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY || 'kit_1fa371d49bc3c6ec11d45d18b1a34c57';
const CONVERTKIT_API_URL = 'https://api.kit.com/v4';

/**
 * Subscribe a user to ConvertKit newsletter
 * Uses ConvertKit V4 API
 * 
 * First tries to add subscriber to a form (if form ID is configured)
 * Otherwise creates a subscriber directly
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, tags } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Get form ID from environment or use default
    const formId = process.env.CONVERTKIT_FORM_ID;

    let subscriberResponse: Response | null = null;
    let subscriberData: any = null;
    
    // Try to add subscriber to form first (preferred method)
    if (formId) {
      subscriberResponse = await fetch(
        `${CONVERTKIT_API_URL}/forms/${formId}/subscribers`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CONVERTKIT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email.trim(),
            first_name: firstName?.trim() || undefined,
          }),
        }
      );

      if (subscriberResponse.ok) {
        subscriberData = await subscriberResponse.json();
      } else {
        // If form subscription fails, try creating subscriber directly
        const errorData = await subscriberResponse.json().catch(() => ({}));
        console.log('Form subscription failed, trying direct subscriber creation:', errorData);
      }
    }

    // If no form ID or form subscription failed, create subscriber directly
    if (!subscriberData) {
      subscriberResponse = await fetch(
        `${CONVERTKIT_API_URL}/subscribers`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CONVERTKIT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email.trim(),
            first_name: firstName?.trim() || undefined,
          }),
        }
      );

      if (subscriberResponse.ok) {
        subscriberData = await subscriberResponse.json();
      }
    }

    // Check if subscription was successful
    if (subscriberData) {
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter!',
        subscriber: subscriberData.subscriber || subscriberData,
      });
    }

    // Handle errors
    if (subscriberResponse && !subscriberResponse.ok) {
      const errorData = await subscriberResponse.json().catch(() => ({}));
      console.error('ConvertKit API error:', errorData);
      
      // If subscriber already exists (422), that's okay - they're subscribed
      if (subscriberResponse.status === 422 || subscriberResponse.status === 409) {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed!',
          alreadySubscribed: true,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to subscribe to newsletter',
          details: errorData.errors || errorData.message || ['Unknown error'],
        },
        { status: subscriberResponse.status }
      );
    }

    // Fallback error
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process subscription',
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error subscribing to ConvertKit:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process subscription',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

