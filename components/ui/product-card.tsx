"use client"


import Image from "next/image";
import Link from "next/link";
import Currency from "@/components/ui/currency";
import { Product } from "@/types";
import { MouseEventHandler, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BuyNowButton from "./BuyNowButton";

interface ProductCardProps {
  data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const [isBuying, setIsBuying] = useState(false);

  const handleBuyNow: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    setIsBuying(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        checkoutInfo: {},
        productIds: [data.id],
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to proceed to checkout. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
      <Link href={`/product/${data.id}`} passHref>
        <div className="aspect-square rounded-xl bg-gray-100 relative">
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
              objectPosition: "center"
            }}
          />
        </div>
      </Link>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">{data.name}</p>
          <p className="text-sm text-gray-500">{data.category?.name}</p>
          <Currency value={data?.price} />
        </div>
        <BuyNowButton onClick={handleBuyNow} isBuying={isBuying} />
      </div>
      {/* Other product details or additional content */}
    </div>
  );
};

export default ProductCard;
