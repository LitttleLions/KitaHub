
import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
  initialValue?: string;
}

const SearchInput = ({ 
  placeholder = "Suchen...", 
  onSearch,
  className = "",
  initialValue = ""
}: SearchInputProps) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="block w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-kita-orange focus:border-transparent shadow-sm transition-all"
          placeholder={placeholder}
        />
      </div>
    </form>
  );
};

export default SearchInput;
