"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import Image from "next/image";
import Currency from "@/components/ui/currency";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import SocialSharingProduct from "./SocialSharingProduct";
import { cn } from "@/lib/utils";

interface ProductDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: Product;
}

const ProductDetailsPopup: React.FC<ProductDetailsPopupProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-xl shadow-2xl p-6 w-[90vw] sm:w-[420px] m-4"
            style={{
              background: "linear-gradient(white, white) padding-box, linear-gradient(to right, #4f46e5, #3b82f6, #0ea5e9) border-box",
              border: "2px solid transparent",
              boxShadow: "0 15px 30px -8px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(79, 70, 229, 0.1)",
              backgroundImage: "radial-gradient(circle at top center, rgba(255, 255, 255, 1) 70%, rgba(249, 250, 251, 1) 100%)"
            }}
          >
            <motion.button 
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
            
            <motion.div
              className="flex flex-col space-y-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {/* Product name */}
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent leading-tight">
                {data.name}
              </h2>
              
              {/* Product thumbnails */}
              {data?.images?.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                  {data.images.slice(0, 3).map((image, index) => (
                    <div 
                      key={image.id}
                      className={cn(
                        'relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all duration-200 w-16 h-16 border',
                        'border-gray-200 hover:border-gray-400 hover:shadow-md',
                      )}
                    >
                      <Image
                        src={image.url}
                        alt={`${data.name} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                        quality={80}
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <div className="flex items-center justify-between gap-x-2 text-sm">
                <div className="flex items-center gap-x-2">
                  {data.brand && (
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {data.brand.name}
                    </span>
                  )}
                  
                  {data.category && (
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                      {data.category.name}
                    </span>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => toggleWishlist(data.id, {
                        name: data.name,
                        price: data.price,
                        images: data.images,
                        category: data.category,
                        brand: data.brand,
                        description: data.description
                      })}
                      className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={16}
                        className={cn(
                          "transition-all duration-300",
                          isInWishlist(data.id) 
                            ? "text-red-500 fill-red-500" 
                            : "text-gray-600 hover:text-red-500"
                        )}
                      />
                    </motion.button>
                    <div className="scale-90">
                      <SocialSharingProduct productId={data.id} productName={data.name} />
                    </div>
                  </div>
                </div>
                <Currency value={data.price} className="text-sm bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent font-semibold" />
              </div>
              
              {/* Description */}
              {data.description && (
                <p className="text-xs text-gray-600">
                  {typeof data.description === 'object' && 'value' in data.description ? data.description.value : String(data.description)}
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsPopup;

/* Custom scrollbar styles */
<style jsx global>{`
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>