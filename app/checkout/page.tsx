'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import Link from 'next/link';
import StockImage from '@/components/images/StockImage';
import { getComplianceText } from '@/lib/utils/compliance-text';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  // Form state
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
      <div className="bg-slate-950 min-h-screen text-gray-300">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-heading text-4xl font-bold text-white mb-6">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">Add some research peptides to your cart to continue.</p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-gray-300">
      {/* Page Header */}
      <section className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Checkout
            </h1>
            <p className="text-lg text-gray-300">Complete your order for research peptides</p>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 space-y-6">
                  {/* Shipping Information */}
                  <div>
                    <h2 className="text-heading text-2xl font-bold text-white mb-6">
                      Shipping Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-semibold text-white mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-slate-700 text-white focus:outline-none focus:border-primary ${
                            errors.firstName ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-semibold text-white mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-slate-700 text-white focus:outline-none focus:border-primary ${
                            errors.lastName ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mt-4">
                      <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 bg-slate-700 text-white focus:outline-none focus:border-primary ${
                          errors.email ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="mt-4">
                      <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 bg-slate-700 text-white focus:outline-none focus:border-primary ${
                          errors.phone ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="mt-4">
                      <label htmlFor="address" className="block text-sm font-semibold text-white mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full border rounded-lg px-4 py-3 bg-slate-700 text-white focus:outline-none focus:border-primary ${
                          errors.address ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    {/* City, State, Zip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-white mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-slate-700 text-white focus:outline-none focus:border-primary ${
                            errors.city ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold text-white mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-slate-700 text-white focus:outline-none focus:border-primary ${
                            errors.state ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-400 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-semibold text-white mb-2">
                          Zip Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full border rounded-lg px-4 py-3 bg-slate-700 text-white focus:outline-none focus:border-primary ${
                            errors.zipCode ? 'border-red-500' : 'border-gray-600'
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RUO Agreement */}
                  <div className="mt-8 p-6 bg-secondary/10 border-2 border-secondary rounded-lg">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="ruoAgreement"
                        checked={hasAgreed}
                        onChange={(e) => setHasAgreed(e.target.checked)}
                        className="mt-1 mr-3 w-5 h-5 text-primary border-gray-600 rounded focus:ring-primary"
                      />
                      <label htmlFor="ruoAgreement" className="text-sm text-gray-300">
                        <span className="font-semibold text-white">I Agree to Research Use Only Terms *</span>
                        <p className="mt-2 text-xs text-gray-400">{ruoClause}</p>
                      </label>
                    </div>
                    {errors.agreement && (
                      <p className="text-red-400 text-sm mt-2">{errors.agreement}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-glow-md glow-on-hover gpu-accelerated disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Complete Order'}
                  </button>
                </form>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800 rounded-lg p-6 sticky top-24">
                  <h2 className="text-heading text-2xl font-bold text-white mb-6">
                    Order Summary
                  </h2>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.size || 'default'}-${item.warehouse}`} className="flex gap-4">
                        <div className="relative w-16 h-16 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                          <StockImage
                            imageType="product-placeholder"
                            context={item.product.name}
                            fill
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-white font-semibold text-sm">{item.product.name}</p>
                          {item.size && (
                            <p className="text-gray-400 text-xs">Size: {item.size}</p>
                          )}
                          {item.warehouse && (
                            <p className={`text-xs font-semibold mt-1 ${
                              item.warehouse === 'us' ? 'text-blue-300' : 'text-green-300'
                            }`}>
                              {item.warehouse === 'us' ? '🇺🇸 U.S. Warehouse' : '🌍 Overseas Warehouse'}
                            </p>
                          )}
                          <p className="text-gray-400 text-xs">
                            Qty: {item.quantity} × ${item.calculatedPrice.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-primary font-semibold">
                          ${(item.calculatedPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-700 my-6"></div>

                  {/* Totals */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">${shipping.toFixed(2)}</span>
                    </div>
                    {expeditedFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          <span className="text-xs">Expedited U.S. Re-Test Handling</span>
                        </span>
                        <span className="text-white">${expeditedFee.toFixed(2)}</span>
                      </div>
                    )}
                    {hasUSWarehouse && hasOverseasWarehouse && (
                      <p className="text-xs text-gray-500 mt-2">
                        * Items from both warehouses will be shipped separately
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-700 my-6"></div>

                  <div className="flex justify-between mb-6">
                    <span className="text-heading text-xl font-bold text-white">Total</span>
                    <span className="text-heading text-xl font-bold text-primary">
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
