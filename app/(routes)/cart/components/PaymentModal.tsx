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
    <Modal open={isOpen} onClose={() => {
      setTimeout(onClose, 50); // Delay the onClose call
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
