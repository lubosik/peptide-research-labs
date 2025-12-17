import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/airtableClient';

export const revalidate = 0; // Always fetch fresh data from Airtable
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET(request: Request) {
  try {
    // Fetch all products from Airtable (no pre-filtering)
    const allProducts = await getAllProducts();
    
    // Apply explicit filtering at the API level
    // A product should display if: inStock === true && isDiscontinued !== true && apiVisibilityStatus === 'LIVE'
    const filteredProducts = allProducts.filter((product) => {
      return (
        product.inStock === true &&
        product.isDiscontinued !== true &&
        product.apiVisibilityStatus === 'LIVE'
      );
    });
    
    console.log(`[API] Total products fetched: ${allProducts.length}`);
    console.log(`[API] Products after filtering (inStock=true, !isDiscontinued, LIVE): ${filteredProducts.length}`);
    
    return NextResponse.json(
      { products: filteredProducts, timestamp: new Date().toISOString() },
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

