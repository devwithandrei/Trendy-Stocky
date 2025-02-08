"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import CrispChatScript from "@/components/ui/CrispChatScript";
import Summary from "./components/summary";
import CheckoutForm from "./components/checkout-form";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const router = useRouter(); // Initialize useRouter

  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8"> 
          {cart.items.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center">
              <p className="text-lg font-semibold text-gray-600">Your Cart is Empty</p>
              <button
                onClick={() => router.push("/")} // Redirects to homepage
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Go To Store
              </button>
            </div>
          ) : (
            // Otherwise, show checkout form & order summary
            <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
              {/* LEFT: Checkout Form */}
              <div className="lg:col-span-7">
                <CheckoutForm onFormValid={(isValid, data) => {
                  setIsFormValid(isValid);
                  setFormData(data);
                }} />
              </div>

              {/* RIGHT: Order Summary */}
              <Summary items={cart.items} isFormValid={isFormValid} formData={formData} />
            </div>
          )}

          {/* Crisp Chat Support */}
          <CrispChatScript />
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
