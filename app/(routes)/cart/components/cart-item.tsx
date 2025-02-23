"use client";

import Image from "next/image";
import { toast } from "react-hot-toast";
import { X, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product, Size, Color } from "@/types";
import { cn } from "@/lib/utils";

interface CartProduct extends Product {
  selectedSize?: Size;
  selectedColor?: Color;
  quantity: number;
}

interface CartItemProps {
  data: CartProduct;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const onRemove = () => {
    cart.removeItem(data.id, data.selectedSize, data.selectedColor);
  };

  const onUpdateQuantity = (newQuantity: number) => {
    cart.updateQuantity(data.id, newQuantity, data.selectedSize, data.selectedColor);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex py-6 border-b border-gray-200 last:border-none"
    >
      {/* Product Image */}
      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images?.[0]?.url || '/placeholder.png'}
          alt={data.name}
          className="object-cover object-center transition-opacity group-hover:opacity-75"
        />
      </div>

      {/* Product Details */}
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>

        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          {/* Product Name and Price */}
          <div>
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {data.name}
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              <p className="text-gray-500">{data.category?.name}</p>
              {data.brand?.name && (
                <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                  {data.brand.name}
                </p>
              )}
            </div>
            <Currency value={Number(data.price)} className="mt-2 text-sm font-medium text-gray-900" />
          </div>

          {/* Variants */}
          <div className="mt-4 sm:mt-0">
            {(data.selectedSize || data.selectedColor) && (
              <div className="flex flex-col gap-y-2">
                {data.selectedColor && (
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="mr-2">Color:</span>
                    <div className="flex items-center">
                      <div
                        className="h-4 w-4 rounded-full border shadow-sm mr-2"
                        style={{ backgroundColor: data.selectedColor.value }}
                      />
                      <span>{data.selectedColor.name}</span>
                    </div>
                  </div>
                )}
                {data.selectedSize && (
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="mr-2">Size:</span>
                    <span>{data.selectedSize.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Controls */}
            <div className="mt-4">
              <label htmlFor={`quantity-${data.id}`} className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <button
                  onClick={() => onUpdateQuantity(data.quantity - 1)}
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                    "bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  )}
                  disabled={data.quantity <= 1}
                >
                  <Minus size={16} className="text-gray-600" />
                </button>
                
                <span className="text-lg font-medium min-w-[2rem] text-center">
                  {data.quantity}
                </span>
                
                <button
                  onClick={() => onUpdateQuantity(data.quantity + 1)}
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                    "bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  )}
                  disabled={data.quantity >= (data.stock || 0)}
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Warning */}
        {data.stock && data.quantity >= data.stock * 0.8 && (
          <p className="mt-2 text-sm text-orange-500">
            Only {data.stock - data.quantity} items left in stock
          </p>
        )}
      </div>
    </motion.li>
  );
};

export default CartItem;
