CREATE TABLE IF NOT EXISTS knowledge_posts (
    id bigint PRIMARY KEY, -- WP-Post-ID
    source_link text NOT NULL,
    slug text NOT NULL,
    full_path text,
    title text NOT NULL,
    content_rendered text,
    excerpt_rendered text,
    date_published timestamptz,
    date_modified timestamptz,
    categories int[],
    tags int[],
    featured_media_id bigint,
    featured_media_url text,
    authors jsonb,
    category_terms jsonb, -- Hinzugefügt für Kategorie-Namen/Slugs
    tag_terms jsonb,      -- Hinzugefügt für Tag-Namen/Slugs
    breadcrumbs jsonb,
    yoast_json jsonb,
    imported_at timestamptz DEFAULT now()
);

-- Index für schnelle Suche nach Slug/Pfad
CREATE INDEX IF NOT EXISTS idx_knowledge_posts_slug ON knowledge_posts(slug);
CREATE INDEX IF NOT EXISTS idx_knowledge_posts_full_path ON knowledge_posts(full_path);

-- Optional: Index auf Veröffentlichungsdatum
CREATE INDEX IF NOT EXISTS idx_knowledge_posts_date_published ON knowledge_posts(date_published);
