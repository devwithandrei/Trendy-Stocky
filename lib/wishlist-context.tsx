"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Product } from "@/types";

interface WishlistContextProps {
  wishlist: Product[];
  wishlistItemCount: number;
  toggleWishlist: (productId: string) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);

  const fetchWishlist = async () => {
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
    fetchWishlist();
  }, [user?.id]);

  const toggleWishlist = async (productId: string) => {
    if (!user || !user.id) return;

    try {
      const isInWishlist = wishlist.some(item => item.id === productId);
      if (isInWishlist) {
        await axios.delete(`/api/users/${user.id}/wishlist/${productId}`);
      } else {
        await axios.post(`/api/users/wishlist`, { productId });
      }
      await fetchWishlist();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      fetchWishlist();
    }
  };

  const value: WishlistContextProps = {
    wishlist,
    wishlistItemCount,
    toggleWishlist,
    fetchWishlist,
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
