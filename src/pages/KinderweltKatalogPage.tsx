// src/pages/KinderweltKatalogPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // useMutation und useQueryClient hinzugefügt
import { fetchStoryCatalog, generateAndSaveStory } from '@/services/kinderweltService';
import StoryCard from '@/components/kinderwelt/StoryCard';
import KinderweltHero from '@/components/kinderwelt/KinderweltHero';
// Korrekter Import mit geschweiften Klammern für die Schnittstelle
import StoryGeneratorForm, { StoryGenerationData } from '@/components/kinderwelt/StoryGeneratorForm';
import { StoryFilters, AgeRange, ReadingTimeRange } from '@/types/kinderwelt';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { toast } from "sonner"; // Für Benachrichtigungen
import Navbar from '@/components/layout/Navbar'; // Import Navbar
import Footer from '@/components/layout/Footer'; // Import Footer

const KinderweltKatalogPage: React.FC = () => {
  const queryClient = useQueryClient();
  // State für Filter erweitern
  const [filters, setFilters] = useState<StoryFilters>({
    theme: undefined,
    age: undefined,
    readingTime: undefined,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Datenabruf für den Katalog (useQuery bleibt gleich, da es 'filters' verwendet)
  const { data: stories, isLoading: isLoadingCatalog, error: catalogError, isError: isCatalogError } = useQuery({
    queryKey: ['stories', filters],
    queryFn: () => fetchStoryCatalog(filters),
  });

  // Mutation für das Generieren und Speichern (nimmt jetzt StoryGenerationData entgegen)
  const { mutate: generateStoryMutation, isPending: isGenerating } = useMutation({
    mutationFn: (data: StoryGenerationData) => generateAndSaveStory(data), // Übergibt das ganze Objekt
    onSuccess: (newStory) => {
      toast.success(`Geschichte "${newStory.title}" erfolgreich erstellt!`);
      // Invalidiere die 'stories'-Abfrage, um die Liste neu zu laden (inkl. Filter, falls nötig)
      // queryClient.invalidateQueries({ queryKey: ['stories', filters] }); // Genauer invalidieren
      queryClient.invalidateQueries({ queryKey: ['stories'] }); // Einfach alle Stories invalidieren
    },
    onError: (error) => { // Nur ein onError-Handler
      console.error("Fehler beim Erstellen der Geschichte:", error);
      toast.error(`Fehler: ${error.message || 'Geschichte konnte nicht erstellt werden.'}`);
    },
  });

  // Nimmt jetzt das StoryGenerationData Objekt entgegen
  const handleGenerateSubmit = async (data: StoryGenerationData) => {
    generateStoryMutation(data);
  };

  // Einfache Textfilterung
  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.themes?.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase())) // Suche auch in Themen
  );

  // Handler für Filteränderungen
  const handleFilterChange = (filterName: keyof StoryFilters, value: string | undefined) => {
    // Wenn 'all' ausgewählt wird, setze den Filter auf undefined
    const actualValue = value === 'all' ? undefined : value;
    setFilters(prev => ({ ...prev, [filterName]: actualValue }));
  };


  // Beispiel-Optionen für Filter
  const availableThemes = ['Freundschaft', 'Mut', 'Abenteuer', 'Gemeinschaft', 'Magie', 'Natur', 'Tiere', 'Jahreszeiten'];
  const ageRanges: { value: AgeRange | 'all', label: string }[] = [
    { value: 'all', label: 'Alle Alter' },
    { value: '3-5', label: '3-5 Jahre' },
    { value: '6-8', label: '6-8 Jahre' },
    { value: '9-12', label: '9-12 Jahre' }, // Beispiel für Erweiterung
  ];
  const readingTimeRanges: { value: ReadingTimeRange | 'all', label: string }[] = [
      { value: 'all', label: 'Alle Lesezeiten' },
      { value: 'short', label: 'Kurz (< 5 Min)' },
      { value: 'medium', label: 'Mittel (5-10 Min)' },
      { value: 'long', label: 'Lang (> 10 Min)' },
  ];

  return (
    <>
      <Navbar />
      <div className="container py-8 mx-auto">
        {/* Hero-Bereich */}
        <KinderweltHero />

        {/* Main content wrapper with white background, padding, shadow */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-12"> {/* Added wrapper */}
          {/* Überschrift für Katalog */}
          <h2 className="mb-8 text-2xl font-semibold tracking-tight border-b pb-4"> {/* Added border-bottom */}
            Entdecke unsere Geschichten
          </h2>

          {/* Filterbereich - Removed background/shadow/border, now handled by parent */}
          <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-4"> {/* Adjusted mb */}
            {/* Suchfeld */}
            <div className="md:col-span-4">
              <Label htmlFor="search">Suche nach Titel oder Thema</Label>
             <Input
               id="search"
               placeholder="z.B. Abenteuer, Fuchs..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="mt-1"
             />
         </div>

         {/* Themen Filter */}
         <div>
            <Label htmlFor="theme-filter">Thema</Label>
            <Select
                onValueChange={(value) => handleFilterChange('theme', value)}
                value={filters.theme || 'all'}
            >
              <SelectTrigger id="theme-filter" className="mt-1">
                <SelectValue placeholder="Thema wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Themen</SelectItem>
                {availableThemes.map(theme => (
                  <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                ))}
              </SelectContent>
            </Select>
         </div>

         {/* Alter Filter */}
         <div>
             <Label htmlFor="age-filter">Alter</Label>
             <Select
                 onValueChange={(value) => handleFilterChange('age', value as AgeRange | 'all')}
                 value={filters.age || 'all'}
             >
               <SelectTrigger id="age-filter" className="mt-1">
                <SelectValue placeholder="Alter wählen" />
               </SelectTrigger>
               <SelectContent>
                 {ageRanges.map(range => (
                   <SelectItem key={range.value} value={String(range.value)}>{range.label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
         </div>

         {/* Lesezeit Filter */}
         <div>
             <Label htmlFor="reading-time-filter">Lesezeit</Label>
             <Select
                 onValueChange={(value) => handleFilterChange('readingTime', value as ReadingTimeRange | 'all')}
                 value={filters.readingTime || 'all'}
             >
               <SelectTrigger id="reading-time-filter" className="mt-1">
                <SelectValue placeholder="Lesezeit wählen" />
               </SelectTrigger>
               <SelectContent>
                 {readingTimeRanges.map(range => (
                   <SelectItem key={range.value} value={String(range.value)}>{range.label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
            </div>
          </div>

          {/* Anzeige der Geschichten */}
          {/* Hinweis: Die Client-seitige Filterung nach searchTerm bleibt erhalten. */}
      {/* Die Filterung nach Thema, Alter, Lesezeit erfolgt jetzt primär durch die API via useQuery */}
      {isLoadingCatalog && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[192px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isCatalogError && (
         <Alert variant="destructive">
           <Terminal className="w-4 h-4" />
           <AlertTitle>Fehler beim Laden</AlertTitle>
           <AlertDescription>
             Die Geschichten konnten nicht geladen werden. ({catalogError?.message})
           </AlertDescription>
         </Alert>
      )}

      {!isLoadingCatalog && !isCatalogError && filteredStories && filteredStories.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}

      {!isLoadingCatalog && !isCatalogError && (!filteredStories || filteredStories.length === 0) && (
        <div className="mt-12 text-center text-muted-foreground">
          <p>Keine Geschichten gefunden.</p>
          {/* Optional: Hinweis, eine neue Geschichte zu generieren */}
          <p className="mt-2 text-sm">Keine passenden Geschichten gefunden. Versuche andere Filter oder erstelle unten eine neue Geschichte!</p>
        </div>
      )}

      {/* Formular zum Generieren (verschoben) - Mehr Abstand nach oben */}
      <div className="mt-16 border-t pt-12"> {/* mt und pt erhöht */}
        <h2 className="mb-8 text-2xl font-semibold tracking-tight"> {/* mb erhöht */}
          Erstelle deine eigene Geschichte!
        </h2>
        <StoryGeneratorForm onSubmit={handleGenerateSubmit} isLoading={isGenerating} />
      </div>
      </div> {/* Closing main content wrapper */}
    </div> {/* Closing container */}
    <Footer />
    </>
  );
};

export default KinderweltKatalogPage;
