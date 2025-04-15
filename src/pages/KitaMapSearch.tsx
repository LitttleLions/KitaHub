
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import KitaMapSearchComponent from '@/components/kitas/map-search/KitaMapSearch';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

const KitaMapSearch: React.FC = () => {
  return (
    <FavoritesProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          <KitaMapSearchComponent />
        </main>
        <Footer />
      </div>
    </FavoritesProvider>
  );
};

export default KitaMapSearch;
