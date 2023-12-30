"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/container';
import NavbarActions from '@/components/navbar-actions';
import ProductSearchBar from './ProductSearchBar';
import { Product } from '@/customTypes';
import { products } from '@/components/ProductData';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="border-b sticky top-0 z-50 bg-[#DCD7D5] bg-opacity-50">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* Logo image */}
            <div className="mx-auto cursor-pointer">
              <Image
                src="https://funsubstance.com/uploads/gif/215/215926.gif"
                alt="Logo"
                width={80} // Adjust width as needed
                height={80} // Adjust height as needed
              />
            </div>
            {/* Brand name */}
            <div className="ml-2 text-center">
              <span className="text-[#3A5795] font-extrabold text-lg sm:text-xl">
                Trendy
              </span>
              <br />
              <span className="text-[#3A5795] font-extrabold text-lg sm:text-xl">
                Stocky
              </span>
            </div>
          </Link>
          {/* Hamburger Menu Icon for small devices */}
          <div className="sm:hidden flex items-center">
            <ProductSearchBar products={products} />
            <button
              onClick={toggleMenu}
              className="h-10 w-10 text-[#3A5795] focus:outline-none ml-auto"
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
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
          {/* ProductSearchBar (visible on larger devices) */}
          <div className="hidden sm:flex justify-center flex-grow">
            <ProductSearchBar products={products} />
          </div>
          {/* Cart Button (visible on larger devices) */}
          <div className="ml-auto sm:ml-0 sm:mr-4 hidden sm:flex">
            <NavbarActions />
          </div>
          {/* Modal Menu */}
          {isMenuOpen && (
            <div className="sm:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-end">
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
                {/* Cart Button */}
                <div className="flex justify-center p-4">
                  <NavbarActions />
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
