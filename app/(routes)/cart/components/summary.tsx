"use client";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import Image from "next/image";
import { Product, Size, Color } from "@/types";

interface CartProduct extends Product {
  selectedSize?: Size;
  selectedColor?: Color;
  quantity: number;
}

interface SummaryProps {
  items: CartProduct[];
  isFormValid: boolean;
  formData?: any;
}

const Summary: React.FC<SummaryProps> = ({ items, isFormValid, formData }) => {
  const searchParams = useSearchParams();
  const cart = useCart();
  const removeAll = useCart((state) => state.removeAll);

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

  const onCheckout = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required details before proceeding.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      // Filter out items that require size/color but don't have selections
      const hasInvalidItems = items.some(item => {
        const needsSize = item.sizes.length > 0;
        const needsColor = item.colors.length > 0;
        return (needsSize && !item.selectedSize) || (needsColor && !item.selectedColor);
      });

      if (hasInvalidItems) {
        const invalidItems = items.filter(item => {
          const needsSize = item.sizes.length > 0;
          const needsColor = item.colors.length > 0;
          return (needsSize && !item.selectedSize) || (needsColor && !item.selectedColor);
        });
        const itemNames = invalidItems.map(item => item.name).join(", ");
        toast.error(`Please select size and color for: ${itemNames}`);
        return;
      }

      const payload = {
        productIds: items.map(item => item.id),
        sizes: items.map(item => {
          // Only include size ID if the product has sizes available
          if (item.sizes && item.sizes.length > 0) {
            return item.selectedSize?.id || "";
          }
          return null; // No sizes available for this product
        }),
        colors: items.map(item => {
          // Only include color ID if the product has colors available
          if (item.colors && item.colors.length > 0) {
            return item.selectedColor?.id || "";
          }
          return null; // No colors available for this product
        }),
        quantities: items.map(item => item.quantity || 1),
        customerDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          postalCode: formData.postalCode
        }
      };

      console.log('Sending checkout request with payload:', payload);
      
      // Extract store ID from API URL since it's already included
      const storeId = process.env.NEXT_PUBLIC_API_URL?.split('/api/')?.[1]?.split('/')?.[0];
      if (!storeId) {
        throw new Error('Store ID not found in API URL');
      }

      // Construct checkout URL using the base API URL
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL?.split('/api/')?.[0] + '/api';
      const checkoutUrl = `${baseApiUrl}/${storeId}/checkout`;
      console.log('Checkout URL:', checkoutUrl);
      
      const response = await axios.post(checkoutUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Checkout response:', response.data);

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error: any) {
      console.error("Checkout error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        payload: error.config?.data
      });
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong with checkout. Please try again.");
      }
    }
  };

  return (
    <>
      {items.length > 0 && (
        <div className="mt-16 rounded-lg bg-white shadow-lg px-6 py-8 sm:p-8 lg:col-span-5 lg:mt-0 lg:p-10">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">Order Summary</h2>

          {/* Cart Items List */}
          <ul className="mt-6 space-y-3 max-h-[300px] overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-2 border rounded-lg shadow-sm bg-gray-50 relative">
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
                  
                  {/* Category and Brand */}
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {item.category?.name} • {item.brand?.name}
                  </p>
                  
                  {/* Size and Color */}
                  {(item.selectedSize || item.selectedColor) && (
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {[
                        item.selectedColor?.name && `Color: ${item.selectedColor.name}`,
                        item.selectedSize?.name && `Size: ${item.selectedSize.name}`
                      ].filter(Boolean).join(' • ')}
                    </p>
                  )}
                  
                  {/* Quantity and Price */}
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Qty: {item.quantity || 1}</span>
                    <Currency value={Number(item.price) * (item.quantity || 1)} className="text-xs sm:text-sm font-medium text-gray-900" />
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => cart.removeItem(item.id)}
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

          {/* Checkout Button */}
          <Button 
            onClick={onCheckout} 
            disabled={!isFormValid || items.length === 0} 
            className="w-full mt-6 py-3 text-lg font-semibold"
          >
            Checkout
          </Button>
        </div>
      )}
    </>
  );
};

export default Summary;