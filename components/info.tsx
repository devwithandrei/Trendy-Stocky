"use client";

import { MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Product, Size, Color } from "@/types";
import Currency from "@/components/ui/currency";
import { ShoppingCart } from "lucide-react";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ProductVariations from "./product-variations";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(undefined);

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    // Check if product has no variations
    if ((!data.sizes || !data.sizes.length) && (!data.colors || !data.colors.length)) {
      if (!data.stock || data.stock <= 0) {
        toast.error("Product is out of stock");
        return;
      }
      cart.addItem({
        ...data,
        quantity: 1
      });
      toast.success("Item added to cart");
      return;
    }

    // Handle products with variations
    if (data.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (data.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Check stock based on variations
    if (data.sizes.length > 0 && selectedSize && selectedSize.stock <= 0) {
      toast.error("Selected size is out of stock");
      return;
    }

    if (data.colors.length > 0 && selectedColor && selectedColor.stock <= 0) {
      toast.error("Selected color is out of stock");
      return;
    }

    cart.addItem({
      ...data,
      selectedSize,
      selectedColor,
      quantity: 1
    });

    toast.success("Item added to cart");
  };

  const handleVariationSelectAction = (sizeId: string, colorId: string, stock: number) => {
    const size = data.sizes.find(s => s.id === sizeId);
    const color = data.colors.find(c => c.id === colorId);
    
    setSelectedSize(size);
    setSelectedColor(color);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-2xl text-gray-900">
          <Currency value={data.price} />
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        {data.description && (
          <div className="flex items-center gap-x-4">
            <h3 className="font-semibold text-black">Description:</h3>
            <div>{data.description.value}</div>
          </div>
        )}
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Brand:</h3>
          <div>{data.brand.name}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Category:</h3>
          <div>{data.category.name}</div>
        </div>
      </div>
      <div className="mt-6">
        <ProductVariations
          product={data}
          onVariationSelectAction={handleVariationSelectAction}
        />
      </div>
      <div className="mt-10 flex items-center gap-x-3">
          <Button 
            onClick={onAddToCart}
            className="flex items-center gap-x-2"
            disabled={
      (!data.sizes?.length && !data.colors?.length && (!data.stock || data.stock <= 0)) ||
      (data.sizes?.length > 0 && (!selectedSize || selectedSize.stock <= 0)) || 
      (data.colors?.length > 0 && (!selectedColor || selectedColor.stock <= 0))
            }
          >
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;
