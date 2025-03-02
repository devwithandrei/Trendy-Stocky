"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import ProductSearchResult from './ProductSearchResult';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import getProducts from '@/actions/get-products';
import { useStore } from '@/contexts/store-context';

interface ProductSearchBarProps {
  onProductSelect?: () => void;
  products: Product[];
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ onProductSelect, products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { storeId } = useStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setSearchTerm(searchText);
    setIsLoading(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if the search term is too short
    if (searchText.length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    // Debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        console.log("ProductSearchBar - Searching with term:", searchText);
        console.log("ProductSearchBar - Using storeId for search:", storeId);
        
        const results = await getProducts({ 
          search: searchText,
          storeId
        });
        
        console.log(`ProductSearchBar - Found ${results.length} search results`);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}&storeId=${storeId}`);
      setSearchResults([]);
      setIsFocused(false);
      onProductSelect?.();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          placeholder="Search products..."
          className="w-full px-4 py-2 pl-10 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </form>

      {isFocused && (searchResults.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : (
            searchResults.map((product) => (
              <ProductSearchResult
                key={product.id}
                product={product}
                onProductSelect={onProductSelect}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;
