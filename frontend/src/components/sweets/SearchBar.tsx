import React, { useState } from 'react';
import type { SearchParams } from '../../types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = () => {
    const params: SearchParams = {};
    if (name) params.name = name;
    if (category) params.category = category;
    if (minPrice) params.minPrice = parseFloat(minPrice);
    if (maxPrice) params.maxPrice = parseFloat(maxPrice);
    onSearch(params);
  };

  const handleReset = () => {
    setName('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  const categories = ['Chocolate', 'Gummy', 'Hard Candy', 'Caramel'];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4 transition-shadow hover:shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800">Search & Filter</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Input
          placeholder="Search by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="transition-all focus:ring-2 focus:ring-purple-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="transition-all focus:ring-2 focus:ring-purple-500">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="transition-all focus:ring-2 focus:ring-purple-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />

        <Input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="transition-all focus:ring-2 focus:ring-purple-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={handleSearch}
          className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          🔍 Search
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline"
          className="w-full sm:w-auto transition-all duration-200 hover:bg-gray-50"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
