"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Container from "@/components/ui/container";
import { Product } from "@/types";
import axios from "axios";
import ProductCard from "@/components/ui/product-card";
import { Heart, Trash2 } from "lucide-react";

const WishlistPage = () => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      
      try {
        const response = await axios.get(`/api/users/${user.id}/wishlist`);
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      await axios.delete(`/api/users/${user.id}/wishlist/${productId}`);
      setWishlist(current => current.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-black">My Wishlist</h1>
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          <div className="mt-8">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Heart className="w-12 h-12 text-gray-300" />
                <p className="text-neutral-500">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishlist.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard data={product} />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default WishlistPage;
