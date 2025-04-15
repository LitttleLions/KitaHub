
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/types/company';

interface KitaDetailHeaderProps {
  kita: Company;
}

const PLACEHOLDER_IMAGE_URL = '/placeholder.svg';

// Helper function for image error handling
const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.target as HTMLImageElement;
  // Prevent infinite loop if placeholder itself fails
  if (target.src !== PLACEHOLDER_IMAGE_URL) {
    target.src = PLACEHOLDER_IMAGE_URL;
    // Optional: Add a class to style the placeholder differently if needed
    // target.classList.add('placeholder-image-style'); 
  }
};

const KitaDetailHeader: React.FC<KitaDetailHeaderProps> = ({ kita }) => {
  const isPremium = kita.is_premium === true;

  return (
    <div className="relative h-64 md:h-80 w-full bg-gray-200 overflow-hidden">
      {kita.cover_image_url ? (
        <img
          src={kita.cover_image_url}
          alt={kita.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
          <span className="text-gray-500">Kein Titelbild verfügbar</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full">
        <div className="container mx-auto px-4 md:px-6 pb-6">
          <Button variant="outline" size="sm" asChild className="mb-4 bg-white">
            <Link to="/kitas">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Übersicht
            </Link>
          </Button>
          <div className="flex items-center">
            <div className={`h-20 w-20 md:h-24 md:w-24 rounded-lg mr-4 overflow-hidden bg-white p-1 ${isPremium ? 'border-2 border-amber-400' : ''}`}>
              {kita.logo_url ? (
                <img
                  src={kita.logo_url}
                  alt={`${kita.name} Logo`}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-400">{kita.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{kita.name}</h1>
                {isPremium && (
                  <Badge className="bg-amber-400 text-black font-semibold flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-white/90 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{kita.location}</span>
                {kita.rating && (
                  <>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{kita.rating.toFixed(1)}</span>
                      <span className="ml-1 text-white/70">({kita.review_count || 0} Bewertungen)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitaDetailHeader;
