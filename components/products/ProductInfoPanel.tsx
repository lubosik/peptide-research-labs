'use client';

import { useState } from 'react';
import { Product } from '@/data/products';
import AddToCartButton from './AddToCartButton';
import WarehouseSelector from './WarehouseSelector';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { useWarehouse } from '@/lib/context/WarehouseContext';

interface ProductInfoPanelProps {
  product: Product;
}

export default function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [selectedSize, setSelectedSize] = useState('50MG');
  const [quantity, setQuantity] = useState(1);
  const { getPrice } = useWarehouse();

  const sizes = ['50MG', '100MG', '250MG'];
  const displayPrice = getPrice(product);

  return (
    <div>
      <h1 className="text-heading text-3xl md:text-4xl font-bold text-white mb-4">
        {product.name}
      </h1>

      {/* Warehouse Selector */}
      <div className="mb-6">
        <WarehouseSelector />
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

      {/* Size Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-white mb-2">
          SIZE
        </label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full border border-gray-600 bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-white mb-2">
          QUANTITY
        </label>
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

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-300 leading-relaxed">{product.description}</p>
      </div>

      {/* Compliance Disclaimers */}
      <div className="mb-6 space-y-3">
        <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-300 font-semibold mb-2">
            Regulatory Notice:
          </p>
          <p className="text-sm text-red-200">
            {getComplianceText('NOT_FDA_APPROVED')}
          </p>
        </div>
        <div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
          <p className="text-sm text-yellow-300 font-semibold mb-2">
            Important Research Note:
          </p>
          <p className="text-sm text-yellow-200">
            {getComplianceText('NO_MEDICAL_ADVICE')}
          </p>
        </div>
        <div className="p-4 bg-orange-500/10 border-l-4 border-orange-500 rounded">
          <p className="text-sm text-orange-300 font-semibold mb-2">
            Safety & Handling Disclaimer:
          </p>
          <p className="text-sm text-orange-200">
            {getComplianceText('USE_AT_OWN_RISK')}
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mb-6">
        <AddToCartButton 
          product={product} 
          size={selectedSize} 
          quantity={quantity}
          warehousePrice={displayPrice}
        />
      </div>
    </div>
  );
}

