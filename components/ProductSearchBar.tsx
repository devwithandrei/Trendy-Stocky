"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import ProductSearchResult from './ProductSearchResult';
import { Search, X } from 'lucide-react';

interface ProductSearchBarProps {
  products: Product[];
  onProductSelect?: () => void;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ products, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setSearchTerm('');
        setIsFocused(false);
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

    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchText) ||
      product.brand.name.toLowerCase().includes(searchText) ||
      (product.description?.value?.toLowerCase().includes(searchText) ?? false)
    );
    setSearchResults(filteredProducts);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchContainerRef}>
      <div 
        className={`
          flex items-center gap-3 px-4 py-2 
          bg-white rounded-full
          border border-gray-200
          transition-all duration-200
          ${isFocused ? 'shadow-md border-gray-300' : 'hover:border-gray-300'}
        `}
      >
        <Search 
          size={18} 
          className={`
            transition-colors duration-200
            ${isFocused ? 'text-gray-800' : 'text-gray-400'}
          `}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          placeholder="Search products..."
          className="
            flex-1 
            text-sm 
            bg-transparent 
            outline-none 
            placeholder:text-gray-400
            text-gray-800
          "
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {searchTerm && searchResults.length > 0 && (
        <div className="
          absolute z-50 w-full mt-2
          bg-white rounded-lg
          shadow-lg
          border border-gray-100
          overflow-hidden
          max-h-[calc(100vh-200px)]
          overflow-y-auto
          scrollbar-thin
          scrollbar-thumb-gray-200
          scrollbar-track-transparent
        ">
          {searchResults.map((product) => (
            <ProductSearchResult
              key={product.id}
              product={product}
              onProductSelect={() => {
                setSearchTerm('');
                setSearchResults([]);
                onProductSelect?.();
              }}
            />
          ))}
        </div>
      )}

      {/* No Results Message */}
      {searchTerm && searchResults.length === 0 && (
        <div className="
          absolute z-50 w-full mt-2
          bg-white rounded-lg
          shadow-lg
          border border-gray-100
          p-4
        ">
          <p className="text-gray-500 text-center text-sm">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;