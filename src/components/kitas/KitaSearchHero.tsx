import React from 'react';
import { Link } from 'react-router-dom';
import KitaSearchForm from '@/components/kitas/KitaSearchForm';

interface KitaSearchHeroProps {
  searchText: string;
  setSearchText: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  selectedState: string; // Hinzugefügt
  setSelectedState: (value: string) => void; // Hinzugefügt
  handleSearch: (e: React.FormEvent) => void;
  title?: string;
  subtitle?: string;
  showFrequentSearches?: boolean;
  showBottomLinks?: boolean;
  bgColor?: string; // Optional background color class
}

const KitaSearchHero: React.FC<KitaSearchHeroProps> = ({
  searchText,
  setSearchText,
  location,
  setLocation,
  selectedState, // Hinzugefügt
  setSelectedState, // Hinzugefügt
  handleSearch,
  title = "Kita-Suche", // Default title
  subtitle,
  showFrequentSearches = true,
  showBottomLinks = false,
  bgColor = "bg-transparent" // Default background is now transparent
}) => {
  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Removed the outer section wrapper, background and padding are handled by the parent (Index.tsx) */}
      <div className="max-w-3xl mx-auto text-center">
        {/* Adjusted title styling and applied Poppins font */}
        <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-800 mb-4"> {/* Added font-display */}
          {title}
        </h1>
        {subtitle && (
            <p className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          {/* Adjusted search container styling: more padding, more rounded, stronger shadow */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <KitaSearchForm
              searchText={searchText}
              setSearchText={setSearchText}
              location={location}
              setLocation={setLocation}
              selectedState={selectedState} // Übergeben
              setSelectedState={setSelectedState} // Übergeben
              handleSearch={handleSearch}
            />
            {/* Adjusted frequent searches styling */}
            {showFrequentSearches && (
              <div className="mt-6 text-base text-gray-600 flex flex-wrap justify-center items-center gap-2"> {/* Increased top margin and text size */}
                <span>Häufige Suchen:</span>
                {/* Adjusted link styling: white bg, border, slightly larger text */}
                <Link to="/kitas?location=Berlin" className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors">Berlin</Link>
                <Link to="/kitas?location=Hamburg" className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors">Hamburg</Link>
                <Link to="/kitas?location=München" className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors">München</Link>
                <Link to="/kitas?location=Köln" className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors">Köln</Link>
                <Link to="/kitas?location=Frankfurt" className="bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-50 transition-colors">Frankfurt</Link>
              </div>
            )}
          </div>
          {/* Adjusted bottom links styling */}
          {showBottomLinks && (
             <div className="mt-8 flex justify-center gap-4">
                {/* Adjusted link styling: white bg, more rounded */}
                <Link to="/kitas" className="bg-white px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm font-medium">
                  Suche nach Bundesland
                </Link>
                <Link to="/wissen" className="bg-white px-4 py-2 border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm font-medium">
                  Wissenswertes zur Kita
                </Link>
              </div>
          )}
        </div>
      </div>
    // Removed closing section tag
  ); // Closing parenthesis for return statement
}; // Closing brace for component function

export default KitaSearchHero;
