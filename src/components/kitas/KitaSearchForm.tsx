
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KitaSearchFormProps {
  searchText: string;
  setSearchText: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const KitaSearchForm: React.FC<KitaSearchFormProps> = ({
  searchText,
  setSearchText,
  location,
  setLocation,
  handleSearch
}) => {
  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Name der Kita oder Stichwort"
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kita-orange focus:border-transparent"
            />
          </div>
          
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ort, PLZ oder Bundesland"
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kita-orange focus:border-transparent"
            />
          </div>
          
          <Button 
            type="submit" 
            className="bg-kita-orange hover:bg-kita-orange/90 text-white py-3 px-6"
          >
            Kitas finden
          </Button>
        </div>
      </div>
    </form>
  );
};

export default KitaSearchForm;
