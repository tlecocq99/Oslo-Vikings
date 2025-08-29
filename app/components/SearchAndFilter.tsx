"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  categories: string[];
  onSearch: (query: string) => void;
  onFilter: (category: string) => void;
  activeCategory: string;
}

export default function SearchAndFilter({ 
  categories, 
  onSearch, 
  onFilter, 
  activeCategory 
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-viking-red focus:border-transparent"
        />
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 mr-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500 font-medium">Filter:</span>
        </div>
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilter(category)}
            className={
              category === activeCategory 
                ? 'bg-viking-red hover:bg-viking-red-dark' 
                : 'border-viking-red text-viking-red hover:bg-viking-red hover:text-white'
            }
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}