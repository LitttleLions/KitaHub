
import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Company } from '@/types/company';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapMarkerProps {
  kita: Company;
  isSelected: boolean;
  onSelect: () => void;
}

// Create map marker icons
const createIcon = (isPremium: boolean, isSelected: boolean) => {
  // In a real application, you'd use actual marker icons here
  // For this demo, we're using a placeholder style
  
  let color = isPremium ? '#F7941D' : '#3B7BBF'; // Premium or regular
  if (isSelected) {
    color = isPremium ? '#e67e00' : '#2a5a8e'; // Darker when selected
  }
  
  return new Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
        <path fill="${color}" d="M16 0c8.837 0 16 7.163 16 16 0 8.837-16 26-16 26S0 24.837 0 16C0 7.163 7.163 0 16 0z"/>
        <circle fill="white" cx="16" cy="16" r="8"/>
      </svg>
    `),
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

// Removed getRandomPosition function as we now use actual coordinates

const MapMarker: React.FC<MapMarkerProps> = ({ kita, isSelected, onSelect }) => {
  // Memoize the marker icon to prevent unnecessary re-renders
  const icon = useMemo(
    () => createIcon(kita.is_premium, isSelected),
    [kita.is_premium, isSelected]
  );

  // Use actual coordinates from the kita object
  const position: [number, number] | null = useMemo(() => {
    if (typeof kita.latitude === 'number' && typeof kita.longitude === 'number') {
      return [kita.latitude, kita.longitude];
    }
    // Optionally log an error or warning if coordinates are missing/invalid
    console.warn(`Invalid or missing coordinates for Kita ID: ${kita.id}`);
    return null; // Return null if coordinates are invalid
  }, [kita.latitude, kita.longitude, kita.id]);

  // Only render the marker if the position is valid
  if (!position) {
    return null;
  }

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: onSelect
      }}
    >
      <Popup>
        <div className="min-w-[200px] max-w-[280px]">
          <div className="flex items-center gap-1 mb-1">
            {kita.is_premium && (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                <Award className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            <h3 className="font-medium text-gray-900 truncate">{kita.name}</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{kita.location}</p>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {/* These would be actual data in a real app */}
            {kita.special_pedagogy && (
              <Badge variant="outline" className="text-xs bg-blue-50">
                {kita.special_pedagogy}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs bg-green-50">
              Kindergarten
            </Badge>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <Link 
              to={`/kita/${kita.id}`}
              className="text-blue-600 hover:underline text-sm flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Details
            </Link>
            
            {kita.is_premium && (
              <Button 
                size="sm" 
                className="bg-kita-orange hover:bg-kita-orange/90 py-1 px-2 h-auto text-xs"
                onClick={() => window.open(`/kita/${kita.id}`, '_blank')}
              >
                Kontaktieren
              </Button>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
