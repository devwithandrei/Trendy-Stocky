"use client";

import { ShoppingBag, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useWishlist } from "@/lib/wishlist-context";
import useCart from "@/hooks/use-cart";

interface NavbarActionsProps {
  toggleMenu?: () => void;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ toggleMenu }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { wishlistItemCount } = useWishlist();
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const count = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartItemCount(count);
    }
  }, [cart.items, isMounted]);

  const [cartItemCount, setCartItemCount] = useState(0);

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <button
        onClick={() => router.push('/cart')}
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ShoppingBag
          size={22}
          className="text-gray-600 transition-colors"
        />
        {cartItemCount > 0 && (
          <span className="
            absolute -top-1 -right-1
            flex items-center justify-center
            w-5 h-5
            text-[11px]
            font-medium
            text-white
            bg-red-500
            rounded-full
            shadow-sm
            transition-all
            animate-in
            fade-in
            duration-200
          ">
            {cartItemCount}
          </span>
        )}
      </button>
      <button
        onClick={() => router.push('/wishlist')}
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Heart
          size={22}
          className="text-gray-600 transition-colors"
        />
        {wishlistItemCount > 0 && (
          <span className="
            absolute -top-1 -right-1
            flex items-center justify-center
            w-5 h-5
            text-[11px]
            font-medium
            text-white
            bg-red-500
            rounded-full
            shadow-sm
            transition-all
            animate-in
            fade-in
            duration-200
          ">
            {wishlistItemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NavbarActions;
