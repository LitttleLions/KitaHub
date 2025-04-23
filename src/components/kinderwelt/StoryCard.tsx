// src/components/kinderwelt/StoryCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Story } from '@/types/kinderwelt';
import { Clock, Tag, User } from 'lucide-react';
import { cn } from '@/lib/utils'; // Importiere cn für bedingte Klassen

interface StoryCardProps {
  story: Story;
  className?: string; // Erlaube zusätzliche Klassen von außen
}

const StoryCard: React.FC<StoryCardProps> = ({ story, className }) => {
  return (
    // Hover-Effekt hinzugefügt, Klassen zusammengeführt mit cn
    <Card className={cn("flex flex-col h-full overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1", className)}>
      <CardHeader className="p-0">
        {/* Link umschließt das Bild und den Titel für bessere Klickbarkeit */}
        <Link to={`/kinderwelt/${story.slug}`} className="block">
          {story.cover_image_url ? (
            <img
              src={story.cover_image_url}
              alt={`Titelbild für ${story.title}`}
              className="object-cover w-full h-48" // Feste Höhe für Konsistenz
            />
          ) : (
            // Verwende den Standard-Platzhalter
            <img 
              src="/placeholder.svg" 
              alt="Platzhalterbild" 
              className="object-contain w-full h-48 p-4 bg-muted" // object-contain, damit es nicht verzerrt wird
            />
          )}
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Link to={`/kinderwelt/${story.slug}`} className="block hover:text-primary">
          <CardTitle className="mb-2 text-lg leading-tight">{story.title}</CardTitle>
        </Link>
        {/* Kurze Beschreibung oder Teaser (optional, hier nicht im Typ definiert) */}
        {/* <p className="text-sm text-muted-foreground line-clamp-2">{story.seo_description || 'Keine Beschreibung verfügbar.'}</p> */}
      </CardContent>
      {/* Farbige Badges wie auf Detailseite, aber etwas kleiner (text-xs) */}
      <CardFooter className="flex flex-wrap gap-1.5 p-4 text-xs border-t"> 
        {story.target_age_min && story.target_age_max && (
          <Badge className="flex items-center gap-1 py-0.5 px-2 bg-blue-100 text-blue-800">
            <User className="w-3 h-3" />
            {story.target_age_min}-{story.target_age_max} J.
          </Badge>
        )}
        {story.reading_time_minutes && (
          <Badge className="flex items-center gap-1 py-0.5 px-2 bg-green-100 text-green-800">
            <Clock className="w-3 h-3" />
            {story.reading_time_minutes} Min.
          </Badge>
        )}
        {story.themes && story.themes.length > 0 && (
           <Badge variant="outline" className="flex items-center gap-1 py-0.5 px-2 border-yellow-500 text-yellow-700 bg-yellow-50">
             <Tag className="w-3 h-3" />
             {story.themes[0]} 
           </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
