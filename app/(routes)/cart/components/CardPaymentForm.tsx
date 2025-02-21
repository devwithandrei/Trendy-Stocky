import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { StripePaymentRequestButtonElementOptions } from '@stripe/stripe-js';

interface CardPaymentFormProps {
  setFormData: (data: any) => void;
  setIsFormValid: (isValid: boolean) => void;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ setFormData, setIsFormValid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  const [cardholderNameTouched, setCardholderNameTouched] = useState(false);
  const [countryTouched, setCountryTouched] = useState(false);
  const [zipTouched, setZipTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Order Total',
          amount: 1000, // This will be updated dynamically
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestPayerPhone: true,
        requestShipping: true,
      });

      // Check if the Payment Request is available
      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      // Handle payment method
      pr.on('paymentmethod', async (e) => {
        const { paymentMethod, payerName, payerEmail, payerPhone, shippingAddress } = e;
        
        // Update form data with the received information
        setFormData({
          cardholderName: payerName,
          email: payerEmail,
          phone: payerPhone,
          country: shippingAddress?.country || '',
          zip: shippingAddress?.postalCode || '',
          address: shippingAddress?.addressLine || '',
          city: shippingAddress?.city || '',
          state: shippingAddress?.region || '',
          paymentMethodId: paymentMethod.id,
        });

        setIsFormValid(true);
        e.complete('success');
      });
    }
  }, [stripe, setFormData, setIsFormValid]);

  useEffect(() => {
    setIsFormValid(cardholderName !== '' && country !== '' && zip !== '' && phone !== '');
    setFormData({
      cardholderName,
      country,
      zip,
      phone,
      paymentMethodId: null, // Will be set if using Google/Apple Pay
    });
  }, [cardholderName, country, zip, phone, setFormData, setIsFormValid]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
      
      {/* Google Pay / Apple Pay Button */}
      {paymentRequest && (
        <div className="mb-4">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'default',
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

      {/* Credit Card Input */}
      <CardElement 
        options={{
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
        }} 
      />

      <div className="mt-4">
        <label className="block text-gray-700 font-medium">Cardholder Name</label>
        <input 
          type="text" 
          placeholder="Full name on card"
          required 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          onBlur={() => setCardholderNameTouched(true)}
        />
        {cardholderNameTouched && cardholderName === '' && (
          <p className="text-red-500 text-sm mt-1">Cardholder name is required.</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-gray-700 font-medium">Country or Region</label>
          <input 
            type="text" 
            placeholder="Country"
            required 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onBlur={() => setCountryTouched(true)}
          />
          {countryTouched && country === '' && (
            <p className="text-red-500 text-sm mt-1">Country is required.</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium">ZIP / Postal Code</label>
          <input 
            type="text" 
            placeholder="ZIP"
            required 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            onBlur={() => setZipTouched(true)}
          />
          {zipTouched && zip === '' && (
            <p className="text-red-500 text-sm mt-1">ZIP code is required.</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 font-medium">Phone Number</label>
        <input 
          type="tel" 
          placeholder="Phone number"
          required 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setPhoneTouched(true)}
        />
        {phoneTouched && phone === '' && (
          <p className="text-red-500 text-sm mt-1">Phone number is required.</p>
        )}
      </div>
    </form>
  );
};

export default CardPaymentForm;
