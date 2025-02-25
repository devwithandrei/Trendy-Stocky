"use client";

import Image from "next/image";
import { MouseEventHandler, useState, useCallback, useEffect } from "react";
import { Expand, ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/lib/wishlist-context";
import { toast } from "react-hot-toast";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  data: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const router = useRouter();
  const previewModal = usePreviewModal();
  const cart = useCart();
  const { toggleWishlist, wishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const getAvailableStock = () => {
    return data.stock;
  };

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
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
    <div className="bg-white group rounded-xl border p-3 space-y-4">
      {/* Image & actions */}
      <div 
        onClick={handleClick}
        className="aspect-square rounded-xl bg-gray-100 relative cursor-pointer"
      >
        <Image
          src={data?.images?.[0]?.url}
          alt={data.name}
          fill
          className="aspect-square object-cover rounded-md"
        />
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <button
              onClick={onPreview}
              className="rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition"
            >
              <Expand size={20} className="text-gray-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(data.id);
              }}
              className="rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition"
            >
              <Heart 
                size={20} 
                className={isInWishlist ? "text-red-500 fill-red-500" : "text-gray-600"} 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        <p className="text-sm text-gray-500">{data.category?.name}</p>
      </div>

      {/* Size Selector */}
      {hasSizes && (
        <Select
          value={selectedSize}
          onChange={(value) => setSelectedSize(value)}
          options={data.sizes.map((size) => ({
            value: size.id,
            label: size.name,
          }))}
        />
      )}

      {/* Color Selector */}
      {hasColors && (
        <Select
          value={selectedColor}
          onChange={(value) => setSelectedColor(value)}
          options={data.colors.map((color) => ({
            value: color.id,
            label: color.name,
          }))}
        />
      )}

      {/* Price & Add to Cart */}
      <div className="flex items-center justify-between mt-4">
        <p className="font-semibold text-lg">
         €{Number(data.price).toFixed(2)}
        </p>
        <Button
          onClick={onAddToCart}
          className="flex items-center gap-x-2"
          disabled={!data.stock || data.stock <= 0}
        >
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};
