'use client';

import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import StockImage from '@/components/images/StockImage';
import { getComplianceText } from '@/lib/utils/compliance-text';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const router = useRouter();
  const ruoDisclaimer = getComplianceText('RUO_DISCLAIMER');

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-950 min-h-screen text-gray-300">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-heading text-4xl font-bold text-white mb-6">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">Add some research peptides to your cart to continue.</p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-glow-md glow-on-hover"
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
    <div className="bg-slate-950 min-h-screen text-gray-300">
      {/* Page Header */}
      <section className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-300">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
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
                <div className="bg-slate-800 rounded-lg p-6 space-y-6">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size || 'default'}`}
                      className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-slate-700 last:border-b-0 last:pb-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-full sm:w-32 h-32 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
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
                              className="text-heading text-xl font-bold text-white hover:text-primary transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            {item.size && (
                              <p className="text-sm text-gray-400 mt-1">Size: {item.size}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
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

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">Quantity:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 border border-gray-600 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center text-white font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 border border-gray-600 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400">
                              ${item.product.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/shop"
                    className="inline-flex items-center text-primary hover:text-primary-light transition-colors"
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
                <div className="bg-slate-800 rounded-lg p-6 sticky top-24">
                  <h2 className="text-heading text-2xl font-bold text-white mb-6">
                    Order Summary
                  </h2>

                  {/* Subtotal */}
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white font-semibold">${shipping.toFixed(2)}</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-700 my-6"></div>

                  {/* Total */}
                  <div className="flex justify-between mb-6">
                    <span className="text-heading text-xl font-bold text-white">Total</span>
                    <span className="text-heading text-xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>

                  {/* RUO Disclaimer */}
                  <div className="mb-6 p-4 bg-secondary/10 border border-secondary/20 rounded text-xs text-gray-400">
                    {ruoDisclaimer}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-glow-md glow-on-hover gpu-accelerated"
                  >
                    Proceed to Checkout
                  </button>

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full mt-4 text-gray-400 hover:text-red-400 transition-colors text-sm"
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
