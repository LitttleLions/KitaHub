
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Award } from 'lucide-react';
import { Card } from "@/components/ui/card";
// Keep getPlaceholderImage for CompanyAvatar fallback
import { getPlaceholderImage } from "@/utils/dataFormatUtils"; 
import { Company } from '@/types/company';
import CompanyAvatar from "@/components/ui/company-avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

const PLACEHOLDER_IMAGE_URL = '/placeholder.svg';

// Helper function for image error handling (same as in other components)
const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== PLACEHOLDER_IMAGE_URL) {
    target.src = PLACEHOLDER_IMAGE_URL;
  }
};

interface FeaturedKitaCardProps {
  kita: Company;
  index: number;
}

const FeaturedKitaCard: React.FC<FeaturedKitaCardProps> = ({ kita, index }) => {
  // Use a consistent but diverse set of placeholder images
  const getUniqueImageIndex = () => {
    // Create a number unique to this kita based on its ID
    const uniqueId = kita.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return uniqueId + index;
  };
  
  const isPremium = kita.is_premium === true;
  
  // Premium badge element to be used in avatar
  const premiumBadge = isPremium ? (
    <Badge className="bg-amber-400 hover:bg-amber-500 text-black text-[10px] h-5 px-1 rounded-full border-2 border-white">
      <Award className="h-3 w-3 mr-0.5" />
      <span className="sr-only md:not-sr-only md:inline">Premium</span>
    </Badge>
  ) : null;
  
  return (
    <Card className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 ${isPremium ? 'ring-2 ring-amber-400' : ''}`}>
      <Link to={`/kita/${kita.id}`} className="block">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 z-10"></div>
        <div className="relative h-72">
          {kita.cover_image_url ? (
            <img 
              src={kita.cover_image_url}
              alt={kita.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <img
              src={PLACEHOLDER_IMAGE_URL} // Use standard placeholder
              alt={kita.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          
          {isPremium && (
            <div className="absolute top-3 right-3 z-20">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="bg-amber-400 text-black font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-md cursor-help">
                    <Award className="h-4 w-4" />
                    Premium
                  </div>
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
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          <div className="flex items-center gap-3 mb-3">
            <CompanyAvatar 
              src={kita.logo_url}
              name={kita.name}
              fallbackIndex={getUniqueImageIndex() + 100}
              size="lg"
              className="bg-white"
              badge={premiumBadge}
            />
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-200 transition-colors">{kita.name}</h3>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-3 w-3" />
                <span className="text-sm">{kita.location}</span>
                {kita.rating && (
                  <>
                    <span className="mx-1">•</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{kita.rating.toFixed(1)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-kita-orange text-white">
              {kita.type || 'Kindertagesstätte'}
            </span>
            
            {isPremium && kita.has_open_positions && (
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-500 text-white">
                Offene Stellen
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default FeaturedKitaCard;
