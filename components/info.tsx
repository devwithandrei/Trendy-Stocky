"use client";

import { ShoppingCart } from 'lucide-react';
import Currency from '@/components/ui/currency';
import Button from '@/components/ui/button';
import { Product } from '@/types';
import useCart from '@/hooks/use-cart';
import Head from 'next/head';

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();

  const onAddToCart = () => {
    cart.addItem(data);
  };

  const { name, price, size, color, description } = data || {};

  // Split description into an array by line breaks
  const descriptionLines = description?.value.split('\n');

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
          <Currency value={price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Description:</h3>
        </div>
        {descriptionLines && (
          <div>
            {descriptionLines.map((line, index) => (
              <p
                key={index}
                className="text-green-900 font-semibold text-lg" // Updated text color and font weight
              >
                {line}
                {index !== descriptionLines.length - 1 && <br />} {/* Add line break except for the last line */}
              </p>
            ))}
          </div>
        )}
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <div>{size?.value}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          <div
            className="h-6 w-6 rounded-full border border-gray-600"
            style={{ backgroundColor: color?.value }}
          />
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;