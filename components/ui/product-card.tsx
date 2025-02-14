"use client";

import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import Currency from "@/components/ui/currency";
import { Product, Size, Color } from "@/types";

interface ProductCard {
  data: Product
}

const ProductCard: React.FC<ProductCard> = ({
  data
}) => {
  const cart = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    if (data.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (data.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    setIsAddingToCart(true);
    
    const cartItem = {
      ...data,
      selectedSize,
      selectedColor,
      quantity: 1
    };

    cart.addItem(cartItem);
    
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] sm:aspect-square overflow-hidden rounded-t-xl">
        <Image 
          src={data.images?.[0]?.url} 
          alt={data.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transform transition-transform duration-300 group-hover:scale-105"
          priority
        />
        
        {/* Cart Icon */}
        <button
          onClick={onAddToCart}
          className={`
            absolute top-4 right-4
            p-2 rounded-full
            shadow-md
            transition-all duration-300
            ${isAddingToCart 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/90 text-gray-700 hover:bg-white'
            }
          `}
        >
          <ShoppingCart size={20} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-medium text-lg text-gray-800 line-clamp-1">{data.name}</h3>
          <div className="mt-1">
            <Currency value={data.price} />
          </div>
        </div>

        {/* Size Selection */}
        {data.sizes.length > 0 && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {data.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`
                    min-w-[2.5rem] h-[2.5rem] rounded-lg
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
        {data.colors.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {data.colors.map((color) => (
              <button
                key={color.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                title={color.name}
                className={`
                  w-8 h-8 rounded-full transition-all
                  ${selectedColor?.id === color.id
                    ? 'ring-2 ring-black ring-offset-2 scale-110'
                    : 'ring-1 ring-gray-300 hover:scale-110'
                  }
                `}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
