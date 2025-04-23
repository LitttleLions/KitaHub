-- supabase/stories_table.sql

-- Tabelle für Kindergeschichten erstellen
CREATE TABLE IF NOT EXISTS public.stories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Eindeutige ID
    slug character varying(255) NOT NULL UNIQUE, -- SEO-freundlicher Bezeichner für URL
    title character varying(255) NOT NULL, -- Titel der Geschichte
    cover_image_url text, -- URL des Titelbilds (optional)
    inline_image_urls text[], -- URLs für Bilder innerhalb der Geschichte (optional, Array von Text)
    content_text text NOT NULL, -- Der Text der Geschichte
    -- audio_url text, -- URL zur Vorlese-Audiodatei (optional, kommt später)
    -- pdf_url text, -- URL zur druckfreundlichen PDF-Version (optional, kommt später)
    target_age_min integer, -- Mindestalter-Empfehlung (für Filterung, optional)
    target_age_max integer, -- Höchstalter-Empfehlung (für Filterung, optional)
    reading_time_minutes integer, -- Geschätzte Lesedauer in Minuten (für Filterung, optional)
    themes text[], -- Themen/Schlagwörter (für Filterung, optional, Array von Text)
    seo_description character varying(160), -- Meta-Beschreibung für SEO (optional, max 160 Zeichen)
    seo_keywords text[], -- Keywords für SEO (optional, Array von Text)
    openai_prompt text, -- Der Prompt, der zur Generierung verwendet wurde (optional, für interne Zwecke)
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, -- Zeitstempel der Erstellung
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL -- Zeitstempel der letzten Aktualisierung
);

-- Optional: Indizes für häufig verwendete Filter hinzufügen
CREATE INDEX IF NOT EXISTS idx_stories_slug ON public.stories USING btree (slug);
CREATE INDEX IF NOT EXISTS idx_stories_themes ON public.stories USING gin (themes); -- GIN-Index für Array-Suche

-- RLS (Row Level Security) aktivieren (WICHTIG für Supabase)
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Beispiel-Policy: Erlaube Lesezugriff für alle (anonyme und authentifizierte Nutzer)
-- ACHTUNG: Für Schreibzugriff (z.B. durch Admins) sind spezifischere Policies nötig!
CREATE POLICY "Allow public read access" ON public.stories
    FOR SELECT
    USING (true);

-- Trigger-Funktion, um updated_at automatisch zu aktualisieren
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger zur Tabelle hinzufügen
DROP TRIGGER IF EXISTS on_stories_updated ON public.stories; -- Erst löschen, falls schon vorhanden
CREATE TRIGGER on_stories_updated
  BEFORE UPDATE ON public.stories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Kommentar zur Tabelle hinzufügen
COMMENT ON TABLE public.stories IS 'Speichert Kindergeschichten für den Kinderwelt-Bereich.';
