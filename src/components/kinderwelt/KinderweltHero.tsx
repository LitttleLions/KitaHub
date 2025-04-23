// src/components/kinderwelt/KinderweltHero.tsx
import React from 'react';

const KinderweltHero: React.FC = () => {
  return (
    // Hintergrundfarbe geändert zu Himmelblau (bg-blue-50), Padding angepasst
    <div className="py-10 mb-12 text-center bg-blue-50 rounded-lg shadow-sm"> 
      <div className="container mx-auto px-4 md:px-6">
        {/* Optional: Ein verspieltes Icon oder eine kleine Illustration */}
        {/* <img src="/path/to/maskottchen.svg" alt="Kinderwelt Maskottchen" className="w-16 h-16 mx-auto mb-4" /> */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-800 md:text-5xl lg:text-6xl">
          Willkommen in der Kinderwelt!
        </h1>
        <p className="mt-4 text-lg text-gray-600 md:text-xl">
          Entdecke spannende Geschichten zum Vorlesen, Lachen und Träumen.
        </p>
        {/* Optional: Ein kleiner Call-to-Action oder Hinweis */}
        {/* <p className="mt-2 text-sm text-gray-500">Gib unten deine Ideen ein und lass uns eine neue Geschichte zaubern!</p> */}
      </div>
    </div>
  );
};

export default KinderweltHero;
