"use client";

import React, { useEffect, useState } from 'react';
import { Product, Category } from '@/SearchTypes';
import Image from 'next/image';
import Link from 'next/link';

interface ProductSearchResultProps {
  product: Product;
}

const ProductSearchResult: React.FC<ProductSearchResultProps> = ({ product }) => {
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    // Simulate fetching category data based on the categoryId
    // Replace this with your actual API call or data retrieval logic to fetch the category
    // For example:
    // fetchCategory(product.categoryId)
    //   .then((data) => setCategory(data))
    //   .catch((error) => console.error('Error fetching category:', error));
    // This is a placeholder with empty array dependencies, so it runs once on mount
  }, []);

  const productUrl = `/product/${product.id}`; // Replace 'product.id' with the actual ID property

  return (
    <Link href={productUrl}>
      <div className="block p-2 border-b hover:bg-gray-100 cursor-pointer">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-md overflow-hidden">
            <Image src={product.images[0]?.url} alt={product.name} layout="responsive" width={80} height={80} />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.description.value}</p>
            <p className="text-sm font-semibold">{product.price}</p>
            {category && (
              <p className="text-sm text-gray-500">Category: {category.name}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductSearchResult;
