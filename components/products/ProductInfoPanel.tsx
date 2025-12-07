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
    if (selectedVariant) {
      const warehouseMultiplier =
        product.warehouseOptions?.[selectedWarehouse]?.priceMultiplier ?? 1.0;
      return selectedVariant.price * warehouseMultiplier;
    }
    return getPrice(product);
  };

  const displayPrice = getDisplayPrice();
  const inStock = selectedVariant ? selectedVariant.inStock : isProductInStock(product);

  return (
    <div className="relative">
      {/* Title - Above Fold */}
      <h1 className="text-heading text-3xl md:text-4xl font-bold text-accent-gold-light mb-6">
        {product.name}
      </h1>

      {/* Price Display - Above Fold */}
      <div className="mb-6 pb-6 border-b border-luxury-gold/20">
        <div className="flex items-baseline gap-3">
          <span 
            key={`price-${selectedVariant?.strength || 'default'}`}
            className="text-4xl font-bold text-luxury-gold"
          >
            ${displayPrice.toFixed(2)}
          </span>
          {selectedVariant && (
            <span 
              key={`spec-${selectedVariant.strength}`}
              className="text-sm text-neutral-gray"
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
            <span className="text-sm text-neutral-gray">
              SKU: <span className="text-pure-white font-mono">{selectedVariant.sku}</span>
            </span>
          </div>
        )}
        {/* Stock Status */}
        <div 
          key={`stock-${selectedVariant?.strength || 'default'}`}
          className="mt-3"
        >
          {inStock ? (
            <span className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-semibold text-sm border border-green-500/30">
              In Stock
            </span>
          ) : (
            <span className="inline-block bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-semibold text-sm border border-red-500/30">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Interactive Elements Group - Above Fold */}
      <div className="mb-6 pb-6 border-b border-luxury-gold/20 space-y-4">
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
          <label className="block text-sm font-semibold text-accent-gold-light mb-2">
            QUANTITY (Vials)
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 border border-luxury-gold/30 bg-secondary-charcoal text-pure-white rounded-lg hover:bg-luxury-gold/20 hover:border-luxury-gold transition-all duration-400 font-semibold"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center border border-luxury-gold/30 bg-secondary-charcoal text-pure-white rounded-lg px-4 py-3 focus:outline-none focus:border-luxury-gold transition-all duration-400"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 border border-luxury-gold/30 bg-secondary-charcoal text-pure-white rounded-lg hover:bg-luxury-gold/20 hover:border-luxury-gold transition-all duration-400 font-semibold"
            >
              +
            </button>
          </div>
          <p className="text-xs text-neutral-gray mt-2 italic">
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

      {/* Quantity Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-accent-gold-light mb-2">
          QUANTITY (Vials)
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 border border-luxury-gold/30 bg-secondary-charcoal text-pure-white rounded-lg hover:bg-luxury-gold/20 hover:border-luxury-gold transition-colors font-semibold"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center border border-luxury-gold/30 bg-secondary-charcoal text-pure-white rounded-lg px-4 py-3 focus:outline-none focus:border-luxury-gold"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 border border-luxury-gold/30 bg-secondary-charcoal text-pure-white rounded-lg hover:bg-luxury-gold/20 hover:border-luxury-gold transition-colors font-semibold"
          >
            +
          </button>
        </div>
        <p className="text-xs text-neutral-gray mt-2 italic">
          Each quantity unit = 1 research vial
        </p>
      </div>

      {/* Description */}
      <div className="mb-6 pb-6 border-b border-luxury-gold/20">
        <p className="text-pure-white leading-relaxed">{product.description}</p>
      </div>

      {/* Variant Comparison Table */}
      {hasMultipleVariants && (
        <div className="mb-6 pb-6 border-b border-luxury-gold/20">
          <VariantComparisonTable product={product} />
        </div>
      )}

      {/* Compliance Disclaimers */}
      <div className="mb-6 space-y-3">
        <div className="p-4 bg-red-500/10 border-l-4 border-red-500/50 rounded">
          <p className="text-sm text-red-400 font-semibold mb-2">
            Regulatory Notice:
          </p>
          <p className="text-sm text-pure-white">
            {getComplianceText('NOT_FDA_APPROVED')}
          </p>
        </div>
        <div className="p-4 bg-luxury-gold/10 border-l-4 border-luxury-gold/50 rounded">
          <p className="text-sm text-accent-gold-light font-semibold mb-2">
            Important Research Note:
          </p>
          <p className="text-sm text-pure-white">
            {getComplianceText('NO_MEDICAL_ADVICE')}
          </p>
        </div>
        <div className="p-4 bg-accent-gold-dark/10 border-l-4 border-accent-gold-dark/50 rounded">
          <p className="text-sm text-accent-gold-light font-semibold mb-2">
            Safety & Handling Disclaimer:
          </p>
          <p className="text-sm text-pure-white">
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

