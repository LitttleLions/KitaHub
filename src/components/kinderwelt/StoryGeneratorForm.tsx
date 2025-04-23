// src/components/kinderwelt/StoryGeneratorForm.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Select importiert
import { Loader2 } from 'lucide-react'; // Für Ladeanzeige
import { AgeRange, ReadingTimeRange } from '@/types/kinderwelt'; // Typen importiert

// Datenstruktur für die Übergabe an die onSubmit-Funktion (exportiert)
export interface StoryGenerationData {
  prompt: string;
  targetAge?: AgeRange;
  targetReadingTime?: ReadingTimeRange;
  targetTheme?: string;
}

interface StoryGeneratorFormProps {
  onSubmit: (data: StoryGenerationData) => Promise<void>; // Nimmt nun ein Objekt entgegen
  isLoading: boolean; // Zeigt an, ob der Generierungsprozess läuft
}

// Optionen für die Auswahlfelder (ähnlich wie in KinderweltKatalogPage)
const availableThemes = ['Freundschaft', 'Mut', 'Abenteuer', 'Gemeinschaft', 'Magie', 'Natur', 'Tiere', 'Jahreszeiten'];
const ageRanges: { value: AgeRange | 'any', label: string }[] = [
  { value: 'any', label: 'Beliebiges Alter' },
  { value: '3-5', label: '3-5 Jahre' },
  { value: '6-8', label: '6-8 Jahre' },
  { value: '9-12', label: '9-12 Jahre' },
];
const readingTimeRanges: { value: ReadingTimeRange | 'any', label: string }[] = [
    { value: 'any', label: 'Beliebige Lesezeit' },
    { value: 'short', label: 'Kurz (< 5 Min)' },
    { value: 'medium', label: 'Mittel (5-10 Min)' },
    { value: 'long', label: 'Lang (> 10 Min)' },
];


const StoryGeneratorForm: React.FC<StoryGeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [targetAge, setTargetAge] = useState<AgeRange | 'any'>('any');
  const [targetReadingTime, setTargetReadingTime] = useState<ReadingTimeRange | 'any'>('any');
  const [targetTheme, setTargetTheme] = useState<string | 'any'>('any');


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim() || isLoading) {
      return; // Verhindere leere Eingaben oder doppelte Submits
    }

    const data: StoryGenerationData = {
      prompt: prompt.trim(),
      targetAge: targetAge === 'any' ? undefined : targetAge,
      targetReadingTime: targetReadingTime === 'any' ? undefined : targetReadingTime,
      targetTheme: targetTheme === 'any' ? undefined : targetTheme,
    };

    await onSubmit(data);
    // Optional: Formular nach dem Absenden leeren
    // setPrompt('');
    // setTargetAge('any');
    // setTargetReadingTime('any');
    // setTargetTheme('any');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mb-8 border rounded-lg shadow-sm bg-white">
      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        Erzähl mir eine Geschichte über...
      </h2>
      <div className="space-y-4">
        {/* Prompt Input */}
        <div>
          <Label htmlFor="story-prompt" className="text-sm font-medium text-gray-600">
            Themen oder Stichwörter (z.B. "ein mutiger Bär im Wald", "Freundschaft zwischen Katze und Maus") <span className="text-red-500">*</span>
          </Label>
          <Input
            id="story-prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Gib hier deine Ideen ein..."
            required
            disabled={isLoading}
            className="mt-1"
          />
        </div>

        {/* Auswahlfelder für Filter */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Alter */}
          <div>
            <Label htmlFor="target-age">Zielalter</Label>
            <Select
              value={targetAge}
              onValueChange={(value) => setTargetAge(value as AgeRange | 'any')}
              disabled={isLoading}
            >
              <SelectTrigger id="target-age" className="mt-1">
                <SelectValue placeholder="Alter wählen" />
              </SelectTrigger>
              <SelectContent>
                {ageRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lesezeit */}
          <div>
            <Label htmlFor="target-reading-time">Lesezeit</Label>
            <Select
              value={targetReadingTime}
              onValueChange={(value) => setTargetReadingTime(value as ReadingTimeRange | 'any')}
              disabled={isLoading}
            >
              <SelectTrigger id="target-reading-time" className="mt-1">
                <SelectValue placeholder="Lesezeit wählen" />
              </SelectTrigger>
              <SelectContent>
                {readingTimeRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Thema */}
          <div>
            <Label htmlFor="target-theme">Thema</Label>
            <Select
              value={targetTheme}
              onValueChange={(value) => setTargetTheme(value)}
              disabled={isLoading}
            >
              <SelectTrigger id="target-theme" className="mt-1">
                <SelectValue placeholder="Thema wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Beliebiges Thema</SelectItem>
                {availableThemes.map(theme => (
                  <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Geschichte wird erstellt...
            </>
          ) : (
            'Geschichte erstellen'
          )}
        </Button>
      </div>
    </form>
  );
};

export default StoryGeneratorForm;
