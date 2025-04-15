
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchingForm from '@/components/matching/MatchingForm';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

const Matching = () => {
  return (
    <FavoritesProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-50 to-amber-50 py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Finde die perfekte Kita für dein Kind
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Unser intelligentes Matching-System hilft dir, aus über 50.000 Kitas 
                  in Deutschland die passende Einrichtung für deine Familie zu finden.
                </p>
                <div className="inline-flex items-center justify-center bg-white p-2 rounded-lg shadow-sm">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    Von über 10.000 Eltern empfohlen
                  </span>
                </div>
              </div>
              {/* Added Hero Image */}
              <div className="mt-8 max-w-5xl mx-auto">
                <img 
                  src="/lovable-uploads/kindergarten-2204239_1920.jpg" 
                  alt="Kinder spielen in einer Kita" 
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md" 
                />
              </div>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Kita-Matching: Deine Wünsche
                </h2>
                <p className="text-gray-600 mb-8">
                  Bitte gib deine Präferenzen an, damit wir die passenden Kitas für dich finden können.
                  Je mehr Details du angibst, desto besser können wir dir helfen.
                </p>
                
                <MatchingForm />
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
                  So funktioniert unser Kita-Matching
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-kita-orange text-white text-xl font-bold mb-4">
                      1
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Präferenzen angeben</h3>
                    <p className="text-gray-600">
                      Beschreibe, was dir bei einer Kita wichtig ist: Standort, Konzept, Betreuungszeiten und mehr.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-kita-orange text-white text-xl font-bold mb-4">
                      2
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Matches finden</h3>
                    <p className="text-gray-600">
                      Unser Algorithmus findet Kitas, die deinen Wünschen am besten entsprechen und bewertet sie.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-kita-orange text-white text-xl font-bold mb-4">
                      3
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Kitas kontaktieren</h3>
                    <p className="text-gray-600">
                      Sieh dir die Ergebnisse an, speichere deine Favoriten und nimm direkt Kontakt auf.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </FavoritesProvider>
  );
};

export default Matching;
