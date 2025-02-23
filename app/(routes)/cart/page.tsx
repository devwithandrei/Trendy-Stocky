"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import Summary from "./components/summary";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return !isMounted ? (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ) : (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8">
          

          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              <Summary items={cart.items} isSignedIn={isSignedIn} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
