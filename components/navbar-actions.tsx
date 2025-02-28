"use client";

import { ShoppingBag, Heart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useWishlist } from "@/lib/wishlist-context";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import { UserNav } from "@/components/user-nav";

interface NavbarActionsProps {
  toggleMenu?: () => void;
}

const NavbarActions: React.FC<NavbarActionsProps> = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { wishlistItemCount } = useWishlist();
  const cart = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const cartItemCount = useMemo(() => {
    if (!isMounted) return 0;
    return cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart.items, isMounted]);
  const handleProtectedAction = useCallback((action: () => void) => {
    if (!isSignedIn) {
      toast.error("Please sign in to continue");
      router.push('/sign-in');
      return;
    }
    action();
  }, [isSignedIn, router]);
  const handleCartClick = useCallback(() => {
    handleProtectedAction(() => router.push('/cart'));
  }, [handleProtectedAction, router]);
  const handleWishlistClick = useCallback(() => {
    if (isSignedIn) {
      router.push('/wishlist');
    } else {
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);
  const handleSignInClick = useCallback(() => {
    router.push('/sign-in');
  }, [router]);
  if (!isMounted) return null;
  return (
    <div className="flex items-center gap-x-4">
      <button
        onClick={handleCartClick}
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
        onClick={handleWishlistClick}
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
      
      <div className="w-9 h-9 flex items-center justify-center">
        {isSignedIn ? (
          <UserNav />
        ) : (
          <button
            onClick={handleSignInClick}
            className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <User
              size={22}
              className="text-gray-600 transition-colors"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavbarActions;
