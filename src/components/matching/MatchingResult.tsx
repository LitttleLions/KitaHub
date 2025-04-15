
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, MapPin, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CompanyAvatar from '@/components/ui/company-avatar';
import { MatchingResult as MatchingResultType } from '@/types/matching';
import { useFavorites } from '@/contexts/FavoritesContext';

interface MatchingResultProps {
  result: MatchingResultType;
}

const MatchingResult: React.FC<MatchingResultProps> = ({ result }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(result.companyId);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFavorite(result.companyId);
    } else {
      addFavorite(result.companyId);
    }
  };

  return (
    <Link 
      to={`/kita/${result.companyId}`}
      className={cn(
        "block rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow bg-white",
        result.isPremium && "border-amber-300 bg-amber-50/20"
      )}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-4">
          <CompanyAvatar 
            src={result.logoUrl} 
            name={result.name} 
            size="lg"
            className={result.isPremium ? "border-2 border-amber-300" : ""}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
                {result.name}
              </h3>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    favorite && "text-red-500"
                  )}
                  onClick={handleFavoriteToggle}
                >
                  <Heart className={cn(
                    "h-5 w-5", 
                    favorite ? "fill-current" : ""
                  )} />
                  <span className="sr-only">
                    {favorite ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                  </span>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
              <div className="flex items-center mr-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {result.location}
                  {result.distance !== undefined && (
                    <span className="ml-1 text-gray-400">
                      ({result.distance} km)
                    </span>
                  )}
                </span>
              </div>
            </div>
            
            {/* Matching score - visually displayed as a progress indicator */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Matching-Score</span>
                <span className="text-sm font-semibold">{result.matchingScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full",
                    result.matchingScore >= 80 ? "bg-green-500" :
                    result.matchingScore >= 60 ? "bg-green-400" :
                    result.matchingScore >= 40 ? "bg-amber-400" :
                    "bg-red-400"
                  )}
                  style={{ width: `${result.matchingScore}%` }}
                ></div>
              </div>
            </div>
            
            {/* Features that match search criteria */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {result.isPremium && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                  Premium
                </Badge>
              )}
              
              {result.pedagogicalConcept && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  {result.pedagogicalConcept}
                </Badge>
              )}
              
              {result.careTypes.map((careType) => (
                <Badge key={careType} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                  {careType === 'halbtags' ? 'Halbtags' : 
                   careType === 'ganztags' ? 'Ganztags' : 'Flexibel'}
                </Badge>
              ))}
              
              {result.additionalOffers.slice(0, 2).map((offer, index) => (
                <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                  {typeof offer === 'string' ? offer : ''}
                </Badge>
              ))}
              
              {result.additionalOffers.length > 2 && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  +{result.additionalOffers.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchingResult;
