// src/services/kinderweltService.ts
import { Story, StoryFilters } from '@/types/kinderwelt';

// Basis-URL für die Kinderwelt-API (Annahme: Backend läuft auf Port 3000)
const API_BASE_URL = 'http://localhost:3000/api/kinderwelt'; 

/**
 * Ruft den Katalog der Kindergeschichten vom Backend ab, optional gefiltert.
 * @param filters - Optionale Filterkriterien.
 * @returns Ein Promise, das zu einem Array von Story-Objekten auflöst.
 */
export const fetchStoryCatalog = async (filters?: StoryFilters): Promise<Story[]> => {
  console.log('Fetching story catalog with filters:', filters);
  
  // Bereinige Filter für URLSearchParams (entferne undefined Werte)
  const cleanFilters: Record<string, string> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanFilters[key] = String(value);
      }
    });
  }
  
  const queryParams = new URLSearchParams(cleanFilters).toString();
  const url = `${API_BASE_URL}${queryParams ? `?${queryParams}` : ''}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Versuche, Fehlermeldung vom Backend zu lesen
      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler beim Abrufen des Katalogs.' }));
      throw new Error(errorData.message || `HTTP-Fehler ${response.status}`);
    }
    const data: Story[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchStoryCatalog:', error);
    // Wirf den Fehler weiter, damit React Query ihn behandeln kann
    throw error;
  }
};

/**
 * Ruft eine einzelne Kindergeschichte anhand ihres Slugs vom Backend ab.
 * @param slug - Der SEO-freundliche Slug der Geschichte.
 * @returns Ein Promise, das zum Story-Objekt auflöst, oder null, wenn nicht gefunden.
 */
export const fetchStoryBySlug = async (slug: string): Promise<Story | null> => {
  console.log('Fetching story by slug:', slug);
  const url = `${API_BASE_URL}/${slug}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Geschichte nicht gefunden
      }
      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler beim Abrufen der Geschichte.' }));
      throw new Error(errorData.message || `HTTP-Fehler ${response.status}`);
    }
    const data: Story = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchStoryBySlug for slug ${slug}:`, error);
    throw error; // Wirf den Fehler weiter
  }
}; // Fehlende schließende Klammer für fetchStoryBySlug

// Importiere die Datenstruktur (korrekte Position und Pfad)
import { StoryGenerationData } from '@/types/kinderwelt'; 

/**
 * Sendet Daten (Prompt und optionale Zielvorgaben) an das Backend, um eine Geschichte zu generieren und zu speichern.
 * @param data - Ein Objekt mit dem Prompt und optionalen Zielvorgaben (Alter, Lesezeit, Thema).
 * @returns Ein Promise, das zum neu erstellten Story-Objekt auflöst.
 * @throws Wirft einen Fehler, wenn die Anfrage fehlschlägt.
 */
export const generateAndSaveStory = async (data: StoryGenerationData): Promise<Story> => {
  console.log('Generating story with data:', data);
  const url = `${API_BASE_URL}/generate-and-save`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Sende das gesamte Datenobjekt an das Backend
      body: JSON.stringify(data), 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler beim Generieren der Geschichte.' }));
      throw new Error(errorData.message || `HTTP-Fehler ${response.status}`);
    }

    const newStory: Story = await response.json();
    console.log('Successfully generated and saved story:', newStory);
    return newStory;

  } catch (error) {
    console.error('Error in generateAndSaveStory:', error);
    throw error; // Wirf den Fehler weiter
  }
};


// Zukünftige Funktionen könnten sein:
// - fetchStoryThemes(): Gibt alle verfügbaren Themen zurück
// - fetchStoryAges(): Gibt alle verfügbaren Altersgruppen zurück
// - fetchStoryReadingTimes(): Gibt alle verfügbaren Lesezeiten zurück
