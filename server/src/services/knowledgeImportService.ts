// Typdefinitionen für Knowledge-Posts
export interface KnowledgeCategoryOrTag {
    id: number;
    name: string;
    slug: string;
}

export interface KnowledgeAuthor {
    id: number;
    name: string;
    url?: string;
    description?: string;
    [key: string]: any; // Für optionale Felder, da API inkonsistent sein kann
}

export interface KnowledgePost {
    id: number;
    source_link: string;
    slug: string;
    full_path: string | null;
    title: string;
    content_rendered: string;
    excerpt_rendered: string;
    date_published: string | null;
    date_modified: string | null;
    categories: number[];
    tags: number[];
    featured_media_id: number | null;
    featured_media_url: string | null;
    authors: KnowledgeAuthor | null;
    category_terms: KnowledgeCategoryOrTag[] | null;
    tag_terms: KnowledgeCategoryOrTag[] | null;
    breadcrumbs: any; // Kann später typisiert werden, falls benötigt
    yoast_json: any;  // Kann später typisiert werden, falls benötigt
    imported_at: string;
}

import fetch from 'node-fetch';
import { supabase } from '../supabaseServiceRoleClient.js'; // Import geändert

// Vorschau der ersten 5 Knowledge-Posts holen
export interface KnowledgePreview {
    id: number;
    title: string;
    link: string;
    slug: string;
    date: string;
    modified: string;
    excerpt: string;
    content: string;
    categories: number[];
    tags: number[];
    featured_media: number;
    yoast: any;
}

