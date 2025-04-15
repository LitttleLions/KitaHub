
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompaniesByBundesland } from '@/services/company';

const BUNDESLAENDER = [
  { id: 'bw', name: 'Baden-Württemberg' },
  { id: 'by', name: 'Bayern' },
  { id: 'be', name: 'Berlin' },
  { id: 'bb', name: 'Brandenburg' },
  { id: 'hb', name: 'Bremen' },
  { id: 'hh', name: 'Hamburg' },
  { id: 'he', name: 'Hessen' },
  { id: 'mv', name: 'Mecklenburg-Vorpommern' },
  { id: 'ni', name: 'Niedersachsen' },
  { id: 'nw', name: 'Nordrhein-Westfalen' },
  { id: 'rp', name: 'Rheinland-Pfalz' },
  { id: 'sl', name: 'Saarland' },
  { id: 'sn', name: 'Sachsen' },
  { id: 'st', name: 'Sachsen-Anhalt' },
  { id: 'sh', name: 'Schleswig-Holstein' },
  { id: 'th', name: 'Thüringen' }
];

const BundeslanderNavigation = () => {
  const navigate = useNavigate();
  
  const handleStateClick = (stateName: string) => {
    // Navigate to the kitas page with the bundesland filter applied
    navigate(`/kitas?bundesland=${encodeURIComponent(stateName)}`);
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
          {BUNDESLAENDER.map((state) => (
            <button
              key={state.id}
              onClick={() => handleStateClick(state.name)}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700"
            >
              <MapPin className="h-4 w-4 text-kita-orange" />
              <span>{state.name}</span>
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
