"use client";
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Currency from '@/components/ui/currency';
import Button from '@/components/ui/button';
import { Product, Category } from '@/types';
import useCart from '@/hooks/use-cart';
import Head from 'next/head';
import { Fragment } from 'react';
import SizeSelector from '@/components/ui/SizeSelector';
import ColorSelector from '@/components/ui/ColorSelector';

interface InfoProps {
  data: Product & { category: Category };
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const [showSizes, setShowSizes] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [showColors, setShowColors] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  const onSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizes(false);
  };

  const onColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowColors(false);
  };

  const onAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    const productToAdd = { ...data, selectedSize, selectedColor };
    cart.addItem(productToAdd);
    window.location.href = '/cart';
  };

  const { name, price, color, description, size, brand, category } = data || {};
  const descriptionLines = description?.value.split('\n');
  const isShoeCategory = category?.name === 'Shoes';

  return (
    <div>
      <Head>
        <Fragment>
          {/* Your Head content */}
        </Fragment>
      </Head>
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
          <Currency value={price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex gap-x-4">
          <div>
            <SizeSelector
              showSizes={showSizes}
              isShoeCategory={isShoeCategory}
              selectedSize={selectedSize}
              onSizeSelect={onSizeSelect}
              setShowSizes={setShowSizes}
            />
          </div>
          <div>
            <ColorSelector
              showColors={showColors}
              onColorSelect={onColorSelect}
              setShowColors={setShowColors}
              selectedColor={selectedColor}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Brand:</h3>
          <div>{brand?.value}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Description:</h3>
        </div>
        {descriptionLines && (
          <div>
            {descriptionLines.map((line, index) => (
              <p key={index} className="text-green-900 font-semibold text-lg">
                {line}
                {index !== descriptionLines.length - 1 && <br />}
              </p>
            ))}
          </div>
        )}
        <div className="mt-10 flex items-center gap-x-3">
          <Button
            onClick={onAddToCart}
            className={`flex items-center gap-x-2 ${showColors ? 'bg-blue-300' : 'bg-blue-200'} bg-opacity-50 text-blue-900`}
          >
            Add To Cart
            <ShoppingCart size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Info; 