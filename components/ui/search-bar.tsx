'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-blue-500"
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
