"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, User, Heart } from "lucide-react"; // Modern icons
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import ProductSearchBar from "./ProductSearchBar";
import ProductSearchResult from "./ProductSearchResult";
import MobileMenuContent from "./MobileMenuContent";
import MainNav from "@/components/main-nav"; // New import
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { Product, Category } from '@/types'; // Updated import
import { useStore } from "@/contexts/store-context"; // New import
import getProducts from "@/actions/get-products";
import axios from "axios"; // New import
import SearchResults from "@/components/ui/search-results"; // New import

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { storeId } = useStore(); // New state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // New state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
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
        const [featuredProducts, categoriesRes] = await Promise.all([
          getProducts({ isFeatured: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories?storeId=${storeId}`)
        ]);
        
        setProducts(featuredProducts);
        if (categoriesRes.data) {
          console.log('Categories loaded:', categoriesRes.data.length);
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Don't set categories if there's an error
        setCategories([]);
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
          const results = await getProducts({
            categoryId: '',
            colorId: '',
            sizeId: '',
            search: mobileSearchTerm
          });
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
  }, [mobileSearchTerm]);

  const handleNavigate = (productId: string) => {
    // router.push(`/product/${productId}`);
    setShowMobileSearch(false);
    setMobileSearchTerm("");
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

          {/* Mobile Menu */}
          <div className="sm:hidden flex items-center">
            {/* Search Icon */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 mr-2"
              aria-label="Toggle Search"
            >
              <Search size={20} className="text-[#3A5795]" />
            </button>

            {/* Mobile Search Popup */}
            {showMobileSearch && (
              <div 
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              >
                <div 
                  ref={searchRef}
                  className="absolute top-0 left-0 right-0 bg-white shadow-lg"
                  style={{ animation: 'slideDown 0.2s ease-out' }}
                >
                  {/* Search Header */}
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

                  {/* Search Results Container */}
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
            <MainNav storeId={storeId} categories={categories} />
            <NavbarActions />
            
            {/* Wishlist Link */}
            

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
              <UserButton afterSignOutUrl="/" />
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
