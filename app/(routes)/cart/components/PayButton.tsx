'use client';

import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import useCart from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface PayButtonProps {
  disabled: boolean;
  formData: any;
  onPaymentIntent: (clientSecret: string) => void;
}

const PayButton: React.FC<PayButtonProps> = ({ disabled, formData, onPaymentIntent }) => {
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

      // Calculate total amount in cents
      const totalAmount = cart.items.reduce((total, item) => {
        return total + (Number(item.price) * 100 * (item.quantity || 1));
      }, 0);

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          items: cart.items.map(item => ({
            id: item.id,
            price: Number(item.price),
            quantity: item.quantity || 1,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor
          })),
          customerInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Invalid response from server');
      }

      // Pass the client secret to parent component to initialize Elements
      onPaymentIntent(clientSecret);

    } catch (error: any) {
      console.error('[PAYMENT_ERROR]', error);
      
      // Show specific error messages
      if (error.message.includes('insufficient stock')) {
        toast.error('Some items are no longer in stock. Please review your cart.');
      } else if (error.message.includes('network')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error(error.message || 'Something went wrong. Please try again.');
      }
      
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || loading || !stripe || !elements}
      className="w-full mt-6"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </Button>
  );
};

export default PayButton;
