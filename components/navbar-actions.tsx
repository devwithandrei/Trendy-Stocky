"use client";

import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";

interface NavbarActionsProps {
  toggleMenu?: () => void;
}

const NavbarActions: React.FC<NavbarActionsProps> = ({ toggleMenu }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const router = useRouter();
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const count = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
      setItemCount(count);
    }
  }, [cart.items, isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleCartClick = () => {
    if (toggleMenu) {
      toggleMenu();
    }
    router.push('/cart');
  };

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <button
        onClick={handleCartClick}
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <ShoppingBag
          size={22}
          className="text-gray-600 transition-colors"
        />
        {itemCount > 0 && (
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
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NavbarActions;
