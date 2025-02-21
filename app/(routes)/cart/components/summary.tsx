"use client";

import axios from "axios";
import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import Image from "next/image";
import { Product, Size, Color } from "@/types";
import CardPaymentForm from './CardPaymentForm';
import PayButton from './PayButton';
import MultipleButton from './QuantityButton';
import ShipmentDetails from './ShipmentDetails';
import { useState } from 'react';

interface CartProduct extends Product {
  selectedSize?: Size;
  selectedColor?: Color;
  quantity: number;
}

interface SummaryProps {
  items: CartProduct[];
  isFormValid: boolean;
  formData: any;
}

const Summary: React.FC<SummaryProps> = ({ items }) => {
  const searchParams = useSearchParams();
  const cart = useCart();
  const removeAll = useCart((state) => state.removeAll);
  const [formData, setFormData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (searchParams) {
      if (searchParams.get("success")) {
        toast.success("Payment completed.");
        removeAll();
      }
      if (searchParams.get("canceled")) {
        toast.error("Something went wrong.");
      }
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + (Number(item.price) * (item.quantity || 1));
  }, 0);

  const getItemVariationKey = (item: CartProduct) => {
    return `${item.id}-${item.selectedSize?.id || 'no-size'}-${item.selectedColor?.id || 'no-color'}`;
  };

  const findMatchingItem = (itemId: string, targetItem: CartProduct) => {
    return items.find(item => {
      const sameId = item.id === itemId;
      const sameSize = (!targetItem.selectedSize && !item.selectedSize) || 
                      (targetItem.selectedSize?.id === item.selectedSize?.id);
      const sameColor = (!targetItem.selectedColor && !item.selectedColor) || 
                      (targetItem.selectedColor?.id === item.selectedColor?.id);
      return sameId && sameSize && sameColor;
    });
  };

  const increaseQuantity = (itemId: string, targetItem: CartProduct) => {
    const item = findMatchingItem(itemId, targetItem);
    if (item) {
      if (item.quantity + 1 <= item.stock) {
        cart.addItem({ ...item, quantity: item.quantity + 1 });
      } else {
        toast.error("Not enough stock available.");
      }
    }
  };

  const decreaseQuantity = (itemId: string, targetItem: CartProduct) => {
    const item = findMatchingItem(itemId, targetItem);
    if (item && item.quantity > 1) {
      cart.addItem({ ...item, quantity: item.quantity - 1 });
    } else {
      cart.removeItem(itemId);
    }
  };

  const onCheckout = async () => {
    // ... (existing checkout logic)
  };

  const handleShipmentDetailsValid = useCallback((isValid: boolean, shipmentData: any) => {
    setIsFormValid(isValid);
    setFormData(shipmentData);
  }, [setIsFormValid, setFormData]);

  return (
    <>
      {items.length > 0 && (
        <div className="lg:col-span-5 mt-0 rounded-lg bg-white shadow-lg px-6 py-8 sm:p-8 lg:p-10"> 
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">Order Summary</h2>

          {/* Cart Items List */}
          <ul className="mt-6 space-y-3 max-h-[300px] overflow-y-auto">
            {items.map((item) => (
              <li key={getItemVariationKey(item)} className="flex items-center gap-3 p-2 border rounded-lg shadow-sm bg-gray-50 relative">
                {/* Product Image */}
                <div className="relative h-10 w-10 sm:h-16 sm:w-16 rounded-md overflow-hidden">
                  <Image
                    src={item.images?.[0]?.url || '/placeholder.png'}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  {item.selectedSize && <p className="text-[10px] sm:text-xs text-gray-500">Size: {item.selectedSize.name}</p>}
                  {item.selectedColor && <p className="text-[10px] sm:text-xs text-gray-500">Color: {item.selectedColor.name}</p>}
                  
                  {/* Quantity Adjustment */}
                  <div className="flex items-center justify-between mt-2">
                    <MultipleButton 
                      quantity={item.quantity} 
                      onIncrease={() => increaseQuantity(item.id, item)} 
                      onDecrease={() => decreaseQuantity(item.id, item)} 
                    />
                    <Currency value={Number(item.price) * (item.quantity || 1)} className="text-xs sm:text-sm font-medium text-gray-900" />
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => {
                    console.log('Removing item with:', {
                      id: item.id,
                      size: item.selectedSize,
                      color: item.selectedColor
                    });
                    cart.removeItem(
                      item.id,
                      item.selectedSize || undefined,
                      item.selectedColor || undefined
                    );
                  }}
                  className="absolute top-1 right-1 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                >
                  <X size={12} className="text-gray-600" />
                </button>
              </li>
            ))}
          </ul>

          {/* Order Total */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4">
            <span className="text-base font-medium text-gray-900">Total:</span>
            <Currency value={totalPrice} className="text-lg font-semibold text-gray-900" />
          </div>

          {/* Shipment Details */}
         

          {/* Stripe Payment Form and Pay Button */}
          <CardPaymentForm setFormData={setFormData} setIsFormValid={setIsFormValid} />
          <ShipmentDetails onFormValid={handleShipmentDetailsValid} />
          <PayButton disabled={!isFormValid} formData={formData} />
        </div>
      )}
    </>
  );
};

export default Summary;
