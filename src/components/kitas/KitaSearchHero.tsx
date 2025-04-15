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
  bgColor = "bg-gradient-to-r from-blue-50 to-indigo-50" // Default background
}) => {
  return (
    <section className={`py-16 pt-24 ${bgColor}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <KitaSearchForm
              searchText={searchText}
              setSearchText={setSearchText}
              location={location}
              setLocation={setLocation}
              selectedState={selectedState} // Übergeben
              setSelectedState={setSelectedState} // Übergeben
              handleSearch={handleSearch}
            />
            {showFrequentSearches && (
              <div className="mt-4 text-sm text-gray-500">
                Häufige Suchen:
                <Link to="/kitas?location=Berlin" className="ml-2 text-kita-blue hover:underline">Berlin</Link>
                <Link to="/kitas?location=Hamburg" className="ml-2 text-kita-blue hover:underline">Hamburg</Link>
                <Link to="/kitas?location=München" className="ml-2 text-kita-blue hover:underline">München</Link>
                <Link to="/kitas?location=Köln" className="ml-2 text-kita-blue hover:underline">Köln</Link>
                <Link to="/kitas?location=Frankfurt" className="ml-2 text-kita-blue hover:underline">Frankfurt</Link>
              </div>
            )}
          </div>
          {showBottomLinks && (
             <div className="mt-6 flex justify-center gap-4">
                <Link to="/kitas" className="px-4 py-2 bg-white text-gray-700 rounded shadow hover:bg-gray-100">
                  Suche nach Bundesland
                </Link>
                <Link to="/wissen" className="px-4 py-2 bg-white text-gray-700 rounded shadow hover:bg-gray-100">
                  Wissenswertes zur Kita
                </Link>
              </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KitaSearchHero;
