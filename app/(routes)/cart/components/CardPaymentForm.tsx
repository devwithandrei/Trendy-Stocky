import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

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

  const [cardholderNameTouched, setCardholderNameTouched] = useState(false);
  const [countryTouched, setCountryTouched] = useState(false);
  const [zipTouched, setZipTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  useEffect(() => {
    setIsFormValid(cardholderName !== '' && country !== '' && zip !== '' && phone !== '');
    setFormData({
      cardholderName: cardholderName,
      country: country,
      zip: zip,
      phone: phone,
    });
  }, [cardholderName, country, zip, phone, setFormData, setIsFormValid]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe or elements not available');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error('Card element not found');
      return;
    }

    // This is handled in PayButton
    // const result = await stripe.confirmCardPayment('{CLIENT_SECRET}', {
    //   payment_method: {
    //     card: cardElement,
    //   },
    // });

    // if (result.error) {
    //   console.error(result.error);
    // } else {
    //   console.log('Payment successful!');
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
      
      <CardElement 
        options={{
          style: {
            base: {
              color: '#32325d',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSize: '16px',
              lineHeight: '24px',
              padding: '10px',
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
            placeholder="United States"
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
          <label className="block text-gray-700 font-medium">ZIP</label>
          <input 
            type="text" 
            placeholder="US"
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
          type="text"
          placeholder="(800) 555-0175"
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

      {/* Removed Pay button from here */}

      <p className="mt-4 text-xs text-gray-500">By clicking Pay, you agree to the Link Terms and Privacy Policy.</p>
    </form>
  );
};

export default CardPaymentForm;
