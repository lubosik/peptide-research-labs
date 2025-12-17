'use client';

import { useState, useEffect } from 'react';
import { Product, ProductVariant, hasVariants, getDefaultVariant, getProductMinPrice, isProductInStock } from '@/data/products';
import AddToCartButton from './AddToCartButton';
import WarehouseSelector from './WarehouseSelector';
import VariantSelector from './VariantSelector';
import VariantComparisonTable from './VariantComparisonTable';
import FloatingAddToCart from './FloatingAddToCart';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { useWarehouse } from '@/lib/context/WarehouseContext';

interface ProductInfoPanelProps {
  product: Product;
}

export default function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { selectedWarehouse, getPrice } = useWarehouse();

  const hasMultipleVariants = hasVariants(product);

  // Initialize selected variant
  useEffect(() => {
    if (hasMultipleVariants && product.variants && product.variants.length > 0) {
      // Select first in-stock variant, or first variant if none in stock
      const inStockVariant = product.variants.find(v => v.inStock);
      setSelectedVariant(inStockVariant || product.variants[0]);
    } else {
      // Legacy product - create default variant
      const defaultVariant = getDefaultVariant(product);
      setSelectedVariant(defaultVariant);
    }
  }, [product, hasMultipleVariants]);

  // Get display price based on selected variant or legacy price
  const getDisplayPrice = () => {
    if (selectedVariant && selectedVariant.price > 0) {
      const warehouseMultiplier =
        product.warehouseOptions?.[selectedWarehouse]?.priceMultiplier ?? 1.0;
      return selectedVariant.price * warehouseMultiplier;
    }
    // Fallback to product price or min price from variants
    if (product.price && product.price > 0) {
      const warehouseMultiplier =
        product.warehouseOptions?.[selectedWarehouse]?.priceMultiplier ?? 1.0;
      return product.price * warehouseMultiplier;
    }
    // If product has variants, get min price
    if (product.variants && product.variants.length > 0) {
      const minVariantPrice = Math.min(...product.variants.map(v => v.price).filter(p => p > 0));
      if (minVariantPrice > 0) {
        const warehouseMultiplier =
          product.warehouseOptions?.[selectedWarehouse]?.priceMultiplier ?? 1.0;
        return minVariantPrice * warehouseMultiplier;
      }
    }
    return 0;
  };

  const displayPrice = getDisplayPrice();
  const inStock = selectedVariant ? selectedVariant.inStock : isProductInStock(product);

  return (
    <div className="relative">
      {/* Title - Above Fold */}
      <h1 className="text-heading text-3xl md:text-4xl font-bold text-charcoal mb-6">
        {product.name}
      </h1>

      {/* Out of Stock Badge - Red badge beneath product name */}
      {!inStock && (
        <div className="mb-4">
          <span className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold text-sm border border-red-200">
            Out of Stock
          </span>
        </div>
      )}

      {/* Price Display - Above Fold */}
      <div className="mb-6 pb-6 border-b border-taupe">
        <div className="flex items-baseline gap-3">
          <span 
            key={`price-${selectedVariant?.strength || 'default'}`}
            className="text-4xl font-bold text-charcoal"
          >
            ${displayPrice.toFixed(2)}
          </span>
          {selectedVariant && (
            <span 
              key={`spec-${selectedVariant.strength}`}
              className="text-sm text-stone"
            >
              {selectedVariant.specification || selectedVariant.strength}
            </span>
          )}
        </div>
        {selectedVariant && (
          <div 
            key={`sku-${selectedVariant.strength}`}
            className="mt-2"
          >
            <span className="text-sm text-stone">
              SKU: <span className="text-charcoal font-mono">{selectedVariant.sku}</span>
            </span>
          </div>
        )}
        {/* Stock Status */}
        {inStock && (
          <div 
            key={`stock-${selectedVariant?.strength || 'default'}`}
            className="mt-3"
          >
            <span className="inline-block bg-taupe text-charcoal px-4 py-2 rounded-lg font-semibold text-sm border border-stone">
              In Stock
            </span>
          </div>
        )}
      </div>

      {/* Interactive Elements Group - Above Fold */}
      <div className="mb-6 pb-6 border-b border-taupe space-y-4">
        {/* Variant Selector */}
        {hasMultipleVariants && selectedVariant && (
          <VariantSelector
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
          />
        )}

        {/* Warehouse Selector */}
        <div>
          <WarehouseSelector />
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">
            QUANTITY (Vials)
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 border border-taupe bg-ivory text-charcoal rounded-lg hover:bg-taupe transition-all duration-400 font-semibold"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center border border-taupe bg-ivory text-charcoal rounded-lg px-4 py-3 focus:outline-none focus:border-charcoal transition-all duration-400 font-serif"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 border border-taupe bg-ivory text-charcoal rounded-lg hover:bg-taupe transition-all duration-400 font-semibold"
            >
              +
            </button>
          </div>
          <p className="text-xs text-stone mt-2 italic">
            Each quantity unit = 1 research vial
          </p>
        </div>

        {/* Add to Cart Button - Desktop */}
        <div className="hidden md:block">
          <AddToCartButton 
            product={product} 
            variant={selectedVariant}
            quantity={quantity}
            warehousePrice={displayPrice}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 pb-6 border-b border-taupe">
        <h2 className="text-heading text-2xl font-bold text-charcoal mb-4">Description</h2>
        <p className="text-charcoal leading-relaxed">{product.description}</p>
      </div>

      {/* Variant Comparison Table */}
      {hasMultipleVariants && (
        <div className="mb-6 pb-6 border-b border-taupe">
          <VariantComparisonTable product={product} />
        </div>
      )}

      {/* Compliance Disclaimers */}
      <div className="mb-6 space-y-3">
        <div className="p-4 bg-red-50 border-l-4 border-red-200 rounded">
          <p className="text-sm text-red-600 font-semibold mb-2">
            Regulatory Notice:
          </p>
          <p className="text-sm text-charcoal">
            {getComplianceText('NOT_FDA_APPROVED')}
          </p>
        </div>
        <div className="p-4 bg-taupe border-l-4 border-stone rounded">
          <p className="text-sm text-charcoal font-semibold mb-2">
            Important Research Note:
          </p>
          <p className="text-sm text-charcoal">
            {getComplianceText('NO_MEDICAL_ADVICE')}
          </p>
        </div>
        <div className="p-4 bg-taupe border-l-4 border-stone rounded">
          <p className="text-sm text-charcoal font-semibold mb-2">
            Safety & Handling Disclaimer:
          </p>
          <p className="text-sm text-charcoal">
            {getComplianceText('USE_AT_OWN_RISK')}
          </p>
        </div>
      </div>

      {/* Floating Add to Cart Button - Mobile Only */}
      <FloatingAddToCart
        product={product}
        variant={selectedVariant}
        quantity={quantity}
        warehousePrice={displayPrice}
      />
    </div>
  );
}

