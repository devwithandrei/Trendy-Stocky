"use client";

import { MouseEventHandler, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Product, Size, Color, CartProduct } from "@/types";
import Currency from "@/components/ui/currency";
import { ShoppingCart, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { Tab } from "@headlessui/react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-context";
import { motion, AnimatePresence } from "framer-motion";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const getAvailableStock = () => {
    return data.stock;
  };

  const handleTabChange = (index: number) => {
    setIsAnimating(true);
    setSelectedTab(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextImage = () => {
    if (data?.images?.length > 1 && !isAnimating) {
      handleTabChange((selectedTab === data.images.length - 1) ? 0 : selectedTab + 1);
    }
  };

  const prevImage = () => {
    if (data?.images?.length > 1 && !isAnimating) {
      handleTabChange((selectedTab === 0) ? data.images.length - 1 : selectedTab - 1);
    }
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    if (data.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (data.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    const availableStock = getAvailableStock();
    if (!availableStock) {
      toast.error("Product is out of stock");
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return;
    }

    const cartItem: CartProduct = {
      id: data.id,
      name: data.name,
      price: data.price,
      images: data.images,
      stock: data.stock,
      quantity: quantity,
      selectedSize: selectedSize ? {
        ...selectedSize,
        stock: data.stock
      } : undefined,
      selectedColor: selectedColor ? {
        ...selectedColor,
        stock: data.stock
      } : undefined
    };

    cart.addItem(cartItem);
    toast.success("Added to cart");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Gallery Section - Left side on desktop */}
      <div className="mb-8 lg:mb-0 lg:col-span-7 xl:col-span-8">
        <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-xl">
          {data?.images?.length > 1 && (
            <>
              <motion.button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 z-10 shadow-lg opacity-80 hover:opacity-100 transition-all duration-300 hover:bg-white"
                aria-label="Previous image"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
              <motion.button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 z-10 shadow-lg opacity-80 hover:opacity-100 transition-all duration-300 hover:bg-white"
                aria-label="Next image"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={24} />
              </motion.button>
            </>
          )}

          <div
            {...useSwipeable({
              onSwipedLeft: nextImage,
              onSwipedRight: prevImage,
              preventScrollOnSwipe: true,
              trackMouse: true,
              swipeDuration: 500,
              delta: 10,
              trackTouch: true,
            })}
            className="h-full w-full touch-pan-y"
          >
            <AnimatePresence mode="wait">
              {data?.images?.map((image, index) =>
                index === selectedTab ? (
                  <motion.div
                    key={image.id}
                    className="relative h-full w-full"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <Image
                      src={image.url}
                      alt="Product image"
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      quality={90}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    />
                  </motion.div>
                ) : null,
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {data?.images?.length > 1 && (
          <div className="mt-6 grid grid-cols-5 sm:grid-cols-6 gap-4">
            {data?.images?.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedTab(index)}
                className={cn(
                  "relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all duration-200",
                  selectedTab === index
                    ? "ring-2 ring-offset-2 ring-black shadow-md transform scale-105"
                    : "hover:ring-1 ring-offset-1 ring-gray-400 hover:shadow-md",
                )}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={image.url}
                    alt="Thumbnail"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 10vw"
                    quality={80}
                    loading="eager"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Information Section - Right side on desktop */}
      <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 lg:self-start">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-6">{data.name}</h1>
          <div className="flex items-center justify-between mb-8 border-b pb-6">
            <p className="text-3xl font-semibold text-gray-900">
              <Currency value={data.price} />
            </p>
          </div>
          
          <div className="space-y-10">
            {/* Description */}
            <div className="space-y-3 border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed text-base">{data.description?.value}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-b pb-6">
              {/* Brand */}
              {data.brand && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                  <p className="font-medium text-gray-900">{data.brand.name}</p>
                </div>
              )}
              
              {/* Category */}
              {data.category && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="font-medium text-gray-900">{data.category.name}</p>
                </div>
              )}
            </div>

            {/* Size Selection */}
            {data.sizes?.length > 0 && (
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-xl font-semibold text-gray-900">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {data.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "transition-all duration-200",
                        selectedSize?.id === size.id
                          ? "bg-black text-white ring-black shadow-md transform scale-105"
                          : "bg-white text-gray-900 ring-gray-300 hover:bg-gray-50",
                        "min-w-[3rem] h-10 rounded-lg border px-4 py-2 text-sm font-medium flex items-center justify-center",
                      )}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {data.colors?.length > 0 && (
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-xl font-semibold text-gray-900">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {data.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "transition-all duration-200 relative",
                        selectedColor?.id === color.id
                          ? "ring-2 ring-offset-2 ring-black shadow-md transform scale-105"
                          : "ring-1 ring-gray-300 hover:ring-gray-400",
                        "h-10 w-10 rounded-full flex items-center justify-center",
                      )}
                      style={{ backgroundColor: color.value }}
                      aria-label={color.name}
                    >
                      {selectedColor?.id === color.id && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <span className="text-xl font-medium">-</span>
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= (data.stock || 0)}
                  >
                    <span className="text-xl font-medium">+</span>
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {data.stock} available
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart and Wishlist Buttons */}
          <div className="mt-10 flex items-center space-x-4">
            <Button
              onClick={onAddToCart}
              className="flex-1 rounded-lg bg-black px-6 py-3 text-base font-medium text-white transition hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              {data.sizes?.length > 0 && !selectedSize ? "Select Size" : "Add To Bag"}
            </Button>
            <button
              onClick={() => toggleWishlist(data.id)}
              className={cn(
                "rounded-lg p-3 text-sm font-medium transition flex items-center justify-center",
                isInWishlist(data.id)
                  ? "bg-red-500 text-white shadow-md"
                  : "border border-gray-300 hover:bg-gray-100",
              )}
            >
              <Heart
                size={20}
                className={isInWishlist(data.id) ? "fill-current" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
