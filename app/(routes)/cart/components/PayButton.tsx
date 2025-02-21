'use client';

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useCart from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

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

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: cart.items.map(item => item.id),
          sizes: cart.items.map(item => item.selectedSize?.id || null),
          colors: cart.items.map(item => item.selectedColor?.id || null),
          quantities: cart.items.map(item => item.quantity || 1),
          customerDetails: {
            name: formData.cardholderName,
            email: formData.email || '',
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postalCode: formData.zip
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const { clientSecret, orderId } = await response.json();

      if (!clientSecret || !orderId) {
        throw new Error('Invalid response from server');
      }

      let paymentResult;

      // Handle payment based on payment method type
      if (formData.paymentMethodId) {
        // For Google Pay / Apple Pay
        paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: formData.paymentMethodId,
        });
      } else {
        // For regular card payments
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.cardholderName,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                country: formData.country,
                postal_code: formData.zip,
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
      console.error('[PAYMENT_ERROR]', error);
      toast.error(error.message || 'Something went wrong with the payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading || !stripe || !elements}
      className="w-full mt-6"
    >
      {loading ? 'Processing...' : 'Checkout'}
    </Button>
  );
};

export default PayButton;
