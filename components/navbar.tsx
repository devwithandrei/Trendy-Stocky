"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import ProductSearchBar from "./ProductSearchBar";
import MobileMenuContent from "./MobileMenuContent";
import MainNav from "@/components/main-nav";
import { useUser } from "@clerk/nextjs";
import { Product, Category } from '@/types';
import { useStore } from "@/contexts/store-context";
import getCategories from "@/actions/get-categories";
import SearchResults from "@/components/ui/search-results";

const Navbar = () => {
  const { user } = useUser();
  const { storeId } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    const fetchData = async () => {
      if (!storeId) {
        console.error('Store ID is not available');
        return;
      }

      try {
        console.log("Navbar - Fetching categories with storeId:", storeId);
        
        const response = await fetch(`/api/categories?storeId=${storeId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categoriesData: Category[] = await response.json();

        console.log('Categories loaded:', categoriesData.length);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchData();
  }, [storeId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (mobileSearchTerm.length >= 2) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          console.log("Navbar - Searching with term:", mobileSearchTerm);
          console.log("Navbar - Using storeId for search:", storeId);
          
          const response = await fetch(`/api/products/search?search=${mobileSearchTerm}&storeId=${storeId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const results: Product[] = await response.json();

          
          console.log(`Navbar - Found ${results.length} search results`);
          setMobileSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setMobileSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setMobileSearchResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [mobileSearchTerm, storeId]);

  const handleNavigate = (productId: string) => {
    setShowMobileSearch(false);
    setMobileSearchTerm("");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileSearch = () => {
    setShowMobileSearch(false);
    setMobileSearchTerm("");
    setMobileSearchResults([]);
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

          {/* Search Bar and User Profile (Desktop) */}
          <div className="hidden sm:flex items-center justify-center flex-grow mr-4">
            <ProductSearchBar
              onProductSelect={() => {}}
            />
          </div>
          
          <div className="ml-auto flex items-center gap-x-4">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="sm:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
              aria-label="Toggle Search"
            >
              <Search size={20} className="text-[#3A5795]" />
            </button>

            <NavbarActions />

            {/* Menu Toggle (visible on all screens) */}
            <button
              onClick={toggleMenu}
              className="h-10 w-10 text-[#3A5795] focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors duration-300"
              aria-label="Toggle Menu"
            >
              <Menu size={24} className="text-[#3A5795]" />
            </button>
          </div>

          {/* Mobile Search Popup */}
          {showMobileSearch && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden">
              <div 
                ref={searchRef}
                className="absolute top-0 left-0 right-0 bg-white shadow-lg"
                style={{ animation: 'slideDown 0.2s ease-out' }}
              >
                <div className="flex items-center gap-4 p-4 border-b">
                  <button
                    onClick={closeMobileSearch}
                    className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={mobileSearchTerm}
                      onChange={(e) => setMobileSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 
                               bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400 
                               focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                      autoFocus
                    />
                    <Search 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      size={20} 
                    />
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                  <SearchResults
                    results={mobileSearchResults}
                    isLoading={isLoading}
                    searchTerm={mobileSearchTerm}
                    onProductSelect={handleNavigate}
                    className="p-4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Menu Content */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-end">
              <MobileMenuContent toggleMenu={toggleMenu} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
