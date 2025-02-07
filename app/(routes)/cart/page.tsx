"use client";

import React, { useEffect, useState } from 'react';
import Container from '@/components/ui/container';
import useCart from '@/hooks/use-cart';
import Summary from './components/summary';
import CartItem from './components/cart-item';
import CrispChatScript from '@/components/ui/CrispChatScript';

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goBack = () => {
    window.history.back(); // Use the browser's history to go back
  };

  const handleColorSelect = (itemId: string, selectedColor: string) => {
    setSelectedColors({ ...selectedColors, [itemId]: selectedColor });
  };

  const handleSizeSelect = (itemId: string, selectedSize: string) => {
    setSelectedSizes({ ...selectedSizes, [itemId]: selectedSize });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <button className="bg-transparent border-none cursor-pointer flex items-center" onClick={goBack}>
              {/* Add your arrow icon here */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm">Go Back</span>
            </button>
          </div>
          <div className="flex items-center mb-4">
            <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          </div>
          <div className="mt-6 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && <p className="text-neutral-500">No items added to cart.</p>}
              <ul>
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    data={{
                      ...item,
                      selectedColor: selectedColors[item.id] || item.selectedColor || 'Default Color',
                      selectedSize: selectedSizes[item.id] || item.selectedSize || 'Default Size',
                    }}
                    onRemove={() => cart.removeItem(item.id)}
                    onColorSelect={(selectedColor) => handleColorSelect(item.id, selectedColor)}
                    onSizeSelect={(selectedSize) => handleSizeSelect(item.id, selectedSize)}
                  />
                ))}
              </ul>
            </div>
            <Summary selectedColors={selectedColors} selectedSizes={selectedSizes} />
          </div>
          <CrispChatScript />
        </div>
      </Container>
    </div>
  );
};

export default CartPage;