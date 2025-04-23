import axios from 'axios';
import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import type { RawKitaDetails } from '../types/company.d.ts';
import { addLog, updateJobStatus, LogLevel } from '../services/importStatusService.js';
import { importConfig } from '../config/importConfig.js';
import { extractContact } from './extractors/contactExtractor.js';
import { extractDescriptionAndHours } from './extractors/descriptionExtractor.js';
import { extractGallery } from './extractors/galleryExtractor.js';
import { extractFeatures } from './extractors/featuresExtractor.js';
import { extractTableData } from './extractors/tableExtractor.js';
import { extractAddress } from './extractors/addressExtractor.js';

// --- Interfaces (Moved to company.d.ts) ---

// Added export here
export interface ScrapingConfig {
    maxKitas?: number;
    batchSize?: number;
    // Add other config options as needed
}

// --- Constants ---
// BASE_URL is now in importConfig
const HEADERS = { // Keep HEADERS here for now, could be moved to config later
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
};

// --- Helper Functions ---
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function randomDelay(min = 1000, max = 2500): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Scraping & Parsing Functions (Moved from importService) ---

/**
 * Fetches the main kita overview page and extracts URLs and names for each Bundesland.
 * Includes a simple retry mechanism for network errors.
 */
export async function getBundeslandUrlsAndNames(jobId: string, maxRetries = 3, initialDelay = 1000): Promise<{ name: string, url: string }[]> {
    console.log(`[${jobId}] --- getBundeslandUrlsAndNames ENTERED ---`);
    const overviewUrl = `${importConfig.baseUrl}/kitas/`; // Use config
    addLog(jobId, `Fetching Bundesland list from ${overviewUrl}`);

    let retries = 0;
    let currentDelay = initialDelay;

    while (retries < maxRetries) {
        try {
            console.log(`[${jobId}] Calling axios.get for ${overviewUrl} (Attempt ${retries + 1}/${maxRetries})...`);
            const response = await axios.get(overviewUrl, { headers: HEADERS, timeout: 15000 }); // Added timeout
            console.log(`[${jobId}] axios.get successful. Status: ${response.status}`);

            // Check for non-2xx status codes that might indicate server issues
            if (response.status < 200 || response.status >= 300) {
                 throw new Error(`Request failed with status code ${response.status}`);
            }
        const $ = cheerio.load(response.data);
        console.log(`[${jobId}] Cheerio loaded.`);
        const bundeslaender: { name: string, url: string }[] = [];
        const seenUrls = new Set<string>(); // To avoid duplicates if structure is weird

        // Adjust selector if needed - this assumes links are direct children or within a specific container
        $('a[href^="/kitas/"]').each((index, element) => { // Let TS infer types
            const elNode = $(element); // Use a different variable name to avoid shadowing $
            const href = elNode.attr('href');
            if (href && href.startsWith('/kitas/') && href.split('/').length === 3) {
                const fullUrl = importConfig.baseUrl + href;
                if (!seenUrls.has(fullUrl)) {
                    const name = elNode.text().trim(); // Use elNode (Cheerio object) to call .text()
                    if (name) { // Only add if name is found
                         bundeslaender.push({ name, url: fullUrl });
                         seenUrls.add(fullUrl);
                    } else {
                        addLog(jobId, `Found Bundesland URL ${fullUrl} but no name.`, 'warn');
                    }
                }
            }
        });
        console.log(`[${jobId}] Finished iterating links. Found ${bundeslaender.length} Bundesländer.`);

        if (bundeslaender.length === 0) {
            addLog(jobId, "No Bundesländer found. Check CSS selectors.", 'warn');
            console.warn(`[${jobId}] No Bundesländer extracted.`);
        } else {
            addLog(jobId, `Found ${bundeslaender.length} Bundesländer.`);
        }
        console.log(`[${jobId}] --- getBundeslandUrlsAndNames RETURNING ${bundeslaender.length} items ---`);
            return bundeslaender; // Success, exit the loop and return

        } catch (error: any) {
            retries++;
            const message = error instanceof Error ? error.message : String(error);
            console.error(`[${jobId}] --- getBundeslandUrls Attempt ${retries}/${maxRetries} FAILED ---`, error);
            addLog(jobId, `Attempt ${retries}/${maxRetries} failed for ${overviewUrl}: ${message}`, 'warn');

            // Check if it's a retryable error (e.g., network timeout, 5xx status)
            const isRetryable = axios.isAxiosError(error) && (!error.response || error.response.status >= 500 || error.code === 'ECONNABORTED');

            if (retries >= maxRetries || !isRetryable) {
            console.error(`[${jobId}] Max retries reached or non-retryable error for ${overviewUrl}. Giving up.`);
            addLog(jobId, `Error fetching Bundesländer list from ${overviewUrl} after ${retries} attempts: ${message}`, 'error');
            // updateJobStatus(jobId, 'failed', `Error fetching Bundesländer list: ${message}`); // Consider moving status update higher
            return []; // Return empty array on final failure
        }

            // Wait before retrying with exponential backoff
            addLog(jobId, `Waiting ${currentDelay}ms before retry ${retries + 1}...`, 'info');
            await sleep(currentDelay);
            currentDelay *= 2; // Exponential backoff
        }
    }
    // Should not be reached if logic is correct, but satisfy TypeScript return path
    return [];
}

