
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
// Removed unused imports useQuery and fetchCompaniesByBundesland
import { GERMAN_STATES } from '@/lib/constants'; // Import shared constant

// Removed local BUNDESLAENDER array

const BundeslanderNavigation = () => {
  const navigate = useNavigate();
  
  // Modified to use state.value (URL slug) for navigation
  const handleStateClick = (stateValue: string) => { 
    navigate(`/kitas?bundesland=${stateValue}`); // Use state.value directly
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kitas nach Bundesland</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Wählen Sie ein Bundesland aus, um Kindertagesstätten in dieser Region zu finden.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Use imported GERMAN_STATES */}
          {GERMAN_STATES.map((state) => ( 
            <button
              key={state.value} // Use state.value as key
              onClick={() => handleStateClick(state.value)} // Pass state.value to handler
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700"
            >
              <MapPin className="h-4 w-4 text-kita-orange" />
              <span>{state.label}</span> {/* Use state.label for display */}
            </button>
          ))}
        </div>

        {/* View all kitas button */}
        <div className="mt-8 text-center">
          <Link 
            to="/kitas"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-kita-orange text-white font-medium hover:bg-kita-orange/90 transition-colors"
          >
            Alle Kitas anzeigen
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BundeslanderNavigation;
