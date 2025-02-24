'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';

interface CardPaymentFormProps {
  setFormData: (data: FormData) => void;
  setIsFormValid: (isValid: boolean) => void;
  amount: number;
  customerInfo: {
    email: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  openTimestamp: number;
}

interface FormData {
  paymentMethodId?: string | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  setFormData,
  setIsFormValid,
  amount,
  customerInfo,
  openTimestamp
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        }
      });

      if (submitError) {
        switch (submitError.type) {
          case 'card_error':
            setError('Your card was declined. Please try a different card.');
            break;
          case 'validation_error':
            setError(submitError.message || 'Please check your card details.');
            break;
          default:
            setError('An unexpected error occurred. Please try again.');
        }
        toast.error(submitError.message || 'Payment failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <PaymentElement
          key={openTimestamp}
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: 'auto'
            },
            wallets: {
              applePay: 'auto',
              googlePay: 'auto'
            },
            defaultValues: {
              billingDetails: {
                name: customerInfo.name,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: {
                  line1: customerInfo.address,
                  city: customerInfo.city,
                  country: customerInfo.country,
                  postal_code: customerInfo.postalCode,
                }
              }
            }
          }}
        />

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ${formatCurrency(amount)}`
          )}
        </Button>
      </div>
    </form>
  );
};

export default CardPaymentForm;
