import axios from 'axios';
import * as cheerio from 'cheerio';
import { supabase } from '@/integrations/supabase/client'; // Corrected import path
import { Company } from '@/types/company'; // Import the Company type
// TODO: Define types for ImportConfig, KitaRawData, KitaMappedData (Partial<Company> might work for mapped)
// TODO: Import or define status update/logging functions (e.g., from importStatusService)

const BASE_URL = "https://kita.de";
const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
};

// Helper function for delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

 // --- Scraping Implementation ---

 /**
  * Fetches the main kita overview page and extracts URLs for each Bundesland.
  */
 async function getBundeslandUrls(): Promise<string[]> {
     const overviewUrl = `${BASE_URL}/kitas/`;
     console.log(`Fetching Bundesland URLs from ${overviewUrl}`);
     // TODO: Log to job status
     try {
         const response = await axios.get(overviewUrl, { headers: HEADERS });
         const $ = cheerio.load(response.data);
         const bundeslandUrls = new Set<string>();

         // Find links that likely point to Bundesland pages
         // This selector needs verification based on the actual structure of kita.de/kitas/
         // Example: Look for links within a specific list or section
         $('a[href^="/kitas/"]').each((_, el) => {
             const href = $(el).attr('href');
             // Filter out pagination links or other non-Bundesland links
             if (href && href.startsWith('/kitas/') && href.split('/').length === 3) { // e.g., /kitas/berlin/
                 const fullUrl = BASE_URL + href;
                 bundeslandUrls.add(fullUrl);
                 console.log(`   Found Bundesland URL: ${fullUrl}`);
             }
         });

         if (bundeslandUrls.size === 0) {
             console.warn("   No Bundesland URLs found. Check CSS selectors.");
             // TODO: Log warning to job status
             // Return a default or throw error? Returning empty for now.
         }

         return Array.from(bundeslandUrls);

     } catch (error) {
         console.error(`Error fetching or parsing Bundesland URLs from ${overviewUrl}:`, error);
         // TODO: Log error to job status
         // TODO: Update job status to failed?
         return []; // Return empty array on error
      }
  }

 /**
  * Fetches a Bundesland page and extracts URLs for each Bezirk/Region within it.
  */
 async function getBezirkUrls(bundeslandUrl: string): Promise<string[]> {
     console.log(`Fetching Bezirk URLs from ${bundeslandUrl}`);
     // TODO: Log to job status
     try {
         const response = await axios.get(bundeslandUrl, { headers: HEADERS });
         const $ = cheerio.load(response.data);
         const bezirkUrls = new Set<string>();
         const bundeslandPath = new URL(bundeslandUrl).pathname; // e.g., /kitas/berlin/

         // Find links that likely point to Bezirk pages within the current Bundesland
         // This selector needs verification based on the actual structure
         // Example: Look for links within a specific list, often starting with the Bundesland path
         $(`a[href^="${bundeslandPath}"]`).each((_, el) => {
             const href = $(el).attr('href');
             // Filter out links that are just the Bundesland itself or pagination etc.
             // Expecting format like /kitas/berlin/mitte/
             if (href && href.startsWith(bundeslandPath) && href.length > bundeslandPath.length && href.endsWith('/')) {
                 const fullUrl = BASE_URL + href;
                 bezirkUrls.add(fullUrl);
                 console.log(`   Found Bezirk URL: ${fullUrl}`);
             }
         });

         if (bezirkUrls.size === 0) {
             console.warn(`   No Bezirk URLs found on ${bundeslandUrl}. Check CSS selectors.`);
             // TODO: Log warning to job status
         }

         return Array.from(bezirkUrls);

     } catch (error) {
         console.error(`Error fetching or parsing Bezirk URLs from ${bundeslandUrl}:`, error);
         // TODO: Log error to job status
         return []; // Return empty array on error
      }
  }

 /**
  * Fetches Kita URLs from a Bezirk page, handling pagination.
  * @param bezirkPageUrl - The starting URL of the Bezirk page.
  * @param maxKitasToFetch - An approximate limit for the total number of Kitas to fetch from this Bezirk.
  */
 async function getKitaUrlsFromBezirkPage(bezirkPageUrl: string, maxKitasToFetch: number): Promise<string[]> {
     let allKitaUrls = new Set<string>();
     let currentPage = 1;
     let hasMorePages = true;
     let fetchedCount = 0;

     console.log(`Fetching Kita URLs from ${bezirkPageUrl} (limit ~${maxKitasToFetch})`);
     // TODO: Log to job status

     while (hasMorePages && fetchedCount < maxKitasToFetch) {
         // Construct URL for the current page. Assumes pagination format like /p=2/
         // Adjust if the format is different (e.g., ?page=2)
         const url = `${bezirkPageUrl}` + (currentPage > 1 ? `p=${currentPage}/` : '');
         console.log(`   - Scraping page ${currentPage}: ${url}`);
         // TODO: Log to job status

         try {
             const response = await axios.get(url, { headers: HEADERS });
             const $ = cheerio.load(response.data);
             const kitaLinksOnPage = extractKitaUrlsFromHtml($, BASE_URL); // Use the existing helper

             if (kitaLinksOnPage.length === 0) {
                 hasMorePages = false;
                 console.log(`   - No more Kita URLs found on page ${currentPage}.`);
                 // TODO: Log to job status
             } else {
                 kitaLinksOnPage.forEach(link => allKitaUrls.add(link));
                 fetchedCount = allKitaUrls.size; // Update count based on unique URLs
                 console.log(`   - Found ${kitaLinksOnPage.length} URLs on page ${currentPage}. Total unique now: ${fetchedCount}`);
                 // TODO: Log to job status

                 // Check if there's likely a next page.
                 // This logic might need refinement based on how kita.de indicates the last page.
                 // Example: Check for a disabled 'next' button or if the number of links is less than expected per page.
                 // For now, assume we continue if we found links. A simple check:
                 const hasNextPageLink = $('a:contains("»"), a:contains("Weiter"), a.next').length > 0; // Example selectors
                 if (!hasNextPageLink) {
                      hasMorePages = false;
                      console.log(`   - No 'next page' link detected on page ${currentPage}. Assuming end of pagination.`);
                 } else {
                     currentPage++;
                     await sleep(randomDelay()); // Delay before fetching next page
                 }
             }
         } catch (error: any) {
             // Handle 404 specifically for pagination end, otherwise log error
             if (axios.isAxiosError(error) && error.response?.status === 404 && currentPage > 1) {
                 console.log(`   - Page ${currentPage} not found (404). Assuming end of pagination for ${bezirkPageUrl}.`);
                 hasMorePages = false;
             } else {
                 console.error(`   - Error scraping page ${url}:`, error);
                 // TODO: Log error to job status
                 hasMorePages = false; // Stop pagination on other errors for this bezirk
             }
         }
     }

     const finalUrls = Array.from(allKitaUrls);
     console.log(`   Finished scraping Bezirk ${bezirkPageUrl}. Found ${finalUrls.length} unique Kita URLs.`);
     // TODO: Log to job status

     // Apply the overall limit if necessary (though the loop condition already handles it)
     return finalUrls.slice(0, maxKitasToFetch);
 }

