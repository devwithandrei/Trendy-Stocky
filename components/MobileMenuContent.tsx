"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import ProductSearchBar from './ProductSearchBar';
import NavbarActions from '@/components/navbar-actions';
import CategoriesList from './categories-list'; // Import the CategoriesList component
import { useUser, UserButton, useClerk } from "@clerk/nextjs"; // Import Clerk's user hook and UserButton
import { Product } from '@/types'; // Import the Product type

interface MobileMenuContentProps {
  toggleMenu: () => void;
  products: Product[];
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({ toggleMenu, products }: MobileMenuContentProps) => {
  const { user } = useUser(); // Get the current user
  const { openSignIn } = useClerk(); // Get the openSignIn function

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      // Clicked outside the menu, close it
      toggleMenu();
    }
  }, [toggleMenu]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => handleClickOutside(event);

    // Add event listener when the component mounts
    document.addEventListener('mousedown', handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleClickOutside]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 overflow-y-auto">
      <div ref={menuRef} className="w-2/3 bg-blue-200 bg-opacity-70 h-full overflow-y-auto absolute top-0 right-0">
        <div className="flex justify-between p-4 items-center">
          {/* Close Button */}
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

          {/* ProductSearchBar */}
          <div>
            <ProductSearchBar products={products} />
          </div>

          {/* Cart Button */}
          <div>
            <NavbarActions />
          </div>

          {/* User Button */}
          {user ? (
            <UserButton
              userProfileMode="modal"
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "rounded-full",
                },
              }}
            />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Categories List */}
        <CategoriesList />
        <div className="mx-auto py-4 flex flex-wrap justify-center">
          <p className="text-center text-sm md:text-lg text-[#3A5795] mr-8">
            <a
              href="/about"
              className="text-[#3A5795] hover:underline transition-colors duration-300"
            >
              About Us
            </a>
          </p>
          <p className="text-center text-sm md:text-lg text-[#3A5795] mr-8">
            <a
              href="/privacy-policy"
              className="text-[#3A5795] hover:underline transition-colors duration-300"
            >
              Privacy & Policy
            </a>
          </p>
          <p className="text-center text-sm md:text-lg text-[#3A5795] mr-8">
            <a
              href="/return-policies"
              className="text-[#3A5795] hover:underline transition-colors duration-300"
            >
              Return Policies
            </a>
          </p>
        </div>
        <div className="mx-auto py-3">
          <p className="text-center text-sm md:text-lg text-[#3A5795]">
            &copy; {new Date().getFullYear()} Trendy Stocky, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenuContent;