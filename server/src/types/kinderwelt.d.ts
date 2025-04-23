// server/src/types/kinderwelt.d.ts

/**
 * Repräsentiert die Struktur eines Story-Datensatzes in der Datenbank.
 * Entspricht der 'stories'-Tabelle.
 */
export interface StoryRecord {
  id: string; // UUID
  slug: string;
  title: string;
  cover_image_url?: string | null;
  content_text: string;
  // audio_url?: string | null; // Kommt später
  // pdf_url?: string | null; // Kommt später
  target_age_min?: number | null;
  target_age_max?: number | null;
  reading_time_minutes?: number | null;
  themes?: string[] | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  openai_prompt?: string | null;
  created_at: string; // ISO 8601 timestamp string
  updated_at: string; // ISO 8601 timestamp string
}

/**
 * Typ für die Daten, die zum Erstellen einer neuen Story benötigt werden.
 * (Kann später für einen Admin-Endpunkt verwendet werden)
 */
export interface CreateStoryPayload {
  title: string;
  slug: string; // Sollte idealerweise automatisch generiert werden
  content_text: string;
  cover_image_url?: string;
  inline_image_urls?: string[]; // Hinzugefügt für Bilder im Text
  target_age_min?: number;
  target_age_max?: number;
  reading_time_minutes?: number;
  themes?: string[];
  seo_description?: string;
  seo_keywords?: string[];
  openai_prompt?: string;
}

/**
 * Typ für Filteroptionen bei der Abfrage des Katalogs über die API.
 */
export interface StoryApiFilters {
  theme?: string;
  age?: string; // Als String, da Query-Parameter Strings sind
  readingTime?: string; // Als String
  limit?: string; // Für Paginierung
  offset?: string; // Für Paginierung
}
