// src/types/kinderwelt.ts

/**
 * Repräsentiert die Metadaten und Inhalte einer einzelnen Kindergeschichte.
 */
export interface Story {
  id: string; // Eindeutige ID der Geschichte (z.B. UUID)
  slug: string; // SEO-freundlicher Bezeichner für die URL
  title: string; // Titel der Geschichte
  cover_image_url?: string | null; // URL des Titelbilds
  inline_image_urls?: string[] | null; // URLs für Bilder innerhalb der Geschichte
  content_text: string; // Der Text der Geschichte (kann HTML enthalten)
  audio_url?: string | null; // URL zur Vorlese-Audiodatei
  pdf_url?: string | null; // URL zur druckfreundlichen PDF-Version
  target_age_min?: number | null; // Mindestalter-Empfehlung
  target_age_max?: number | null; // Höchstalter-Empfehlung
  reading_time_minutes?: number | null; // Geschätzte Lesedauer in Minuten
  themes?: string[] | null; // Themen/Schlagwörter (z.B. ["Freundschaft", "Natur"])
  seo_description?: string | null; // Meta-Beschreibung für SEO
  seo_keywords?: string[] | null; // Keywords für SEO
  created_at: string; // Zeitstempel der Erstellung
  // Optional: Felder für interaktive Elemente (MVP++)
  // quiz_data?: any;
  // coloring_page_url?: string;
}

/**
 * Definiert die möglichen Werte für den Altersfilter.
 * '3-5' bedeutet 3 bis 5 Jahre.
 */
export type AgeRange = '3-5' | '6-8' | '9-12';

/**
 * Definiert die möglichen Werte für den Lesezeitfilter.
 * 'short' < 5 Min, 'medium' 5-10 Min, 'long' > 10 Min.
 */
export type ReadingTimeRange = 'short' | 'medium' | 'long';


/**
 * Repräsentiert die Filteroptionen für den Geschichten-Katalog,
 * wie sie von der UI verwendet und an die API gesendet werden.
 */
export interface StoryFilters {
  age?: AgeRange; // Alter als definierter Bereich
  readingTime?: ReadingTimeRange; // Lesezeit als definierter Bereich
  theme?: string; // Nach spezifischem Thema filtern
  limit?: number; // Anzahl der Ergebnisse begrenzen
  offset?: number; // Für Paginierung (optional)
}

// Datenstruktur für die Generierungsanfrage vom Frontend
export interface StoryGenerationData {
  prompt: string;
  targetAge?: AgeRange;
  targetReadingTime?: ReadingTimeRange;
  targetTheme?: string;
}
