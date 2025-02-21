import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useCart from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PayButtonProps {
  disabled: boolean;
  formData: any;
}

const PayButton: React.FC<PayButtonProps> = ({ disabled, formData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      if (!stripe || !elements) {
        toast.error('Payment provider not available');
        return;
      }

      const productIds = cart.items.map((item) => item.id);
      const sizes = cart.items.map((item) => item.selectedSize?.id || null);
      const colors = cart.items.map((item) => item.selectedColor?.id || null);
      const quantities = cart.items.map((item) => item.quantity || 1);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: productIds,
          sizes: sizes,
          colors: colors,
          quantities: quantities,
          customerDetails: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      const { clientSecret, orderId } = data;

      let paymentResult;

      // Handle payment based on payment method type
      if (formData.paymentMethodId) {
        // For Google Pay / Apple Pay
        paymentResult = await stripe.confirmCardPayment(String(clientSecret), {
          payment_method: formData.paymentMethodId,
        });
      } else {
        // For regular card payments
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          toast.error('Card element not found');
          return;
        }

        paymentResult = await stripe.confirmCardPayment(String(clientSecret), {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.cardholderName,
              phone: formData.phone,
              address: {
                country: formData.country,
                postal_code: formData.zip,
                line1: formData.address,
                city: formData.city,
                state: formData.state,
              },
            },
          },
        });
      }

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message || 'Payment failed');
      }

      // Payment successful
      toast.success('Payment successful!');
      cart.removeAll();
      router.push(`/orders/${orderId}`);

    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button 
        onClick={handlePayment} 
        disabled={disabled || loading} 
        className={`w-full bg-green-600 text-white px-6 py-3 rounded-md text-sm font-medium transition ${
          disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      <p className="mt-4 text-xs text-gray-500 text-center">
        By clicking Pay Now, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
};

export default PayButton;