// Helper to extract URLs (similar to Python version)
function extractKitaUrlsFromHtml($: cheerio.CheerioAPI, baseUrl: string): string[] {
     const urls = new Set<string>();
     $('a[href*="/kita/"]').each((_, el) => {
         let href = $(el).attr('href');
         if (href && /^\/?kita\/\d+/.test(href)) {
             if (href.startsWith('/')) {
                 href = baseUrl + href;
             }
             urls.add(href);
         }
     });
     return Array.from(urls);
 }

 /**
  * Scrapes detailed information from a single Kita page.
  * @param kitaUrl - The URL of the Kita detail page.
  */
 async function scrapeKitaDetails(kitaUrl: string): Promise<any | null> { // TODO: Use KitaRawData type
     console.log(`   - Scraping details from ${kitaUrl}`);
     // TODO: Log to job status
     try {
         const response = await axios.get(kitaUrl, { headers: HEADERS });
         const $ = cheerio.load(response.data);
         const details = extractDetailsFromHtml($, kitaUrl); // Pass URL for source_url

         return details;

     } catch (error: any) {
         console.error(`   - Error scraping details from ${kitaUrl}:`, error.message);
         // TODO: Log error to job status
         return null; // Indicate failure
     }
 }

 /**
  * Helper function to extract structured data from the Cheerio object of a Kita detail page.
  * Note: Selectors are based on assumptions and the Python script, they MUST be verified against the live website.
  */
 function extractDetailsFromHtml($: cheerio.CheerioAPI, sourceUrl: string): any { // TODO: Use KitaRawData type
     const kitaInfo: any = { source_url: sourceUrl }; // TODO: Use KitaRawData type

     // --- Extract Name (h1) ---
     try {
         kitaInfo.name = $('h1').first().text().trim() || 'Unbekannt';
     } catch (e) { console.warn("Could not extract name"); }

     // --- Extract Address (assuming it's in a <p> tag near <h1>) ---
     // This is fragile and needs verification.
     try {
         const addressBlock = $('h1').first().next('p').text().trim();
         if (addressBlock) {
             // Regex similar to Python script to extract Straße, PLZ, Ort
             const addressPattern = /(.+?)\s+(\d{5})\s+(.+)/; // Simplified, adjust as needed
             const match = addressBlock.match(addressPattern);
             if (match) {
                 kitaInfo.strasse = match[1].replace(/,$/, '').trim(); // Remove trailing comma if present
                 kitaInfo.plz = match[2].trim();
                 kitaInfo.ort = match[3].trim();
                 // Extract Bezirk if possible (e.g., "Berlin / Mitte")
                 const bezirkMatch = kitaInfo.ort.match(/^(.*?)\s*\/\s*(.*)$/);
                 if (bezirkMatch) {
                     kitaInfo.ort = bezirkMatch[1].trim();
                     kitaInfo.bezirk = bezirkMatch[2].trim();
                 }
             } else {
                 // Fallback if regex fails
                 kitaInfo.address_full = addressBlock; // Store full block if parsing fails
                 console.warn(`Could not parse address block: ${addressBlock}`);
             }
         } else {
              console.warn("Could not find address block near h1");
         }
     } catch (e) { console.warn("Error extracting address block"); }


     // --- Extract Table Data (assuming a specific table structure) ---
     try {
         // Find the table - adjust selector if needed
         const infoTable = $('table').first(); // Or a more specific selector like table.info-table
         infoTable.find('tr').each((_, row) => {
             const cells = $(row).find('th, td');
             if (cells.length >= 2) {
                 const header = $(cells[0]).text().trim().replace(':', '');
                 const value = $(cells[1]).text().trim();

                 // Map headers to keys (case-insensitive matching for robustness)
                 const lowerHeader = header.toLowerCase();
                 if (lowerHeader.includes("träger") && !lowerHeader.includes("typ")) kitaInfo.traeger = value;
                 else if (lowerHeader.includes("trägertyp")) kitaInfo.traegertyp = value;
                 else if (lowerHeader.includes("dachverb")) kitaInfo.dachverband = value; // Includes "Dachverbände"
                 else if (lowerHeader.includes("plätze") && lowerHeader.includes("gesamt")) kitaInfo.plaetze_gesamt = value.split('/')[0]?.trim(); // Extract total places
                 else if (lowerHeader.includes("plätze") && lowerHeader.includes("freie")) kitaInfo.freie_plaetze = value.split('/')[1]?.trim(); // Extract free places
                 else if (lowerHeader.includes("betreuungszeit")) kitaInfo.betreuungszeit = value;
                 else if (lowerHeader.includes("aufnahmealter")) kitaInfo.betreuungsalter_von = value.replace(/ab\s*/i, '').trim();
                 else if (lowerHeader.includes("betreuungsalter") && !lowerHeader.includes("aufnahme")) kitaInfo.betreuungsalter_bis = value.replace(/bis\s*/i, '').trim();
                 else if (lowerHeader.includes("pädagogisches konzept")) kitaInfo.paedagogisches_konzept = value;
             }
         });
     } catch (e) { console.warn("Error extracting table data"); }

      // --- Extract Opening Hours (assuming under h2) ---
      try {
          const hoursHeading = $('h2').filter((_, el) => $(el).text().trim().toLowerCase() === 'öffnungszeiten');
          if (hoursHeading.length > 0) {
              // Try to get the next element's text, might be a <p> or <div>
              kitaInfo.oeffnungszeiten = hoursHeading.first().next().text().trim();
          }
      } catch (e) { console.warn("Error extracting opening hours"); }

      // --- Extract Website (look for external links) ---
      try {
          let foundWebsite = false;
          // Prioritize links explicitly labeled or near "Website", "Internet" etc.
          $('a').each((_, link) => {
              const href = $(link).attr('href');
              const linkText = $(link).text().toLowerCase();
              const parentText = $(link).parent().text().toLowerCase();
              if (href && href.startsWith('http') && !href.includes('kita.de')) {
                  if (linkText.includes("website") || linkText.includes("internet") || parentText.includes("website") || parentText.includes("internet")) {
                      kitaInfo.website = href;
                      foundWebsite = true;
                      return false; // Stop searching
                  }
              }
          });
          // Fallback: take the first external link if no specific one found
          if (!foundWebsite) {
               $('a').each((_, link) => {
                   const href = $(link).attr('href');
                   if (href && href.startsWith('http') && !href.includes('kita.de')) {
                       kitaInfo.website = href;
                       return false; // Stop after finding the first external link
                   }
               });
          }
      } catch (e) { console.warn("Error extracting website"); }


     return kitaInfo;
 }

 // TODO: Define KitaRawData type based on scraped fields
 // Use Partial<Company> for the mapped data to allow upserting only specific fields
 function mapKitaData(rawData: any): Partial<Company> { // TODO: Define KitaRawData type
     // Map rawData fields to the public.companies table structure
     // Ensure keys match the Company type and database columns
     // Provide default values or null for fields that might be missing
     const mapped: Partial<Company> = {
        name: rawData.name,
         street: rawData.strasse || null,
         postal_code: rawData.plz || null,
         city: rawData.ort || null,
         // bundesland: rawData.bundesland || null, // Needs to be determined based on context (e.g., from Bezirk URL)
         website: rawData.website || null,
         source_url: rawData.source_url, // Should always exist if rawData exists
         sponsor_name: rawData.traeger || null,
         sponsor_type: rawData.traegertyp || null,
         capacity_total: rawData.plaetze_gesamt || null,
         capacity_free: rawData.freie_plaetze || null,
         opening_hours_text: rawData.oeffnungszeiten || null,
         association: rawData.dachverband || null,
         min_age: rawData.betreuungsalter_von || null,
         max_age: rawData.betreuungsalter_bis || null,
         special_pedagogy: rawData.paedagogisches_konzept || null,
         // description: rawData.description || null, // Map if description is scraped
         // type: rawData.type || null, // Map if type is scraped
         // latitude: undefined, // Explicitly undefined as Geocoding is TODO
         // longitude: undefined, // Explicitly undefined as Geocoding is TODO
        // longitude: null, // Geocoding TODO
         // ... other fields ...
     };
     // Remove undefined properties before returning
     Object.keys(mapped).forEach(key => mapped[key as keyof Partial<Company>] === undefined && delete mapped[key as keyof Partial<Company>]);
     return mapped;
 }

 async function saveKitaBatch(kitas: Partial<Company>[], jobId: string) {
     console.log(`      - TODO: Implement saveKitaBatch - Saving batch of ${kitas.length} kitas for job ${jobId}`);
     try {
         // Explicitly type the upsert call
         const { data, error } = await supabase
             .from('companies')
             .upsert(kitas as Company[], { onConflict: 'source_url' }) // Cast might be needed depending on strictness, or ensure kitas match Company[]
             .select(); // Add select() to potentially get typed data back if needed, or handle response type

        if (error) {
              throw error;
          }
          // Explicitly check if data is not null before accessing length
          const upsertedCount = data ? data.length : 0;
          console.log(`      - Batch saved successfully. Upserted: ${upsertedCount}`);
          // TODO: Log success to job status
      } catch (error) {
        console.error(`      - Error saving batch:`, error);
        // TODO: Log error to job status
    }
}

