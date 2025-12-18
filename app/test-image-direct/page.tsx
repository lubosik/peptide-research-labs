'use client';

export default function TestImageDirectPage() {
  const images = [
    { name: '5-amino-1mq', path: '/images/products/vici-5-amino-1mq.png' },
    { name: 'ACETIC ACID', path: '/images/products/vici-acetic-acid.png' },
    { name: 'Adipotide', path: '/images/products/vici-adipotide.png' },
    { name: 'AICAR', path: '/images/products/vici-aicar.png' },
  ];

  return (
    <div className="p-8 bg-ivory min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Direct Image Test</h1>
      <p className="mb-4">Testing if local images load directly:</p>
      
      <div className="grid grid-cols-2 gap-6">
        {images.map((img, idx) => (
          <div key={idx} className="border border-taupe p-4 rounded-lg">
            <h2 className="font-bold mb-2">{img.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{img.path}</p>
            <div className="border border-taupe rounded overflow-hidden" style={{ width: '300px', height: '300px', backgroundColor: '#E6DED4' }}>
              <img 
                src={img.path}
                alt={img.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error(`Failed to load ${img.name}:`, img.path);
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="p-4 text-red-600">Failed to load image</div>`;
                  }
                }}
                onLoad={() => {
                  console.log(`✓ Successfully loaded ${img.name}:`, img.path);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

