
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MatchingResults from '@/components/matching/MatchingResults';
import { Button } from '@/components/ui/button';
import { MatchingCriteria, MatchingResult } from '@/types/matching';
import { findMatchingKitas } from '@/services/matchingService';
import { useFavorites, FavoritesProvider } from '@/contexts/FavoritesContext';
import { ArrowLeft, Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MatchingResultsPage = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [results, setResults] = useState<MatchingResult[]>([]);
  const [displayedResults, setDisplayedResults] = useState<MatchingResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [criteria, setCriteria] = useState<MatchingCriteria | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Load saved criteria from session storage and perform matching
  useEffect(() => {
    const loadSavedCriteria = () => {
      const savedCriteria = sessionStorage.getItem('matchingCriteria');
      if (!savedCriteria) {
        navigate('/matching');
        return null;
      }
      
      try {
        return JSON.parse(savedCriteria) as MatchingCriteria;
      } catch (error) {
        console.error('Error parsing saved criteria:', error);
        navigate('/matching');
        return null;
      }
    };
    
    const savedCriteria = loadSavedCriteria();
    if (savedCriteria) {
      setCriteria(savedCriteria);
      performMatching(savedCriteria);
    }
  }, [navigate]);

  // Filter results when favorites change or filter toggle changes
  useEffect(() => {
    if (results.length > 0) {
      if (showOnlyFavorites) {
        setDisplayedResults(results.filter(result => favorites.includes(result.companyId)));
      } else {
        setDisplayedResults(results);
      }
    }
  }, [results, favorites, showOnlyFavorites]);

  const performMatching = async (matchingCriteria: MatchingCriteria) => {
    setIsLoading(true);
    try {
      const matchingResults = await findMatchingKitas(matchingCriteria);
      setResults(matchingResults);
      setDisplayedResults(matchingResults);
    } catch (error) {
      console.error('Error during matching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavoriteFilter = () => {
    setShowOnlyFavorites(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-50 to-amber-50 py-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Deine passenden Kitas
                </h1>
                <p className="text-gray-600">
                  Basierend auf deinen Präferenzen haben wir diese Kitas für dich gefunden
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4 md:mt-0"
                onClick={() => navigate('/matching')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zur Suche
              </Button>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-12 gap-6">
              {/* Filter Sidebar - Mobile */}
              <div className="md:hidden mb-4">
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter anzeigen
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Deine Suchkriterien</SheetTitle>
                      <SheetDescription>
                        Auf Basis dieser Kriterien haben wir passende Kitas gefunden
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      {criteria && renderCriteriaDetails(criteria)}
                    </div>
                    <Button 
                      onClick={() => navigate('/matching')}
                      className="w-full mt-4"
                    >
                      Kriterien ändern
                    </Button>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Filter Sidebar - Desktop */}
              <div className="hidden md:block md:col-span-3">
                <div className="sticky top-24 bg-white p-5 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Deine Suchkriterien</h3>
                  {criteria && renderCriteriaDetails(criteria)}
                  <Button 
                    onClick={() => navigate('/matching')}
                    className="w-full mt-4"
                  >
                    Kriterien ändern
                  </Button>
                </div>
              </div>
              
              {/* Results List */}
              <div className="md:col-span-9">
                <MatchingResults 
                  results={displayedResults}
                  isLoading={isLoading}
                  onFilterToggle={() => setShowFilters(true)}
                  showOnlyFavorites={showOnlyFavorites}
                  toggleFavorites={toggleFavoriteFilter}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Helper function to render criteria details
const renderCriteriaDetails = (criteria: MatchingCriteria) => (
  <div className="space-y-4 text-sm">
    <div>
      <h4 className="font-medium text-gray-900">Standort</h4>
      <p className="text-gray-600">{criteria.location || "Nicht angegeben"}</p>
    </div>
    
    <div>
      <h4 className="font-medium text-gray-900">Alter des Kindes</h4>
      <p className="text-gray-600">{criteria.childAge} Jahre</p>
    </div>
    
    <div>
      <h4 className="font-medium text-gray-900">Betreuungszeit</h4>
      <p className="text-gray-600">
        {criteria.careType === 'halbtags' ? 'Halbtags' : 
         criteria.careType === 'ganztags' ? 'Ganztags' : 'Flexibel'}
      </p>
    </div>
    
    {criteria.pedagogicalConcepts.length > 0 && (
      <div>
        <h4 className="font-medium text-gray-900">Pädagogisches Konzept</h4>
        <p className="text-gray-600">
          {criteria.pedagogicalConcepts.join(', ')}
        </p>
      </div>
    )}
    
    {criteria.additionalOffers.length > 0 && (
      <div>
        <h4 className="font-medium text-gray-900">Zusatzangebote</h4>
        <p className="text-gray-600">
          {criteria.additionalOffers.join(', ')}
        </p>
      </div>
    )}
    
    <div>
      <h4 className="font-medium text-gray-900">Wunschstart</h4>
      <p className="text-gray-600">{criteria.startDate}</p>
    </div>
    
    <div>
      <h4 className="font-medium text-gray-900">Prioritäten</h4>
      <ul className="text-gray-600 list-disc pl-5">
        {criteria.priorityFactor && Object.entries(criteria.priorityFactor)
          .sort(([, valueA], [, valueB]) => valueB - valueA)
          .map(([key, value]) => (
            <li key={key}>
              {key === 'location' ? 'Standort' : 
               key === 'concept' ? 'Pädagogisches Konzept' :
               key === 'additionalOffers' ? 'Zusatzangebote' : 'Betreuungszeiten'}
              {value > 0.25 ? ' (Hohe Priorität)' : ''}
            </li>
          ))}
      </ul>
    </div>
  </div>
);

// Wrap page with FavoritesProvider
const MatchingResultsPageWithProvider = () => (
  <FavoritesProvider>
    <MatchingResultsPage />
  </FavoritesProvider>
);

export default MatchingResultsPageWithProvider;
