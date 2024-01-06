"use client";

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useCart from '@/hooks/use-cart';
import Button from '@/components/ui/button';
import Currency from '@/components/ui/currency';
import SendEmail from '@/actions/SendEmail';
import { Product } from '@/types'; 

interface SummaryProps {
  selectedColors: { [key: string]: string }; 
  selectedSizes: { [key: string]: string }; 
}

const Summary: React.FC<SummaryProps> = ({ selectedColors, selectedSizes }) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }
  }, [searchParams, removeAll]);

  const onCheckout = async () => {
    try {
      const productIds = items.map((item) => item.id);

      const emailContent = {
        productDetails: items.map((item) => ({
          name: item.name,
          price: item.price,
          selectedColor: selectedColors[item.id] || item.selectedColor || 'Default Color',
          selectedSize: selectedSizes[item.id] || item.selectedSize || 'Default Size',
        })),
        totalPrice: items.reduce((total, item) => total + Number(item.price), 0).toFixed(2),
        productIds: productIds,
      };

      await SendEmail(emailContent);

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        productIds: productIds,
      });

      window.location = response.data.url;
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const totalPrice = items.reduce((total, item) => total + Number(item.price), 0).toFixed(2);

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <p>{item.name}</p>
            <Currency value={item.price} />
            <p>Color: {selectedColors[item.id] || item.selectedColor || 'Default Color'}</p>
            <p>Size: {selectedSizes[item.id] || item.selectedSize || 'Default Size'}</p>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-6" style={{ backgroundColor: 'rgba(173, 216, 230, 0.5)', color: 'blue' }}>
        Pay Now
      </Button>
    </div>
  );
};

export default Summary;