"use client"

import React, { useEffect, useState } from 'react';
import CategoryCard from '@/components/ui/CategoryCard';
import NoResults from '@/components/ui/no-results';
import Image from 'next/image'

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  // Other category properties
}

interface CategoriesListProps {
  toggleMenu?: () => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({ toggleMenu }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const categoryData: Category[] = [
      {
        id: '3e6a8bc6-1129-471d-bdff-fb6c389716b9',
        name: 'Fashion',
        imageUrl: 'https://media.giphy.com/media/Z9uId9712lo9gfJvil/giphy.gif',
        // Other category properties
      },
      {
        id: 'a5e78714-b6db-43ff-8eb8-e896a6ce7ae6',
        name: 'Shoes',
        imageUrl: 'https://media.giphy.com/media/14gnhUPQZpdyLe/source.gif',
        // Other category properties
      },
      // Add other categories as needed
    ];

    // Filter out categories without an image URL
    const filteredCategories = categoryData.filter(category => !!category.imageUrl);
    setCategories(filteredCategories);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-3xl">Categories</h3>
      {categories.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard 
            key={category.id} 
            category={category} 
            toggleMenu={toggleMenu} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;