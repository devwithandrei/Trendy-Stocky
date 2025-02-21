"use client";

import Image from "next/image";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Product, Size, Color } from "@/types";

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
    cart.removeItem(data.id);
    toast.success("Item removed from cart.");
  };

  const onUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) {
      cart.removeItem(data.id);
      toast.success("Item removed from cart.");
      return;
    }

    if (newQuantity > (data.stock || 0)) {
      toast.error("Not enough stock available");
      return;
    }

    cart.updateQuantity(data.id, newQuantity);
  };

  return ( 
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images?.[0]?.url || '/placeholder.png'}
          alt={data.name}
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{data.name}</p>
          </div>

          {/* Category and Brand */}
          <div className="mt-1 flex text-sm">
            <p className="text-gray-500">{data.category?.name}</p>
            <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{data.brand?.name}</p>
          </div>

          {/* Size and Color */}
          {(data.selectedSize || data.selectedColor) && (
            <div className="mt-1 flex text-sm">
              {[
                data.selectedColor?.name && (
                  <div key="color" className="flex items-center text-gray-500">
                    <span>Color: </span>
                    <div 
                      className="ml-2 w-4 h-4 rounded-full ring-1 ring-gray-200" 
                      style={{ backgroundColor: data.selectedColor.value }}
                      title={data.selectedColor.name}
                    />
                  </div>
                ),
                data.selectedSize?.name && (
                  <p key="size" className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                    Size: {data.selectedSize.name}
                  </p>
                )
              ].filter(Boolean)}
            </div>
          )}

          {/* Quantity Controls */}
          <div className="mt-2 flex items-center gap-x-3">
            <button
              onClick={() => onUpdateQuantity(data.quantity - 1)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-medium hover:bg-gray-200 transition"
            >
              -
            </button>
            <span className="text-lg font-medium min-w-[2rem] text-center">
              {data.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(data.quantity + 1)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-medium hover:bg-gray-200 transition"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="mt-2">
            <div className="flex items-center gap-x-2">
              <Currency value={data.price} />
              <span className="text-gray-500">×</span>
              <span>{data.quantity}</span>
              <span className="text-gray-500">=</span>
              <Currency value={parseFloat(data.price) * data.quantity} />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
