"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, User } from "lucide-react"; // Modern icons
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import ProductSearchBar from "./ProductSearchBar";
import ProductSearchResult from "./ProductSearchResult";
import MobileMenuContent from "./MobileMenuContent";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { Product } from '@/types';
import getProducts from "@/actions/get-products";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value.toLowerCase();
    setSearchTerm(searchText);

    const filteredProducts = products.filter(
      product =>
        product.name.toLowerCase().includes(searchText) ||
        product.brand.name.toLowerCase().includes(searchText) ||
        (product.description?.value?.toLowerCase().includes(searchText) ?? false)
    );
    setSearchResults(filteredProducts);
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
                Outly.Shop
              </span>
              <br />
            </div>
          </Link>

          {/* Mobile Menu */}
          <div className="sm:hidden flex items-center">
            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 mr-2"
              aria-label="Toggle Search"
            >
              <Search size={20} className="text-[#3A5795]" />
            </button>

            {/* Search Popup */}
            {isSearchOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-blue-500 bg-opacity-25 p-4 rounded-lg max-w-md w-full border border-blue-500 border-opacity-50 relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full rounded-md py-2 px-3 outline-none border border-gray-300 focus:border-blue-500 transition-all bg-opacity-50 text-black"
                    style={{ backgroundColor: 'rgba(0, 0, 255, 0.2)' }}
                  />
                  {searchTerm && searchResults.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      {searchResults.map(product => (
                        <ProductSearchResult 
                          key={product.id} 
                          product={product} 
                          onProductSelect={closeSearch} 
                        />
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={closeSearch} 
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="ml-2">
              <NavbarActions />
            </div>
            
            {/* Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="h-10 w-10 text-[#3A5795] focus:outline-none ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-300"
              aria-label="Toggle Menu"
            >
              <Menu size={24} className="text-[#3A5795]" />
            </button>
          </div>

          {/* Search Bar and User Profile (Desktop) */}
          <div className="hidden sm:flex items-center justify-center flex-grow mr-4">
            <ProductSearchBar 
              products={products} 
              onProductSelect={closeSearch} 
            />
          </div>
          
          <div className="ml-auto sm:ml-0 sm:mr-4 hidden sm:flex items-center gap-x-4">
            <NavbarActions />
            
            {/* User/Sign In Button */}
            {user ? (
              <UserButton
                userProfileMode="modal"
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "rounded-full w-8 h-8",
                  },
                }}
              />
            ) : (
              <button
                onClick={() => openSignIn()}
                className="text-[#3A5795] hover:bg-gray-100 p-2 rounded-full transition-colors duration-300"
                aria-label="Sign In"
              >
                <User size={20} />
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