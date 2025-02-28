import React from 'react';
import { Tab } from '@headlessui/react';
import NextImage from 'next/image';
import { Image } from '@/types';
import { motion } from 'framer-motion';

interface GalleryTabProps {
  image: Image;
  onClick: () => void;
  selected: boolean;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image, onClick, selected }) => {
  return (
    <Tab
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white overflow-hidden group"
      onClick={onClick}
    >
      <motion.div
        initial={false}
        animate={{ scale: selected ? 0.95 : 1 }}
        transition={{ duration: 0.2 }}
        className="w-full h-full"
      >
        <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
          <NextImage
            fill
            src={image.url}
            alt=""
            className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
          />
        </span>
        <motion.span
          initial={false}
          animate={{
            opacity: selected ? 1 : 0,
            borderColor: selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0)'
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-md border-2"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selected ? 0.1 : 0 }}
          whileHover={{ opacity: 0.05 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black rounded-md"
        />
      </motion.div>
    </Tab>
  );
};

export default GalleryTab;
