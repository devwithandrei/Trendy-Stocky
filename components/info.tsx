"use client"

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Currency from '@/components/ui/currency';
import Button from '@/components/ui/button';
import { Product } from '@/types';
import useCart from '@/hooks/use-cart';
import Head from 'next/head';
import { toast } from 'react-hot-toast';

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const toggleSizeDropdown = () => {
    setIsSizeDropdownOpen(!isSizeDropdownOpen);
  };

  const selectSize = (size: string) => {
    setSelectedSize(size);
    setIsSizeDropdownOpen(false);
  };

  const onAddToCart = () => {
    if (selectedSize) {
      const itemWithSize = { ...data, selectedSize };
      cart.addItem(itemWithSize);
    } else {
      toast.error('Please select a size');
    }
  };

  const { name, price, color, description } = data || {};

  const descriptionLines = description?.value.split('\n');

  // Predefined sizes
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                onClick={toggleSizeDropdown}
              >
                <span>{selectedSize ? selectedSize : 'Select your size'}</span>
                <svg
                  className={`ml-2 h-5 w-5 transition duration-300 ease-in-out ${
                    isSizeDropdownOpen ? 'transform rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 13.293a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L10 11.586l3.293-3.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1 0 1.414l4 4a1 1 0 0 1-1.414 1.414l-3.293-3.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            {isSizeDropdownOpen && (
              <div className="origin-top-right absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div
                  className="py-1 flex flex-col items-center"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {sizes.map((sizeOption, index) => (
                    <button
                      key={index}
                      className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center`}
                      onClick={() => selectSize(sizeOption)}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          <div
            className="h-6 w-6 rounded-full border border-gray-600"
            style={{ backgroundColor: color?.value }}
          />
        </div>
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
              <p key={index} className="text-green-900 font-semibold text-lg">
                {line}
                {index !== descriptionLines.length - 1 && <br />}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          onClick={onAddToCart}
          className="flex items-center gap-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
        >
          Add To Cart
          <ShoppingCart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Info;