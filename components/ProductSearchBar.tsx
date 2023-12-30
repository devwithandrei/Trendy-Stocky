"use client"

import React, { useState } from 'react';
import { Product } from '@/customTypes';
import ProductSearchResult from './ProductSearchResult';
import { products } from '@/components/ProductData';


interface ProductSearchBarProps {
  products: Product[];
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showPopup, setShowPopup] = useState(false);

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
    <div className="relative flex justify-center items-center">
      {/* Small search icon for smaller devices */}
      <div className="block sm:hidden ml-auto mr-4">
        <button onClick={openPopup} className="flex items-center">
          {/* SVG icon for search */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a4 4 0 11-8 0 4 4 0 018 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </div>
      {/* Search bar and results on larger devices */}
      <div className="hidden sm:flex relative justify-center items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-8"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white shadow-md rounded-lg py-2 overflow-y-auto max-h-60">
            {searchResults.map(product => (
              <ProductSearchResult key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      {/* Popup on smaller devices */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button onClick={closePopup}>Close</button>
            <div className="mt-2 max-h-60 overflow-y-auto">
              {searchResults.map(product => (
                <ProductSearchResult key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;
