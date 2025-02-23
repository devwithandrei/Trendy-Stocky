"use client";

import axios from "axios";
import { useEffect, useCallback, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types";

interface Size {
  id: string;
  name: string;
  value: string;
  stock: number;
}

interface Color {
  id: string;
  name: string;
  value: string;
  stock: number;
}
import PaymentModal from './PaymentModal';
import MultipleButton from './QuantityButton';
import ShipmentDetails from './ShipmentDetails';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ProductVariation {
  id: string;
  sizeId?: string;
  colorId?: string;
  stock: number;
}

export interface CartProduct {
  id: string;
  name: string;
  price: string;
  images: Array<{
    url: string;
  }>;
  stock?: number;
  colorId?: string;
  sizeId?: string;
  selectedColor?: {
    id: string;
    name: string;
    value: string;
    stock: number;
  };
  selectedSize?: {
    id: string;
    name: string;
    value: string;
    stock: number;
  };
  quantity: number;
  productSizes?: ProductVariation[];
  productColors?: ProductVariation[];
}

interface SummaryProps {
  items: CartProduct[];
  isSignedIn?: boolean;
}

const Summary: React.FC<SummaryProps> = ({ items, isSignedIn }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const removeAll = useCart((state) => state.removeAll);
  const [formData, setFormData] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

 const createPaymentIntent = async (formData: any) => {
    try {
      setIsProcessingPayment(true);
      const totalAmount = items.reduce((total, item) => {
        return total + (Number(item.price) * 100 * (item.quantity || 1));
      }, 0);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          items: items.map(item => ({
            id: item.id,
            price: Number(item.price),
            quantity: item.quantity || 1,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor
          })),
          customerInfo: formData
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      const { clientSecret: secret } = data;
      setClientSecret(secret);
    } catch (error: any) {
      console.error('[PAYMENT_ERROR]', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    if (searchParams) {
      if (searchParams.get("success")) {
        toast.success("Payment completed.");
        removeAll();
        router.push('/orders'); // Redirect to orders page after successful payment
      }
      if (searchParams.get("canceled")) {
        toast.error("Something went wrong with the payment.");
      }
    }
  }, [searchParams, removeAll, router]);

  useEffect(() => {
    // Initialize any items without quantity
    items.forEach(item => {
      if (!item.quantity) {
        cart.updateQuantity(item.id, 1, item.selectedSize, item.selectedColor);
      }
    });
  }, [items, cart]);

  const totalPrice = items.reduce((total, item) => {
    return total + (Number(item.price) * (item.quantity || 1));
  }, 0);

  const getItemVariationKey = (item: CartProduct) => {
    return `${item.id}-${item.selectedSize?.id || 'no-size'}-${item.selectedColor?.id || 'no-color'}`;
  };

  const getAvailableStock = (item: CartProduct): number => {
    if (item.selectedSize) {
      return item.selectedSize.stock;
    }
    
    if (item.selectedColor) {
      return item.selectedColor.stock;
    }
    
    return item.stock ?? 0;
  };

  const increaseQuantity = (item: CartProduct) => {
    const availableStock = getAvailableStock(item);
    if (item.quantity < availableStock) {
      cart.updateQuantity(
        item.id,
        item.quantity + 1,
        item.selectedSize,
        item.selectedColor
      );
    }
  };

  const decreaseQuantity = (item: CartProduct) => {
    if (item.quantity > 1) {
      cart.updateQuantity(
        item.id,
        item.quantity - 1,
        item.selectedSize,
        item.selectedColor
      );
    } else {
      cart.removeItem(
        item.id,
        item.selectedSize,
        item.selectedColor
      );
    }
  };

  const handleShipmentDetailsValid = useCallback((isValid: boolean, shipmentData: any) => {
    setIsFormValid(isValid);
    setFormData(shipmentData);
  }, []);

  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '6px',
      borderRadius: '8px'
    }
  };

  const options = {
    clientSecret,
    appearance
  };

  return (
    <div className="lg:col-span-5">
      {items.length > 0 ? (
        <div className="mt-0 rounded-lg bg-white shadow-lg px-6 py-8 sm:p-8 lg:p-10">
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
                      maxQuantity={getAvailableStock(item)}
                      onIncrease={() => increaseQuantity(item)}
                      onDecrease={() => decreaseQuantity(item)}
                    />
                    <Currency value={Number(item.price) * (item.quantity || 1)} className="text-xs sm:text-sm font-medium text-gray-900" />
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => cart.removeItem(item.id, item.selectedSize, item.selectedColor)}
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
          <ShipmentDetails onFormValid={handleShipmentDetailsValid} />

          {/* Payment Section */}
          {isSignedIn ? (
            <div className="mt-6">
              <Button
                onClick={() => createPaymentIntent(formData)}
                disabled={!isFormValid || items.length === 0 || isProcessingPayment}
                className="w-full"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Pay Now'
                )}
              </Button>
              {clientSecret && (
                <Elements stripe={stripePromise} options={options}>
                  <PaymentModal
                    isOpen={true}
                    onClose={() => setClientSecret(undefined)}
                    formData={formData}
                    setFormData={setFormData}
                    setIsFormValid={setIsFormValid}
                    amount={totalPrice * 100}
                  />
                </Elements>
              )}
            </div>
          ) : (
            <Button
              onClick={() => router.push('/sign-in')}
              className="w-full mt-6"
            >
              Sign in to Checkout
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-0 rounded-lg bg-white shadow-lg px-6 py-8 sm:p-8 lg:p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Cart is Empty</h2>
          <Button
            onClick={() => router.push("/")}
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Summary;
