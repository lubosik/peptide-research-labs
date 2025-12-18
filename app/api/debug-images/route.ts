import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/airtableClient';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const allProducts = await getAllProducts();
    
    // Get products with images
    const productsWithImages = allProducts
      .filter(p => p.imageURL && p.imageURL !== '/images/products/placeholder.jpg')
      .slice(0, 5); // First 5 products with images
    
    // Get raw Airtable data for debugging
    const debugInfo = productsWithImages.map(product => ({
      productName: product.productName,
      imageURL: product.imageURL,
      imageURLLength: product.imageURL?.length || 0,
      isAirtableUrl: product.imageURL?.includes('airtableusercontent.com') || product.imageURL?.includes('dl.airtable.com'),
      startsWithHttps: product.imageURL?.startsWith('https://'),
    }));
    
    return NextResponse.json({
      totalProducts: allProducts.length,
      productsWithImages: productsWithImages.length,
      debugInfo,
      sampleProduct: productsWithImages[0] || null,
    }, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug info', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

