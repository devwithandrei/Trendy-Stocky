"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import CheckoutForm from "./components/checkout-form";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const cart = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (cart.items.length === 0) {
      router.push("/cart");
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const response = await axios.post("/api/create-payment-intent", {
          items: cart.items,
          userId: user.id,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast.error("Something went wrong. Please try again.");
      }
    };

    createPaymentIntent();
  }, [cart.items, router, user]);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: '#0F172A',
    },
  };

  const options: any = {
    clientSecret,
    appearance,
  };

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Checkout</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm />
                </Elements>
              )}
            </div>
            <div className="lg:col-span-5">
              <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900">
                  Order summary
                </h2>
                <div className="mt-6 space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-t border-gray-200 pt-4"
                    >
                      <div className="flex items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="ml-2 text-sm text-gray-600">
                          x{item.quantity}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${(Number(item.price) * (Number(item.quantity) || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                      Order total
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      ${cart.getTotalPrice().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CheckoutPage;
