"use client"

import Image from "next/image";
import Currency from "@/components/ui/currency";
import { Product } from "@/types";
import { MouseEventHandler, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import BuyNowButton from "./BuyNowButton";
import IconButton from "@/components/ui/icon-button";
import { Expand, ShoppingCart } from "lucide-react";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";

interface ProductCardProps {
  data: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const [isBuying, setIsBuying] = useState(false);
  const previewModal = usePreviewModal();
  const cart = useCart();

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

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem(data);
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
        <div className="opacity-0 group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
            <IconButton
              onClick={onAddToCart}
              icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
          </div>
        </div>
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
