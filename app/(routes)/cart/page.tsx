"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import CrispChatScript from "@/components/ui/CrispChatScript";
import Summary from "./components/summary";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QpJ4YAnX9f0T7mIQHBIMEZEoF4YluCRyYqy8Cily19yfXnQzVnE9WVwbrBr6fVgQsZ4NTJcwEVhsJqt6E46srTv00FK5wVqDs');

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="bg-white">
        <Container>
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            {cart.items.length === 0 ? (
              <div className="mt-12 flex flex-col items-center justify-center">
                <p className="text-lg font-semibold text-gray-600">Your Cart is Empty</p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                >
                  Go To Store
                </button>
              </div>
            ) : (
              <div className="mt-4 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
                {/* RIGHT: Order Summary */}
                <div className="lg:col-span-12"> 
                  <Summary items={cart.items} isFormValid={isFormValid} formData={formData} />
                </div>
              </div>
            )}

            {/* Crisp Chat Support */}
            <CrispChatScript />
          </div>
        </Container>
      </div>
    </Elements>
  );
};

export default CartPage;