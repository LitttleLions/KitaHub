import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Building } from 'lucide-react'; // Added Building icon
import { Company } from '@/types/company';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge'; // Keep Badge import
import { getDisplayCoverImageUrl } from '@/utils/dataFormatUtils'; // Import the new helper function

const PLACEHOLDER_IMAGE_URL = '/placeholder.svg'; // Keep the ultimate fallback

// Helper function for image error handling
const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== PLACEHOLDER_IMAGE_URL) {
    target.src = PLACEHOLDER_IMAGE_URL;
  }
};

interface HorizontalKitaCardProps {
  kita: Company;
  className?: string;
}

const HorizontalKitaCard: React.FC<HorizontalKitaCardProps> = ({ kita, className }) => {
  return (
    <Link 
      to={`/kita/${kita.id}`} 
      className={cn(
        "block rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-200",
        "flex flex-col md:flex-row", // Horizontal layout on medium screens and up
        className
      )}
    >
      {/* Image Section - Made slightly smaller */}
      <div className="md:w-1/4 lg:w-1/5 flex-shrink-0 aspect-video md:aspect-[4/3] overflow-hidden rounded-l-lg md:rounded-l-lg md:rounded-r-none"> {/* Adjusted width and aspect ratio */}
        <img
          src={getDisplayCoverImageUrl(kita)} // Use the helper function to get the correct image URL
          alt={`Bild von ${kita.name}`}
          className="w-full h-full object-cover" // Ensure image covers the area
          onError={handleImageError} // Keep onError pointing to the final fallback
        />
      </div>

      {/* Content Section - Adjusted padding and text sizes */}
      <div className="p-2 flex flex-col justify-between flex-grow"> {/* Reduced padding */}
        <div>
          {/* Type and Location */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1"> {/* Smaller text */}
            {/* Moved Type Badge here */}
            {kita.type && (
              <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal mr-2"> {/* Even smaller badge */}
                {/* <Building className="w-2.5 h-2.5 mr-0.5" />  Icon might be too small */}
                {kita.type}
              </Badge>
            )}
            <div className="flex items-center gap-1 ml-auto"> {/* Pushed location to right */}
              <MapPin className="w-3 h-3" />
              <span className="truncate">{kita.location || 'Unbekannt'}</span>
            </div>
          </div>
          {/* Name */}
          <h3 className="text-sm font-semibold text-primary mb-1 truncate">{kita.name}</h3> {/* Smaller title, truncate */}
          {/* Removed duplicate type badge */}
          {/* Optional: Add more details like capacity, age range if needed */}
          {/* <p className="text-sm text-muted-foreground line-clamp-2">
            </Badge>
          )}
          {/* Optional: Add more details like capacity, age range if needed */}
          {/* <p className="text-sm text-muted-foreground line-clamp-2">
            {kita.description ? 'Beschreibung vorhanden' : 'Keine Beschreibung'}
          </p> */}
        </div>
        {/* Rating and Footer Info - Adjusted text size */}
        <div className="flex items-center justify-between mt-1 pt-1 border-t"> {/* Reduced margin/padding */}
          <div className="flex items-center gap-1 text-xs"> {/* Smaller text */}
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="font-medium">{kita.rating ? kita.rating.toFixed(1) : 'N/A'}</span>
            <span className="text-muted-foreground">({kita.review_count || 0})</span> {/* Removed "Bewertungen" */}
          </div>
          {/* Optional: Add price or other info here if available */}
          {/* <span className="font-semibold">$XXX / Monat</span> */}
        </div>
      </div>
    </Link>
  );
};

export default HorizontalKitaCard;
