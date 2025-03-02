"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import Summary from "./components/summary";
import RelatedProducts from "./components/related-products";
import CartItem from "./components/cart-item";
import { Product } from "@/types";

const MemoizedCartItem = React.memo(CartItem);

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItems = useMemo(() => {
    return cart.items.map((item) => ({
      ...item,
      isFeatured: false,
      isArchived: false,
      category: { id: '', name: '', billboardId: '', billboard: { id: '', label: '', imageUrl: '' }, createdAt: '', updatedAt: '' },
      brand: { id: '', name: '', value: '', createdAt: '', updatedAt: '' },
      description: null,
      createdAt: '',
      updatedAt: '',
      sizes: [],
      colors: [],
      stock: item.stock ?? 0,
      images: item.images?.map(img => ({
        id: '',
        url: img.url,
        createdAt: '',
        updatedAt: ''
      })) || [],
      quantity: item.quantity || 1
    }));
  }, [cart.items]);

  if (!isMounted) {
    return null;
  }

    return (
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
              <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <Summary items={cart.items} isSignedIn={isSignedIn} />
                </div>
                <div className="lg:col-span-1 order-1 lg:order-2 hidden lg:block">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-6">Shopping Cart</h1>
                  <div className="mt-4 bg-white rounded-lg shadow-md p-6 mb-6">
                    <ul role="list" className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <MemoizedCartItem key={item.id} data={item} />
                      ))}
                    </ul>
                  </div>
                  <RelatedProducts cartItems={cart.items} />
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    );
}
