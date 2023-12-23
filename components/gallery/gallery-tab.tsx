import Head from 'next/head'
import React from 'react';
import { Tab } from '@headlessui/react';
import NextImage from 'next/image';
import { Image } from '@/types';

interface GalleryTabProps {
  image: Image;
  onClick: () => void;
  selected: boolean;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image, onClick, selected }) => {
  return (
    <Tab
      className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white"
      onClick={onClick}
    >
      {({ selected: tabSelected }) => (
        <div>
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
            <NextImage
              fill
              src={image.url}
              alt=""
              className="object-cover object-center"
            />
          </span>
          <span
            className={`absolute inset-0 rounded-md ring-2 ring-offset-2 ${
              tabSelected ? 'ring-black' : 'ring-transparent'
            }`}
          />
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;
