"use client"

import React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  // Other category properties
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="category-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out">
      <NextLink href={`/category/${category.id}`} passHref>
        <div>
          <div className="w-full h-56">
            <Image
              src={category.imageUrl}
              alt={category.name}
              layout="responsive"
              width={400} // Adjust width and height based on your design
              height={300}
            />
          </div>
          <div className="p-4 flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2 text-center">{category.name}</h2>
            {/* Include other category information or details */}
          </div>
        </div>
      </NextLink>
    </div>
  );
};

export default CategoryCard;