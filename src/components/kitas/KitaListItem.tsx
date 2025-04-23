import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Building } from 'lucide-react';
import { Company } from '@/types/company';
import { cn } from '@/lib/utils';
import CompanyAvatar from '@/components/ui/company-avatar';
import { Badge } from '@/components/ui/badge';

interface KitaListItemProps {
  kita: Company;
  className?: string;
}

const KitaListItem: React.FC<KitaListItemProps> = ({ kita, className }) => {
  // Get a consistent placeholder image index
  const getUniqueImageIndex = () => {
    const uniqueId = kita.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return uniqueId;
  };

  return (
    <Link 
      to={`/kita/${kita.id}`} 
      className={cn(
        // Applied card styling with padding
        "flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200", 
        className
      )}
    >
      {/* Avatar */}
      <CompanyAvatar 
        src={kita.logo_url}
        name={kita.name}
        fallbackIndex={getUniqueImageIndex()}
        size="md" // Medium avatar size
        className="flex-shrink-0"
      />
      
      {/* Info Section */}
      <div className="flex-grow min-w-0"> {/* min-w-0 prevents text overflow issues */}
        <p className="font-medium text-sm truncate text-gray-800 mb-1">{kita.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{kita.location || 'Unbekannt'}</span>
        </div>
        {/* Kita Type Badge */}
        {kita.type && (
          <div className="mt-1">
            <Badge variant="outline" className="text-xs py-0.5 px-1.5 font-normal"> 
              <Building className="w-3 h-3 mr-1" /> 
              {kita.type}
            </Badge>
          </div>
        )}
      </div> {/* Closing Info Section div */}

      {/* Rating (optional) */}
      {kita.rating ? ( // Check if rating exists and is not 0
        <div className="flex items-center gap-1 text-xs text-gray-700 flex-shrink-0 ml-auto pl-2"> {/* Pushes rating to the right */}
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold">{kita.rating.toFixed(1)}</span>
        </div>
      ) : null } {/* Render nothing if no rating */}
    </Link> 
  ); 
}; 

export default KitaListItem;
