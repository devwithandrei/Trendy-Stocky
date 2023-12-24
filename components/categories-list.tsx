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

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const categoryData: Category[] = [
      {
        id: '129bbaeb-972e-41ef-b92a-b742e810cc31',
        name: 'Jackets',
        imageUrl: 'https://i.pinimg.com/originals/89/f5/9c/89f59c4b799edd68b28a19111421fc94.gif',
        // Other category properties
      },
      {
        id: '7ee63657-e60d-4bab-96d2-fab6c50a0d22',
        name: 'Jeans',
        imageUrl: 'https://media.giphy.com/media/Z9uId9712lo9gfJvil/giphy.gif',
        // Other category properties
      },
      {
        id: 'e548d1eb-1cd7-4299-95e5-fe08ff6fc488',
        name: 'T-Shirts',
        imageUrl: 'https://media.giphy.com/media/zbGUB1RQEOmyEVjJvK/giphy.gif',
        // Other category properties
      },
      {
        id: 'a08a0da8-4538-4d0a-94bd-9bc933458d11',
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
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;