function randomDelay(min = 1000, max = 2500): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Main Import Process Function ---

export async function runImportProcess(jobId: string, dryRun: boolean, config: any) { // TODO: Use ImportConfig type
    console.log(`Starting import process for job ${jobId}...`, { dryRun, config });
    // TODO: Update job status to 'running'

    let totalKitasProcessed = 0;
    let totalKitasSaved = 0; // Only relevant if not dryRun
    const collectedResults: any[] = []; // For dry run // TODO: Use KitaMappedData[]

    try {
        const bundeslandUrls = await getBundeslandUrls(); // TODO: Filter based on config.startLocation if needed
        // TODO: Log found Bundesländer

        for (const bundeslandUrl of bundeslandUrls) {
            // TODO: Log current Bundesland
            const bezirkUrls = await getBezirkUrls(bundeslandUrl); // TODO: Filter based on config.startLocation
            // TODO: Log found Bezirke

            for (const bezirkUrl of bezirkUrls) {
                // TODO: Log current Bezirk
                const kitaUrls = await getKitaUrlsFromBezirkPage(bezirkUrl, config.maxKitas || 100);
                // TODO: Log found Kita URLs for Bezirk

                 const batchToSave: Partial<Company>[] = [];

                 for (const kitaUrl of kitaUrls) {
                     // TODO: Update progress in job status
                     totalKitasProcessed++;
                     // Log the URL being processed
                     console.log(`   [${totalKitasProcessed}] Scraping Kita URL: ${kitaUrl}`);
                     // TODO: Log this message to the job status/logs

                     const rawDetails = await scrapeKitaDetails(kitaUrl);
                     if (rawDetails) {
                        // Log the *extracted* data for verification
                        console.log(`      -> Extracted: ${rawDetails.name} (${rawDetails.ort || 'Ort unbekannt'})`);
                        // TODO: Log extracted details (or key parts) to the job status/logs

                        const mappedData = mapKitaData(rawDetails);
                        // TODO: Add bundesland info if possible
                        // TODO: Add validation for mappedData

                        if (dryRun) {
                            collectedResults.push(mappedData);
                        } else {
                            batchToSave.push(mappedData);
                            if (batchToSave.length >= (config.batchSize || 10)) {
                                await saveKitaBatch(batchToSave, jobId);
                                totalKitasSaved += batchToSave.length;
                                batchToSave.length = 0; // Clear the batch
                                await sleep(randomDelay(500, 1500)); // Delay after saving batch
                            }
                        }
                    } else {
                         // Error already logged in scrapeKitaDetails
                         // TODO: Increment error count in job status
                    }
                    await sleep(randomDelay()); // Delay between scraping individual Kitas
                } // End loop through Kitas in Bezirk

                // Save any remaining Kitas in the batch for this Bezirk
                if (!dryRun && batchToSave.length > 0) {
                    await saveKitaBatch(batchToSave, jobId);
                    totalKitasSaved += batchToSave.length;
                }
                 await sleep(randomDelay(2000, 5000)); // Longer delay between Bezirke
            } // End loop through Bezirke
        } // End loop through Bundesländer

        console.log(`Import process for job ${jobId} finished.`);
        console.log(`Total Kitas Processed: ${totalKitasProcessed}`);
        if (dryRun) {
            console.log(`Collected ${collectedResults.length} Kitas (Dry Run).`);
            // TODO: Store collectedResults for retrieval via API
        } else {
            console.log(`Total Kitas Saved/Upserted: ${totalKitasSaved}`);
        }
        // TODO: Update job status to 'completed'

    } catch (error) {
        console.error(`Import process failed for job ${jobId}:`, error);
        // TODO: Update job status to 'failed' with error details
    }
}

// Basic placeholder export if needed, or export the main function
export {};
