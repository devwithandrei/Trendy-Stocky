"use client";

import React from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import Currency from '@/components/ui/currency';

interface ProductSearchResultProps {
  product: Product;
  onProductSelect?: () => void;
}

const ProductSearchResult: React.FC<ProductSearchResultProps> = ({ product, onProductSelect }) => {
  const productUrl = `/product/${product.id}`;

  const handleClick = () => {
    onProductSelect && onProductSelect();
  };

  return (
    <Link href={productUrl} onClick={handleClick}>
      <div className="block p-2 border-b hover:bg-gray-100 cursor-pointer bg-opacity-75" style={{ backgroundColor: 'rgba(0, 0, 255, 0.2)' }}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-black">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.brand.name}</p>
        </div>
        <div className="flex items-start">
          <div className="w-20 h-20 rounded-md overflow-hidden" style={{ marginTop: '0.5rem', marginRight: '1rem' }}>
            <Image src={product.images[0]?.url} alt={product.name} layout="responsive" width={80} height={80} />
          </div>
          <div className="ml-4 flex-grow">
            {product.description && (
              <p className="text-sm text-black line-clamp-2">{product.description.value}</p>
            )}
            <div className="flex justify-between items-center mt-2">
              <Currency value={product.price} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductSearchResult;