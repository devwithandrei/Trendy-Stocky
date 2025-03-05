"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import Image from "next/image";
import Currency from "@/components/ui/currency";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSwipeable } from "react-swipeable";

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
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" 
            onClick={onClose}
          />
          <motion.div 
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: '-50%',
              y: 0
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: '-50%',
              y: 10
            }}
            exit={{ 
              opacity: 0, 
              scale: 0,
              x: '-50%',
              y: 0
            }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed left-1/2 top-[60px] z-50 bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
            style={{
              background: "linear-gradient(white, white) padding-box, linear-gradient(to right, #4f46e5, #3b82f6, #0ea5e9) border-box",
              border: "2px solid transparent",
              boxShadow: "0 15px 30px -8px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(79, 70, 229, 0.1)",
              backgroundImage: "radial-gradient(circle at top center, rgba(255, 255, 255, 1) 70%, rgba(249, 250, 251, 1) 100%)",
              transform: "translateX(-50%)"
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
              className="flex flex-col space-y-4"
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
                </div>
                <Currency value={data.price} className="text-sm bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent font-semibold" />
              </div>
              
              {data.description && (
                <motion.div 
                  className="mt-4 bg-gray-50 p-4 rounded-lg max-h-[200px] overflow-y-auto hide-scrollbar touch-pan-y"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  {...useSwipeable({
                    onSwiping: ({ deltaY }) => {
                      const element = document.querySelector('.description-content');
                      if (element) {
                        element.scrollTop -= deltaY;
                      }
                    },
                    preventScrollOnSwipe: true,
                    trackTouch: true
                  })}
                >
                  <div className="description-content relative">
                    <p className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-sm leading-relaxed">{data.description.value}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
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
  
  /* Custom scrollbar for the popup */
  .scrollbar-thin::-webkit-scrollbar {
    width: 5px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`}</style>