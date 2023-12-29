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
        name: 'Jakets',
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
      {
        id: '3059d150-1bba-4f6c-ae90-763d7bd2f861',
        name: 'Accesories',
        imageUrl: 'https://media.giphy.com/media/vy0dVKp8BLOUxvvrj6/giphy.gif',
        // Other category properties
      },
      {
        id: '0bc32551-e4c3-4967-8ee8-a8fd786426da',
        name: 'For Him',
        imageUrl: 'https://th.bing.com/th/id/R.0d92d6bbbb6049a60abf58e53b1935e6?rik=%2fCwM2W0jniJAAw&riu=http%3a%2f%2f66.media.tumblr.com%2ff1a14725f46003edd4959a5d359775f5%2ftumblr_o7ezwnDuGE1tcsj92o2_r1_400.gif&ehk=JqMwmWLg2z7szLglCF8vIyjm1EeN4TzappilLWb74cI%3d&risl=&pid=ImgRaw&r=0',
        // Other category properties
      },
      {
        id: 'd001952e-0465-4ace-8189-87bf9142581d',
        name: 'For Her',
        imageUrl: 'https://media.giphy.com/media/yyc8oPpz22B6h0g6bm/giphy.gif',
        // Other category properties
      },
      {
        id: '0856c133-5c28-4590-af03-305b3f34cd7c',
        name: 'For Kids',
        imageUrl: 'https://img.buzzfeed.com/buzzfeed-static/static/2016-03/14/10/enhanced/webdr06/anigif_enhanced-19388-1457965470-2.gif',
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