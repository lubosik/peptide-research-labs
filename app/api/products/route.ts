import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/airtableClient';

export const revalidate = 0; // Always fetch fresh data from Airtable
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET(request: Request) {
  try {
    // Add cache control headers to prevent caching
    const products = await getAllProducts();
    return NextResponse.json(
      { products, timestamp: new Date().toISOString() },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

