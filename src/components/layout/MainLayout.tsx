// src/components/layout/MainLayout.tsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom'; // Import Outlet

// interface MainLayoutProps { // Interface nicht mehr unbedingt nötig, da keine Props mehr
//   // children: React.ReactNode; // children wird nicht mehr als Prop übergeben
// }

const MainLayout: React.FC = () => { // Keine Props und keine leeren Generics mehr nötig
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Hier werden die Kind-Routen gerendert */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
