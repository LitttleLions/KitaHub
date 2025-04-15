import axios from 'axios'; // Use import
import * as cheerio from 'cheerio'; // Correct import for ES Modules
import { Element } from 'domhandler'; // Import Element type from domhandler
import type { RawKitaDetails } from '../types/company.d.ts'; // Import type
import { addLog, updateJobStatus, LogLevel } from '../services/importStatusService.js'; // Fix: .js extension for ESM compatibility
import { importConfig } from '../config/importConfig.js'; // Add .js extension
import { extractContact } from './extractors/contactExtractor.js';
import { extractDescriptionAndHours } from './extractors/descriptionExtractor.js';
import { extractGallery } from './extractors/galleryExtractor.js';
import { extractFeatures } from './extractors/featuresExtractor.js';
import { extractTableData } from './extractors/tableExtractor.js';

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
 * Includes a simple retry mechanism for network errors.
 */
export async function getBezirkUrlsAndNames(jobId: string, bundeslandUrl: string, maxRetries = 3, initialDelay = 1000): Promise<{ name: string, url: string }[]> {
    addLog(jobId, `Fetching Bezirk list from ${bundeslandUrl}`);

    let retries = 0;
    let currentDelay = initialDelay;

    while(retries < maxRetries) {
        try {
            console.log(`[${jobId}] Calling axios.get for ${bundeslandUrl} (Attempt ${retries + 1}/${maxRetries})...`);
            const response = await axios.get(bundeslandUrl, { headers: HEADERS, timeout: 15000 }); // Added timeout
            console.log(`[${jobId}] axios.get successful for ${bundeslandUrl}. Status: ${response.status}`);

            if (response.status < 200 || response.status >= 300) {
                 throw new Error(`Request failed with status code ${response.status}`);
            }

            const $ = cheerio.load(response.data);
            const bezirke: { name: string, url: string }[] = [];
            const seenUrls = new Set<string>();
            const bundeslandPath = new URL(bundeslandUrl).pathname;

            // Angepasster Selektor: Bezirks-Links innerhalb der Liste ol.cities, kein Slash am Ende nötig
            $(`ol.cities a[href^="${bundeslandPath}"]`).each((index, element) => { // Let TS infer types
                const elNode = $(element); // Use a different variable name
                const href = elNode.attr('href');
                if (href && href.startsWith(bundeslandPath) && href.length > bundeslandPath.length) {
                    const fullUrl = importConfig.baseUrl + href;
                    if (!seenUrls.has(fullUrl)) {
                        const name = elNode.text().trim(); // Use elNode (Cheerio object) to call .text()
                        if (name) {
                            bezirke.push({ name, url: fullUrl });
                            seenUrls.add(fullUrl);
                        } else {
                            addLog(jobId, `Found Bezirk URL ${fullUrl} but no name.`, 'warn');
                        }
                    }
                }
            });

            if (bezirke.length === 0) {
                addLog(jobId, `No Bezirke found on ${bundeslandUrl}. Check CSS selectors.`, 'warn');
            } else {
                addLog(jobId, `Found ${bezirke.length} Bezirke for ${bundeslandUrl}.`);
            }
            return bezirke; // Success

        } catch (error: any) {
            retries++;
            const message = error instanceof Error ? error.message : String(error);
            console.error(`[${jobId}] --- getBezirkUrls Attempt ${retries}/${maxRetries} FAILED for ${bundeslandUrl} ---`, error);
            addLog(jobId, `Attempt ${retries}/${maxRetries} failed for ${bundeslandUrl}: ${message}`, 'warn');

            const isRetryable = axios.isAxiosError(error) && (!error.response || error.response.status >= 500 || error.code === 'ECONNABORTED');

            if (retries >= maxRetries || !isRetryable) {
            console.error(`[${jobId}] Max retries reached or non-retryable error for ${bundeslandUrl}. Giving up.`);
            addLog(jobId, `Error fetching Bezirk list from ${bundeslandUrl} after ${retries} attempts: ${message}`, 'error');
            return []; // Return empty array on final failure
        }

            addLog(jobId, `Waiting ${currentDelay}ms before retry ${retries + 1} for ${bundeslandUrl}...`, 'info');
            await sleep(currentDelay);
            currentDelay *= 2;
        }
    }
    return []; // Should not be reached
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

        const coverElement = $('.cover-image img, #cover-image img, .hero-image img, header > img').first();
        if (coverElement.length > 0) {
            const coverSrc = coverElement.attr('src');
            if (coverSrc && coverSrc !== kitaInfo.logo_url) {
                kitaInfo.cover_image_url = new URL(coverSrc, importConfig.baseUrl).toString();
            }
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

    // --- Address Extraction (Robust Extraction) ---
    try {
        // Find potential contact containers more broadly
        const potentialContainers = $('div.details, .kontakt, .contact, #kontakt, #contact, address, .adresse, #adresse, .sidebar, aside, .footer, footer');
        let contactContainer = potentialContainers.first() as cheerio.Cheerio<Element>; // Added Type Cast
        if (contactContainer.length === 0) {
            // Fallback: Look near H1 or in common sections if specific containers fail
            contactContainer = $('h1').first().closest('div, section, article') as cheerio.Cheerio<Element>; // Added Type Cast
            if (contactContainer.length === 0 || contactContainer.prop('tagName')?.toLowerCase() === 'body') {
                contactContainer = $('main, #main, .main-content, article').first() as cheerio.Cheerio<Element>; // Added Type Cast
            }
            if (contactContainer.length === 0) {
                contactContainer = $('body') as cheerio.Cheerio<Element>; // Added Type Cast
                addLog(jobId, `No specific contact container found, using body as fallback.`, 'warn');
            } else {
                addLog(jobId, `Using fallback container: ${contactContainer.prop('tagName')}.${contactContainer.attr('class') || ''}${contactContainer.attr('id') ? '#' + contactContainer.attr('id') : ''}`, 'info');
            }
        } else {
            addLog(jobId, `Using primary container: ${contactContainer.prop('tagName')}.${contactContainer.attr('class') || ''}${contactContainer.attr('id') ? '#' + contactContainer.attr('id') : ''}`, 'info');
        }

        // --- Address Parsing (More Robust) ---
        let addressFound = false;
        // Try specific selectors first within the container
        let addressElement = contactContainer.find('.address, .adresse, p:contains("Straße"), p:contains("Adresse"), div:contains("Straße"), div:contains("Adresse")').first();
        if (addressElement.length === 0) {
            // Fallback 1: Look for paragraphs/divs containing a 5-digit number (PLZ) within the container
            contactContainer.find('p, div').each((_, el) => {
                const text = $(el).text();
                // Basic check for street number and PLZ pattern, avoid long texts
                if (/\d{1,4}[a-zA-Z]?\s*,\s*\d{5}|\d{5}\s+\w+/.test(text) && text.length < 150) {
                    addressElement = $(el);
                    addLog(jobId, `Address found using container PLZ fallback.`, 'info');
                    return false; // Stop searching
                }
            });
        }

        // Fallback 2: Search the whole body if still not found in the container
        if (addressElement.length === 0) {
            $('p, address, div.address, div.adresse').each((_, el) => {
                const text = $(el).text();
                if (/\d{1,4}[a-zA-Z]?\s*,\s*\d{5}|\d{5}\s+\w+/.test(text) && text.length < 150) {
                    addressElement = $(el);
                    addLog(jobId, `Address found using body fallback selector.`, 'info');
                    return false;
                }
            });
        }

        if (addressElement.length > 0) {
            // Extract text, clean up whitespace, remove labels like "Adresse:"
            const addressText = addressElement.text()
                                      .replace(/Adresse:|Straße:/gi, '')
                                      .replace(/\s+/g, ' ')
                                      .trim();

            // Regex patterns (more flexible) - Prioritize patterns with comma before PLZ
            const patterns = [
                /(.+?\s+[\d]+(?:[\s-]?[\d\w]+)?)\s*,\s*(\d{5})\s*(.+)/, // Street 123, 12345 City (Optional Bezirk)
                /(.+?\s+[\d]+(?:[\s-]?[\d\w]+)?)\s+(\d{5})\s*(.+)/,    // Street 123 12345 City
                /(\d{5})\s*(.+?),\s*(.+?\s+[\d]+(?:[\s-]?[\d\w]+)?)/     // 12345 City, Street 123
            ];

            for (const pattern of patterns) {
                const match = addressText.match(pattern);
                if (match) {
                    let streetAndHouse, plz, city;
                    // Determine which pattern matched based on capture groups
                    if (pattern.source.includes(',')) { // PLZ City, Street 123 pattern OR Street 123, PLZ City
                         if (/^\d{5}/.test(match[1])) { // Starts with PLZ: 12345 City, Street 123
                             plz = match[1].trim();
                             city = match[2].trim();
                             streetAndHouse = match[3].trim();
                         } else { // Standard: Street 123, PLZ City
                             streetAndHouse = match[1].trim();
                             plz = match[2].trim();
                             city = match[3].trim();
                         }
                    } else { // Street 123 PLZ City
                        streetAndHouse = match[1].trim();
                        plz = match[2].trim();
                        city = match[3].trim();
                    }

                    kitaInfo.plz = plz;
                    kitaInfo.ort = city.replace(/,.*/, '').trim(); // Remove anything after a comma in city

                    // Extract Street and House Number
                    const houseNumberMatch = streetAndHouse.match(/^(.*?)\s+([\d]+(?:[\s-]?[\d\w\/]+)?)$/); // Allow / in house numbers
                    if (houseNumberMatch) {
                        kitaInfo.strasse = houseNumberMatch[1].trim().replace(/,$/, '');
                        kitaInfo.house_number = houseNumberMatch[2].trim();
                    } else {
                        // Handle cases like "Am Park 5-7" or "Hauptstr. 12a"
                        const complexHouseNrMatch = streetAndHouse.match(/^(.*?)\s+([\d]+[a-zA-Z]?\s*[-\/]?\s*[\d]*[a-zA-Z]?)$/);
                         if (complexHouseNrMatch) {
                             kitaInfo.strasse = complexHouseNrMatch[1].trim().replace(/,$/, '');
                             kitaInfo.house_number = complexHouseNrMatch[2].trim();
                         } else {
                            kitaInfo.strasse = streetAndHouse.replace(/,$/, ''); // Store full string if no number found
                            addLog(jobId, `Could not separate street and house number from: ${streetAndHouse} in ${addressText}`, 'warn');
                         }
                    }

                    // Refined Bezirk extraction - Look for common patterns within the extracted city part
                    const cityPartForBezirk = city; // Use original city string before trimming
                    const bezirkMatch = cityPartForBezirk.match(/(?:\(| \/ | - |,\s*Bezirk\s+)(.*?)(?:\)|$)/i);
                    if (bezirkMatch && bezirkMatch[1]) {
                        kitaInfo.bezirk = bezirkMatch[1].trim();
                        // Clean up ort if district was appended
                        kitaInfo.ort = kitaInfo.ort.replace(bezirkMatch[0], '').trim();
                    } else if (kitaInfo.ort && kitaInfo.ort.toLowerCase().includes('berlin') && kitaInfo.ort.length > 6) {
                        const potentialBezirk = kitaInfo.ort.replace(/berlin/i, '').replace(/[-()]/g, '').trim();
                         if (potentialBezirk && potentialBezirk.length > 2 && potentialBezirk.toLowerCase() !== 'berlin') {
                            kitaInfo.bezirk = potentialBezirk;
                            kitaInfo.ort = 'Berlin';
                        }
                    }
                    addressFound = true;
                    addLog(jobId, `Address parsed: ${kitaInfo.strasse} ${kitaInfo.house_number}, ${kitaInfo.plz} ${kitaInfo.ort}${kitaInfo.bezirk ? ' (' + kitaInfo.bezirk + ')' : ''}`, 'info');
                    break; // Stop after first successful match
                }
            }
            if (!addressFound) {
                kitaInfo.address_full = addressText; // Store raw text if parsing fails
                addLog(jobId, `Could not parse address structure: ${addressText}`, 'warn');
            }
        } else {
            addLog(jobId, "Could not find address element", 'warn');
        }

        // --- Kontaktfelder extrahieren ---
        const contact = extractContact($, sourceUrl, jobId);
        if (contact.phone) kitaInfo.phone = contact.phone;
        if (contact.email) kitaInfo.email = contact.email;
        if (contact.website) kitaInfo.website = contact.website;
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting address/contact details: ${message}`, 'warn');
    }


    // --- Table Data ---
    const tableData = extractTableData($, sourceUrl, jobId);
    if (tableData.traeger) kitaInfo.traeger = tableData.traeger;
    if (tableData.traegertyp) kitaInfo.traegertyp = tableData.traegertyp;
    if (tableData.dachverband) kitaInfo.dachverband = tableData.dachverband;
    if (tableData.plaetze_gesamt) kitaInfo.plaetze_gesamt = tableData.plaetze_gesamt;
    if (tableData.freie_plaetze) kitaInfo.freie_plaetze = tableData.freie_plaetze;
    if (tableData.betreuungszeit) kitaInfo.betreuungszeit = tableData.betreuungszeit;
    if (tableData.betreuungsalter_von) kitaInfo.betreuungsalter_von = tableData.betreuungsalter_von;
    if (tableData.betreuungsalter_bis) kitaInfo.betreuungsalter_bis = tableData.betreuungsalter_bis;
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