export async function fetchKnowledgePreview(): Promise<KnowledgePreview[]> {
    const apiUrl = 'https://www.kita.de/wissen/wp-json/wp/v2/posts?per_page=5';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch knowledge preview: ${response.status} ${response.statusText}`);
    }
    const posts = await response.json() as any[];

    return posts.map((post: any) => ({
        id: post.id,
        title: post.title?.rendered,
        link: post.link,
        slug: post.slug,
        date: post.date,
        modified: post.modified,
        excerpt: post.excerpt?.rendered,
        content: post.content?.rendered,
        categories: post.categories,
        tags: post.tags,
        featured_media: post.featured_media,
        yoast: post.yoast_head_json ?? null,
    }));
}

/**
 * Knowledge-Posts importieren & in Supabase speichern
 * Gibt im Dry-Run-Modus ein Array von KnowledgePost zurück, sonst Anzahl gespeicherter Zeilen oder null.
 */
export async function importKnowledgePosts(
    limit = 20,
    dryRun = true
): Promise<KnowledgePost[] | number | null> {
    // _embed hinzufügen, um Kategorie/Tag-Namen zu erhalten
    const apiUrl = `https://www.kita.de/wissen/wp-json/wp/v2/posts?per_page=${limit}&_embed`; 
    console.log(`[Knowledge Import] Fetching URL: ${apiUrl}`); // Log URL
    const response = await fetch(apiUrl);
    if (!response.ok) {
        // Log error response body if possible
        const errorBody = await response.text().catch(() => 'Could not read error body');
        console.error(`[Knowledge Import] API Error ${response.status} ${response.statusText}: ${errorBody}`);
        throw new Error(`Failed to fetch knowledge posts: ${response.status} ${response.statusText}`);
    }
    const posts = await response.json() as any[];

    const transformed: KnowledgePost[] = posts.map((post: any, index: number) => { // Index hinzufügen für Logging
        const yoast = post.yoast_head_json ?? null;
        const embedded = post._embedded ?? {};
        let categoryTerms: KnowledgeCategoryOrTag[] = [];
        let tagTerms: KnowledgeCategoryOrTag[] = [];
        let authorsData: KnowledgeAuthor | null = null;

        // Versuche, Kategorien und Tags zu extrahieren
        if (embedded['wp:term'] && Array.isArray(embedded['wp:term'])) {
            const terms = embedded['wp:term'].flat();
            categoryTerms = terms
                .filter((term: any) => term?.taxonomy === 'category')
                .map((term: any) => ({ id: term.id, name: term.name, slug: term.slug }));
            tagTerms = terms
                .filter((term: any) => term?.taxonomy === 'post_tag')
                .map((term: any) => ({ id: term.id, name: term.name, slug: term.slug }));
            if (index < 3) {
                console.log(`[Knowledge Import] Post ${post.id} (Index ${index}): Found ${categoryTerms.length} categories, ${tagTerms.length} tags in wp:term.`);
            }
        } else if (index < 3) {
            console.log(`[Knowledge Import] Post ${post.id} (Index ${index}): No 'wp:term' array found in _embedded data.`);
        }

        if (embedded.author && Array.isArray(embedded.author) && embedded.author.length > 0) {
            authorsData = embedded.author[0];
            if (index < 3) {
                console.log(`[Knowledge Import] Post ${post.id} (Index ${index}): Found author data.`);
            }
        } else if (index < 3) {
            console.log(`[Knowledge Import] Post ${post.id} (Index ${index}): No 'author' array found in _embedded data.`);
        }


        let full_path = null;
        try {
            if (post.link) {
                const url = new URL(post.link);
                // Extrahiere den Pfadteil nach der Domain, behalte führenden und optionalen abschließenden Slash
                full_path = url.pathname; 
                if (!full_path.endsWith('/')) {
                    full_path += '/'; // Stelle sicher, dass der Pfad mit / endet
                }
                 // Entferne /wissen/ am Anfang, falls vorhanden, da wir es später hinzufügen
                if (full_path.startsWith('/wissen/')) {
                    full_path = full_path.substring('/wissen'.length);
                }

                console.log(`[Knowledge Import] Extracted full_path for post ${post.id}: ${full_path}`);
            } else {
                 console.warn(`[Knowledge Import] Missing link for post ${post.id}, cannot generate full_path.`);
                 full_path = `/${post.slug ?? post.id}/`; // Fallback, falls kein Link vorhanden
            }
        } catch (e) {
            console.error(`[Knowledge Import] Error parsing link URL for post ${post.id}:`, e);
            full_path = `/${post.slug ?? post.id}/`; // Fallback bei Fehler
        }


        return {
            id: post.id,
            source_link: post.link,
            slug: post.slug,
            full_path: full_path, // Speichere den extrahierten Pfad (ohne /wissen/)
            title: post.title?.rendered ?? '',
            content_rendered: post.content?.rendered ?? '',
            excerpt_rendered: post.excerpt?.rendered ?? '',
            date_published: post.date ? new Date(post.date).toISOString() : null,
            date_modified: post.modified ? new Date(post.modified).toISOString() : null,
            categories: post.categories ?? [],
            tags: post.tags ?? [],
            featured_media_id: post.featured_media ?? null,
            featured_media_url: embedded['wp:featuredmedia']?.[0]?.source_url ?? null, // Versuche, die URL aus _embedded zu holen
            authors: authorsData, // Verwende die extrahierten Autorendaten
            category_terms: categoryTerms.length > 0 ? categoryTerms : null, // Speichere null, wenn leer
            tag_terms: tagTerms.length > 0 ? tagTerms : null,           // Speichere null, wenn leer
            breadcrumbs: null, 
            yoast_json: yoast, 
            imported_at: new Date().toISOString(),
        };
    });

    if (dryRun) {
        console.log(`[Knowledge Import] Dry run aktiviert, ${transformed.length} Posts nur gelesen, nicht gespeichert.`);
        // Log first 3 transformed items for dry run preview
        console.log('[Knowledge Import] Dry run preview data (first 3):', JSON.stringify(transformed.slice(0, 3), null, 2));
        return transformed;
    }

    // Log data before upserting
    console.log(`[Knowledge Import] Attempting to upsert ${transformed.length} posts.`);
    // Log first 3 posts data before upsert
    if (transformed.length > 0) {
         console.log('[Knowledge Import] Example post data before upsert (first 3):', JSON.stringify(transformed.slice(0, 3), null, 2));
     }

     console.log(`[Knowledge Import] Calling supabase.upsert for ${transformed.length} posts...`);
     const { data, error } = await supabase
         .from('knowledge_posts')
         .upsert(transformed, { onConflict: 'id' })
         .select();

     if (error) {
         console.error(`[Knowledge Import] Supabase upsert error: ${error.message}`);
         console.error('[Knowledge Import] Supabase error details:', JSON.stringify(error, null, 2));
         const postIds = transformed.map(p => p.id).join(', ');
         console.error(`[Knowledge Import] Attempted to upsert posts with IDs: ${postIds}`);
         throw error;
     } else {
         const count = data?.length ?? 0;
         console.log(`[Knowledge Import] Supabase upsert successful. ${count} rows returned by select().`);
         if (data && data.length > 0) {
             const successfulIds = data.map((row: { id: number }) => row.id).join(', ');
             console.log(`[Knowledge Import] IDs returned by select(): ${successfulIds}`);
             if (transformed.length !== count) {
                 console.warn(`[Knowledge Import] Mismatch: Sent ${transformed.length} posts, but Supabase returned ${count} rows.`);
             }
         } else {
             console.warn('[Knowledge Import] Supabase returned no data after upsert, although no error was reported.');
         }
         return count;
     }
}