/**
 * Fetches a Bundesland page and extracts URLs and names for each Bezirk/Region within it.
 * Includes a simple retry mechanism for network errors and handles alphabetical pagination.
 */
export async function getBezirkUrlsAndNames(jobId: string, bundeslandUrl: string, maxRetries = 3, initialDelay = 1000): Promise<{ name: string, url: string }[]> {
    addLog(jobId, `Fetching Bezirk list from ${bundeslandUrl} (including pagination)`);
    const allBezirke = new Map<string, string>(); // Use Map to store URL -> Name, ensures uniqueness by URL

    const fetchAndParsePage = async (url: string, attempt = 1): Promise<string[]> => {
        addLog(jobId, `   - Fetching page: ${url} (Attempt ${attempt}/${maxRetries})`);
        try {
            const response = await axios.get(url, { headers: HEADERS, timeout: 15000 });
            console.log(`[${jobId}] axios.get successful for ${url}. Status: ${response.status}`);
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`Request failed with status code ${response.status}`);
            }

            const $ = cheerio.load(response.data);
            const bundeslandPath = new URL(bundeslandUrl).pathname; // Base path for comparison
            let foundOnPage = 0;

            // Extract Bezirke from the current page
            $(`ol.cities a[href^="${bundeslandPath}"], ul.cities a[href^="${bundeslandPath}"]`).each((index, element) => {
                const elNode = $(element);
                const href = elNode.attr('href');
                // Ensure the link goes one level deeper (is a Bezirk link)
                if (href && href.startsWith(bundeslandPath) && href.split('/').filter(Boolean).length === bundeslandPath.split('/').filter(Boolean).length + 1) {
                    const fullUrl = importConfig.baseUrl + href;
                    const name = elNode.text().trim();
                    if (name && !allBezirke.has(fullUrl)) {
                        allBezirke.set(fullUrl, name);
                        foundOnPage++;
                    }
                }
            });
            addLog(jobId, `   - Found ${foundOnPage} new Bezirke on ${url}. Total unique now: ${allBezirke.size}`);

            // Extract pagination links for subsequent pages (only needed on the first page load)
            const paginationLinks: string[] = [];
            if (url === bundeslandUrl) { // Only extract pagination links from the initial page
                 $('ol.pagination_char a:not(.current)').each((index, element) => {
                    const pageHref = $(element).attr('href');
                    if (pageHref) {
                        paginationLinks.push(importConfig.baseUrl + pageHref);
                    }
                });
                 addLog(jobId, `   - Found ${paginationLinks.length} pagination links on initial page.`);
            }
            return paginationLinks; // Return pagination links found on this page

        } catch (error: any) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`[${jobId}] --- fetchAndParsePage Attempt ${attempt}/${maxRetries} FAILED for ${url} ---`, error);
            addLog(jobId, `   - Attempt ${attempt}/${maxRetries} failed for ${url}: ${message}`, 'warn');

            const isRetryable = axios.isAxiosError(error) && (!error.response || error.response.status >= 500 || error.code === 'ECONNABORTED');

            if (attempt >= maxRetries || !isRetryable) {
                console.error(`[${jobId}] Max retries reached or non-retryable error for ${url}. Giving up on this page.`);
                addLog(jobId, `   - Error fetching page ${url} after ${attempt} attempts: ${message}`, 'error');
                return []; // Return empty array on final failure for this page
            }

            // Wait before retrying
            const retryDelay = initialDelay * Math.pow(2, attempt - 1); // Exponential backoff
            addLog(jobId, `   - Waiting ${retryDelay}ms before retry ${attempt + 1} for ${url}...`, 'info');
            await sleep(retryDelay);
            return fetchAndParsePage(url, attempt + 1); // Retry
        }
    };

    // 1. Fetch the initial Bundesland page and get pagination links
    const initialPaginationLinks = await fetchAndParsePage(bundeslandUrl);

    // 2. Fetch all other pagination pages
    if (initialPaginationLinks.length > 0) {
        addLog(jobId, `Processing ${initialPaginationLinks.length} additional pagination pages...`);
        for (const pageUrl of initialPaginationLinks) {
            await sleep(randomDelay(500, 1500)); // Add delay between pagination page fetches
            await fetchAndParsePage(pageUrl); // Fetch and parse each pagination page
        }
    }

    // 3. Convert the Map to the desired array format
    const finalBezirkeArray = Array.from(allBezirke.entries()).map(([url, name]) => ({ name, url }));

    if (finalBezirkeArray.length === 0) {
        addLog(jobId, `No Bezirke found in total for ${bundeslandUrl} after checking pagination.`, 'warn');
    } else {
        addLog(jobId, `Finished fetching Bezirke for ${bundeslandUrl}. Total unique found: ${finalBezirkeArray.length}.`);
    }

    return finalBezirkeArray;
}


