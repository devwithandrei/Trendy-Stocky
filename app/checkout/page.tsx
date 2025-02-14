'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/container';
import useCart from '@/hooks/use-cart';
import CheckoutForm from '@/components/checkout-form';

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/cart');
    }
  }, [cart.items.length, router]);

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Checkout</h1>
          <CheckoutForm />
        </div>
      </Container>
    </div>
  );
}
