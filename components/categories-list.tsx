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
        id: '9e2c7068-d057-4728-8d5e-012d22f63e22',
        name: 'Man Jakets',
        imageUrl: 'https://i.pinimg.com/originals/89/f5/9c/89f59c4b799edd68b28a19111421fc94.gif',
        // Other category properties
      },
      {
        id: '80c65c2c-e3e4-43ec-b118-c6f161ffe6a4',
        name: 'Women Jakets',
        imageUrl: 'https://media.giphy.com/media/8LXZJw9REOSLS/giphy.gif',
        // Other category properties
      },
      {
        id: '8503f9ee-50fa-4fb2-9440-1b0f1779d1b2',
        name: 'Jeans',
        imageUrl: 'https://media.giphy.com/media/Z9uId9712lo9gfJvil/giphy.gif',
        // Other category properties
      },
      {
        id: 'f1fc66bb-c0da-4de5-b788-5ae970c1378e',
        name: 'T-Shirts',
        imageUrl: 'https://media.giphy.com/media/zbGUB1RQEOmyEVjJvK/giphy.gif',
        // Other category properties
      },
      {
        id: '8642ffbb-a635-4c36-b3a7-fbc1800f0058',
        name: 'Shoes',
        imageUrl: 'https://media.giphy.com/media/14gnhUPQZpdyLe/source.gif',
        // Other category properties
      },
      {
        id: '411385ba-cf30-4cb5-a91a-e91214eb2147',
        name: 'Accesories',
        imageUrl: 'https://media.giphy.com/media/vy0dVKp8BLOUxvvrj6/giphy.gif',
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