/**
 * Fetches Kita URLs from a Bezirk page, handling pagination.
 */
export async function getKitaUrlsFromBezirkPage(jobId: string, bezirkPageUrl: string, maxKitasToFetch: number): Promise<string[]> {
    let allKitaUrls = new Set<string>();
    let currentPage = 1;
    let hasMorePages = true;
    let fetchedCount = 0;

    addLog(jobId, `Fetching Kita URLs from ${bezirkPageUrl} (limit ~${maxKitasToFetch})`);

    while (hasMorePages && fetchedCount < maxKitasToFetch) {
        const url = `${bezirkPageUrl}` + (currentPage > 1 ? `p=${currentPage}/` : '');
        addLog(jobId, `   - Scraping page ${currentPage}: ${url}`);

        let attempt = 0;
        const maxPageRetries = 3; // Specific retries for page fetch
        let pageSuccess = false;

        while (attempt < maxPageRetries && !pageSuccess) {
            try {
                attempt++;
                console.log(`[${jobId}] Attempt ${attempt}/${maxPageRetries} to fetch ${url}`);
                const response = await axios.get(url, { headers: HEADERS, timeout: 15000 }); // Added timeout
                console.log(`[${jobId}] axios.get successful for ${url}. Status: ${response.status}`);

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(`Request failed with status code ${response.status}`);
                }

                const $ = cheerio.load(response.data);
                const kitaLinksOnPage = extractKitaUrlsFromHtml($, importConfig.baseUrl); // Use config
                pageSuccess = true; // Mark as success if parsing starts

                if (kitaLinksOnPage.length === 0) {
                    hasMorePages = false;
                    addLog(jobId, `   - No more Kita URLs found on page ${currentPage}.`);
                } else {
                    kitaLinksOnPage.forEach(link => {
                        if (allKitaUrls.size < maxKitasToFetch) {
                            allKitaUrls.add(link);
                        }
                    });
                    fetchedCount = allKitaUrls.size;
                    addLog(jobId, `   - Found ${kitaLinksOnPage.length} URLs on page ${currentPage}. Total unique now: ${fetchedCount}`);

                     const hasNextPageLink = $('a:contains("»"), a:contains("Weiter"), a.next').length > 0;
                     addLog(jobId, `   - Checking pagination: hasNextPageLink=${hasNextPageLink}, fetchedCount=${fetchedCount}, maxKitasToFetch=${maxKitasToFetch}`); // DEBUG LOG
                     if (!hasNextPageLink || fetchedCount >= maxKitasToFetch) {
                          hasMorePages = false;
                          if (!hasNextPageLink) {
                              addLog(jobId, `   - No 'next page' link detected on page ${currentPage}. Stopping pagination for ${bezirkPageUrl}.`);
                          }
                          if (fetchedCount >= maxKitasToFetch) {
                              addLog(jobId, `   - Reached maxKitasToFetch limit (${maxKitasToFetch}). Stopping pagination for ${bezirkPageUrl}.`);
                          }
                     } else {
                         // Only increment page if the current page was successful and has next
                        currentPage++;
                        // No delay here, delay happens before the next while loop iteration if needed
                    }
                }
            } catch (error: any) {
                const message = error instanceof Error ? error.message : String(error);
                console.error(`[${jobId}] --- getKitaUrlsFromBezirkPage Attempt ${attempt}/${maxPageRetries} FAILED for ${url} ---`, error);
                addLog(jobId, `   - Attempt ${attempt}/${maxPageRetries} failed for page ${url}: ${message}`, 'warn');

                const isRetryable = axios.isAxiosError(error) && (!error.response || error.response.status >= 500 || error.code === 'ECONNABORTED');

                if (attempt >= maxPageRetries || !isRetryable) {
                    if (axios.isAxiosError(error) && error.response?.status === 404 && currentPage > 1) {
                        addLog(jobId, `   - Page ${currentPage} not found (404) after ${attempt} attempts. Assuming end of pagination for ${bezirkPageUrl}.`);
                     } else {
                         addLog(jobId, `   - Error scraping page ${url} after ${attempt} attempts: ${message}`, 'error');
                     }
                     addLog(jobId, `   - Stopping pagination for ${bezirkPageUrl} due to persistent error or 404 on page ${currentPage}.`); // DEBUG LOG
                     hasMorePages = false; // Stop pagination for this bezirk on persistent error or 404
                     break; // Exit the retry loop for this page
                 }

                // Wait before retrying page fetch
                const retryDelay = 1000 * Math.pow(2, attempt -1); // Exponential backoff for page retries
                addLog(jobId, `   - Waiting ${retryDelay}ms before retry ${attempt + 1} for page ${url}...`, 'info');
                await sleep(retryDelay);
            }
        } // End of retry loop for a single page

        // Add a delay before fetching the next page *if* there are more pages
        if (hasMorePages && fetchedCount < maxKitasToFetch) {
             await sleep(randomDelay());
        }

    } // End of while loop for pagination


    const finalUrls = Array.from(allKitaUrls);
    addLog(jobId, `   Finished scraping Bezirk ${bezirkPageUrl}. Found ${finalUrls.length} unique Kita URLs.`);
    return finalUrls;
  }

