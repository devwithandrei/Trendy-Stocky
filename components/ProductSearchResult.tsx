"use client";
import React from 'react';
import { Product } from '@/SearchTypes';
import { products } from '@/components/ProductSearchData';
import Image from 'next/image'


interface ProductSearchResultProps {
  product: Product;
}

const ProductSearchResult: React.FC<ProductSearchResultProps> = ({ product }) => {
  return (
    <div className="p-2 border-b">
      {/* Access the first image's URL if available */}
      <img src={product.images[0]?.url} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
      <div className="mt-2">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.description.value}</p>
        <p className="text-sm font-semibold">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductSearchResult;