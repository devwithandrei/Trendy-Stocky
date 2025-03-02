"use client";

import { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import axios from "axios";
import { Product } from "@/types";
import { toast } from "react-hot-toast";

interface WishlistContextProps {
  wishlist: Product[];
  wishlistItemCount: number;
  toggleWishlist: (productId: string, productData?: Partial<Product>) => Promise<void>;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a ref to track pending operations to prevent race conditions
  const pendingOperations = useRef<Set<string>>(new Set());
  
  // Debounce wishlist fetching to prevent multiple requests
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchWishlist = useCallback(async () => {
    if (!isSignedIn) {
      setWishlist([]);
      setWishlistItemCount(0);
      return;
    }

    // Clear any pending fetch
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // If there are pending operations, delay the fetch
    if (pendingOperations.current.size > 0) {
      fetchTimeoutRef.current = setTimeout(fetchWishlist, 300);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`/api/users/wishlist`);
      setWishlist(response.data);
      setWishlistItemCount(response.data.length);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
      setWishlistItemCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setWishlistItemCount(0);
    }
  }, [isSignedIn, fetchWishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback(async (productId: string, productData?: Partial<Product>) => {
    if (!isSignedIn) {
      toast.error("Please sign in to use wishlist");
      openSignIn();
      return;
    }

    // If this product is already being processed, ignore the request
    if (pendingOperations.current.has(productId)) {
      return;
    }

    const isProductInWishlist = isInWishlist(productId);
    
    // Optimistic UI update
    if (isProductInWishlist) {
      // Remove from wishlist optimistically
      setWishlist(prev => prev.filter(item => item.id !== productId));
      setWishlistItemCount(prev => prev - 1);
      toast.success("Removed from wishlist");
    } else if (productData) {
      // Add to wishlist optimistically if we have product data
      const optimisticProduct = {
        id: productId,
        name: productData.name || 'Product',
        price: productData.price || '0',
        images: productData.images || [],
        ...productData
      } as Product;
      
      setWishlist(prev => [...prev, optimisticProduct]);
      setWishlistItemCount(prev => prev + 1);
      toast.success("Added to wishlist");
    } else {
      // If we don't have product data, show loading toast
      toast.loading("Updating wishlist...");
    }

    // Mark this product as being processed
    pendingOperations.current.add(productId);

    try {
      if (isProductInWishlist) {
        await axios.delete(`/api/users/wishlist?productId=${productId}`);
      } else {
        await axios.post(`/api/users/wishlist`, { productId });
      }
      
      // Fetch the latest wishlist data to ensure consistency
      // But only if we didn't have product data for optimistic updates
      if (!productData) {
        await fetchWishlist();
        toast.dismiss();
        toast.success(isProductInWishlist ? "Removed from wishlist" : "Added to wishlist");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Something went wrong");
      
      // Revert optimistic update on error
      await fetchWishlist();
    } finally {
      // Remove this product from pending operations
      pendingOperations.current.delete(productId);
    }
  }, [isSignedIn, isInWishlist, openSignIn, fetchWishlist]);

  const value: WishlistContextProps = {
    wishlist,
    wishlistItemCount,
    toggleWishlist,
    fetchWishlist,
    isInWishlist,
    isLoading
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
