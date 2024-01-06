"use client"

// ProductCard.tsx

import Image from "next/image";
import Currency from "@/components/ui/currency";
import { Product } from "@/types";
import { MouseEventHandler, useState } from "react";
import BuyNowButton from "./BuyNowButton";
import useCart from "@/hooks/use-cart";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const [isBuying, setIsBuying] = useState(false);
  const cart = useCart();

  const handleBuyNow: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    setIsBuying(true);

    try {
      // Add the product to the cart
      cart.addItem(data); // Assuming there's a function in useCart hook to add items to the cart

      // Redirect to the cart page
      window.location.href = '/cart'; // Change '/cart' to the actual cart page URL
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  const handleClickImage = () => {
    window.location.href = `/product/${data.id}`;
  };

  return (
    <div className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
      <div className="aspect-square rounded-xl bg-gray-100 relative" onClick={handleClickImage}>
        <Image
          src={data.images?.[0]?.url}
          alt={data.name}
          width={300}
          height={300}
          className="aspect-square object-cover rounded-md"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            objectPosition: "center",
          }}
        />
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">{data.name}</p>
          <p className="text-sm text-gray-500">{data.category?.name}</p>
          <Currency value={data?.price} />
        </div>
        <BuyNowButton onClick={handleBuyNow} isBuying={isBuying} />
      </div>
    </div>
  );
};

export default ProductCard;
