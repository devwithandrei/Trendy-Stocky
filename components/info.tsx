"use client";

import { MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Product, Size, Color } from "@/types";
import Currency from "@/components/ui/currency";
import { ShoppingCart } from "lucide-react";
import useCart from "@/hooks/use-cart";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

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

    if (quantity > data.stock) {
      toast.error("Not enough stock available");
      return;
    }

    cart.addItem({
      ...data,
      selectedSize,
      selectedColor,
      quantity
    });

    toast.success("Item added to cart");
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

        {/* Size Selection */}
        {data.sizes?.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-black">Select Size:</h3>
            <div className="flex flex-wrap gap-2">
              {data.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    min-w-[3rem] h-[3rem] rounded-lg
                    flex items-center justify-center
                    text-sm font-medium transition-all
                    ${selectedSize?.id === size.id
                      ? 'bg-black text-white scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {data.colors?.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-black">Select Color:</h3>
            <div className="flex flex-wrap gap-3">
              {data.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  className={`
                    w-10 h-10 rounded-full transition-all
                    ${selectedColor?.id === color.id
                      ? 'ring-2 ring-black ring-offset-2 scale-110'
                      : 'ring-1 ring-gray-300 hover:scale-110'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <h3 className="font-semibold text-black">Quantity:</h3>
          <div className="flex items-center gap-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-medium hover:bg-gray-200 transition"
            >
              -
            </button>
            <span className="text-xl font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(data.stock || 1, quantity + 1))}
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-medium hover:bg-gray-200 transition"
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Available Stock: {data.stock}
          </p>
        </div>

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

export default Info;
