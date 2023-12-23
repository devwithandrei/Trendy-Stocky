"use client";


import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import NextImage from 'next/image';
import { Image } from '@/types';
import GalleryTab from './gallery-tab';

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  if (!images || images.length === 0) {
    return <div>No images available.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mt-6 w-full max-w-2xl sm:block lg:max-w-none">
        <div
          className="aspect-square relative h-full w-full sm:rounded-lg overflow-hidden cursor-pointer"
          onClick={() => handleImageClick((selectedImageIndex + 1) % images.length)}
        >
          {images[selectedImageIndex] && images[selectedImageIndex].url && (
            <NextImage
              fill
              src={images[selectedImageIndex].url}
              alt="Image"
              className="object-cover object-center"
            />
          )}
        </div>
      </div>
      <div className="mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.Group>
          <Tab.List className="grid grid-cols-4 gap-6">
            {images.map((image, index) => (
              <GalleryTab
                key={image.id}
                image={image}
                onClick={() => handleImageClick(index)} // Pass onClick handler
                selected={selectedImageIndex === index} // Check if image is selected
              />
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Gallery;