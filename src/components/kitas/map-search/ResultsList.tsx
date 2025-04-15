
import React from 'react';
import { Link } from 'react-router-dom';
import { Company } from '@/types/company';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, Award } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

interface ResultsListProps {
  results: Company[];
  isLoading: boolean;
  selectedKitaId: string | null;
  onKitaSelect: (id: string) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({ 
  results, 
  isLoading, 
  selectedKitaId, 
  onKitaSelect 
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Keine Kitas gefunden. Bitte passe deine Suchkriterien an.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map(kita => (
        <div 
          key={kita.id} 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            selectedKitaId === kita.id ? 'border-kita-orange bg-orange-50' : 'hover:border-gray-300'
          }`}
          onClick={() => onKitaSelect(kita.id)}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center">
                {kita.is_premium && (
                  <Badge className="mr-2 bg-amber-500 hover:bg-amber-600">
                    <Award className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {kita.name}
              </h3>
              <p className="text-sm text-gray-500">{kita.location}</p>
            </div>
            <button 
              onClick={(e) => toggleFavorite(e, kita.id)}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label={isFavorite(kita.id) ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite(kita.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {kita.description.length > 150 
              ? `${kita.description.substring(0, 150)}...` 
              : kita.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {/* In a real app, these would come from the kita data */}
            {kita.special_pedagogy && (
              <Badge variant="outline" className="text-xs bg-blue-50">
                {kita.special_pedagogy}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs bg-green-50">
              Kindergarten
            </Badge>
            {kita.is_premium && kita.has_open_positions && (
              <Badge variant="outline" className="text-xs bg-purple-50">
                Freie Plätze
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <Link 
              to={`/kita/${kita.id}`}
              className="text-blue-600 hover:underline text-sm flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Details ansehen
            </Link>
            
            {kita.is_premium && (
              <Button 
                size="sm" 
                className="bg-kita-orange hover:bg-kita-orange/90"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/kita/${kita.id}`, '_blank');
                }}
              >
                Jetzt kontaktieren
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsList;
