"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { X, User } from "lucide-react";
import ProductSearchBar from './ProductSearchBar';
import NavbarActions from '@/components/navbar-actions';
import CategoriesList from './categories-list';
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { Product } from '@/types';

interface MobileMenuContentProps {
  toggleMenu: () => void;
  products: Product[];
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({ toggleMenu, products }: MobileMenuContentProps) => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      toggleMenu();
    }
  }, [toggleMenu]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => handleClickOutside(event);

    document.addEventListener('mousedown', handleOutsideClick);

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
            className="h-8 w-8 text-[#3A5795] focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors duration-300"
            aria-label="Close Menu"
          >
            <X size={24} className="text-[#3A5795]" />
          </button>

          {/* ProductSearchBar */}
          <div className="flex-grow mx-2">
            <ProductSearchBar products={products} />
          </div>

          {/* Cart Button */}
          <div className="ml-2">
            <NavbarActions toggleMenu={toggleMenu} />
          </div>

          {/* User Button */}
          {user ? (
            <UserButton
              userProfileMode="modal"
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "rounded-full w-8 h-8 ml-2",
                },
              }}
            />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="text-[#3A5795] hover:bg-gray-100 p-2 rounded-full transition-colors duration-300 ml-2"
              aria-label="Sign In"
            >
              <User size={20} />
            </button>
          )}
        </div>

        {/* Categories List */}
        <CategoriesList toggleMenu={toggleMenu} />
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