/**
 * Extracts Kita URLs from the HTML of a list page.
 */
function extractKitaUrlsFromHtml($: cheerio.CheerioAPI, baseUrlUsed: string): string[] { // Use CheerioAPI
     const urls = new Set<string>();
     // Try a more specific selector assuming results are within items having a common class like 'result-item' or similar
     // This is a guess and might need adjustment based on actual HTML structure.
     $('.result-item a[href^="/kita/"], .search-result a[href^="/kita/"], article a[href^="/kita/"]').each((index, element) => { // Let TS infer types
       let href = $(element).attr('href');
       // Ensure it matches the pattern /kita/ followed by digits
       if (href && /^\/kita\/\d+/.test(href)) {
           // Prepend baseUrl only if it starts with /
           href = baseUrlUsed + href;
           urls.add(href);
       } else if (href && href.startsWith(baseUrlUsed) && href.includes('/kita/')) {
           // Handle cases where the full URL might already be present but ensure it's a kita detail page
           if (/\/kita\/\d+/.test(href)) {
               urls.add(href);
           }
       }
     });

     // Fallback or additional check if the specific selector yields no results
     if (urls.size === 0) {
        console.warn("Specific selector yielded 0 results, trying broader selector 'a[href*=\"/kita/\"]'");
        $('a[href*="/kita/"]').each((index, element) => { // Let TS infer types
          let href = $(element).attr('href');
          if (href && /^\/?kita\/\d+/.test(href)) {
              if (href.startsWith('/')) {
               href = baseUrlUsed + href; // Use passed baseUrl
           }
           urls.add(href);
       }
     });
   } // <-- Corrected: Added missing closing brace
   return Array.from(urls);
}

