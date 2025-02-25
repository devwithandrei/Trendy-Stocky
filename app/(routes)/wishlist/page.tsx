"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Container from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { Heart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Product } from "@/types";
import axios from "axios";

const WishlistPage = () => {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Transform product data to include sizes and colors in the format expected by ProductCard
  const transformProductData = (product: any): Product => {
    const sizes = product.productSizes?.map((ps: any) => ({
      id: ps.size.id,
      name: ps.size.name,
      value: ps.size.value,
      stock: ps.stock
    })) || [];

    const colors = product.productColors?.map((pc: any) => ({
      id: pc.color.id,
      name: pc.color.name,
      value: pc.color.value,
      stock: pc.stock
    })) || [];

    return {
      ...product,
      sizes,
      colors
    };
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`/api/users/wishlist`);
          const transformedProducts = response.data.map(transformProductData);
          setWishlist(transformedProducts);
        } catch (error: any) {
          toast.error('Error fetching wishlist. Please try again.');
          console.error('Error fetching wishlist:', error);
          setError('Error fetching wishlist. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWishlist();
  }, [user?.id]);

  const removeFromWishlist = async (productId: string) => {
    if (!user || !user.id) return;

    try {
      await axios.delete(`/api/users/wishlist`, { params: { productId } });
      setWishlist(current => current.filter(item => item.id !== productId));
    } catch (error) {
      toast.error('Error removing from wishlist. Please try again.');
      console.error('Error removing from wishlist:', error);
      setError('Error removing from wishlist. Please try again.');
      setWishlist(current => current.filter(item => item.id !== productId));
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user || !user.id) return;

    try {
      await axios.post(`/api/users/wishlist`, { productId });
      const productResponse = await axios.get(`/api/products/${productId}`);
      const transformedProduct = transformProductData(productResponse.data);
      setWishlist(current => [...current, transformedProduct]);
    } catch (error) {
      toast.error('Error adding to wishlist. Please try again.');
      console.error('Error adding to wishlist:', error);
      setError('Error adding to wishlist. Please try again.');
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (wishlist.some(item => item.id === productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
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
            <h1 className="text-3xl font-bold text-black">
              My Wishlist ({wishlist.length})
            </h1>
            <Heart className="w-6 h-6 text-rose-500" />
          </div>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
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
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose-50"
                    >
                      {wishlist.some(item => item.id === product.id) ? (
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      ) : (
                        <Heart className={`w-6 h-6 ${wishlist.some(item => item.id === product.id) ? 'text-rose-500' : 'text-gray-300'}`} />
                      )}
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
