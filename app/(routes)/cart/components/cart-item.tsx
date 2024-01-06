import React, { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import IconButton from '@/components/ui/icon-button';
import Currency from '@/components/ui/currency';
import { Product } from '@/types';
import SizeSelector from '@/components/ui/SizeSelector';
import ColorSelector from '@/components/ui/ColorSelector';
import { Category } from '@/types';

interface CartItemProps {
  data: Product & { selectedColor: string; selectedSize: string; category: Category };
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ data, onRemove }) => {
  const { id, name, price, images, selectedColor, selectedSize, category } = data;

  const [color, setColor] = useState(selectedColor || 'Default Color');
  const [size, setSize] = useState(selectedSize || 'Default Size');
  const [showColors, setShowColors] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const handleSizeSelect = (selected: string) => {
    setSize(selected);
    setShowSizes(false);
  };

  const handleColorSelect = (selected: string) => {
    setColor(selected);
    setShowColors(false);
  };

  return (
    <div className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        <Image fill src={images[0].url} alt={name} className="object-cover object-center" />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute z-10 right-0 top-0">
          <IconButton onClick={onRemove} icon={<X size={15} />} />
        </div>
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-black">{name}</p>
          </div>
          <div className="mt-1 flex text-sm">
            <p className="text-gray-500 sm:ml-0 md:ml-0 lg:ml-0 xl:ml-0 2xl:ml-0">
              <ColorSelector
                showColors={showColors}
                onColorSelect={handleColorSelect}
                setShowColors={setShowColors}
                selectedColor={color}
              />
            </p>
            <p className="ml-2 md:ml-2 lg:ml-2 xl:ml-2 2xl:ml-2">
              <SizeSelector
                showSizes={showSizes}
                selectedSize={size}
                onSizeSelect={handleSizeSelect}
                setShowSizes={setShowSizes}
                isShoeCategory={category?.name === 'Shoes'}
              />
            </p>
          </div>
          <div className="text-gray-500 text-sm mt-2"> {/* Slightly move it down */}
            Price: <Currency value={price} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
