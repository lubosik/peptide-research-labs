'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import StockImage from '@/components/images/StockImage';
import AddToCartButton from './AddToCartButton';
import WarehouseSelector from './WarehouseSelector';
import RelatedProductsAccordion from './RelatedProductsAccordion';
import { useToast } from '@/components/ui/ToastProvider';
import { useWarehouse } from '@/lib/context/WarehouseContext';
import { getComplianceText } from '@/lib/utils/compliance-text';

interface ProductDetailLayoutProps {
  product: Product;
}

export default function ProductDetailLayout({ product }: ProductDetailLayoutProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('50MG');
  const [quantity, setQuantity] = useState(1);
  const { showToast } = useToast();
  const { getPrice } = useWarehouse();
  
  const displayPrice = getPrice(product);

  // Gallery images
  const galleryImages = [
    { type: 'product-placeholder' as const },
    { type: 'laboratory-vials' as const },
    { type: 'scientific-beakers' as const },
    { type: 'research-equipment' as const },
  ];

  const sizes = ['50MG', '100MG', '250MG'];

  const handleNotifyMe = () => {
    showToast('You will be notified when this product is back in stock', 'info');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-gray-300">
      {/* Breadcrumbs */}
      <section className="bg-slate-900 border-b border-slate-800 py-4">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm">
              <ol className="flex items-center space-x-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/shop" className="hover:text-primary transition-colors">
                    Shop
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white font-medium">{product.name}</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Product Section - Three Column Layout */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column - Thumbnail Gallery (10%) */}
              <div className="col-span-12 md:col-span-1">
                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 md:w-full flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                        selectedImage === index
                          ? 'border-primary shadow-glow-sm'
                          : 'border-gray-600 hover:border-primary/50'
                      }`}
                    >
                      <StockImage
                        imageType={image.type}
                        context={product.name}
                        fill
                        className="rounded-lg"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Center Column - Main Image (50%) */}
              <div className="col-span-12 md:col-span-6">
                <div className="relative w-full h-96 md:h-[600px] rounded-lg overflow-hidden bg-slate-800">
                  <StockImage
                    imageType={galleryImages[selectedImage].type}
                    context={product.name}
                    fill
                    priority
                    className="rounded-lg object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Right Column - Product Info (40%) */}
              <div className="col-span-12 md:col-span-5">
                <h1 className="text-heading text-3xl md:text-4xl font-bold text-white mb-6">
                  {product.name}
                </h1>

                {/* Warehouse Selector */}
                <div className="mb-6">
                  <WarehouseSelector />
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-white mb-2">SIZE</label>
                  <div className="flex gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
                          selectedSize === size
                            ? 'bg-primary border-primary text-white shadow-glow-sm'
                            : 'bg-slate-800 border-gray-600 text-gray-300 hover:border-primary/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-white">
                      ${displayPrice.toFixed(2)}
                    </span>
                    {product.warehouseOptions && (
                      <span className="text-sm text-gray-400">
                        (Base: ${product.price.toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                {product.inStock ? (
                  <div className="mb-6">
                    <span className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold text-sm border border-green-500/30">
                      In Stock
                    </span>
                  </div>
                ) : (
                  <div className="mb-6">
                    <span className="inline-block bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold text-sm border border-red-500/30">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                {product.inStock ? (
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">QUANTITY</label>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-12 h-12 border border-gray-600 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-20 text-center border border-gray-600 bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-12 h-12 border border-gray-600 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <AddToCartButton 
                      product={product} 
                      size={selectedSize} 
                      quantity={quantity}
                      warehousePrice={displayPrice}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <button
                      onClick={handleNotifyMe}
                      className="w-full bg-slate-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-slate-600 transition-colors duration-200 border border-gray-600 flex items-center justify-center space-x-2"
                    >
                      <span>NOTIFY WHEN BACK IN STOCK</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description and Properties Section - Two Column Layout */}
      <section className="py-12 md:py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Description */}
              <div>
                <h2 className="text-heading text-3xl font-bold text-white mb-6">DESCRIPTION</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {/* Right Column - Properties */}
              <div>
                <h2 className="text-heading text-3xl font-bold text-white mb-6">PROPERTIES</h2>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400 font-semibold">SIZE : </span>
                    <span className="text-white">{selectedSize}</span>
                  </div>
                  {product.chemicalFormula && (
                    <div>
                      <span className="text-gray-400 font-semibold">CHEMICAL FORMULA : </span>
                      <span className="text-white font-mono">{product.chemicalFormula}</span>
                    </div>
                  )}
                  {product.synonyms && product.synonyms.length > 0 && (
                    <div>
                      <span className="text-gray-400 font-semibold">SYNONYMS : </span>
                      <span className="text-white">{product.synonyms.join(', ')}</span>
                    </div>
                  )}
                  {product.molarMass && (
                    <div>
                      <span className="text-gray-400 font-semibold">MOLAR MASS : </span>
                      <span className="text-white">{product.molarMass}</span>
                    </div>
                  )}
                  {product.casNumber && (
                    <div>
                      <span className="text-gray-400 font-semibold">CAS NUMBER : </span>
                      <span className="text-white">{product.casNumber}</span>
                    </div>
                  )}
                  {product.pubchemId && (
                    <div>
                      <span className="text-gray-400 font-semibold">PUBCHEM : </span>
                      <span className="text-white">{product.pubchemId}</span>
                    </div>
                  )}
                  {product.shelfLife && (
                    <div>
                      <span className="text-gray-400 font-semibold">SHELF LIFE : </span>
                      <span className="text-white">{product.shelfLife}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <RelatedProductsAccordion
              currentProductId={product.id}
              currentCategory={product.category}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

