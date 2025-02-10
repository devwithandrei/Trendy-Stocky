"use client";

import React from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProductSearchResultProps {
  product: Product;
}

const ProductSearchResult: React.FC<ProductSearchResultProps> = ({ product }) => {

  const productUrl = `/product/${product.id}`; // Replace 'product.id' with the actual ID property

  return (
    <Link href={productUrl}>
      <div className="block p-2 border-b hover:bg-gray-100 cursor-pointer bg-opacity-75" style={{ backgroundColor: 'rgba(0, 0, 255, 0.2)' }}>
        <h3 className="font-semibold text-black mb-2">{product.name}</h3> {/* Adjusted margin to position title */}
        <div className="flex items-start"> {/* Changed to 'items-start' to align content at the start */}
          <div className="w-20 h-20 rounded-md overflow-hidden" style={{ marginTop: '0.5rem', marginRight: '1rem' }}> {/* Adjusted marginTop and marginRight */}
            <Image src={product.images[0]?.url} alt={product.name} layout="responsive" width={80} height={80} />
          </div>
          <div className="ml-4">
            <p className="text-sm text-black">{product.description.value}</p>
            <p className="text-sm font-semibold text-black">{product.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductSearchResult;