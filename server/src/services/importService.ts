// Import types separately using 'import type'
import type { Company } from '../types/company.d.ts';
import type { ScrapingConfig } from '../scrapers/kitaDeScraper.js';
import type { RawKitaDetails } from '../types/company.d.ts';

// Import functions and modules with .js extensions
import { getBundeslandUrlsAndNames, getBezirkUrlsAndNames, getKitaUrlsFromBezirkPage, scrapeKitaDetails } from '../scrapers/kitaDeScraper.js';
import { mapKitaData } from '../mappers/kitaDeMapper.js';
import { importConfig } from '../config/importConfig.js';
import { GERMAN_STATES } from '../config/germanStates.js'; // Import GERMAN_STATES
import { addLog, updateJobStatus } from './importStatusService.js';
import { supabase } from '../supabaseServiceRoleClient.js'; // Import geändert

/**
 * Speichert einen Batch von Kitas in der Supabase-Datenbank per upsert.
 * Gibt ein Promise<void> zurück.
 */
async function saveKitaBatch(jobId: string, kitas: Partial<Company>[]): Promise<void> {
   // --- DEBUG: Check if supabase client is available ---
   console.log(`[${jobId}] DEBUG saveKitaBatch: Checking supabase client...`, typeof supabase, supabase ? Object.keys(supabase) : 'undefined');
   // --- END DEBUG ---
   if (kitas.length === 0) {
       addLog(jobId, "Skipping saveKitaBatch: No Kitas in batch.", 'warn');
       return; // Don't attempt to save an empty batch
   }
   addLog(jobId, `Attempting to save/update batch of ${kitas.length} kitas...`);
   try {
       // --- DEBUG: Log data being sent to upsert ---
       console.log(`[${jobId}] DEBUG saveKitaBatch: Data to upsert:`, JSON.stringify(kitas, null, 2));
       // --- END DEBUG ---
       // Use the imported Supabase client
       // Upsert based on the source_url to insert new or update existing Kitas
       const { data, error } = await supabase
           .from('companies') // Target the 'companies' table
           .upsert(kitas, { onConflict: 'source_url' }) // Perform upsert on conflict with source_url
           .select(); // Select the upserted data (optional, useful for logging count)

       if (error) {
           // Log the detailed Supabase error if available
           console.error(`[${jobId}] Supabase upsert error:`, JSON.stringify(error, null, 2));
           throw new Error(`Supabase upsert failed: ${error.message} (Code: ${error.code})`);
       }

       const upsertedCount = data ? data.length : 0;
       addLog(jobId, `Batch saved/updated successfully. Rows affected: ${upsertedCount}`);
       // Optional: Log details of what was upserted if needed for debugging
       // console.log(`[${jobId}] Upserted data sample:`, data?.slice(0, 2));

   } catch (error: unknown) { // Use unknown for errors
       const message = error instanceof Error ? error.message : String(error);
       // Log the error with more context
       console.error(`[${jobId}] Error during saveKitaBatch execution:`, error);
       addLog(jobId, `Error saving/updating Kita batch: ${message}`, 'error');
 }
}

// Helper function for delays (Consider moving to a shared utils module later)
// Hilfsfunktion für Delays
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
function randomDelay(min = 1000, max = 2500): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// --- Main Import Process Function ---

/**
 * Hauptfunktion für den Importprozess.
 * Gibt ein Promise<void> zurück.
 */
