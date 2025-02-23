"use client";

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { X, User, Search, ShoppingBag, Heart, Settings } from "lucide-react";
import NavbarActions from '@/components/navbar-actions';
import { useUser, UserButton, useClerk } from "@clerk/nextjs";
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import getProducts from '@/actions/get-products';
import Link from 'next/link';
import SearchResults from '@/components/ui/search-results';

interface MobileMenuContentProps {
  toggleMenu: () => void;
  products: Product[];
}

const MobileMenuContent: React.FC<MobileMenuContentProps> = ({ toggleMenu, products }) => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          const results = await getProducts({
            categoryId: '',
            colorId: '',
            sizeId: '',
            search: searchTerm
          });
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
  }, [searchTerm]);

  const handleNavigate = (url: string) => {
    router.push(url);
    toggleMenu();
  };

  const userMenuItems = [
    { href: '/orders', label: 'My Orders', icon: ShoppingBag },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

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
        {/* Header with Search */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md shadow-sm">
          <div className="flex justify-between items-center p-4">
            <button
              onClick={toggleMenu}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close Menu"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="flex items-center gap-4">
              <NavbarActions toggleMenu={toggleMenu} />
              {user ? (
                <div className="relative">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-10 h-10",
                        userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full",
                        userButtonPopoverCard: "!z-[60] !mt-2 !absolute !right-0 !w-[280px]",
                        userButtonPopoverActions: "!z-[60]",
                        userButtonPopoverFooter: "!z-[60]"
                      }
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => openSignIn()}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <User size={20} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

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
        </div>

        {/* User Menu */}
        {user ? (
          <div className="mt-6 space-y-4">
            <Link
              href="/orders"
              className="flex items-center gap-x-2 text-neutral-500 hover:text-black transition"
              onClick={toggleMenu}
            >
              <ShoppingBag size={20} />
              <span>My Orders</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-x-2 text-neutral-500 hover:text-black transition"
              onClick={toggleMenu}
            >
              <Heart size={20} />
              <span>Wishlist</span>
            </Link>
            <div className="flex items-center gap-x-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                    userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full",
                    userButtonPopoverCard: "!z-[60] !mt-2 !absolute !right-0 !w-[280px]",
                    userButtonPopoverActions: "!z-[60]",
                    userButtonPopoverFooter: "!z-[60]"
                  }
                }}
              />
              <span className="text-sm font-medium">
                {user.firstName || user.emailAddresses[0].emailAddress}
              </span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="mt-6 flex items-center gap-x-2 text-neutral-500 hover:text-black transition"
          >
            <User size={20} />
            <span>Sign In</span>
          </button>
        )}

        {/* Navigation Links */}
        <nav className="mt-4 px-4">
          <div className="space-y-2">
            {[
              { href: '/about', label: 'About Us' },
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms of Service' },
              { href: '/contact', label: 'Contact Us' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handleNavigate(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-8 px-4 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Outly.Shop. All rights reserved.
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