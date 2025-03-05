"use client";

import { useEffect } from "react";
import Container from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";

const WishlistPage = () => {
  const { wishlist, toggleWishlist, fetchWishlist, isLoading } = useWishlist();

  // Refresh wishlist data when the page loads
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (isLoading) {
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
                    <ProductCard 
                      data={product}
                      // The ProductCard component already handles size selection internally
                      // No additional props needed as it checks for product.sizes automatically
                    />
                    <button
                      onClick={() => toggleWishlist(product.id, {
                        name: product.name,
                        price: product.price,
                        images: product.images,
                        category: product.category,
                        brand: product.brand,
                        description: product.description,
                        sizes: product.sizes,
                        colors: product.colors,
                        stock: product.stock
                      })}
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
