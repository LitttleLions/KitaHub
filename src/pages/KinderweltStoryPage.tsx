// src/pages/KinderweltStoryPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchStoryBySlug } from '@/services/kinderweltService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Download, Terminal, ArrowLeft } from 'lucide-react'; // ArrowLeft wieder hinzugefügt
import { Badge } from '@/components/ui/badge';
import { Clock, Tag, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Importiere ReactMarkdown
import { Link } from 'react-router-dom'; // Import Link wieder hinzugefügt
import remarkGfm from 'remark-gfm'; // Importiere GFM Plugin
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RelatedStoriesSidebar from '@/components/kinderwelt/RelatedStoriesSidebar'; // Import Sidebar

// Beispiel für eine einfache Audio-Player Komponente
const SimpleAudioPlayer: React.FC<{ src: string }> = ({ src }) => {
  if (!src) return null;
  return (
    <div className="mt-4">
      <audio controls src={src} className="w-full">
        Ihr Browser unterstützt das Audio-Element nicht.
      </audio>
    </div>
  );
};

const KinderweltStoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // Holt den Slug aus der URL

  const { data: story, isLoading, error, isError } = useQuery({
    queryKey: ['story', slug], // Eindeutiger Key für diese Story
    queryFn: () => fetchStoryBySlug(slug!), // Ruft die Funktion zum Laden der Story auf
    enabled: !!slug, // Query nur ausführen, wenn slug vorhanden ist
  });

  if (isLoading) {
    return (
      <div className="container py-8 mx-auto">
        <Skeleton className="w-3/4 h-10 mb-4" />
        <Skeleton className="w-1/2 h-6 mb-8" />
        <div className="space-y-4">
          <Skeleton className="w-full h-48" /> {/* Platzhalter für Bild */}
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/2 h-4" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-8 mx-auto">
        <Alert variant="destructive">
          <Terminal className="w-4 h-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>
            Die Geschichte konnte nicht geladen werden. Bitte versuchen Sie es später erneut.
            {/* <pre className="mt-2 text-xs">{error?.message}</pre> */}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container py-8 mx-auto text-center">
        <h1 className="text-2xl font-semibold">Geschichte nicht gefunden</h1>
        <p className="text-muted-foreground">Die gesuchte Geschichte existiert nicht oder wurde entfernt.</p>
        {/* Optional: Link zurück zum Katalog */}
      </div>
    );
  }

  // Vorverarbeitung des Textes, um Bild-Marker zu ersetzen
  let processedContent = story.content_text;
  if (story.inline_image_urls && story.inline_image_urls.length > 0) {
    const imageMarkers = [...processedContent.matchAll(/\[Bild: (.*?)\]/g)]; // Finde alle Marker
    
    // Ersetze jeden Marker mit dem entsprechenden Bild-URL aus dem Array
    imageMarkers.forEach((match, index) => {
      const description = match[1]; // Definiere description hier, damit es im else-Block verfügbar ist
      if (story.inline_image_urls && index < story.inline_image_urls.length && story.inline_image_urls[index]) {
        const imageUrl = story.inline_image_urls[index];
        // Ersetze den Marker durch Markdown-Bildsyntax
        processedContent = processedContent.replace(match[0], `\n\n![${description}](${imageUrl})\n\n`);
      } else {
        // Falls keine passende URL vorhanden ist, ersetze den Marker durch die Beschreibung in Kursivschrift
        console.warn(`Keine Inline-Bild-URL für Marker ${index + 1} gefunden, zeige Beschreibung an.`);
        processedContent = processedContent.replace(match[0], `\n\n*(${description})*\n\n`);
      }
    });
  }


  // Hier beginnt die eigentliche Komponente wieder
  return (
    <>
      <Navbar />
      {/* Hauptcontainer mit Grid für Hauptinhalt und Sidebar */}
      <div className="container py-8 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* Hauptinhaltsbereich (nimmt 2 von 3 Spalten auf großen Bildschirmen) - mit leichtem Hintergrund */}
        <div className="lg:col-span-2 bg-yellow-50 p-6 rounded-lg shadow-sm"> {/* Hintergrund, Padding, Runde Ecken */}
          {/* Zurück-Link */}
          <Link 
          to="/kinderwelt" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-kita-orange mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Zurück zur Übersicht
        </Link>

        {/* Titelbild oder Platzhalter */}
        {story.cover_image_url ? (
          <img
            src={story.cover_image_url}
            alt={`Titelbild für ${story.title}`}
            className="object-cover w-full mb-6 rounded-lg shadow-md max-h-96"
          />
        ) : (
          <img
            src="/placeholder.svg"
            alt="Platzhalterbild"
            className="object-contain w-full mb-6 rounded-lg shadow-md max-h-96 p-8 bg-muted" // Platzhalter mit Padding
          />
        )}

      {/* Titel */}
      <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
        {story.title}
      </h1>

      {/* Metadaten - mit größeren Icons, mehr Abstand und Farben */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-sm"> {/* text-muted-foreground entfernt */}
        {story.target_age_min && story.target_age_max && (
          <Badge className="flex items-center gap-1.5 py-1 px-2.5 bg-blue-100 text-blue-800 hover:bg-blue-200"> {/* Farbige Badge */}
            <User className="w-4 h-4" /> 
            {story.target_age_min}-{story.target_age_max} Jahre
          </Badge>
        )}
        {story.reading_time_minutes && (
          <Badge className="flex items-center gap-1.5 py-1 px-2.5 bg-green-100 text-green-800 hover:bg-green-200"> {/* Farbige Badge */}
            <Clock className="w-4 h-4" /> 
            {story.reading_time_minutes} Min. Lesezeit
          </Badge>
        )}
        {story.themes && story.themes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5"> 
             <Tag className="w-4 h-4 text-gray-500" /> {/* Icon Farbe angepasst */}
             {/* Farbige Outline-Badges für Themen */}
             {story.themes.map(theme => 
               <Badge key={theme} variant="outline" className="py-1 px-2.5 border-yellow-500 text-yellow-700 bg-yellow-50 hover:bg-yellow-100"> 
                 {theme}
               </Badge>
             )}
          </div>
        )}
      </div>

      {/* Audio-Player */}
      {story.audio_url && (
        <div className="p-4 mb-6 rounded-md bg-muted">
           <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Geschichte anhören</h3>
           <SimpleAudioPlayer src={story.audio_url} />
        </div>
      )}

      {/* Geschichte Text (als Markdown rendern mit vorverarbeitetem Inhalt) - Zeilenabstand bleibt, ggf. Schriftart anpassen */}
      <div className="prose max-w-none lg:prose-lg dark:prose-invert leading-relaxed lg:leading-loose mt-8"> {/* Mehr Abstand nach oben */}
        {/* Füge benutzerdefinierte Komponenten hinzu, um Bilder zu stylen, falls nötig */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Beispiel: Bilder zentrieren und mit Rand versehen
            img: ({node, ...props}) => <img className="mx-auto my-4 rounded-md shadow-md" {...props} />
          }}
        >
          {processedContent}
        </ReactMarkdown>
      </div>

      {/* Download-Button */}
      {story.pdf_url && (
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <a href={story.pdf_url} download target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4 mr-2" />
              Geschichte als PDF herunterladen
            </a>
          </Button>
        </div>
      )}

      {/* TODO: Interaktive Elemente (Quiz, Ausmalbild) hier einfügen, wenn implementiert */}
          {/* TODO: Interaktive Elemente (Quiz, Ausmalbild) hier einfügen, wenn implementiert */}
        </div>

        {/* Sidebar-Bereich (nimmt 1 von 3 Spalten auf großen Bildschirmen) */}
        <RelatedStoriesSidebar currentStoryId={story?.id} /> 

      </div>
      <Footer />
    </>
  );
};

export default KinderweltStoryPage;
