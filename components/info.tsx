"use client";

import { MouseEventHandler, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Product, Size, Color, CartProduct } from "@/types";
import Currency from "@/components/ui/currency";
import { ShoppingCart, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import useCart from "@/hooks/use-cart";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-context";
import { motion, AnimatePresence } from "framer-motion";
import ProductDetailsPopup from "./ProductDetailsPopup";
import SocialSharingProduct from "./SocialSharingProduct";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(
    undefined,
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkIsMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkIsMobile);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

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
      handleTabChange(
        selectedTab === data.images.length - 1 ? 0 : selectedTab + 1,
      );
    }
  };

  const prevImage = () => {
    if (data?.images?.length > 1 && !isAnimating) {
      handleTabChange(
        selectedTab === 0 ? data.images.length - 1 : selectedTab - 1,
      );
    }
  };

  const toggleDetailsPopup = () => {
    setShowDetailsPopup(!showDetailsPopup);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    if (data.sizes?.length > 0 && !selectedSize) {
      // toast.error("Please select a size");
      return;
    }

    if (data.colors?.length > 0 && !selectedColor) {
      // toast.error("Please select a color");
      return;
    }

    const availableStock = getAvailableStock();
    if (!availableStock) {
      // toast.error("Product is out of stock");
      return;
    }

    if (quantity > availableStock) {
      // toast.error(`Only ${availableStock} items available in stock`);
      return;
    }

    const cartItem: CartProduct = {
      id: data.id,
      name: data.name,
      price: data.price,
      images: data.images,
      stock: data.stock,
      quantity: quantity,
      selectedSize: selectedSize
        ? {
            ...selectedSize,
            stock: data.stock,
          }
        : undefined,
      selectedColor: selectedColor
        ? {
            ...selectedColor,
            stock: data.stock,
          }
        : undefined,
    };

    cart.addItem(cartItem);
    // toast.success("Added to cart");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Gallery Section - Left side on desktop */}
      <div className="mb-8 lg:mb-0 lg:col-span-7 xl:col-span-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Thumbnail Navigation - Independent thumbnails */}
          <div className="order-2 lg:order-1 lg:w-20 mt-4 lg:mt-0 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] hide-scrollbar">
            {data?.images?.length > 1 && data?.images?.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedTab(index)}
                onMouseEnter={() => setSelectedTab(index)}
                className={cn(
                  'relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all duration-200 min-w-[80px] w-20 h-20 border',
                  selectedTab === index
                    ? 'border-black shadow-md'
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-md',
                )}
              >
                <Image
                  src={image.url}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 10vw"
                  quality={80}
                  loading="eager"
                />
              </button>
            ))}
          </div>

          {/* Main Image - Left side on desktop */}
          <div className="order-1 lg:order-2 lg:flex-1">
            <div className="relative aspect-square sm:aspect-square lg:aspect-square rounded-2xl overflow-hidden shadow-xl bg-gray-100 group">
              {/* Navigation arrows for desktop */}
              {!isMobile && data?.images?.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    disabled={isAnimating}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    disabled={isAnimating}
                  >
                    <ChevronRight size={20} />
                  </button>
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
                className="h-full w-full touch-pan-y overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {data?.images?.map((image, index) =>
                    index === selectedTab ? (
                      <motion.div
                        key={image.id}
                        className="relative h-full w-full overflow-hidden"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <div className="relative h-full w-full transform transition-transform duration-500 ease-out group-hover:scale-110">
                          <Image
                            src={image.url}
                            alt={`${data.name} - Product image`}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                            quality={100}
                            priority
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                          />
                        </div>
                        {/* Zoom indicator that appears on hover */}
                        <div className="absolute bottom-4 right-4 bg-white/80 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                          </svg>
                        </div>
                      </motion.div>
                    ) : null,
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Add custom CSS for hiding scrollbar */}
        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      {/* Product Information Section - Right side on desktop */}
      <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 lg:self-start">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <div className="relative">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6 truncate overflow-hidden whitespace-nowrap h-8 leading-8">{data.name}</h1>
              <motion.button 
                onClick={toggleDetailsPopup}
                className="ml-2 mb-6 p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-50"
                aria-label="Show product details"
                whileHover={{ scale: 1.1, backgroundColor: "#dbeafe" }}
                whileTap={{ scale: 0.95 }}
                id="info-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </motion.button>
            </div>
            
            {/* Product Details Popup */}
            <ProductDetailsPopup 
              isOpen={showDetailsPopup}
              onClose={toggleDetailsPopup}
              data={data}
            />
          </div>
          
          <div className="flex items-center justify-between mb-4 border-b pb-4">
            <p className="text-3xl font-semibold text-gray-900">
              <Currency value={data.price} />
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Size Selection */}
            {data.sizes?.length > 0 && (
              <div className="space-y-4 border-b pb-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent animate-gradient">
                  Available Sizes:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "transition-all duration-200",
                        selectedSize?.id === size.id
                          ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white ring-black shadow-md transform scale-105"
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
          </div>

          {/* Add to Cart and Wishlist Buttons */}
          <div className="mt-10 flex items-center space-x-4">
            <Button
              onClick={onAddToCart}
              className="flex-1 min-w-[180px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-4 text-base font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center border border-transparent relative overflow-hidden group"
            >
              <span className="relative z-10 whitespace-nowrap text-center transition-transform group-hover:translate-x-1 group-active:translate-x-0">
                {data.sizes?.length > 0 && !selectedSize ? "Select Size" : "Add To Bag"}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></span>
            </Button>
            <button
              onClick={() => toggleWishlist(data.id, {
                name: data.name,
                price: data.price,
                images: data.images,
                category: data.category,
                brand: data.brand,
                description: data.description,
                sizes: data.sizes,
                colors: data.colors,
                stock: data.stock
              })}
              className="relative p-3 text-sm font-medium transition-all duration-300 flex items-center justify-center rounded-full hover:scale-110 active:scale-90"
              aria-label="Add to wishlist"
            >
              <Heart
                size={24}
                className={cn(
                  "transition-all duration-300",
                  isInWishlist(data.id) 
                    ? "text-red-500 fill-red-500 filter drop-shadow-md animate-heartbeat" 
                    : "text-gray-400 hover:text-red-500"
                )}
              />
            </button>
            <SocialSharingProduct productId={data.id} productName={data.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
