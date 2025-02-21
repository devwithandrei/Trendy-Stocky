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
    onProductSelect?.();
  };

  return (
    <Link href={productUrl} onClick={handleClick}>
      <div className="flex items-center p-4 hover:bg-gray-50 transition-colors duration-150 border-b last:border-b-0">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 64px) 100vw, 64px"
          />
        </div>
        
        <div className="ml-4 flex-grow min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm text-gray-900 truncate pr-2">
              {product.name}
            </h3>
            <Currency value={product.price} className="text-sm font-semibold text-gray-900" />
          </div>
          
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <span className="truncate">{product.brand.name}</span>
            {product.stock > 0 ? (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                In Stock
              </span>
            ) : (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
          
          {product.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">
              {product.description.value}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductSearchResult;