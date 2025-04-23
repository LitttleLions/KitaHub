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
import { addLog, updateJobStatus } from './importStatusService.js'; // Import status service functions

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
 * Searches WordPress knowledge posts via the REST API.
 * @param searchTerm The term to search for.
 * @returns A promise resolving to an array of found posts with minimal details. Handles exact search if searchTerm is wrapped in double quotes.
 */
export async function searchWordPressKnowledgePosts(searchTerm: string): Promise<{id: number, title: string, slug: string, link: string}[]> {
    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }

    let effectiveSearchTerm = searchTerm.trim();
    let exactMatchRequired = false;

    // Check for exact match convention (wrapped in double quotes)
    if (effectiveSearchTerm.startsWith('"') && effectiveSearchTerm.endsWith('"') && effectiveSearchTerm.length > 2) {
        exactMatchRequired = true;
        effectiveSearchTerm = effectiveSearchTerm.substring(1, effectiveSearchTerm.length - 1); // Remove quotes for API search
        console.log(`[Search WP Knowledge] Exact title match requested for: "${effectiveSearchTerm}"`);
    }

    const encodedSearchTerm = encodeURIComponent(effectiveSearchTerm);
    // Fetch only essential fields for the search result list
    // Increase per_page slightly to have more candidates for exact filtering if needed
    const apiUrl = `https://www.kita.de/wissen/wp-json/wp/v2/posts?search=${encodedSearchTerm}&_fields=id,title,slug,link&per_page=50`;
    console.log(`[Search WP Knowledge] Fetching URL: ${apiUrl} (Exact match required: ${exactMatchRequired})`);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`WordPress API search failed: ${response.status} ${response.statusText}`);
        }
        const posts = await response.json() as any[];
        console.log(`[Search WP Knowledge] API returned ${posts.length} posts for term "${effectiveSearchTerm}".`);

        // Map to the desired simple structure first
        let results = posts.map(post => ({
            id: post.id,
            title: post.title?.rendered ?? 'N/A', // Use rendered title
            slug: post.slug ?? '',
            link: post.link ?? ''
        }));

        // Apply exact title filtering if requested
        if (exactMatchRequired) {
            console.log(`[Search WP Knowledge] Filtering for exact title match: "${effectiveSearchTerm}"`);
            results = results.filter(post => post.title.trim().toLowerCase() === effectiveSearchTerm.toLowerCase());
            console.log(`[Search WP Knowledge] Found ${results.length} posts with exact title match.`);
        }

        // Limit final results if needed (e.g., if exact match wasn't required but API returned many)
        return results.slice(0, 20); // Return max 20 results

    } catch (error) {
        console.error(`[Search WP Knowledge] Error searching posts for term "${effectiveSearchTerm}":`, error);
        // Depending on requirements, you might want to return an empty array or re-throw
        return []; // Return empty array on error for now
    }
}


/**
 * Knowledge-Posts importieren & in Supabase speichern.
 * Holt Posts seitenweise von der WordPress API oder gezielt über IDs/Slugs.
 * Gibt im Dry-Run-Modus ein Array aller verarbeiteten KnowledgePost zurück, sonst die Gesamtzahl
 * der erfolgreich gespeicherten/aktualisierten Zeilen oder null bei Fehlern.
 */
interface ImportOptions {
    limit?: number;
    page?: number;
    totalPagesToFetch?: number;
    postIds?: number[];
    postSlugs?: string[]; // Currently not implemented for fetching, use IDs if possible
    dryRun?: boolean;
}

export async function importKnowledgePosts(
    jobId: string,
    options: ImportOptions
): Promise<KnowledgePost[] | number | null> {
    const {
        limit = 20,
        page = 1,
        totalPagesToFetch = 1,
        postIds,
        // postSlugs, // Fetching by multiple slugs isn't directly supported well, prefer IDs
        dryRun = true
    } = options;

    addLog(jobId, `Starting knowledge import. Options: ${JSON.stringify(options)}`);
    updateJobStatus(jobId, 'running', 'Import gestartet...', 0); // Initial status

    let allTransformedPosts: KnowledgePost[] = [];
    let totalFetchedPosts = 0;

    try { // Wrap the main logic in try-catch

        let postsToProcess: any[] = [];

        // --- Logic Branch: Fetch specific posts or paginate ---
        if (postIds && postIds.length > 0) {
            // --- Fetch specific posts by ID ---
            const progressMessage = `Fetching ${postIds.length} specific posts by ID...`;
            console.log(`[${jobId}] ${progressMessage}`);
            addLog(jobId, progressMessage);
            updateJobStatus(jobId, 'running', progressMessage, 10); // Initial progress

            // WP API allows fetching multiple posts by ID using 'include'
            // We might need to batch this if the number of IDs is very large, but start simple
            const batchSize = 100; // Max posts per request for WP API
            for (let i = 0; i < postIds.length; i += batchSize) {
                const idBatch = postIds.slice(i, i + batchSize);
                const apiUrl = `https://www.kita.de/wissen/wp-json/wp/v2/posts?include=${idBatch.join(',')}&per_page=${idBatch.length}&_embed`;
                console.log(`[${jobId}] Fetching specific posts batch from URL: ${apiUrl}`);
                addLog(jobId, `Fetching batch of ${idBatch.length} posts...`);

                const response = await fetch(apiUrl);
                 if (!response.ok) {
                    const errorBody = await response.text().catch(() => 'Could not read error body');
                    throw new Error(`Failed to fetch specific knowledge posts (IDs: ${idBatch.join(',')}): ${response.status} ${response.statusText} - ${errorBody}`);
                }
                const batchPosts = await response.json() as any[];
                postsToProcess.push(...batchPosts);
                totalFetchedPosts += batchPosts.length;

                // Update progress based on batches fetched
                const progress = Math.round(((i + idBatch.length) / postIds.length) * 80) + 10; // Scale progress within 10-90% range
                updateJobStatus(jobId, 'running', `Fetched ${totalFetchedPosts}/${postIds.length} specific posts...`, progress);
            }
             addLog(jobId, `Finished fetching ${totalFetchedPosts} specific posts.`);

        } else {
            // --- Paginate through posts (existing logic) ---
            let currentPage = page;
            const maxPage = page + totalPagesToFetch - 1;
            const totalPagesEffective = maxPage - page + 1; // Actual number of pages to fetch
            addLog(jobId, `Fetching up to ${totalPagesEffective} pages starting from page ${page}.`);

            while (currentPage <= maxPage) {
                const progress = Math.round(((currentPage - page) / totalPagesEffective) * 80) + 10; // Scale progress within 10-90% range
                const progressMessage = `Seite ${currentPage}/${maxPage} wird abgerufen...`;
                console.log(`[${jobId}] ${progressMessage}`);
                addLog(jobId, progressMessage);
                updateJobStatus(jobId, 'running', progressMessage, progress);

                const apiUrl = `https://www.kita.de/wissen/wp-json/wp/v2/posts?per_page=${limit}&page=${currentPage}&_embed`;
            console.log(`[${jobId}] Fetching from URL: ${apiUrl}`);

            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorBody = await response.text().catch(() => 'Could not read error body');
                const errorMessage = `API Error on page ${currentPage}: ${response.status} ${response.statusText}: ${errorBody}`;
                console.error(`[${jobId}] ${errorMessage}`);
                addLog(jobId, errorMessage, 'error');
                // Decide whether to stop or continue? For now, stop on error.
                throw new Error(`Failed to fetch knowledge posts on page ${currentPage}: ${response.status} ${response.statusText}`);
            }

            const posts = await response.json() as any[];

            if (posts.length === 0) {
                const message = `No more posts found on page ${currentPage}. Stopping fetch loop.`;
                console.log(`[${jobId}] ${message}`);
                addLog(jobId, message);
                break; // Keine Posts mehr auf dieser Seite, Schleife beenden
            }

            totalFetchedPosts += posts.length;
            const processMessage = `Fetched ${posts.length} posts from page ${currentPage}. Total fetched so far: ${totalFetchedPosts}. Processing...`;
            console.log(`[${jobId}] ${processMessage}`);
            addLog(jobId, processMessage);
            // Update progress slightly while processing
            updateJobStatus(jobId, 'running', `Verarbeite ${posts.length} Posts von Seite ${currentPage}...`, progress);


            const transformedPage: KnowledgePost[] = posts.map((post: any, index: number) => { // Index hinzufügen für Logging
            const yoast = post.yoast_head_json ?? null;
        const embedded = post._embedded ?? {};
        let categoryTerms: KnowledgeCategoryOrTag[] = [];
        let tagTerms: KnowledgeCategoryOrTag[] = [];
        let authorsData: KnowledgeAuthor | null = null;
        let breadcrumbData: any[] | null = null; // Initialize breadcrumb data variable

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

        // Extract breadcrumbs from Yoast JSON if available
        try {
            if (yoast?.schema?.['@graph'] && Array.isArray(yoast.schema['@graph'])) {
                const breadcrumbList = yoast.schema['@graph'].find((item: any) => item['@type'] === 'BreadcrumbList');
                if (breadcrumbList?.itemListElement && Array.isArray(breadcrumbList.itemListElement)) {
                    // Extract only necessary fields (name, item)
                    breadcrumbData = breadcrumbList.itemListElement.map((item: any) => ({
                        name: item.name,
                        item: item.item // URL or null for the last item
                    }));
                     if (index < 3) { // Log only for first few posts
                        console.log(`[${jobId}] Post ${post.id} (Index ${index}): Extracted ${breadcrumbData.length} breadcrumbs from Yoast.`);
                    }
                } else if (index < 3) {
                     console.log(`[${jobId}] Post ${post.id} (Index ${index}): BreadcrumbList or itemListElement not found/valid in Yoast schema.`);
                }
            } else if (index < 3) {
                 console.log(`[${jobId}] Post ${post.id} (Index ${index}): Yoast schema graph not found or not an array.`);
            }
        } catch (e) {
             console.error(`[${jobId}] Error processing Yoast breadcrumbs for post ${post.id}:`, e);
             addLog(jobId, `Error processing Yoast breadcrumbs for post ${post.id}: ${e instanceof Error ? e.message : String(e)}`, 'error');
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
                 console.warn(`[${jobId}] Missing link for post ${post.id}, cannot generate full_path.`);
                 addLog(jobId, `Missing link for post ${post.id}, using fallback path.`, 'warn');
                 full_path = `/${post.slug ?? post.id}/`; // Fallback, falls kein Link vorhanden
            }
        } catch (e) {
            console.error(`[${jobId}] Error parsing link URL for post ${post.id}:`, e);
            addLog(jobId, `Error parsing link for post ${post.id}: ${e instanceof Error ? e.message : String(e)}`, 'error');
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
            breadcrumbs: breadcrumbData, // Assign extracted breadcrumbs
            yoast_json: yoast,
            imported_at: new Date().toISOString(),
        };
    });

        allTransformedPosts.push(...transformedPage);
            currentPage++; // Zur nächsten Seite übergehen
            currentPage++; // Zur nächsten Seite übergehen
          } // Ende der while-Schleife
        } // Ende des else-Blocks für Paginierung

        // --- Gemeinsame Verarbeitung nach dem Abrufen ---
        const processStartMessage = `Processing ${postsToProcess.length} fetched posts...`;
        console.log(`[${jobId}] ${processStartMessage}`);
        addLog(jobId, processStartMessage);
        updateJobStatus(jobId, 'running', `Verarbeite ${postsToProcess.length} Posts...`, 90); // Progress before transformation

        allTransformedPosts = postsToProcess.map((post: any, index: number) => { // Index hinzufügen für Logging
            const yoast = post.yoast_head_json ?? null;
            const embedded = post._embedded ?? {};
            let categoryTerms: KnowledgeCategoryOrTag[] = [];
            let tagTerms: KnowledgeCategoryOrTag[] = [];
            let authorsData: KnowledgeAuthor | null = null;
            let breadcrumbData: any[] | null = null; // Initialize breadcrumb data variable

            // Versuche, Kategorien und Tags zu extrahieren
            if (embedded['wp:term'] && Array.isArray(embedded['wp:term'])) {
                const terms = embedded['wp:term'].flat();
                categoryTerms = terms
                    .filter((term: any) => term?.taxonomy === 'category')
                    .map((term: any) => ({ id: term.id, name: term.name, slug: term.slug }));
                tagTerms = terms
                    .filter((term: any) => term?.taxonomy === 'post_tag')
                    .map((term: any) => ({ id: term.id, name: term.name, slug: term.slug }));
                // Optional: Logging removed for brevity after debugging
            }

            if (embedded.author && Array.isArray(embedded.author) && embedded.author.length > 0) {
                authorsData = embedded.author[0];
                 // Optional: Logging removed for brevity after debugging
            }

            // Extract breadcrumbs from Yoast JSON if available
            try {
                if (yoast?.schema?.['@graph'] && Array.isArray(yoast.schema['@graph'])) {
                    const breadcrumbList = yoast.schema['@graph'].find((item: any) => item['@type'] === 'BreadcrumbList');
                    // Check if itemListElement exists and is an array before mapping
                    if (breadcrumbList?.itemListElement && Array.isArray(breadcrumbList.itemListElement)) {
                        breadcrumbData = breadcrumbList.itemListElement.map((item: any) => ({
                            name: item.name,
                            item: item.item // URL or null for the last item
                        }));
                         // Optional: Logging removed for brevity after debugging
                    }
                }
            } catch (e) {
                 console.error(`[${jobId}] Error processing Yoast breadcrumbs for post ${post.id}:`, e);
                 addLog(jobId, `Error processing Yoast breadcrumbs for post ${post.id}: ${e instanceof Error ? e.message : String(e)}`, 'error');
            }


            let full_path = null;
            try {
                if (post.link) {
                    const url = new URL(post.link);
                    full_path = url.pathname;
                    if (!full_path.endsWith('/')) {
                        full_path += '/';
                    }
                    if (full_path.startsWith('/wissen/')) {
                        full_path = full_path.substring('/wissen'.length);
                    }
                    // Optional: Logging removed for brevity after debugging
                } else {
                     console.warn(`[${jobId}] Missing link for post ${post.id}, cannot generate full_path.`);
                     addLog(jobId, `Missing link for post ${post.id}, using fallback path.`, 'warn');
                     full_path = `/${post.slug ?? post.id}/`;
                }
            } catch (e) {
                console.error(`[${jobId}] Error parsing link URL for post ${post.id}:`, e);
                addLog(jobId, `Error parsing link for post ${post.id}: ${e instanceof Error ? e.message : String(e)}`, 'error');
                full_path = `/${post.slug ?? post.id}/`;
            }


            return {
                id: post.id,
                source_link: post.link,
                slug: post.slug,
                full_path: full_path,
                title: post.title?.rendered ?? '',
                content_rendered: post.content?.rendered ?? '',
                excerpt_rendered: post.excerpt?.rendered ?? '',
                date_published: post.date ? new Date(post.date).toISOString() : null,
                date_modified: post.modified ? new Date(post.modified).toISOString() : null,
                categories: post.categories ?? [],
                tags: post.tags ?? [],
                featured_media_id: post.featured_media ?? null,
                featured_media_url: embedded['wp:featuredmedia']?.[0]?.source_url ?? null,
                authors: authorsData,
                category_terms: categoryTerms.length > 0 ? categoryTerms : null,
                tag_terms: tagTerms.length > 0 ? tagTerms : null,
                breadcrumbs: breadcrumbData ?? null, // Ensure null if not found
                yoast_json: yoast,
                imported_at: new Date().toISOString(),
            };
        }); // Ende des map-Blocks

        const fetchFinishMessage = `Finished processing ${allTransformedPosts.length} posts.`;
        console.log(`[${jobId}] ${fetchFinishMessage}`);
        addLog(jobId, fetchFinishMessage);
        updateJobStatus(jobId, 'running', 'Abruf abgeschlossen, bereite Speichern vor...', 95); // Progress near end

        if (dryRun) {
            const dryRunMessage = `Dry run activated. ${allTransformedPosts.length} posts processed, not saved.`;
            console.log(`[${jobId}] ${dryRunMessage}`);
            addLog(jobId, dryRunMessage);
            // Log first 3 transformed items for dry run preview
            if (allTransformedPosts.length > 0) {
                addLog(jobId, `Dry run preview data (first 3): ${JSON.stringify(allTransformedPosts.slice(0, 3), null, 2)}`);
            }
            updateJobStatus(jobId, 'completed', dryRunMessage, 100);
            return allTransformedPosts; // Gib alle verarbeiteten Posts zurück
        }

        if (allTransformedPosts.length === 0) {
            const noSaveMessage = 'No posts to save.';
            console.log(`[${jobId}] ${noSaveMessage}`);
            addLog(jobId, noSaveMessage);
            updateJobStatus(jobId, 'completed', noSaveMessage, 100);
            return 0; // Nichts zu speichern
        }

        // Log data before upserting
        const saveStartMessage = `Attempting to upsert ${allTransformedPosts.length} posts.`;
        console.log(`[${jobId}] ${saveStartMessage}`);
        addLog(jobId, saveStartMessage);
        updateJobStatus(jobId, 'running', `Speichere ${allTransformedPosts.length} Posts...`, 98);

        // Log first 3 posts data before upsert
        if (allTransformedPosts.length > 0) {
             console.log(`[${jobId}] Example post data before upsert (first 3):`, JSON.stringify(allTransformedPosts.slice(0, 3), null, 2));
         }

         console.log(`[${jobId}] Calling supabase.upsert for ${allTransformedPosts.length} posts...`);
         const { data, error, count: upsertCount } = await supabase // Verwende upsertCount für genauere Zählung
             .from('knowledge_posts')
             .upsert(allTransformedPosts, { onConflict: 'id', count: 'exact' }) // 'exact' count anfordern
             .select('id'); // Nur ID auswählen, um Datenmenge zu reduzieren

         if (error) {
             const errorMsg = `Supabase upsert error: ${error.message}`;
             console.error(`[${jobId}] ${errorMsg}`);
             console.error(`[${jobId}] Supabase error details:`, JSON.stringify(error, null, 2));
             const postIds = allTransformedPosts.map(p => p.id).join(', ');
             console.error(`[${jobId}] Attempted to upsert posts with IDs: ${postIds}`);
             addLog(jobId, errorMsg, 'error');
             addLog(jobId, `Error details: ${JSON.stringify(error, null, 2)}`, 'error');
             updateJobStatus(jobId, 'failed', `Fehler beim Speichern: ${error.message}`);
             throw error; // Re-throw to be caught by outer catch block
         } else {
             const returnedRowCount = data?.length ?? 0;
             const finalCount = upsertCount ?? returnedRowCount; // Bevorzuge upsertCount, wenn verfügbar
             const successMsg = `Supabase upsert successful. Upsert count: ${upsertCount}, Returned rows: ${returnedRowCount}. Final count: ${finalCount}`;
             console.log(`[${jobId}] ${successMsg}`);
             addLog(jobId, successMsg);

             if (data && data.length > 0) {
                 const successfulIds = data.map((row: { id: number }) => row.id).join(', ');
                 addLog(jobId, `IDs returned by select(): ${successfulIds}`);
             }
             if (allTransformedPosts.length !== finalCount) {
                 const mismatchMsg = `Mismatch: Processed ${allTransformedPosts.length} posts, but Supabase reported ${finalCount} upserted rows.`;
                 console.warn(`[${jobId}] ${mismatchMsg}`);
                 addLog(jobId, mismatchMsg, 'warn');
             }
             const completionMessage = `Import erfolgreich abgeschlossen. ${finalCount} Beiträge gespeichert/aktualisiert.`;
             updateJobStatus(jobId, 'completed', completionMessage, 100);
             return finalCount; // Gib die Anzahl der gespeicherten/aktualisierten Zeilen zurück
         }
    } catch (error: unknown) { // Outer catch block
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[${jobId}] --- Knowledge Import CAUGHT ERROR ---`, error);
        addLog(jobId, `Knowledge import process failed: ${message}`, 'error');
        updateJobStatus(jobId, 'failed', `Import fehlgeschlagen: ${message}`);
        return null; // Indicate failure
    }
}
