"use client";

import { Product } from "@/types";
import { Search } from "lucide-react";
import ProductSearchResult from "@/components/ProductSearchResult";

interface SearchResultsProps {
  results: Product[];
  isLoading: boolean;
  searchTerm: string;
  onProductSelect: (productId: string) => void;
  className?: string;
}

const SearchResults = ({
  results,
  isLoading,
  searchTerm,
  onProductSelect,
  className = ""
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isLoading && searchTerm.length >= 2 && results.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 text-center ${className}`}>
        <Search size={48} className="text-gray-300 mb-2" />
        <p className="text-gray-500 font-medium">No products found</p>
        <p className="text-sm text-gray-400">Try different keywords</p>
      </div>
    );
  }

  if (!isLoading && results.length > 0) {
    return (
      <div className={`space-y-1 ${className}`}>
        {results.map((product) => (
          <div 
            key={product.id}
            className="px-1 py-0.5 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            <ProductSearchResult
              product={product}
              onProductSelect={() => onProductSelect(product.id)}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SearchResults;
