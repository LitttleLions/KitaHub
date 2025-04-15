import React, { useState, useRef, useEffect, useMemo } from 'react'; // Add useMemo
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchCompanies } from '@/services/company';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LeafletMouseEvent, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'react-router-dom';
import SearchFilters from './SearchFilters';
import ResultsList from './ResultsList';
import MapMarker from './MapMarker';
import { Company } from '@/types/company';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea for better scroll handling

// Default map position (center of Germany)
const DEFAULT_POSITION: [number, number] = [51.1657, 10.4515];
const DEFAULT_ZOOM = 6;

// Custom hook to handle map bounds updates
const MapBoundsHandler = ({ onBoundsChange }: { onBoundsChange: (bounds: any) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;

    const handleMoveEnd = () => {
      const bounds = map.getBounds();
      onBoundsChange(bounds);
    };

    map.on('moveend', handleMoveEnd);
    
    // Initial bounds
    handleMoveEnd();
    
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onBoundsChange]);
  
  return null;
};

// Main component
const KitaMapSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mapRef = useRef<Map>(null);
  
  // Search states
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [radius, setRadius] = useState(searchParams.get('radius') || '10');
  const [careType, setCareType] = useState<string[]>(searchParams.getAll('careType') || []);
  const [openingHours, setOpeningHours] = useState<string[]>(searchParams.getAll('openingHours') || []);
  const [sponsorType, setSponsorType] = useState<string[]>(searchParams.getAll('sponsorType') || []);
  const [concept, setConcept] = useState<string[]>(searchParams.getAll('concept') || []);
  const [specialFeatures, setSpecialFeatures] = useState<string[]>(searchParams.getAll('specialFeatures') || []);
  const [showPremiumOnly, setShowPremiumOnly] = useState(searchParams.get('premium') === 'true');
  
  // Results and interaction states
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [selectedKitaId, setSelectedKitaId] = useState<string | null>(null);
  // const [isSearching, setIsSearching] = useState(false); // Remove, use isFetching from useQuery
  const [initialLoadDone, setInitialLoadDone] = useState(false); // Track initial load

  // Query for fetching kitas - Explicitly type the query result
  const { data, isLoading, error, refetch, isFetching }: UseQueryResult<{ companies: Company[]; total: number; }, Error> = useQuery({ // Add isFetching
    queryKey: ['kita-map-search', location, radius, careType, openingHours, sponsorType, concept, specialFeatures, showPremiumOnly, initialLoadDone], // Add initialLoadDone to key
    queryFn: () => fetchCompanies({
      location: location || undefined, // Pass undefined if location is empty
      limit: location ? 100 : 10, // Fetch 10 initially, 100 for specific searches
      isPremium: showPremiumOnly || undefined,
      // Additional filters would be implemented here in a real application
    }),
    enabled: !!location || showPremiumOnly || initialLoadDone, // Enable if location/premium set OR initial load requested
  });

  // Trigger initial fetch if no location/premium is set
  useEffect(() => {
    if (!location && !showPremiumOnly && !initialLoadDone) {
      setInitialLoadDone(true); // Trigger the query by changing the state included in the queryKey
    }
  }, [location, showPremiumOnly, initialLoadDone]);


  // Handle query errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Fehler bei der Suche",
        description: error.message || "Ein unbekannter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    }
  }, [error]);

  // Perform search when filters change
  // Note: This might double-fetch initially when initialLoadDone triggers the query,
  // but simplifies logic for now. Could be optimized if performance becomes an issue.
  useEffect(() => {
    // Only refetch based on user actions (location/premium change), not initial load trigger
    if ((location || showPremiumOnly) && !initialLoadDone) {
      refetch();
    }
    // Reset initial load flag if user starts searching
    if ((location || showPremiumOnly) && initialLoadDone) {
      setInitialLoadDone(false);
    }
  }, [location, showPremiumOnly, refetch, initialLoadDone]);

  // Update URL search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (radius) params.set('radius', radius);
    careType.forEach(type => params.append('careType', type));
    openingHours.forEach(hours => params.append('openingHours', hours));
    sponsorType.forEach(type => params.append('sponsorType', type));
    concept.forEach(c => params.append('concept', c));
    specialFeatures.forEach(feature => params.append('specialFeatures', feature));
    if (showPremiumOnly) params.set('premium', 'true');
    
    setSearchParams(params, { replace: true });
  }, [location, radius, careType, openingHours, sponsorType, concept, specialFeatures, showPremiumOnly, setSearchParams]);

  // Handle map bounds change (e.g., when user pans/zooms)
  const handleBoundsChange = (bounds: any) => {
    setMapBounds(bounds);
    // In a real application, we might fetch results based on these bounds
  };

  // Handle kita selection in list or on map
  const handleKitaSelect = (id: string) => {
    setSelectedKitaId(id);

    // Find the selected kita to center map on it
    const selectedKita = sortedVisibleResults.find(kita => kita.id === id); // Use sorted results
    if (selectedKita && mapRef.current) {
      // Check if latitude and longitude exist and are numbers
      if (typeof selectedKita.latitude === 'number' && typeof selectedKita.longitude === 'number') {
        const map = mapRef.current;
        map.flyTo([selectedKita.latitude, selectedKita.longitude], 15); // Zoom level 15, adjust as needed
      } else {
        // Fallback or warning if coordinates are missing/invalid
        toast({
          title: "Kartenansicht",
          description: `Keine gültigen Koordinaten für ${selectedKita.name} gefunden.`,
          variant: "destructive"
        });
      }
    }
  };

  // Sort results: Premium first, then by name (or other criteria)
  const sortedVisibleResults = useMemo(() => {
    const companies = data?.companies || [];
    return [...companies].sort((a, b) => {
      // Prioritize premium 
      const isAPremium = a.is_premium ?? false;
      const isBPremium = b.is_premium ?? false;
      if (isAPremium && !isBPremium) return -1;
      if (!isAPremium && isBPremium) return 1;
      // Optional: Add secondary sort criteria, e.g., by name
      // return a.name.localeCompare(b.name);
      return 0; // Keep original order if premium status is the same
    });
  }, [data?.companies]);

  // Define column heights - adjust as needed, especially considering Navbar height (approx 64px or 80px)
  const columnHeight = "h-[calc(100vh-80px-6rem)]"; // Example: vh - navbar - padding/margins

  return (
    <div className="container mx-auto px-4 py-8">
       {/* Title and Description */}
       <div className="mb-6">
         <h1 className="text-3xl font-bold text-gray-800">
           Kitas <span className="text-gray-500">/</span> Super Umkreissuche
         </h1>
         <p className="mt-2 text-gray-600">
           Finden Sie Kitas in Ihrer Nähe. Nutzen Sie die Filter, um die Suche anzupassen,
           sehen Sie die Ergebnisse in der Liste und auf der Karte.
         </p>
       </div>

       {/* Main Grid Layout */}
       {/* Adjust grid columns for wider filter column */}
       <div className={`grid grid-cols-1 md:grid-cols-6 gap-6 ${columnHeight} overflow-hidden`}>

         {/* Column 1: Filters */}
         <div className={`md:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col ${columnHeight} overflow-hidden`}>
           <h2 className="text-xl font-semibold p-4 border-b border-gray-200">Filter</h2>
           <ScrollArea className="flex-grow p-4">
             <SearchFilters
               location={location}
               setLocation={setLocation}
              radius={radius}
              setRadius={setRadius}
              careType={careType}
              setCareType={setCareType}
              openingHours={openingHours}
              setOpeningHours={setOpeningHours}
              sponsorType={sponsorType}
              setSponsorType={setSponsorType}
              concept={concept}
              setConcept={setConcept}
              specialFeatures={specialFeatures}
              setSpecialFeatures={setSpecialFeatures}
              showPremiumOnly={showPremiumOnly}
               setShowPremiumOnly={setShowPremiumOnly}
             />
           </ScrollArea>
         </div>

         {/* Column 2: Results List */}
         {/* Keep results list span at 2 */}
         <div className={`md:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col ${columnHeight} overflow-hidden`}>
           <div className="p-4 border-b border-gray-200">
             <h2 className="text-xl font-semibold">Suchergebnisse</h2>
             <div className="mt-2 text-sm text-gray-600">
               {isLoading || isFetching ? ( // Use isFetching for loading state
                 "Suche läuft..."
               ) : (
                 `${sortedVisibleResults.length} Kitas gefunden` // Use sorted results length
               )}
             </div>
           </div>
           <ScrollArea className="flex-grow p-4">
             <ResultsList
               results={sortedVisibleResults} // Use sorted results
               isLoading={isLoading || isFetching} // Use isFetching from useQuery
               selectedKitaId={selectedKitaId}
               onKitaSelect={handleKitaSelect}
             />
           </ScrollArea>
         </div>

         {/* Column 3: Map */}
         {/* Keep map span at 2 */}
         <div className={`md:col-span-2 border border-gray-200 rounded-lg shadow-sm overflow-hidden ${columnHeight}`}>
           <MapContainer
             center={DEFAULT_POSITION}
             zoom={DEFAULT_ZOOM}
             style={{ height: '100%', width: '100%' }}
             zoomControl={true} // Enable zoom control for better usability
             ref={mapRef}
            // Remove whenReady - ref should be sufficient
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapBoundsHandler onBoundsChange={handleBoundsChange} />

            {/* Render markers for each kita */}
            {sortedVisibleResults.map(kita => ( // Use sorted results
              <MapMarker
                key={kita.id}
                kita={kita}
                isSelected={selectedKitaId === kita.id}
                onSelect={() => handleKitaSelect(kita.id)}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default KitaMapSearch;
