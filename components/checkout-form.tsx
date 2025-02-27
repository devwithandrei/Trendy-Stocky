'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import PaymentForm from './payment-form';

const CheckoutForm = () => {
  const router = useRouter();
  const cart = useCart();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    shippingMethod: 'standard'
  });

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create payment intent
      const response = await axios.post('/api/create-payment-intent', {
        amount: Math.round(totalPrice * 100),
        items: cart.items.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        })),
        customerInfo: formData
      });

      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);

    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Clear cart
      cart.removeAll();
      
      // Redirect to success page
      router.push(`/orders?success=true&payment_intent=${paymentIntentId}`);
      toast.success('Payment completed successfully!');
    } catch (error) {
      console.error('Error handling payment success:', error);
      toast.error('Error processing payment success');
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error || 'Payment failed');
    router.push('/orders?canceled=true');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {!clientSecret ? (
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <div className="mt-4 space-y-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.id} className="flex py-6">
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <Currency value={item.price} />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.selectedSize ? `Size: ${item.selectedSize?.value} | ` : ''}
                            {item.selectedColor ? `Color: ${item.selectedColor?.name}` : ''}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <Currency value={totalPrice} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="shippingMethod" className="block text-sm font-medium text-gray-700">
                  Shipping Method
                </label>
                <select
                  id="shippingMethod"
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="standard">Standard Shipping</option>
                  <option value="express">Express Shipping</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || cart.items.length === 0}
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
          <PaymentForm
            clientSecret={clientSecret}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            amount={Math.round(totalPrice * 100)}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