/**
 * Fetches and parses the details for a single Kita page.
 * Includes a simple retry mechanism for network errors.
 */
export async function scrapeKitaDetails(jobId: string, kitaUrl: string, maxRetries = 3, initialDelay = 1000): Promise<RawKitaDetails | null> {
    addLog(jobId, `   - Scraping details from ${kitaUrl}`);

    let retries = 0;
    let currentDelay = initialDelay;

    while (retries < maxRetries) {
        try {
            console.log(`[${jobId}] Calling axios.get for ${kitaUrl} (Attempt ${retries + 1}/${maxRetries})...`);
            const response = await axios.get(kitaUrl, { headers: HEADERS, timeout: 15000 }); // Added timeout
            console.log(`[${jobId}] axios.get successful for ${kitaUrl}. Status: ${response.status}`);

            if (response.status < 200 || response.status >= 300) {
                 throw new Error(`Request failed with status code ${response.status}`);
            }

            const $ = cheerio.load(response.data);
            const details = extractDetailsFromHtml($, kitaUrl, jobId); // Call the parser function
            return details; // Success

        } catch (error: unknown) {
            retries++;
            const message = error instanceof Error ? error.message : String(error);
            console.error(`[${jobId}] --- scrapeKitaDetails Attempt ${retries}/${maxRetries} FAILED for ${kitaUrl} ---`, error);
            addLog(jobId, `   - Attempt ${retries}/${maxRetries} failed for details page ${kitaUrl}: ${message}`, 'warn');

            // Check if it's a retryable Axios error *after* confirming it's an Axios error
            let isRetryable = false;
            if (axios.isAxiosError(error)) {
                 // Explicit cast to satisfy TS in some environments
                 const axiosError = error as import('axios').AxiosError;
                 isRetryable = !axiosError.response || axiosError.response.status >= 500 || axiosError.code === 'ECONNABORTED';
            }

            if (retries >= maxRetries || !isRetryable) {
                console.error(`[${jobId}] Max retries reached or non-retryable error for ${kitaUrl}. Giving up.`);
                addLog(jobId, `   - Error scraping details from ${kitaUrl} after ${retries} attempts: ${message}`, 'error');
               return null; // Return null on final failure
            }

            addLog(jobId, `   - Waiting ${currentDelay}ms before retry ${retries + 1} for ${kitaUrl}...`, 'info');
            await sleep(currentDelay);
            currentDelay *= 2;
        }
    }
    return null; // Should not be reached
}

/**
 * Extracts Kita details from the HTML content of a detail page.
 * Corrected version with proper try-catch structure and improved extraction.
 */
function extractDetailsFromHtml($: cheerio.CheerioAPI, sourceUrl: string, jobId: string): RawKitaDetails | null { // Use CheerioAPI
    const kitaInfo: Partial<RawKitaDetails> = { source_url: sourceUrl };

    // --- Logo & Cover Image URL ---
    try {
        const logoElement = $('.logo img, #logo img, header img.logo, .header img.logo').first();
        if (logoElement.length > 0) {
            const logoSrc = logoElement.attr('src');
            if (logoSrc) {
                kitaInfo.logo_url = new URL(logoSrc, importConfig.baseUrl).toString();
            }
        } else {
            addLog(jobId, `Could not extract logo_url from ${sourceUrl}`, 'info');
        }

        // --- Cover-Image: Versuche alle Varianten, logge nur wenn wirklich kein Bild gefunden wurde ---
        let coverImageUrl: string | undefined = undefined;
        // 1. cover-image/hero-image
        const coverElement = $('.cover-image img, #cover-image img, .hero-image img, header > img').first();
        if (coverElement.length > 0) {
            const coverSrc = coverElement.attr('src');
            if (coverSrc && coverSrc !== kitaInfo.logo_url) {
                coverImageUrl = new URL(coverSrc, importConfig.baseUrl).toString();
            }
        }
        // 2. img.gfx_profile
        if (!coverImageUrl) {
            const profileImg = $('img.gfx_profile').first();
            if (profileImg.length > 0) {
                const src = profileImg.attr('src');
                if (src) {
                    coverImageUrl = new URL(src, importConfig.baseUrl).toString();
                    addLog(jobId, `Extracted cover_image_url from img.gfx_profile: ${coverImageUrl}`, 'info');
                }
            }
        }
        if (coverImageUrl) {
            kitaInfo.cover_image_url = coverImageUrl;
        } else {
            addLog(jobId, `Could not extract cover_image_url from ${sourceUrl}`, 'info');
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting logo/cover image: ${message}`, 'warn');
    }

    // --- Name ---
    try {
        kitaInfo.name = $('h1').first().text().trim() || undefined;
        if (!kitaInfo.name) {
            addLog(jobId, `Could not extract name from ${sourceUrl}`, 'warn');
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting name: ${message}`, 'warn');
    }

    // --- Address: Nur noch robusten Extraktor verwenden ---
    try {
        const potentialContainers = $('div.details, .kontakt, .contact, #kontakt, #contact, address, .adresse, #adresse, .sidebar, aside, .footer, footer');
        let contactContainer = potentialContainers.first() as cheerio.Cheerio<Element>;
        if (contactContainer.length === 0) {
            contactContainer = $('h1').first().closest('div, section, article') as cheerio.Cheerio<Element>;
            if (contactContainer.length === 0 || contactContainer.prop('tagName')?.toLowerCase() === 'body') {
                contactContainer = $('main, #main, .main-content, article').first() as cheerio.Cheerio<Element>;
            }
            if (contactContainer.length === 0) {
                contactContainer = $('body') as cheerio.Cheerio<Element>;
                addLog(jobId, `No specific contact container found, using body as fallback.`, 'warn');
            } else {
                addLog(jobId, `Using fallback container: ${contactContainer.prop('tagName')}.${contactContainer.attr('class') || ''}${contactContainer.attr('id') ? '#' + contactContainer.attr('id') : ''}`, 'info');
            }
        } else {
            addLog(jobId, `Using primary container: ${contactContainer.prop('tagName')}.${contactContainer.attr('class') || ''}${contactContainer.attr('id') ? '#' + contactContainer.attr('id') : ''}`, 'info');
        }
        // Nur noch den robusten Extraktor verwenden:
        const addressResult = extractAddress($, contactContainer, jobId);
        if (addressResult) {
            kitaInfo.strasse = addressResult.strasse;
            kitaInfo.house_number = addressResult.house_number;
            kitaInfo.plz = addressResult.plz;
            kitaInfo.ort = addressResult.ort;
            kitaInfo.bezirk = addressResult.bezirk;
            kitaInfo.address_full = addressResult.address_full;
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting address: ${message}`, 'warn');
    }

    // --- Kontaktfelder extrahieren ---
    const contact = extractContact($, sourceUrl, jobId);
    if (contact.phone) kitaInfo.phone = contact.phone;
    if (contact.email) kitaInfo.email = contact.email;
    if (contact.website) kitaInfo.website = contact.website;

    // --- Table Data ---
    const tableData = extractTableData($, sourceUrl, jobId);
    if (tableData.traeger) kitaInfo.traeger = tableData.traeger;
    if (tableData.traegertyp) kitaInfo.traegertyp = tableData.traegertyp;
    if (tableData.dachverband) kitaInfo.dachverband = tableData.dachverband;
    // Assign directly, as tableExtractor now returns numbers
    if (tableData.plaetze_gesamt !== undefined) kitaInfo.plaetze_gesamt = String(tableData.plaetze_gesamt);
    if (tableData.freie_plaetze !== undefined) kitaInfo.freie_plaetze = String(tableData.freie_plaetze);
    if (tableData.betreuungszeit) kitaInfo.betreuungszeit = tableData.betreuungszeit;
    if (tableData.betreuungsalter_von !== undefined) kitaInfo.betreuungsalter_von = String(tableData.betreuungsalter_von);
    if (tableData.betreuungsalter_bis !== undefined) kitaInfo.betreuungsalter_bis = String(tableData.betreuungsalter_bis);
    if (tableData.paedagogisches_konzept) kitaInfo.paedagogisches_konzept = tableData.paedagogisches_konzept;

    // --- Description, Opening Hours, Concept ---
    const descInfo = extractDescriptionAndHours($, sourceUrl, jobId);
    if (descInfo.description) kitaInfo.description = descInfo.description;
    if (descInfo.oeffnungszeiten) kitaInfo.oeffnungszeiten = descInfo.oeffnungszeiten;
    if (descInfo.paedagogisches_konzept) kitaInfo.paedagogisches_konzept = descInfo.paedagogisches_konzept;

    // --- Gallery & Video ---
    const galleryInfo = extractGallery($, sourceUrl, jobId);
    if (galleryInfo.gallery) kitaInfo.gallery = galleryInfo.gallery;
    if (galleryInfo.video_url) kitaInfo.video_url = galleryInfo.video_url;

    // --- Features (Benefits, Certifications, Awards) ---
    const features = extractFeatures($, sourceUrl, jobId);
    if (features.benefits) kitaInfo.benefits = features.benefits;
    if (features.certifications) kitaInfo.certifications = features.certifications;
    if (features.awards) kitaInfo.awards = features.awards;

    // --- Kita-Typ (z.B. Krippe, Kindergarten, Hort) extrahieren ---
    try {
        const typeElement = $('h2.type').first();
        if (typeElement.length > 0) {
            const rawType = typeElement.text().trim();
            // Replace " und " with ", " to create a comma-separated list
            kitaInfo.kita_typ = rawType.replace(/\s+und\s+/gi, ', ');
            addLog(jobId, `Kita-Typ extrahiert und formatiert: ${kitaInfo.kita_typ} (Original: ${rawType})`, 'info');
        }
    } catch (e) {
        addLog(jobId, `Fehler beim Extrahieren des Kita-Typs: ${e instanceof Error ? e.message : String(e)}`, 'warn');
    }

    // --- Video URL ---
    try {
        const videoIframe = $('iframe[src*="youtube.com/embed"], iframe[src*="vimeo.com/video"]').first();
        if (videoIframe.length > 0) {
            kitaInfo.video_url = videoIframe.attr('src');
        } else {
            addLog(jobId, `Could not extract video URL from ${sourceUrl}`, 'info');
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting video URL: ${message}`, 'warn');
    }

    // --- Cleanup & Validation ---
    Object.keys(kitaInfo).forEach((key) => {
        const typedKey = key as keyof RawKitaDetails;
        if (kitaInfo[typedKey] === "" || kitaInfo[typedKey] == null) {
            delete kitaInfo[typedKey];
        }
    });

    if (!kitaInfo.name) {
        addLog(jobId, `Skipping Kita due to missing essential data (name): ${sourceUrl}`, 'warn');
        return null;
    }
    return kitaInfo as RawKitaDetails;
}
