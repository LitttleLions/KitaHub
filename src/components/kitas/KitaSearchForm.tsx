
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
    <form onSubmit={handleSearch} className="w-full"> {/* max-w entfernt für Flexibilität */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        {/* Layout angepasst für 3 Spalten + Button */}
        <div className="flex flex-col lg:flex-row gap-3 items-center">
          {/* Suchfeld */}
          <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Name der Kita oder Träger"
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-kita-orange focus:border-kita-orange" // Styling angepasst
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
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-kita-orange focus:border-kita-orange" // Styling angepasst
            />
          </div>

          {/* Bundesland Dropdown */}
          <div className="relative flex-1 w-full lg:w-auto">
             <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
             <Select value={selectedState} onValueChange={setSelectedState}>
               <SelectTrigger className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-kita-orange focus:border-kita-orange text-gray-500"> {/* Styling angepasst */}
                 <SelectValue placeholder="Alle Bundesländer" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">Alle Bundesländer</SelectItem>
                 {GERMAN_STATES.map((state) => (
                   <SelectItem key={state.value} value={state.value}>
                     {state.label}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
          </div>

          {/* Suchbutton */}
          <Button
            type="submit"
            className="bg-kita-green hover:bg-kita-green/90 text-white py-3 px-6 rounded-lg w-full lg:w-auto" // Styling angepasst
          >
            <Search className="mr-2 h-4 w-4 inline" /> Suchen
          </Button>
        </div>
      </div>
    </form>
  );
};

export default KitaSearchForm;
