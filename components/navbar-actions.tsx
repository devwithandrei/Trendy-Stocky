"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const cart = useCart();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button
        onClick={() => router.push('/cart')}
        className="flex items-center rounded-full bg-blue-500 px-3 py-1 sm:px-4 sm:py-2" // Set different sizes for mobile and larger screens
        style={{ color: 'white' }} // Set text color to white
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-white"> {/* Set different font size for mobile and larger screens */}
          {cart.items.length}
        </span>
      </Button>
    </div>
  );
};

export default NavbarActions;