"use client";

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import NextImage from 'next/image';
import { Image } from '@/types';
import GalleryTab from './gallery-tab';
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="mt-6 w-full max-w-2xl lg:max-w-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImageIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="aspect-square relative h-full w-full rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => handleImageClick((selectedImageIndex + 1) % images.length)}
          >
            {images[selectedImageIndex] && images[selectedImageIndex].url && (
              <>
                <NextImage
                  fill
                  src={images[selectedImageIndex].url}
                  alt="Image"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 w-full max-w-2xl lg:max-w-none">
        <Tab.Group>
          <Tab.List className="grid grid-cols-4 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GalleryTab
                  image={image}
                  onClick={() => handleImageClick(index)}
                  selected={selectedImageIndex === index}
                />
              </motion.div>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Gallery;