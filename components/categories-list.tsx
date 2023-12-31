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
        id: 'a128723f-590b-4a78-b08b-77fb3605ae8d',
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
      {
        id: '5a4c8e6e-cae4-4326-8d2c-1714f98eb7a4',
        name: 'For Him',
        imageUrl: 'https://th.bing.com/th/id/R.0d92d6bbbb6049a60abf58e53b1935e6?rik=%2fCwM2W0jniJAAw&riu=http%3a%2f%2f66.media.tumblr.com%2ff1a14725f46003edd4959a5d359775f5%2ftumblr_o7ezwnDuGE1tcsj92o2_r1_400.gif&ehk=JqMwmWLg2z7szLglCF8vIyjm1EeN4TzappilLWb74cI%3d&risl=&pid=ImgRaw&r=0',
        // Other category properties
      },
      {
        id: 'd052eba5-e7b5-4a84-862c-6938c31ffb9f',
        name: 'For Her',
        imageUrl: 'https://media.giphy.com/media/yyc8oPpz22B6h0g6bm/giphy.gif',
        // Other category properties
      },
      {
        id: '58b2b963-16eb-4514-b364-2763a5f9d7a3',
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