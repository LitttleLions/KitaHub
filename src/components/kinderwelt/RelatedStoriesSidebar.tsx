// src/components/kinderwelt/RelatedStoriesSidebar.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchStoryCatalog } from '@/services/kinderweltService';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface RelatedStoriesSidebarProps {
  currentStoryId?: string; // ID der aktuellen Story, um sie auszuschließen
  limit?: number; // Anzahl der anzuzeigenden Stories
}

const RelatedStoriesSidebar: React.FC<RelatedStoriesSidebarProps> = ({ currentStoryId, limit = 5 }) => {
  // Lade eine kleine Anzahl von Geschichten (z.B. die neuesten)
  // Später könnte man hier thematisch ähnliche laden
  const { data: stories, isLoading, isError } = useQuery({
    queryKey: ['relatedStories', limit], // Eigener Query Key
    queryFn: () => fetchStoryCatalog({ limit: limit + 1 }), // Übergebe limit als number
  });

  // Filtere die aktuelle Geschichte heraus und begrenze auf das Limit
  const relatedStories = stories
    ?.filter(story => story.id !== currentStoryId)
    .slice(0, limit);

  return (
    // Angepasstes Styling: Nimmt die volle Breite auf kleinen Screens, 1/3 auf großen.
    // Kein explizites Padding links mehr, da das Grid in der Page den Abstand regelt.
    // Sticky-Positionierung und Abstand zwischen den Blöcken hinzugefügt.
    <aside className="w-full lg:col-span-1"> 
      <div className="sticky top-20 space-y-6">
        {/* Card-Styling für den Block */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold mb-3 text-gray-800 border-b pb-2"> {/* Angepasste Überschrift */}
            Weitere Geschichten
          </h3>
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              {/* Skeleton für Textlinks */}
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}
      {isError && (
        <div className="text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          Fehler beim Laden.
        </div>
      )}
      {!isLoading && !isError && relatedStories && relatedStories.length > 0 && (
        <ul className="space-y-3">
          {relatedStories.map(story => (
            <li key={story.id}>
              <Link 
                to={`/kinderwelt/${story.slug}`} 
                className="text-sm text-gray-700 hover:text-kita-orange transition-colors flex items-center group" // Zurück zum alten Styling mit group für underline
              >
                {/* Kleines Vorschaubild wieder hinzugefügt */}
                {story.cover_image_url ? (
                   <img src={story.cover_image_url} alt="" className="w-10 h-10 object-cover rounded-md mr-3 flex-shrink-0"/>
                ) : (
                   <img src="/placeholder.svg" alt="" className="w-10 h-10 object-contain rounded-md mr-3 p-1 bg-muted flex-shrink-0"/>
                )}
                <span className="group-hover:underline">{story.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
       {!isLoading && !isError && (!relatedStories || relatedStories.length === 0) && (
         <p className="text-sm text-muted-foreground">Keine weiteren Geschichten gefunden.</p>
       )}
       </div> {/* Schließendes Div für Card-Styling */}
      </div> {/* Schließendes Div für Sticky-Container */}
    </aside>
  );
};

export default RelatedStoriesSidebar;
