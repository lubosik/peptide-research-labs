'use client';

import { useEffect, useState } from 'react';

interface ProductImage {
  productName: string;
  imageURL: string;
  isValid: boolean;
}

export default function TestImagesPage() {
  const [products, setProducts] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        const productsWithImages = data.products
          .filter((p: any) => p.imageURL && p.imageURL !== '/images/products/placeholder.jpg')
          .slice(0, 10)
          .map((p: any) => ({
            productName: p.productName,
            imageURL: p.imageURL,
            isValid: p.imageURL.startsWith('https://v5.airtableusercontent.com/') || 
                     p.imageURL.startsWith('https://dl.airtable.com/'),
          }));
        
        setProducts(productsWithImages);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8 bg-ivory min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Image URL Test Page</h1>
      <p className="mb-4">This page shows the image URLs being extracted from Airtable.</p>
      
      <div className="space-y-6">
        {products.map((product, idx) => (
          <div key={idx} className="border border-taupe p-4 rounded-lg bg-white">
            <h2 className="font-bold text-lg mb-2">{product.productName}</h2>
            <div className="mb-2">
              <span className={`px-2 py-1 rounded ${product.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.isValid ? '✓ Valid Airtable URL' : '✗ Invalid URL'}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 break-all">{product.imageURL}</p>
            </div>
            <div className="border border-taupe rounded overflow-hidden" style={{ width: '200px', height: '200px' }}>
              <img 
                src={product.imageURL} 
                alt={product.productName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error(`Failed to load image for ${product.productName}:`, product.imageURL);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onLoad={() => {
                  console.log(`Successfully loaded image for ${product.productName}`);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-red-600">
          No products with images found. Check that Airtable attachments are configured correctly.
        </div>
      )}
    </div>
  );
}

