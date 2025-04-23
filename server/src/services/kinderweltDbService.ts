// server/src/services/kinderweltDbService.ts
import { supabase } from '../supabaseServiceRoleClient.js'; // Import geändert
import { StoryRecord, StoryApiFilters, CreateStoryPayload } from '../types/kinderwelt.js'; // .js Endung hinzufügen

/**
 * Ruft eine Liste von Geschichten aus der Datenbank ab, optional gefiltert und paginiert.
 * @param filters - Filter- und Paginierungsoptionen.
 * @returns Ein Promise, das zu einem Array von StoryRecord-Objekten auflöst.
 */
export const getStories = async (filters: StoryApiFilters = {}): Promise<StoryRecord[]> => {
  let query = supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false }); // Standardmäßig nach Erstellungsdatum sortieren

  // Filter anwenden
  if (filters.theme) {
    // Filtert, wenn das 'themes'-Array das angegebene Thema enthält
    query = query.contains('themes', [filters.theme]);
  }
  // Alter-Filter (AgeRange)
  if (filters.age) {
    switch (filters.age) {
      case '3-5':
        query = query.gte('target_age_min', 3).lte('target_age_max', 5);
        // Oder eine flexiblere Logik, die Überlappungen zulässt:
        // query = query.lte('target_age_min', 5).gte('target_age_max', 3);
        break;
      case '6-8':
        query = query.gte('target_age_min', 6).lte('target_age_max', 8);
        // query = query.lte('target_age_min', 8).gte('target_age_max', 6);
        break;
      case '9-12':
        query = query.gte('target_age_min', 9).lte('target_age_max', 12);
        // query = query.lte('target_age_min', 12).gte('target_age_max', 9);
        break;
      // Füge hier bei Bedarf weitere Bereiche hinzu
    }
  }
  // Lesezeit-Filter (ReadingTimeRange)
  if (filters.readingTime) {
    switch (filters.readingTime) {
      case 'short': // < 5 Min
        query = query.lt('reading_time_minutes', 5);
        break;
      case 'medium': // 5-10 Min
        query = query.gte('reading_time_minutes', 5).lte('reading_time_minutes', 10);
        break;
      case 'long': // > 10 Min
        query = query.gt('reading_time_minutes', 10);
        break;
    }
  }

  // Paginierung anwenden
  const limit = filters.limit ? parseInt(filters.limit, 10) : 20; // Standard-Limit 20
  const offset = filters.offset ? parseInt(filters.offset, 10) : 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching stories:', error);
    throw new Error('Fehler beim Abrufen der Geschichten aus der Datenbank.');
  }

  return data || [];
};

/**
 * Ruft eine einzelne Geschichte anhand ihres Slugs aus der Datenbank ab.
 * @param slug - Der SEO-freundliche Slug der Geschichte.
 * @returns Ein Promise, das zum StoryRecord-Objekt auflöst, oder null, wenn nicht gefunden.
 */
export const getStoryBySlug = async (slug: string): Promise<StoryRecord | null> => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle(); // Gibt null zurück, wenn kein Eintrag gefunden wird

  if (error) {
    console.error(`Error fetching story with slug ${slug}:`, error);
    throw new Error('Fehler beim Abrufen der Geschichte aus der Datenbank.');
  }

  return data;
};

/**
 * Erstellt einen neuen Story-Eintrag in der Datenbank.
 * (Wird später für den Admin-Bereich oder einen Generierungs-Endpunkt benötigt)
 * @param payload - Die Daten für die neue Geschichte.
 * @returns Ein Promise, das zum neu erstellten StoryRecord-Objekt auflöst.
 */
export const createStory = async (payload: CreateStoryPayload): Promise<StoryRecord> => {
    // Hier könnte noch Logik zur Slug-Generierung oder Validierung hinzugefügt werden
    const { data, error } = await supabase
      .from('stories')
      .insert([payload]) // Supabase erwartet ein Array
      .select()
      .single(); // Gibt den neu erstellten Datensatz zurück

    if (error) {
      console.error('Error creating story:', error);
      throw new Error('Fehler beim Erstellen der Geschichte in der Datenbank.');
    }
    if (!data) {
        throw new Error('Konnte die erstellte Geschichte nicht abrufen.');
    }

    return data;
};

// Zukünftige Funktionen könnten sein:
// - updateStory(id: string, payload: Partial<CreateStoryPayload>): Promise<StoryRecord>
// - deleteStory(id: string): Promise<void>
// - getAvailableThemes(): Promise<string[]>
// ... etc.
