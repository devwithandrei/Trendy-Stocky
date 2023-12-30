"use client";

import React from 'react';
import { Product } from '@/SearchTypes';
import { products } from '@/components/ProductSearchData';
import Image from 'next/image';

interface ProductSearchResultProps {
  product: Product;
}

const ProductSearchResult: React.FC<ProductSearchResultProps> = ({ product }) => {
  return (
    <div className="p-2 border-b">
      <div className="w-20 h-20 rounded-md overflow-hidden">
        <Image src={product.images[0]?.url} alt={product.name} layout="responsive" width={80} height={80} />
      </div>
      <div className="mt-2">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.description.value}</p>
        <p className="text-sm font-semibold">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductSearchResult;
