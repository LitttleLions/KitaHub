
import React from 'react';
import { Search, MapPin, Globe } from 'lucide-react'; // Globe hinzugefügt
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Shadcn Select importieren
import { GERMAN_STATES } from '@/lib/constants'; // Annahme: Konstante für Bundesländer

interface KitaSearchFormProps {
  searchText: string;
  setSearchText: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  selectedState: string; // Bundesland hinzugefügt
  setSelectedState: (value: string) => void; // Handler für Bundesland hinzugefügt
  handleSearch: (e: React.FormEvent) => void;
}

const KitaSearchForm: React.FC<KitaSearchFormProps> = ({
  searchText,
  setSearchText,
  location,
  setLocation,
  selectedState,
  setSelectedState,
  handleSearch
}) => {
  return (
    // Removed inner background/shadow div, parent handles the card style
    <form onSubmit={handleSearch} className="w-full">
      {/* Layout angepasst für 3 Spalten + Button */}
      <div className="flex flex-col lg:flex-row gap-3 items-center">
        {/* Suchfeld */}
        <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Name der Kita oder des Trägers"
              // Adjusted styling: lighter border, consistent padding/rounding, removed focus ring
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 text-sm"
            />
          </div>

          {/* Ort/PLZ Feld */}
          <div className="relative flex-1 w-full lg:w-auto">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ort oder PLZ"
               // Adjusted styling: lighter border, consistent padding/rounding, removed focus ring
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 text-sm"
            />
          </div>

          {/* Bundesland Dropdown */}
          <div className="relative flex-1 w-full lg:w-auto">
             <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none z-10" /> {/* Ensure icon is above select */}
             <Select value={selectedState} onValueChange={setSelectedState}>
                {/* Adjusted styling: lighter border, consistent padding/rounding, removed focus ring */}
               <SelectTrigger className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 text-gray-500 text-sm bg-white">
                 <SelectValue placeholder="Alle Bundesländer" />
               </SelectTrigger>
               <SelectContent> {/* Keep default content styling */}
                 <SelectItem value="all">Alle Bundesländer</SelectItem>
                 {GERMAN_STATES.map((state) => (
                   <SelectItem key={state.value} value={state.value}>
                     {state.label}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
          </div>

          {/* Suchbutton - Adjusted color, hover state, and font weight */}
          <Button
            type="submit"
            className="bg-lime-600 hover:bg-lime-700 text-white py-3 px-6 rounded-lg w-full lg:w-auto text-sm font-semibold" /* Changed green, added font-semibold */
          >
            <Search className="mr-2 h-4 w-4 inline" /> Suchen
          </Button>
        </div>
      {/* Removed inner background/shadow div closing tag */}
    </form>
  );
};

export default KitaSearchForm;
