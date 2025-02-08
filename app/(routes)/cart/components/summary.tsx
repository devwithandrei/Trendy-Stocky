"use client";

import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { X } from "lucide-react"; // Import the X icon

interface SummaryProps {
  items: any[];
  isFormValid: boolean;
  formData?: any; // Add formData as an optional prop
}

const Summary: React.FC<SummaryProps> = ({ items, isFormValid, formData }) => {
  const searchParams = useSearchParams();
  const cart = useCart();
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }
    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => total + Number(item.price), 0);

  const onCheckout = async () => {
    if (!isFormValid) {
      toast.error("Please fill in the required details before proceeding.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        formData, // Send user details
        items, // Send cart items
        totalPrice, // Send total price
      });

      if (response.status === 200) {
        toast.success("Order placed successfully!");
        removeAll();
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      {items.length > 0 && (
        <div className="mt-16 rounded-lg bg-white shadow-lg px-6 py-8 sm:p-8 lg:col-span-5 lg:mt-0 lg:p-10">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-4">Order Summary</h2>

          {/* Cart Items - Smaller with Remove Button */}
          <ul className="mt-6 space-y-3 max-h-[300px] overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-2 border rounded-lg shadow-sm bg-gray-50 relative">
                
                {/* Smaller Image */}
                <div className="relative h-10 w-10 sm:h-16 sm:w-16 rounded-md overflow-hidden">
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className="object-cover object-center w-full h-full"
                  />
                </div>

                {/* Compact Product Details */}
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {item.color.name} • {item.size.name}
                  </p>
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    <Currency value={item.price} />
                  </span>
                </div>

                {/* X Button to Remove Item */}
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
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-4 text-base font-medium">
            <span className="text-gray-900">Total:</span>
            <Currency value={totalPrice} />
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
