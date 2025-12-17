import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/airtableClient';

export const revalidate = 0; // Always fetch fresh data
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);
    const allProducts = await getProductsByCategory(decodedCategory);
    
    // Apply explicit filtering at the API level
    // A product should display if: inStock === true && isDiscontinued !== true && apiVisibilityStatus === 'LIVE'
    const filteredProducts = allProducts.filter((product) => {
      return (
        product.inStock === true &&
        product.isDiscontinued !== true &&
        product.apiVisibilityStatus === 'LIVE'
      );
    });
    
    console.log(`[API Category] Category: ${decodedCategory}, Total: ${allProducts.length}, Filtered: ${filteredProducts.length}`);
    
    return NextResponse.json({ products: filteredProducts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

