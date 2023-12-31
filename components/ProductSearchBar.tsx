"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/SearchTypes';
import ProductSearchResult from './ProductSearchResult';
import { products } from '@/components/ProductSearchData';
import Image from 'next/image';

interface ProductSearchBarProps {
  products: Product[];
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]); // Clear search results when clicking outside the search bar or search results
        setSearchTerm(''); // Clear search input when clicking outside the search bar or search results
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value.toLowerCase();
    setSearchTerm(searchText);

    const filteredProducts = products.filter(
      product =>
        product.name.toLowerCase().includes(searchText) ||
        product.brandId.toLowerCase().includes(searchText) ||
        product.descriptionId.toLowerCase().includes(searchText)
    );
    setSearchResults(filteredProducts);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative flex justify-center items-center" ref={searchContainerRef}>
      <div className="block sm:hidden ml-auto mr-4">
        <button onClick={openPopup} className="flex items-center p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </div>
      <div className="hidden sm:flex relative justify-center items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-8 rounded-md py-2 px-3 outline-none border border-gray-300 focus:border-blue-500 transition-all hover:bg-gray-100 text-black"
          style={{ backgroundColor: 'rgba(0, 0, 255, 0.2)' }}
        />
        {(searchTerm && searchResults.length > 0) && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white bg-opacity-75 shadow-md rounded-lg py-2 overflow-y-auto max-h-60">
            {searchResults.map(product => (
              <ProductSearchResult key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-blue-500 bg-opacity-25 p-4 rounded-lg max-w-md w-full border border-blue-500 border-opacity-50">
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
                  <ProductSearchResult key={product.id} product={product} />
                ))}
              </div>
            )}
            <button onClick={closePopup} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;