async function runImportProcess(
    jobId: string,
    dryRun: boolean,
    bezirke: { name: string, url: string }[],
    kitaLimitPerBezirk: number
): Promise<void> {
    console.log(`[${jobId}] --- runImportProcess CALLED ---`);
    console.log(`[${jobId}] --- runImportProcess ENTERED ---`);
    console.log(`[${jobId}] DEBUG: Import gestartet für ${bezirke.length} Bezirke, Limit ${kitaLimitPerBezirk}, DryRun: ${dryRun}`);
    addLog(jobId, `DEBUG: Import gestartet für ${bezirke.length} Bezirke, Limit ${kitaLimitPerBezirk}, DryRun: ${dryRun}`);
    // Log the actual parameters received
    addLog(jobId, `Starting import process... Dry run: ${dryRun}, Bezirke: ${bezirke.map(b => b.name).join(', ')}, Limit/Bezirk: ${kitaLimitPerBezirk}`);
    updateJobStatus(jobId, 'running');

    let totalKitasProcessed = 0;
    let totalKitasSaved = 0;
     let overallProgress = 0;

     // Helper function to extract the correct Bundesland DB value from Bezirk URL
     const getBundeslandDbValueFromUrl = (url: string): string | undefined => {
         try {
             const pathParts = new URL(url).pathname.split('/');
             // Assuming URL structure like /kitas/bundesland-slug/bezirk
             if (pathParts.length >= 3 && pathParts[1] === 'kitas') {
                 const bundeslandSlug = pathParts[2]; // e.g., 'mecklenburg-vorpommern'
                 const foundState = GERMAN_STATES.find(state => state.value === bundeslandSlug);
                 if (foundState) {
                     return foundState.dbValue; // Return the exact DB value like "Mecklenburg-Vorpommern"
                 } else {
                     console.warn(`[${jobId}] Bundesland slug '${bundeslandSlug}' from URL ${url} not found in GERMAN_STATES.`);
                 }
             }
         } catch (e) {
             console.error(`[${jobId}] Error parsing Bundesland DB value from URL ${url}:`, e);
        }
        return undefined;
    };


     try {
         // Use the passed-in bezirke array
         const bezirkeToProcess = bezirke;
         const totalBezirkeToProcess = bezirkeToProcess.length;

         if (totalBezirkeToProcess === 0) {
             throw new Error("No Bezirke provided to process.");
         }
         addLog(jobId, `Processing ${totalBezirkeToProcess} specified Bezirk(s): ${bezirkeToProcess.map(b => b.name).join(', ')}`);

         // --- Process each provided Bezirk ---
         for (let bzIndex = 0; bzIndex < totalBezirkeToProcess; bzIndex++) {
              const currentBezirk = bezirkeToProcess[bzIndex];
              const bezirkName = currentBezirk.name;
              const bezirkUrl = currentBezirk.url;
              const bundeslandDbValue = getBundeslandDbValueFromUrl(bezirkUrl); // Get correct DB value

              console.log(`[${jobId}] Processing Bezirk ${bzIndex + 1}/${totalBezirkeToProcess}: ${bezirkName} (Bundesland DB: ${bundeslandDbValue || 'unbekannt'}) - URL: ${bezirkUrl}`);
              addLog(jobId, `  Processing Bezirk: ${bezirkName} (Bundesland DB: ${bundeslandDbValue || 'unbekannt'})`);

              if (!bundeslandDbValue) {
                  addLog(jobId, `    Could not determine Bundesland DB value for ${bezirkUrl}. Skipping Bezirk.`, 'warn');
                  continue; // Skip this Bezirk if Bundesland cannot be determined
              }

             // Use the passed kitaLimitPerBezirk
             const kitaUrls = await getKitaUrlsFromBezirkPage(jobId, bezirkUrl, kitaLimitPerBezirk);
             console.log(`[${jobId}] Found ${kitaUrls.length} Kita URLs for ${bezirkName} (Limit: ${kitaLimitPerBezirk}).`);

             const batchToSave: Partial<Company>[] = [];
             const kitaDetailPromises: Promise<void>[] = [];
             const concurrencyLimit = 5; // Number of parallel detail requests

             // --- Process Kita URLs in chunks for controlled concurrency ---
             for (let i = 0; i < kitaUrls.length; i += concurrencyLimit) {
                 const chunk = kitaUrls.slice(i, i + concurrencyLimit);
                 console.log(`[${jobId}] Processing Kita chunk ${i / concurrencyLimit + 1} (size: ${chunk.length})`);

                 const chunkPromises = chunk.map(async (kitaUrl, indexInChunk) => {
                     const overallIndex = i + indexInChunk;
                     totalKitasProcessed++; // Increment here as we start processing
                     console.log(`[${jobId}] Processing Kita ${overallIndex + 1}/${kitaUrls.length}: ${kitaUrl}`);
                     addLog(jobId, `    [${totalKitasProcessed}] Processing Kita: ${kitaUrl}`);

                     const rawDetails: RawKitaDetails | null = await scrapeKitaDetails(jobId, kitaUrl);
                     console.log(`[${jobId}] Scraped details for ${kitaUrl}. Details found: ${!!rawDetails}`);

                      if (rawDetails) {
                          addLog(jobId, `      -> Extracted: ${rawDetails.name} (${rawDetails.ort || 'Ort unbekannt'})`);
                          // Pass correct Bundesland DB value and Bezirk name to the mapper
                          const mappedData = mapKitaData(rawDetails, bundeslandDbValue, bezirkName);
                          addLog(jobId, `      -> MappedData Keys: ${Object.keys(mappedData).join(', ')}`);

                          // Synchronize access to batchToSave or handle results differently
                         // For simplicity here, we push directly, but consider locking or queueing for robustness
                         if (dryRun) {
                             addLog(jobId, `      -> Dry run: mappedData erzeugt (nicht gespeichert)`);
                         } else {
                             batchToSave.push(mappedData);
                             // Batch size check - use a default or make configurable later
                             const batchSize = 10; // Example batch size
                             if (batchToSave.length >= batchSize) {
                                 // Saving is now handled after the chunk processing below
                                 // console.log(`[${jobId}] Batch ready (size: ${batchToSave.length})`);
                                 // totalKitasSaved += batchToSave.length;
                                 // batchToSave.length = 0;
                                 console.log(`[${jobId}] Batch ready to be saved (size: ${batchToSave.length}) - saving will happen after chunk processing`);
                             }
                          }
                      }

                      // Update overall progress (needs adjustment for parallel execution)
                      // This calculation is now less accurate due to parallel processing.
                      // A better approach might be to update progress after each chunk finishes.
                      if (kitaUrls.length > 0) {
                         overallProgress = Math.round(((bzIndex + (overallIndex + 1) / kitaUrls.length) / totalBezirkeToProcess) * 100);
                      } else if (totalBezirkeToProcess > 0) {
                         overallProgress = Math.round(((bzIndex + 1) / totalBezirkeToProcess) * 100);
                      } else {
                         overallProgress = 100;
                      }
                      // Progress calculation moved after chunk processing

                 }); // End of chunk.map

                 // Wait for all promises in the current chunk to complete
                 await Promise.all(chunkPromises);
                 console.log(`[${jobId}] Finished processing Kita chunk ${i / concurrencyLimit + 1}`);

                 // --- Calculate and Update Progress ---
                 const processedKitasInCurrentBezirk = i + chunk.length;
                 let progressFractionCurrentBezirk = 0;
                 if (kitaUrls.length > 0) {
                     progressFractionCurrentBezirk = processedKitasInCurrentBezirk / kitaUrls.length;
                 }
                 // Ensure progress doesn't exceed 1 for the current Bezirk if counts are off
                 progressFractionCurrentBezirk = Math.min(progressFractionCurrentBezirk, 1);

                 // Calculate overall progress based on completed Bezirke + fraction of the current one
                 overallProgress = Math.round(((bzIndex + progressFractionCurrentBezirk) / totalBezirkeToProcess) * 100);
                 // Ensure progress doesn't exceed 100
                 overallProgress = Math.min(overallProgress, 100);

                 console.log(`[${jobId}] Progress Update: Bezirk ${bzIndex + 1}/${totalBezirkeToProcess}, Kitas in Bezirk ${processedKitasInCurrentBezirk}/${kitaUrls.length}, Overall: ${overallProgress}%`);
                 // Pass overallProgress as the third argument (messageOrProgress)
                 updateJobStatus(jobId, 'running', overallProgress);
                 // --- End Progress Update ---


                 // Now save the batch collected from this chunk (if not dry run)
                 if (!dryRun && batchToSave.length > 0) {
                     console.log(`[${jobId}] Saving batch after chunk processing (size: ${batchToSave.length})...`);
                     await saveKitaBatch(jobId, batchToSave);
                     totalKitasSaved += batchToSave.length;
                     batchToSave.length = 0; // Clear the batch
                     await sleep(randomDelay(500, 1000)); // Optional delay after saving batch
                 }

                 // Optional delay between chunks
                 if (i + concurrencyLimit < kitaUrls.length) {
                    await sleep(randomDelay(500, 1500));
                 }

             } // End of loop through chunks

              // Save remaining batch for the Bezirk
              if (!dryRun && batchToSave.length > 0) {
                  console.log(`[${jobId}] Saving final batch for Bezirk ${bezirkUrl}...`);
                  await saveKitaBatch(jobId, batchToSave);
                  totalKitasSaved += batchToSave.length;
              }
              console.log(`[${jobId}] Finished processing Bezirk ${bezirkUrl}.`);
              if (bzIndex < totalBezirkeToProcess - 1) {
                 console.log(`[${jobId}] Waiting before next Bezirk...`);
                 await sleep(randomDelay(2000, 5000)); // Delay between Bezirke
              }
          } // End of Bezirk loop

         // --- Finalize Job ---
         // updateJobProgress(jobId, 100); // Entfernt, Funktion existiert nicht mehr
         // Adjust final count logic if needed, especially for dry run
         const finalResultCount = dryRun ? totalKitasProcessed : totalKitasSaved;
         const completionMessage = `Import process finished. Processed: ${totalKitasProcessed}. ${dryRun ? 'Collected (Dry Run)' : 'Saved/Upserted'}: ${finalResultCount}`;
         addLog(jobId, completionMessage);
         // Explicitly set progress to 100 on completion
         updateJobStatus(jobId, 'completed', completionMessage, 100);
         console.log(`[${jobId}] --- runImportProcess COMPLETED NORMALLY ---`);
     }
     catch (error: unknown) {
         const message = error instanceof Error ? error.message : String(error);
         console.error(`[${jobId}] --- runImportProcess CAUGHT ERROR ---`, error);
         addLog(jobId, `Import process failed: ${message}`, 'error');
         updateJobStatus(jobId, 'failed', message);
     }
}




// Fetch preview of knowledge posts from WordPress API

// Export using named export for ES Modules
export {
    runImportProcess
};
