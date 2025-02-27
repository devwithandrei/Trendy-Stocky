'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal';
import CardPaymentForm from './CardPaymentForm';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  setFormData: (data: any) => void;
  setIsFormValid: (isValid: boolean) => void;
  amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  setIsFormValid,
  amount
}) => {
  const [openTimestamp, setOpenTimestamp] = useState(Date.now());

  useEffect(() => {
    if (isOpen) {
      setOpenTimestamp(Date.now());
    }
  }, [isOpen]);

  useEffect(() => {
    // Cleanup function to handle modal close
    return () => {
      if (!isOpen) {
        setFormData({});
        setIsFormValid(false);
      }
    };
  }, [isOpen, setFormData, setIsFormValid]);

  return (
    <Modal open={isOpen} onClose={async () => {
      try {
        // Get payment intent ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentId = urlParams.get('payment_intent');

        if (paymentIntentId) {
          // Cancel the payment intent
          await fetch('/api/cancel-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId }),
          });
        }

        // Redirect to canceled state
        window.location.href = `${window.location.origin}/orders?canceled=true`;
      } catch (error) {
        console.error('Error canceling payment:', error);
        window.location.href = `${window.location.origin}/orders?canceled=true`;
      }
      onClose();
    }}>
      <div className="w-full max-w-xl mx-auto bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Complete Your Payment</h2>
        <CardPaymentForm
          setFormData={setFormData}
          setIsFormValid={setIsFormValid}
          amount={amount}
          customerInfo={formData}
          openTimestamp={openTimestamp}
        />
      </div>
    </Modal>
  );
};

export default PaymentModal;
