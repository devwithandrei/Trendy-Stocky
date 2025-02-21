'use client';

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { StripePaymentRequestButtonElementOptions } from '@stripe/stripe-js';

interface CardPaymentFormProps {
  setFormData: (data: FormData) => void;
  setIsFormValid: (isValid: boolean) => void;
}

interface FormData {
  paymentMethodId?: string;
  cardholderName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

const initialFormData: FormData = {
  cardholderName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  postalCode: ''
};

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '16px',
      lineHeight: '24px',
      padding: '10px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ setFormData, setIsFormValid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [formFields, setFormFields] = useState({
    cardholderName: '',
    country: '',
    zip: '',
    phone: '',
  });
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  const totalAmount = 1000; // This will be updated dynamically

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Order Total',
          amount: totalAmount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        requestShipping: true,
        shippingOptions: [
          {
            id: 'standard',
            label: 'Standard Shipping',
            detail: '3-5 business days',
            amount: 0,
          },
          {
            id: 'express',
            label: 'Express Shipping',
            detail: '1-2 business days',
            amount: 1000,
          },
        ],
      });

      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
        }
      });

      pr.on('paymentmethod', async (e) => {
        // Ensure all values are strings
        const payerName = typeof e.payerName === 'string' ? e.payerName : Array.isArray(e.payerName) ? e.payerName[0] : '';
        const payerEmail = typeof e.payerEmail === 'string' ? e.payerEmail : Array.isArray(e.payerEmail) ? e.payerEmail[0] : '';
        const payerPhone = typeof e.payerPhone === 'string' ? e.payerPhone : Array.isArray(e.payerPhone) ? e.payerPhone[0] : '';
        
        setFormData({
          paymentMethodId: e.paymentMethod.id,
          cardholderName: payerName,
          email: payerEmail,
          phone: payerPhone,
          address: e.shippingAddress?.addressLine?.toString() || '',
          city: e.shippingAddress?.city?.toString() || '',
          country: e.shippingAddress?.country?.toString() || '',
          postalCode: e.shippingAddress?.postalCode?.toString() || ''
        });
        setIsFormValid(true);
        e.complete('success');
      });
    }
  }, [stripe, totalAmount, setFormData, setIsFormValid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const stringValue = Array.isArray(value) ? value[0] : value; // Handle potential array value
    
    setFormFields(prev => ({
      ...prev,
      [name]: stringValue
    }));
    
    const updatedFields = {
      ...formFields,
      [name]: stringValue
    };
    
    // If all fields are filled, update form data
    if (updatedFields.cardholderName && updatedFields.country && updatedFields.zip && updatedFields.phone) {
      setFormData({
        cardholderName: updatedFields.cardholderName,
        email: '', // Required field with empty default
        phone: updatedFields.phone,
        address: updatedFields.zip,
        city: '',
        country: updatedFields.country,
        postalCode: updatedFields.zip
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
      
      {/* Google Pay / Apple Pay Button */}
      {canMakePayment && (
        <div className="mb-4">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'buy',
                  theme: 'dark',
                  height: '40px',
                },
              },
            }}
          />
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or pay with card</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <input
          type="text"
          name="cardholderName"
          value={formFields.cardholderName}
          onChange={handleInputChange}
          placeholder="Cardholder Name"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <input
          type="text"
          name="country"
          value={formFields.country}
          onChange={handleInputChange}
          placeholder="Country"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <input
          type="text"
          name="zip"
          value={formFields.zip}
          onChange={handleInputChange}
          placeholder="ZIP/Postal Code"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <input
          type="tel"
          name="phone"
          value={formFields.phone}
          onChange={handleInputChange}
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
    </form>
  );
};

export default CardPaymentForm;
