"use client";

import React from 'react';
import ProductSearchBar from './ProductSearchBar';
import NavbarActions from '@/components/navbar-actions';
import { products } from '@/components/ProductSearchData';

interface MobileMenuContentProps {
  toggleMenu: () => void; // Define the type for toggleMenu prop
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({ toggleMenu }: MobileMenuContentProps) => {
  return (
    <div className="w-2/3 bg-white h-full overflow-y-auto">
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleMenu}
          className="h-8 w-8 text-[#3A5795] focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {/* ProductSearchBar */}
      <div className="flex justify-center p-4">
        <ProductSearchBar products={products} />
      </div>
      {/* Cart Button */}
      <div className="flex justify-center p-4">
        <NavbarActions />
      </div>
    </div>
  );
};

export default MobileMenuContent;