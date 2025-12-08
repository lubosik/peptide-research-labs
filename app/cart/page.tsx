'use client';

import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StockImage from '@/components/images/StockImage';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { Warehouse } from '@/lib/context/WarehouseContext';
import { useCartRefresh } from '@/lib/hooks/useCartRefresh';
import { useEffect } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, updateWarehouse, updateItemPrice, updateItemProduct, getTotal, clearCart } = useCart();
  const router = useRouter();
  const ruoDisclaimer = getComplianceText('RUO_DISCLAIMER');
  const { validatedItems, loading, refresh } = useCartRefresh(items);

  // Update cart items with fresh data and prices when validation completes
  useEffect(() => {
    if (validatedItems.length > 0) {
      validatedItems.forEach((validation) => {
        if (validation.updatedProduct && validation.updatedPrice !== undefined) {
          // Update product data if it changed
          if (validation.updatedProduct.slug !== validation.item.product.slug) {
            updateItemProduct(
              validation.item.product.id,
              validation.item.variantStrength,
              validation.updatedProduct
            );
          }
          // Update price if it changed
          if (Math.abs(validation.updatedPrice - validation.item.calculatedPrice) > 0.01) {
            updateItemPrice(
              validation.item.product.id,
              validation.item.variantStrength,
              validation.updatedPrice
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
      <div className="bg-primary-black min-h-screen text-pure-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-heading text-4xl font-bold text-accent-gold-light mb-6">Your Cart is Empty</h1>
            <p className="text-neutral-gray mb-8">Add some research peptides to your cart to continue.</p>
            <Link
              href="/shop"
              className="inline-block bg-luxury-gold text-luxury-gold-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-gold-light transition-all duration-400 shadow-lg"
              style={{
                boxShadow: '0 4px 12px rgba(245, 214, 123, 0.25)',
              }}
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
    <div className="bg-primary-black min-h-screen text-pure-white">
      {/* Page Header */}
      <section className="bg-secondary-charcoal border-b border-luxury-gold/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-heading text-4xl md:text-5xl font-bold text-accent-gold-light mb-2">
                  Shopping Cart
                </h1>
                <p className="text-lg text-pure-white">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              {/* Checkout Now Button - Direct from Cart */}
              <button
                onClick={handleCheckout}
                className="hidden md:block bg-luxury-gold text-primary-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-gold-light transition-all duration-400 shadow-lg hover:shadow-xl min-h-[44px] flex items-center justify-center"
                style={{
                  boxShadow: '0 4px 12px rgba(245, 214, 123, 0.25)',
                }}
              >
                Checkout Now
              </button>
            </div>
            {/* Mobile Checkout Button */}
            <button
              onClick={handleCheckout}
              className="md:hidden w-full bg-luxury-gold text-primary-black py-4 px-6 rounded-lg font-semibold hover:bg-accent-gold-light transition-all duration-400 shadow-lg min-h-[44px] flex items-center justify-center"
              style={{
                boxShadow: '0 4px 12px rgba(245, 214, 123, 0.25)',
              }}
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
                <div className="bg-secondary-charcoal rounded-lg p-6 space-y-6">
                  {loading && (
                    <div className="text-center py-4 text-neutral-gray">
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
                      className={`flex flex-col sm:flex-row gap-4 pb-6 border-b border-luxury-gold/20 last:border-b-0 last:pb-0 ${
                        hasErrors ? 'opacity-75' : ''
                      }`}
                    >
                      {hasErrors && (
                        <div className="w-full mb-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                          <p className="text-red-400 text-sm font-semibold mb-1">⚠️ Product Update Required</p>
                          {validation.errors.map((error, idx) => (
                            <p key={idx} className="text-red-300 text-xs">{error}</p>
                          ))}
                          <button
                            onClick={() => removeItem(item.product.id, variantStrength)}
                            className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
                          >
                            Remove from cart
                          </button>
                        </div>
                      )}
                      {/* Product Image */}
                      <div className="relative w-full sm:w-32 h-32 bg-primary-black rounded-lg overflow-hidden flex-shrink-0">
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
                              className="text-heading text-xl font-bold text-pure-white hover:text-luxury-gold transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            {variantStrength && (
                              <p className="text-sm text-accent-gold-light mt-1 font-semibold">
                                Variant: {variantStrength}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id, variantStrength)}
                            className="text-neutral-gray hover:text-red-400 transition-colors"
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
                          <label className="block text-sm font-semibold text-pure-white mb-2">
                            Warehouse Selection
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateWarehouse(item.product.id, variantStrength, 'overseas')}
                              className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all duration-400 text-sm ${
                                item.warehouse === 'overseas'
                                  ? 'border-luxury-gold bg-luxury-gold/10 text-pure-white shadow-glow-sm'
                                  : 'border-luxury-gold/30 bg-primary-black text-pure-white hover:border-luxury-gold/50'
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
                                  ? 'border-luxury-gold bg-luxury-gold/10 text-pure-white shadow-glow-sm'
                                  : 'border-luxury-gold/30 bg-primary-black text-pure-white hover:border-luxury-gold/50'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>🇺🇸</span>
                                <span className="font-semibold">U.S.</span>
                              </div>
                            </button>
                          </div>
                          {item.product.warehouseOptions && (
                            <p className="text-xs text-neutral-gray mt-2">
                              {item.warehouse === 'us'
                                ? item.product.warehouseOptions.us.description
                                : item.product.warehouseOptions.overseas.description}
                            </p>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-neutral-gray">Quantity:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, variantStrength, item.quantity - 1)}
                                className="w-8 h-8 border border-luxury-gold/30 bg-primary-black text-pure-white rounded hover:bg-secondary-charcoal transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center text-pure-white font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, variantStrength, item.quantity + 1)}
                                className="w-8 h-8 border border-luxury-gold/30 bg-primary-black text-pure-white rounded hover:bg-secondary-charcoal transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xs text-neutral-gray ml-2">vials</span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-luxury-gold">
                              ${(item.calculatedPrice * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-neutral-gray">
                              ${item.calculatedPrice.toFixed(2)} per vial
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
                    className="inline-flex items-center text-luxury-gold hover:text-luxury-gold-light transition-colors"
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
                <div className="bg-secondary-charcoal rounded-lg p-6 sticky top-24">
                  <h2 className="text-heading text-2xl font-bold text-pure-white mb-6">
                    Order Summary
                  </h2>

                  {/* Subtotal */}
                  <div className="flex justify-between mb-4">
                    <span className="text-neutral-gray">Subtotal</span>
                    <span className="text-pure-white font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between mb-4">
                    <span className="text-neutral-gray">Shipping</span>
                    <span className="text-pure-white font-semibold">${shipping.toFixed(2)}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-luxury-gold/20 my-6"></div>

                  {/* Total */}
                  <div className="flex justify-between mb-6">
                    <span className="text-heading text-xl font-bold text-pure-white">Total</span>
                    <span className="text-heading text-xl font-bold text-luxury-gold">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* RUO Disclaimer */}
                  <div className="mb-6 p-4 bg-luxury-gold/10 border border-luxury-gold/20 rounded text-xs text-pure-white">
                    {ruoDisclaimer}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-luxury-gold text-primary-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-accent-gold-light transition-all duration-400 shadow-lg hover:shadow-xl min-h-[44px] flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 12px rgba(245, 214, 123, 0.25)',
                    }}
                  >
                    Proceed to Checkout
                  </button>

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full mt-4 text-neutral-gray hover:text-red-400 transition-colors text-sm min-h-[44px] flex items-center justify-center"
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
