"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { X, Search, Heart, Package2, ShoppingBag, User, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Product, Category } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchResults from '@/components/ui/search-results';
import useCart from "@/hooks/use-cart";
import { useWishlist } from "@/lib/wishlist-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-hot-toast";
import { useStore } from '@/contexts/store-context';

interface MobileMenuContentProps {
  toggleMenu: () => void;
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({ toggleMenu }) => {
  const { user, isSignedIn } = useUser();
  const { storeId } = useStore();
  const router = useRouter();
  const cart = useCart();
  const { wishlistItemCount } = useWishlist();
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);

    useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsInfoDropdownOpen(false);
      }
    };
    
        document.addEventListener('mousedown', handleDocumentClick);
    
        return () => {
          document.removeEventListener('mousedown', handleDocumentClick);
        };
      }, []);

    useEffect(() => {
    const fetchData = async () => {
      if (!storeId) {
        console.error('Store ID is not available');
        return;
      }

      try {
        console.log("MobileMenuContent - Fetching categories with storeId:", storeId);
        const response = await fetch(`/api/categories?storeId=${storeId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categoriesData: Category[] = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchData();
    console.log("MobileMenuContent - Categories state after fetch:", categories);
  }, [storeId]);

  useEffect(() => {
    const count = cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartItemCount(count);
  }, [cart.items]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      toggleMenu();
    }
  }, [toggleMenu]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.length >= 2) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(`/api/products/search?search=${searchTerm}&storeId=${storeId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const results: Product[] = await response.json();
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, storeId]);

  const handleNavigate = (url: string) => {
    router.push(url);
    toggleMenu();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm">
      <div 
        ref={menuRef} 
        className="w-[85%] max-w-md h-full overflow-y-auto absolute top-0 right-0 bg-white shadow-2xl"
        style={{ 
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md shadow-sm">
          <div className="flex justify-between items-center p-4">
            <button
              onClick={toggleMenu}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close Menu"
            >
              <X size={24} className="text-gray-600" />
            </button>

            {/* User Actions */}
            {user && (
              <div className="flex items-center gap-x-2">
                <button
                  onClick={() => handleNavigate('/cart')}
                  className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag size={22} className="text-gray-600" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavigate('/orders')}
                  className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Package2 size={22} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleNavigate('/wishlist')}
                  className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart size={22} className="text-gray-600" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                      {wishlistItemCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* User Profile Section */}
          {isSignedIn ? (
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-center space-x-3 relative">
                <Avatar className="h-12 w-12 border border-gray-200">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={user?.firstName || 'User'}
                  />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                      : user?.firstName
                      ? user.firstName[0].toUpperCase()
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>

                {/* User Account Options (when signed in) */}
                <div className="ml-auto">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-sm font-medium text-gray-500 px-4  flex items-center justify-between "
                  >
                    Account
                    <svg
                      className={`w-4 h-4 transition-transform transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0  bg-white rounded-md shadow-lg z-10"
                      style={{ top: '100%', width: 'calc(100% - 1rem)' }}
                    >
                      <div className="py-1" role="none">
                        {[
                          { icon: <User className="h-5 w-5 mr-3 text-gray-500" />, href: '/profile', label: 'Profile' },
                          { icon: <Package2 className="h-5 w-5 mr-3 text-gray-500" />, href: '/orders', label: 'Orders' },
                          { icon: <Heart className="h-5 w-5 mr-3 text-gray-500" />, href: '/wishlist', label: 'Wishlist' },
                        ].map((item) => (
                          <button
                            key={item.href}
                            onClick={() => {
                              handleNavigate(item.href);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            {item.icon}
                            {item.label}
                          </button>
                        ))}
                        <SignOutButton>
                          <button
                            onClick={() => {
                              toggleMenu();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-900"
                            role="menuitem"
                          >
                            <LogOut className="h-5 w-5 mr-3 text-red-500" />
                            Sign Out
                          </button>
                        </SignOutButton>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-gray-50">
              <button
                onClick={() => {
                  toggleMenu();
                  router.push('/sign-in');
                }}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 
                         bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400 
                         focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Search Results Dropdown */}
            {(isLoading || searchResults.length > 0 || searchTerm.length >= 2) && (
              <div className="absolute left-0 right-0 top-full mt-2 mx-4 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-h-[60vh] overflow-y-auto">
                <SearchResults
                  results={searchResults}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                  onProductSelect={(productId) => handleNavigate(`/product/${productId}`)}
                  className="p-2"
                />
              </div>
            )}
          </div>

                  {/* Categories */}
          <nav className="mt-4 px-4">
            <h3 className="text-sm font-medium text-gray-500 px-4 mb-2">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => {
                      console.log("MobileMenuContent - Navigating to category:", category.id);
                    handleNavigate(`/category/${category.id}`);
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

       {/* Navigation Links */}
        <nav className="mt-6 px-4">
          <button
            onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
            className="text-sm font-medium text-gray-500 px-4 mb-2 flex items-center justify-between w-full"
          >
            Information
            <svg
              className={`w-4 h-4 transition-transform transform ${isInfoDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isInfoDropdownOpen && (
            <div className="absolute left-0 w-full bg-white rounded-md shadow-lg z-10">
              <div className="py-1" role="none">
                {[
                  { href: '/about', label: 'About Us' },
                  { href: '/privacy-policy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                  { href: '/contact', label: 'Contact Us' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => {
                      handleNavigate(link.href);
                      setIsInfoDropdownOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        

        {/* Footer */}
        <div className="mt-8 px-4 py-6 text-sm text-gray-500 flex justify-center items-center">
          <span>&copy; {new Date().getFullYear()} Outly.Shop. All rights reserved.</span>
</div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MobileMenuContent;
