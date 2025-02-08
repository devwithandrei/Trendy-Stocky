"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import CrispChatScript from "@/components/ui/CrispChatScript";
import Summary from "./components/summary";
import CheckoutForm from "./components/checkout-form";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

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
          <h1 className="text-3xl font-bold text-black">Thank you for purchasing with us</h1>

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
          <CrispChatScript />
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
