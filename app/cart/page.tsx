'use client';

import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StockImage from '@/components/images/StockImage';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { Warehouse } from '@/lib/context/WarehouseContext';
import { useCartRefresh } from '@/lib/hooks/useCartRefresh';
import { useEffect, useRef } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, updateWarehouse, updateItemPrice, updateItemProduct, getTotal, clearCart } = useCart();
  const router = useRouter();
  const ruoDisclaimer = getComplianceText('RUO_DISCLAIMER');
  const { validatedItems, loading, refresh } = useCartRefresh(items);

  // Update cart items with fresh data and prices when validation completes
  // Use a ref to prevent infinite loops
  const lastValidatedItemsRef = useRef<string>('');
  
  useEffect(() => {
    if (validatedItems.length > 0) {
      // Create a stable key to prevent unnecessary updates
      const validationKey = JSON.stringify(validatedItems.map(v => ({
        id: v.item.product.id,
        variant: v.item.variantStrength,
        price: v.updatedPrice,
      })));
      
      // Only update if validation actually changed
      if (validationKey === lastValidatedItemsRef.current) {
        return;
      }
      
      lastValidatedItemsRef.current = validationKey;
      
      validatedItems.forEach((validation) => {
        if (validation.updatedProduct && validation.updatedPrice !== undefined && validation.updatedPrice > 0) {
          // Always update price from Airtable (even if it's the same, to ensure it's correct)
          updateItemPrice(
            validation.item.product.id,
            validation.item.variantStrength,
            validation.updatedPrice
          );
          
          // Update product data if it changed
          if (validation.updatedProduct.slug !== validation.item.product.slug) {
            updateItemProduct(
              validation.item.product.id,
              validation.item.variantStrength,
              validation.updatedProduct
            );
          }
        }
      });
    }
  }, [validatedItems, updateItemPrice, updateItemProduct]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="bg-ivory min-h-screen text-charcoal">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-heading text-4xl font-bold text-charcoal mb-6">Your Cart is Empty</h1>
            <p className="text-charcoal mb-8">Add some research peptides to your cart to continue.</p>
            <Link
              href="/shop"
              className="inline-block bg-ivory border-2 border-charcoal text-charcoal px-8 py-4 rounded-lg font-semibold text-lg hover:bg-charcoal hover:text-ivory transition-all duration-400 shadow-md uppercase tracking-wide"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = 15.00; // Fixed shipping cost
  const total = subtotal + shipping;

  return (
    <div className="bg-ivory min-h-screen text-charcoal">
      {/* Page Header */}
      <section className="bg-ivory border-b border-taupe py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-heading text-4xl md:text-5xl font-bold text-charcoal mb-2">
                  Shopping Cart
                </h1>
                <p className="text-lg text-charcoal">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              {/* Checkout Now Button - Direct from Cart */}
              <button
                onClick={handleCheckout}
                className="hidden md:block bg-ivory border-2 border-charcoal text-charcoal px-8 py-4 rounded-lg font-semibold text-lg hover:bg-charcoal hover:text-ivory transition-all duration-400 shadow-md hover:shadow-lg min-h-[44px] flex items-center justify-center uppercase tracking-wide"
              >
                Checkout Now
              </button>
            </div>
            {/* Mobile Checkout Button */}
            <button
              onClick={handleCheckout}
              className="md:hidden w-full bg-ivory border-2 border-charcoal text-charcoal py-4 px-6 rounded-lg font-semibold hover:bg-charcoal hover:text-ivory transition-all duration-400 shadow-md min-h-[44px] flex items-center justify-center uppercase tracking-wide"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-ivory rounded-lg border border-taupe p-6 space-y-6" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
                  {loading && (
                    <div className="text-center py-4 text-charcoal">
                      Refreshing product data...
                    </div>
                  )}
                  {items.map((item) => {
                    // Use variantStrength if available, otherwise fall back to size for legacy support
                    const variantStrength = item.variantStrength || item.size;
                    const itemKey = `${item.product.id}-${variantStrength || 'default'}-${item.warehouse}`;
                    const validation = validatedItems.find(
                      (v) => v.item.product.id === item.product.id && 
                             (v.item.variantStrength === variantStrength || (!v.item.variantStrength && !variantStrength))
                    );
                    const hasErrors = validation && !validation.isValid;
                    
                    return (
                    <div
                      key={itemKey}
                      className={`flex flex-col sm:flex-row gap-4 pb-6 border-b border-taupe last:border-b-0 last:pb-0 ${
                        hasErrors ? 'opacity-75' : ''
                      }`}
                    >
                      {hasErrors && (
                        <div className="w-full mb-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                          <p className="text-red-600 text-sm font-semibold mb-1">⚠️ Product Update Required</p>
                          {validation.errors.map((error, idx) => (
                            <p key={idx} className="text-red-500 text-xs">{error}</p>
                          ))}
                          <button
                            onClick={() => removeItem(item.product.id, variantStrength)}
                            className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
                          >
                            Remove from cart
                          </button>
                        </div>
                      )}
                      {/* Product Image */}
                      <div className="relative w-full sm:w-32 h-32 bg-taupe rounded-lg overflow-hidden flex-shrink-0 border border-stone">
                        <StockImage
                          imageType="product-placeholder"
                          context={item.product.name}
                          fill
                          className="rounded-lg"
                          sizes="128px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="text-heading text-xl font-bold text-charcoal hover:text-charcoal/80 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            {variantStrength && (
                              <p className="text-sm text-charcoal mt-1 font-semibold">
                                Variant: {variantStrength}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, variantStrength)}
                            className="text-charcoal hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Warehouse Selector */}
                        <div className="mt-3 mb-4">
                          <label className="block text-sm font-semibold text-charcoal mb-2">
                            Warehouse Selection
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateWarehouse(item.product.id, variantStrength, 'overseas')}
                              className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all duration-400 text-sm ${
                                item.warehouse === 'overseas'
                                  ? 'border-charcoal bg-charcoal text-ivory'
                                  : 'border-taupe bg-ivory text-charcoal hover:border-charcoal'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>🌍</span>
                                <span className="font-semibold">Overseas</span>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => updateWarehouse(item.product.id, variantStrength, 'us')}
                              className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all duration-400 text-sm ${
                                item.warehouse === 'us'
                                  ? 'border-charcoal bg-charcoal text-ivory'
                                  : 'border-taupe bg-ivory text-charcoal hover:border-charcoal'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>🇺🇸</span>
                                <span className="font-semibold">U.S.</span>
                              </div>
                            </button>
                          </div>
                          {item.product.warehouseOptions && (
                            <p className="text-xs text-charcoal mt-2">
                              {item.warehouse === 'us'
                                ? item.product.warehouseOptions.us.description
                                : item.product.warehouseOptions.overseas.description}
                            </p>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-charcoal font-medium">Quantity:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, variantStrength, item.quantity - 1)}
                                className="w-8 h-8 border border-taupe bg-ivory text-charcoal rounded hover:bg-taupe hover:border-charcoal transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center text-charcoal font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, variantStrength, item.quantity + 1)}
                                className="w-8 h-8 border border-taupe bg-ivory text-charcoal rounded hover:bg-taupe hover:border-charcoal transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs text-charcoal ml-2">vials</span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-charcoal">
                              ${((item.calculatedPrice || 0) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-charcoal">
                              ${(item.calculatedPrice || 0).toFixed(2)} per vial
                              {item.warehouse === 'us' && ' (US)'}
                              {item.warehouse === 'overseas' && ' (Overseas)'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/shop"
                    className="inline-flex items-center text-charcoal hover:text-charcoal/80 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-ivory rounded-lg border border-taupe p-6 sticky top-24" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
                  <h2 className="text-heading text-2xl font-bold text-charcoal mb-6">
                    Order Summary
                  </h2>

                  {/* Subtotal */}
                  <div className="flex justify-between mb-4">
                    <span className="text-charcoal">Subtotal</span>
                    <span className="text-charcoal font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between mb-4">
                    <span className="text-charcoal">Shipping</span>
                    <span className="text-charcoal font-semibold">${shipping.toFixed(2)}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-taupe my-6"></div>

                  {/* Total */}
                  <div className="flex justify-between mb-6">
                    <span className="text-heading text-xl font-bold text-charcoal">Total</span>
                    <span className="text-heading text-xl font-bold text-charcoal">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* RUO Disclaimer */}
                  <div className="mb-6 p-4 bg-taupe border border-stone rounded text-xs text-charcoal">
                    {ruoDisclaimer}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-ivory border-2 border-charcoal text-charcoal py-4 px-6 rounded-lg font-semibold text-lg hover:bg-charcoal hover:text-ivory transition-all duration-400 shadow-md hover:shadow-lg min-h-[44px] flex items-center justify-center uppercase tracking-wide"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full mt-4 text-charcoal hover:text-red-600 transition-colors text-sm min-h-[44px] flex items-center justify-center underline"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
