'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import StockImage from '@/components/images/StockImage';
import { getComplianceText } from '@/lib/utils/compliance-text';
import { useCartRefresh } from '@/lib/hooks/useCartRefresh';

export default function CheckoutPage() {
  const { items, getTotal, clearCart, updateItemPrice, updateItemProduct } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);
  const { validatedItems, loading, refresh } = useCartRefresh(items);
  const [checkoutErrors, setCheckoutErrors] = useState<string[]>([]);

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

  // Form state with pre-fill from localStorage
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  // Pre-fill form data from localStorage if available
  useEffect(() => {
    const savedFormData = localStorage.getItem('checkoutFormData');
    if (savedFormData) {
      try {
        const parsed = JSON.parse(savedFormData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage on change
  useEffect(() => {
    if (formData.firstName || formData.email) {
      localStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }
  }, [formData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const ruoClause = getComplianceText('RUO_CLAUSE');
  const subtotal = getTotal();
  
  // Calculate shipping based on warehouse
  const hasUSWarehouse = items.some(item => item.warehouse === 'us');
  const hasOverseasWarehouse = items.some(item => item.warehouse === 'overseas');
  
  let shipping = 15.00; // Base shipping
  let expeditedFee = 0;
  
  if (hasUSWarehouse) {
    expeditedFee = 25.00; // Expedited U.S. Re-Test Handling fee
  }
  
  const total = subtotal + shipping + expeditedFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!hasAgreed) newErrors.agreement = 'You must agree to the Research Use Only terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Refresh cart items before checkout
    await refresh();

    // Check for validation errors
    const invalidItems = validatedItems.filter((v) => !v.isValid);
    if (invalidItems.length > 0) {
      const errors = invalidItems.flatMap((v) => v.errors);
      setCheckoutErrors(errors);
      return;
    }

    setCheckoutErrors([]);
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate order ID
    const orderId = `ORD-${Date.now()}`;

    // Store order in localStorage for confirmation page
    localStorage.setItem('lastOrder', JSON.stringify({
      orderId,
      items,
      formData,
      total,
      date: new Date().toISOString(),
    }));

    // Clear cart
    clearCart();

    // Redirect to confirmation
    router.push(`/checkout/confirmation?orderId=${orderId}`);
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
              className="inline-block bg-luxury-gold text-primary-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-gold-light transition-all duration-400 shadow-lg"
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

  return (
    <div className="bg-primary-black min-h-screen text-pure-white">
      {/* Page Header */}
      <section className="bg-secondary-charcoal border-b border-luxury-gold/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-accent-gold-light mb-4">
              Checkout
            </h1>
            <p className="text-lg text-pure-white">Complete your order for research peptides</p>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Checkout Form - Single Scrollable Page (Mobile: Full Width) */}
              <div className="lg:col-span-2 order-2 lg:order-1">
                  {/* Complete Order Button - Above Fold (Sticky on Desktop, Outside Form) */}
                <div className="lg:sticky lg:top-24 lg:z-10 mb-6 pb-6 border-b border-luxury-gold/20 bg-secondary-charcoal rounded-t-lg pt-6 px-6 md:px-8">
                  {/* Secure Checkout Badge - Above Button */}
                  <div className="mb-3 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg">
                      <svg className="w-5 h-5 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-sm font-semibold text-luxury-gold">Secure Checkout</span>
                    </div>
                  </div>
                  {loading && (
                    <div className="mb-3 text-center text-sm text-neutral-gray">
                      Verifying product availability and prices...
                    </div>
                  )}
                  {checkoutErrors.length > 0 && (
                    <div className="mb-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-400 text-sm font-semibold mb-1">⚠️ Cannot Complete Checkout</p>
                      {checkoutErrors.map((error, idx) => (
                        <p key={idx} className="text-red-300 text-xs">{error}</p>
                      ))}
                      <Link
                        href="/cart"
                        className="mt-2 inline-block text-xs text-red-400 hover:text-red-300 underline"
                      >
                        Return to cart to fix issues
                      </Link>
                    </div>
                  )}
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isProcessing || loading}
                    className="w-full text-primary-black py-4 px-6 rounded-lg font-semibold text-lg hover:bg-accent-gold-light transition-all duration-400 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
                    style={{
                      backgroundColor: '#E5C047', // 10% brighter gold for better visibility
                      boxShadow: '0 4px 12px rgba(245, 214, 123, 0.25)',
                    }}
                  >
                    {isProcessing ? 'Processing...' : loading ? 'Verifying...' : 'Complete Order'}
                  </button>
                </div>

                <form id="checkout-form" onSubmit={handleSubmit} className="bg-secondary-charcoal rounded-lg p-6 md:p-8 space-y-8 border border-luxury-gold/20 border-t-0 rounded-t-none">
                  {/* Shipping Information */}
                  <div className="pb-6 border-b border-luxury-gold/20">
                    <h2 className="text-heading text-2xl font-bold text-accent-gold-light mb-6">
                      Shipping Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-pure-white mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-primary-black text-pure-white focus:outline-none focus:border-luxury-gold transition-all duration-400 ${
                            errors.firstName ? 'border-red-500' : 'border-luxury-gold/30'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-pure-white mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-primary-black text-pure-white focus:outline-none focus:border-luxury-gold transition-all duration-400 ${
                            errors.lastName ? 'border-red-500' : 'border-luxury-gold/30'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mt-4">
                      <label htmlFor="email" className="block text-sm font-semibold text-pure-white mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 bg-primary-black text-pure-white focus:outline-none focus:border-luxury-gold transition-all duration-400 ${
                          errors.email ? 'border-red-500' : 'border-luxury-gold/30'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="mt-4">
                      <label htmlFor="phone" className="block text-sm font-semibold text-pure-white mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 bg-primary-black text-pure-white focus:outline-none focus:border-luxury-gold transition-all duration-400 ${
                          errors.phone ? 'border-red-500' : 'border-luxury-gold/30'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="mt-4">
                      <label htmlFor="address" className="block text-sm font-semibold text-pure-white mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 bg-primary-black text-pure-white focus:outline-none focus:border-luxury-gold transition-all duration-400 ${
                          errors.address ? 'border-red-500' : 'border-luxury-gold/30'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    {/* City, State, Zip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-pure-white mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-primary-black text-pure-white focus:outline-none focus:border-luxury-gold transition-all duration-400 ${
                            errors.city ? 'border-red-500' : 'border-luxury-gold/30'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold text-pure-white mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-primary-black text-pure-white focus:outline-none focus:border-luxury-gold transition-all duration-400 ${
                            errors.state ? 'border-red-500' : 'border-luxury-gold/30'
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-semibold text-pure-white mb-2">
                          Zip Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-primary-black text-pure-white focus:outline-none focus:border-luxury-gold transition-all duration-400 ${
                            errors.zipCode ? 'border-red-500' : 'border-luxury-gold/30'
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RUO Agreement */}
                  <div className="mt-8 p-6 bg-luxury-gold/10 border-2 border-luxury-gold/30 rounded-lg">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="ruoAgreement"
                        checked={hasAgreed}
                        onChange={(e) => setHasAgreed(e.target.checked)}
                        className="mt-1 mr-3 w-5 h-5 text-luxury-gold border-luxury-gold/30 rounded focus:ring-luxury-gold bg-primary-black"
                      />
                      <label htmlFor="ruoAgreement" className="text-sm text-pure-white">
                        <span className="font-semibold text-accent-gold-light">I Agree to Research Use Only Terms *</span>
                        <p className="mt-2 text-xs text-neutral-gray">{ruoClause}</p>
                      </label>
                    </div>
                    {errors.agreement && (
                      <p className="text-red-400 text-sm mt-2">{errors.agreement}</p>
                    )}
                  </div>

                </form>
              </div>

              {/* Right Column - Order Summary (Mobile: Full Width, Above Form) */}
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="bg-secondary-charcoal rounded-lg p-6 lg:sticky lg:top-24 border border-luxury-gold/20 mb-6 lg:mb-0">
                  <h2 className="text-heading text-2xl font-bold text-accent-gold-light mb-6">
                    Order Summary
                  </h2>

                  {/* Warehouse Selection Info */}
                  <div className="mb-4 p-3 bg-luxury-gold/10 border border-luxury-gold/20 rounded-lg">
                    <p className="text-xs text-pure-white font-semibold mb-1">
                      Choose fulfillment option:
                    </p>
                    <p className="text-xs text-neutral-gray">
                      <span className="text-luxury-gold">Overseas Warehouse (Direct)</span> or{' '}
                      <span className="text-luxury-gold">US Warehouse (Re-tested)</span>
                    </p>
                    <p className="text-xs text-neutral-gray mt-1">
                      Warehouse selection can be changed in your cart before checkout.
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => {
                      const variantStrength = item.variantStrength || item.size;
                      const itemKey = `${item.product.id}-${variantStrength || 'default'}-${item.warehouse}`;
                      
                      return (
                      <div key={itemKey} className="flex gap-4 pb-4 border-b border-luxury-gold/10 last:border-b-0 last:pb-0">
                        <div className="relative w-16 h-16 bg-primary-black rounded overflow-hidden flex-shrink-0 border border-luxury-gold/20">
                          <StockImage
                            imageType="product-placeholder"
                            context={item.product.name}
                            fill
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-pure-white font-semibold text-sm">{item.product.name}</p>
                          {variantStrength && (
                            <p className="text-accent-gold-light text-xs font-semibold mt-1">
                              Variant: {variantStrength}
                            </p>
                          )}
                          {item.warehouse && (
                            <p className={`text-xs font-semibold mt-1 ${
                              item.warehouse === 'us' ? 'text-luxury-gold' : 'text-luxury-gold'
                            }`}>
                              {item.warehouse === 'us' ? '🇺🇸 U.S. Warehouse (Re-tested)' : '🌍 Overseas Warehouse (Direct)'}
                            </p>
                          )}
                          <p className="text-neutral-gray text-xs mt-1">
                            Qty: {item.quantity} vial{item.quantity > 1 ? 's' : ''} × ${item.calculatedPrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-luxury-gold font-semibold">
                          ${(item.calculatedPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-luxury-gold/20 my-6"></div>

                  {/* Totals */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-gray">Subtotal</span>
                      <span className="text-pure-white font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-gray">Shipping</span>
                      <span className="text-pure-white font-semibold">${shipping.toFixed(2)}</span>
                    </div>
                    {expeditedFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-neutral-gray">
                          <span className="text-xs">Expedited U.S. Re-Test Handling</span>
                        </span>
                        <span className="text-pure-white font-semibold">${expeditedFee.toFixed(2)}</span>
                      </div>
                    )}
                    {hasUSWarehouse && hasOverseasWarehouse && (
                      <p className="text-xs text-neutral-gray mt-2">
                        * Items from both warehouses will be shipped separately
                      </p>
                    )}
                  </div>

                  <div className="border-t border-luxury-gold/20 my-6"></div>

                  <div className="flex justify-between mb-6">
                    <span className="text-heading text-xl font-bold text-pure-white">Total</span>
                    <span className="text-heading text-xl font-bold text-luxury-gold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
