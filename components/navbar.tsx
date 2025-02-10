"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import ProductSearchBar from "./ProductSearchBar";
import MobileMenuContent from "./MobileMenuContent";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { Product } from '@/types';
import getProducts from "@/actions/get-products";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const featuredProducts = await getProducts({ isFeatured: true });
      setProducts(featuredProducts);
    };
    fetchProducts();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="border-b sticky top-0 z-50 bg-[#DCD7D5] bg-opacity-50">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="mx-auto cursor-pointer">
              <Image
                src="https://funsubstance.com/uploads/gif/215/215926.gif"
                alt="Logo"
                width={80}
                height={80}
                unoptimized
              />
            </div>
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

          {/* Mobile Menu */}
          <div className="sm:hidden flex items-center">
            <ProductSearchBar products={products} />
            <div className="ml-4">
              <NavbarActions />
            </div>
            <button
              onClick={toggleMenu}
              className="h-10 w-10 text-[#3A5795] focus:outline-none ml-4"
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

          {/* Search Bar and User Profile (Desktop) */}
          <div className="hidden sm:flex justify-center flex-grow">
            <ProductSearchBar products={products} />
          </div>
          <div className="ml-auto sm:ml-0 sm:mr-4 hidden sm:flex items-center gap-x-4">
            <NavbarActions />
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

          {/* Mobile Menu Content */}
          {isMenuOpen && (
            <div className="sm:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-end">
              <MobileMenuContent toggleMenu={toggleMenu} products={products} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
