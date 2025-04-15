
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MatchingResult from './MatchingResult';
import { MatchingResult as MatchingResultType } from '@/types/matching';

interface MatchingResultsProps {
  results: MatchingResultType[];
  isLoading: boolean;
  onFilterToggle?: () => void;
  showOnlyFavorites: boolean;
  toggleFavorites: () => void;
}

const MatchingResults: React.FC<MatchingResultsProps> = ({ 
  results, 
  isLoading, 
  onFilterToggle,
  showOnlyFavorites,
  toggleFavorites
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-kita-orange border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Suche passende Kitas...</p>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Keine passenden Kitas gefunden</h3>
        <p className="text-gray-600 mb-6">Versuche es mit weniger oder anderen Filterkriterien.</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/matching')}
          className="mx-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Suche
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {results.length} passende {results.length === 1 ? 'Kita' : 'Kitas'} gefunden
          </h2>
          <p className="text-sm text-gray-500">
            Sortiert nach Premium-Status und Matching-Score
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {onFilterToggle && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onFilterToggle} 
              className="flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          )}
          
          <Button
            variant={showOnlyFavorites ? "default" : "outline"}
            size="sm"
            onClick={toggleFavorites}
            className={showOnlyFavorites ? "bg-kita-orange hover:bg-kita-orange/90" : ""}
          >
            {showOnlyFavorites ? "Alle anzeigen" : "Nur Favoriten"}
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        {results.map((result) => (
          <MatchingResult key={result.companyId} result={result} />
        ))}
      </div>
      
      <div className="flex justify-center pt-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/matching')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Suchkriterien anpassen
        </Button>
      </div>
    </div>
  );
};

export default MatchingResults;
