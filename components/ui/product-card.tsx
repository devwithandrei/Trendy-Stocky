"use client";

import Image from "next/image";
import { MouseEventHandler, useState, useCallback, useEffect } from "react";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/lib/wishlist-context";
import { toast } from "react-hot-toast";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from 'react';
import { PopupContext } from '@/contexts/popup-context';

interface ProductCardProps {
  data: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ data, compact = false }) => {
  const router = useRouter();
  const cart = useCart();
  const { toggleWishlist, wishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const popupContext = useContext(PopupContext);
if (!popupContext) {
  throw new Error('PopupContext must be used within PopupProvider');
}
const { openProductDetails } = popupContext;
  const getAvailableStock = () => {
    return data.stock;
  };
  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    const hasSizes = data.sizes && data.sizes.length > 0;
    const hasColors = data.colors && data.colors.length > 0;
    // Validate size selection if product has sizes
    if (hasSizes && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    // Validate color selection if product has colors
    if (hasColors && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    const selectedSizeObj = selectedSize ? data.sizes?.find(s => s.id === selectedSize) : undefined;
    const selectedColorObj = selectedColor ? data.colors?.find(c => c.id === selectedColor) : undefined;
    cart.addItem({
      ...data,
      quantity: quantity,
      stock: getAvailableStock(),
      selectedSize: selectedSizeObj ? {
        ...selectedSizeObj,
        stock: data.stock
      } : undefined,
      selectedColor: selectedColorObj ? {
        ...selectedColorObj,
        stock: data.stock
      } : undefined
    });
    toast.success("Added to cart");
  };
  const hasSizes = data.sizes && data.sizes.length > 0;
  const hasColors = data.colors && data.colors.length > 0;
  const isInWishlist = wishlist.some((item) => item.id === data.id);
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white group rounded-xl border p-3 space-y-4 hover:shadow-lg transform transition-all duration-300"
    >
      {/* Image & actions */}
      <div 
        className="aspect-square rounded-xl bg-gray-100 relative cursor-pointer overflow-hidden"
      >
        {data?.images?.length > 1 && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === 0 ? data.images.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 z-10 shadow-md opacity-70 hover:opacity-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === data.images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 z-10 shadow-md opacity-70 hover:opacity-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <div
          {...useSwipeable({
            onSwipedLeft: () => setCurrentImageIndex((prev) => (prev === data.images.length - 1 ? 0 : prev + 1)),
            onSwipedRight: () => setCurrentImageIndex((prev) => (prev === 0 ? data.images.length - 1 : prev - 1)),
            preventScrollOnSwipe: true
          })}
          onClick={handleClick}
          className="group/image relative h-full w-full overflow-hidden"
        >
          <motion.div 
            className="relative h-full w-full transform transition-transform duration-500 ease-out group-hover/image:scale-125"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.15 }}
          >
            <Image
              src={data?.images?.[currentImageIndex]?.url || data?.images?.[0]?.url}
              alt={data.name}
              fill
              className="aspect-square object-cover rounded-md"
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              loading="eager"
            />
          </motion.div>
          
          {/* Zoom indicator that appears on hover */}
          <div className="absolute bottom-3 right-3 bg-white/80 rounded-full p-1.5 shadow-md opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            {/* Heart icon removed from here as it's now placed next to the info icon */}
          </div>
        </div>
      </div>
      {/* Description */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <p className="font-semibold text-lg truncate bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-[1.02]">{data.name}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductDetails(data);
            }}
            className="inline-flex items-center justify-center p-1 bg-blue-100 hover:bg-blue-200 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4 text-blue-600"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(data.id, {
                name: data.name,
                price: data.price,
                images: data.images,
                category: data.category,
                brand: data.brand,
                description: data.description,
                sizes: data.sizes,
                colors: data.colors,
                stock: data.stock
              });
            }}
            className="inline-flex items-center justify-center p-1 bg-red-50 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Heart
              size={16}
              className={cn(
                "text-red-500 transition-colors duration-200",
                isInWishlist ? "fill-red-500" : "fill-none"
              )}
            />
          </button>
        </div>
        {/* Product details popup is now handled by the PopupContext */}
      </motion.div>
      {/* Size Selector */}
      {hasSizes && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Select
            value={selectedSize}
            onChange={(value) => setSelectedSize(value)}
            options={data.sizes.map((size) => ({
              value: size.id,
              label: size.name,
            }))}
          />
        </motion.div>
      )}
      {/* Color Selector */}
      {hasColors && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          <Select
            value={selectedColor}
            onChange={(value) => setSelectedColor(value)}
            options={data.colors.map((color) => ({
              value: color.id,
              label: color.name,
            }))}
          />
        </motion.div>
      )}
      {/* Price & Add to Cart */}
      <motion.div 
        className="flex items-center justify-between mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <p className="font-semibold text-lg bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
         €{Number(data.price).toFixed(2)}
        </p>
        <Button
          onClick={onAddToCart}
          className="flex items-center gap-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-indigo-600 hover:to-blue-700 transition-all hover:scale-[1.05] active:scale-[0.95] group relative overflow-hidden animate-in slide-in-from-right-2 duration-300 text-sm py-1.5 px-3 shadow-sm hover:shadow-md"
          disabled={!data.stock || data.stock <= 0}
        >
          <span className="relative z-10 flex items-center gap-x-2 transition-transform group-hover:translate-x-1 group-active:translate-x-0">
            {hasSizes && !selectedSize ? "Select Size" : "Add To Bag"}
            <ShoppingCart size={18} className="transition-transform group-hover:rotate-12" />
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
        </Button>
      </motion.div>
    </motion.div>
  );
};
