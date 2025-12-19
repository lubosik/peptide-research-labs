'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductImage } from '@/lib/products/get-product-image';
import { getComplianceText } from '@/lib/utils/compliance-text';

interface OrderData {
  orderId: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
    };
    quantity: number;
    size?: string;
  }>;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  total: number;
  date: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      router.push('/shop');
      return;
    }

    // Retrieve order data from localStorage
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      const parsed = JSON.parse(storedOrder);
      if (parsed.orderId === orderId) {
        setOrderData(parsed);
      } else {
        router.push('/shop');
      }
    } else {
      router.push('/shop');
    }
  }, [orderId, router]);

  if (!orderData) {
    return (
      <div className="bg-slate-950 min-h-screen text-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order confirmation...</p>
        </div>
      </div>
    );
  }

  const ruoClause = getComplianceText('RUO_CLAUSE');
  const notFdaApproved = getComplianceText('NOT_FDA_APPROVED');
  const noMedicalAdvice = getComplianceText('NO_MEDICAL_ADVICE');
  const useAtOwnRisk = getComplianceText('USE_AT_OWN_RISK');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-950 min-h-screen text-gray-300">
      {/* Success Header */}
      <section className="bg-slate-900 border-b border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-300">
              Thank you for your order. We've received your order and will begin processing it shortly.
            </p>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-lg p-8 space-y-8">
              {/* Order Info */}
              <div>
                <h2 className="text-heading text-2xl font-bold text-white mb-4">Order Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">Order Number:</span>
                    <p className="text-white font-semibold text-lg">{orderData.orderId}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Order Date:</span>
                    <p className="text-white font-semibold text-lg">{formatDate(orderData.date)}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-heading text-2xl font-bold text-white mb-4">Shipping Address</h2>
                <div className="text-gray-300">
                  <p className="font-semibold text-white">
                    {orderData.formData.firstName} {orderData.formData.lastName}
                  </p>
                  <p>{orderData.formData.address}</p>
                  <p>
                    {orderData.formData.city}, {orderData.formData.state} {orderData.formData.zipCode}
                  </p>
                  <p>{orderData.formData.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="text-heading text-2xl font-bold text-white mb-4">Order Items</h2>
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size || 'default'}`}
                      className="flex gap-4 pb-4 border-b border-slate-700 last:border-b-0"
                    >
                      <div className="relative w-20 h-20 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={getProductImage(item.product.name, item.product.slug)}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded"
                          sizes="80px"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-grow">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="text-white font-semibold hover:text-primary transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        {item.size && (
                          <p className="text-gray-400 text-sm">Size: {item.size}</p>
                        )}
                        <p className="text-gray-400 text-sm">
                          Quantity: {item.quantity} × ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-semibold text-lg">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-slate-700 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-heading text-2xl font-bold text-white">Total</span>
                  <span className="text-heading text-2xl font-bold text-primary">
                    ${orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Compliance Disclaimers */}
            <div className="mt-8 space-y-4">
              <div className="p-6 bg-red-500/10 border-l-4 border-red-500 rounded">
                <h3 className="text-red-300 font-semibold mb-2">Regulatory Notice:</h3>
                <p className="text-red-200 text-sm">{notFdaApproved}</p>
              </div>
              <div className="p-6 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
                <h3 className="text-yellow-300 font-semibold mb-2">Important Research Note:</h3>
                <p className="text-yellow-200 text-sm">{noMedicalAdvice}</p>
              </div>
              <div className="p-6 bg-orange-500/10 border-l-4 border-orange-500 rounded">
                <h3 className="text-orange-300 font-semibold mb-2">Research Use Only:</h3>
                <p className="text-orange-200 text-sm">{ruoClause}</p>
              </div>
              <div className="p-6 bg-orange-500/10 border-l-4 border-orange-500 rounded">
                <h3 className="text-orange-300 font-semibold mb-2">Safety & Handling:</h3>
                <p className="text-orange-200 text-sm">{useAtOwnRisk}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="flex-1 bg-primary text-white text-center py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors duration-200 shadow-lg hover:shadow-glow-md glow-on-hover"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="flex-1 bg-slate-700 text-white text-center py-4 px-6 rounded-lg font-semibold text-lg hover:bg-slate-600 transition-colors duration-200"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-slate-950 min-h-screen text-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">Loading order confirmation...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
