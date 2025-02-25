"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Product } from "@/types";
import { toast } from "react-hot-toast";

interface WishlistContextProps {
  wishlist: Product[];
  wishlistItemCount: number;
  toggleWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);

  const fetchWishlist = async () => {
    if (!isSignedIn) {
      setWishlist([]);
      setWishlistItemCount(0);
      return;
    }

    try {
      const response = await axios.get(`/api/users/wishlist`);
      setWishlist(response.data);
      setWishlistItemCount(response.data.length);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
      setWishlistItemCount(0);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setWishlistItemCount(0);
    }
  }, [isSignedIn]);

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = async (productId: string) => {
    if (!isSignedIn) {
      toast.error("Please sign in to use wishlist");
      openSignIn();
      return;
    }

    try {
      const isProductInWishlist = isInWishlist(productId);
      if (isProductInWishlist) {
        await axios.delete(`/api/users/wishlist?productId=${productId}`);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(`/api/users/wishlist`, { productId });
        toast.success("Added to wishlist");
      }
      await fetchWishlist();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Something went wrong");
    }
  };

  const value: WishlistContextProps = {
    wishlist,
    wishlistItemCount,
    toggleWishlist,
    fetchWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
