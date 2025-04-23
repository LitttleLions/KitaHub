
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Award } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Import the new helper function and keep getPlaceholderImage for avatar
import { getDisplayCoverImageUrl, getPlaceholderImage } from "@/utils/dataFormatUtils"; 
import { Company } from '@/types/company';
import CompanyAvatar from "@/components/ui/company-avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const PLACEHOLDER_IMAGE_URL = '/placeholder.svg';

// Helper function for image error handling (same as in other components)
const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== PLACEHOLDER_IMAGE_URL) {
    target.src = PLACEHOLDER_IMAGE_URL;
  }
};

interface KitaCardProps {
  kita: Company;
  index: number;
}

const KitaCard: React.FC<KitaCardProps> = ({ kita, index }) => {
  const isPremium = kita.is_premium === true;
  
  // Use a consistent but diverse set of placeholder images
  const getUniqueImageIndex = () => {
    // Create a number unique to this kita based on its ID
    const uniqueId = kita.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return uniqueId + index;
  };

  // Premium badge element
  const premiumBadge = isPremium ? (
    <Badge className="bg-amber-400 hover:bg-amber-500 text-black text-[10px] h-5 px-1 rounded-full border-2 border-white">
      <Award className="h-3 w-3 mr-0.5" />
      <span className="sr-only md:not-sr-only md:inline">Premium</span>
    </Badge>
  ) : null;

  return (
    <Card className={`h-full transition-all hover:shadow-md ${isPremium ? 'ring-2 ring-amber-400 shadow-md' : ''}`}>
      <Link to={`/kita/${kita.id}`} className="h-full flex flex-col">
        <div className="relative h-44 overflow-hidden rounded-t-lg">
          {/* Use the new helper function to determine the image source */}
          <img 
            src={getDisplayCoverImageUrl(kita)} 
            alt={kita.name}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            onError={handleImageError} // Keep onError pointing to the final fallback
          />
          
          {isPremium && (
            <div className="absolute top-2 left-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Badge className="bg-amber-400 text-black font-semibold flex items-center gap-1 shadow-md cursor-help border-none">
                    <Award className="h-3 w-3" />
                    Premium
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-4 bg-white shadow-lg rounded-lg border border-amber-200">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-amber-700">Premium Kita</h4>
                    <p className="text-sm text-gray-600">Diese Kita bietet zusätzliche Informationen und Services für Eltern.</p>
                    <ul className="text-xs text-gray-500 mt-1 space-y-1">
                      <li className="flex items-center gap-1">✓ Ausführliches Profil</li>
                      <li className="flex items-center gap-1">✓ Bildergalerie</li>
                      <li className="flex items-center gap-1">✓ Direktkontakt</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-white" />
              <span className="text-sm text-white truncate">{kita.location}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <CompanyAvatar 
              src={kita.logo_url}
              name={kita.name}
              fallbackIndex={getUniqueImageIndex() + 100}
              size="md"
              badge={premiumBadge}
            />
            <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-kita-orange transition-colors">{kita.name}</h3>
          </div>

          {/* Add Address Information */}
          {(kita.street || kita.postal_code || kita.location) && (
            <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-3">
              <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col">
                {kita.street && kita.house_number && (
                  <span>{kita.street} {kita.house_number}</span>
                )}
                {(kita.postal_code || kita.location) && (
                  <span>{kita.postal_code} {kita.location}</span>
                )}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">{kita.description}</p>
          <div className="mt-auto pt-2"> {/* Add padding top to separate from description */}
            {kita.rating && (
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{kita.rating.toFixed(1)}</span>
                  <span className="text-gray-400">({kita.review_count || 0})</span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
              <span className="inline-block rounded px-2 py-1 text-xs bg-kita-orange/10 text-kita-orange">
                {kita.type || 'Kindertagesstätte'}
              </span>
              
              {isPremium && kita.has_open_positions && (
                <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full">
                  Offene Stellen
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default KitaCard;
