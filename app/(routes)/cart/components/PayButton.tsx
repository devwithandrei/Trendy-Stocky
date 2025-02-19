import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useCart from '@/hooks/use-cart';

interface PayButtonProps {
  disabled: boolean;
  formData: any;
}

const PayButton: React.FC<PayButtonProps> = ({ disabled, formData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCart();

  const handleClick = async () => {
    if (!stripe || !elements) {
      console.error('Stripe or elements not available');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('Card element not found');
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
    const clientSecret = data.clientSecret;

    console.log("Client Secret:", clientSecret);

    const result = await stripe.confirmCardPayment(String(clientSecret), {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      console.error(result.error);
    } else {
      console.log('Payment successful!');
    }
  };

  return (
    <button onClick={handleClick} disabled={disabled} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition">
      Pay Now
    </button>
  );
};

export default PayButton;
