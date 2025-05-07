import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  const [inputValue, setInputValue] = useState(value);
  
  // Update local state when props change
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Debounce the onChange call
    const handler = setTimeout(() => {
      onChange(newValue);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  };
  
  // Clear search
  const handleClear = () => {
    setInputValue('');
    onChange('');
  };
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-drive-blue focus:border-drive-blue bg-white text-gray-900"
        placeholder={placeholder}
      />
      
      {inputValue && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          onClick={handleClear}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;