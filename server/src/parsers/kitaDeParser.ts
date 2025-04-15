import type * as CheerioAPI from 'cheerio';
// Import interfaces/types needed
import type { RawKitaDetails } from '../types/company.d.ts';
// Import status functions using require with relative path adjustment
const { addLog } = require('../services/importStatusService');

/**
 * Extracts Kita details from the HTML content of a detail page.
 * (Moved from kitaDeScraper.ts)
 * @param $ - Cheerio API instance loaded with the page HTML.
 * @param sourceUrl - The URL of the page being scraped.
 * @param jobId - The ID of the current import job for logging.
 * @returns An object containing the extracted Kita information, or null if basic info is missing.
 */
export function extractDetailsFromHtml($: CheerioAPI.CheerioAPI, sourceUrl: string, jobId: string): RawKitaDetails | null {
    const kitaInfo: Partial<RawKitaDetails> = { source_url: sourceUrl }; // Use Partial for building

    // --- Name ---
    try {
       kitaInfo.name = $('h1').first().text().trim() || undefined; // Use undefined if empty
       if (!kitaInfo.name) {
           addLog(jobId, `Could not extract name from ${sourceUrl}`, 'warn');
           // return null; // Decide if critical
       }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting name: ${message}`, 'warn');
    }

    // --- Address ---
    try {
        let addressBlock: string | null = null;
        const h1 = $('h1').first();
        if (h1.length > 0) {
            const nextP = h1.next('p');
            if (nextP.length > 0) {
                addressBlock = nextP.text().trim();
            }
        }
        if (!addressBlock) {
            $('p').each((_, el) => {
                const text = $(el).text().trim();
                if (/\d{5}\s+\w+/.test(text)) {
                    addressBlock = text;
                    return false;
                }
            });
        }
        if (addressBlock) {
            const addressPattern = /(.+?\s+\d+(?:[-‐‑‒–—―]?\s*\d*\w*)?)\s*(\d{5})\s*(.+)/;
            const match = addressBlock.match(addressPattern);
            if (match) {
                kitaInfo.strasse = match[1].replace(/,$/, '').trim();
                kitaInfo.plz = match[2].trim();
                kitaInfo.ort = match[3].trim();
                const bezirkMatch = kitaInfo.ort.match(/^(.*?)\s*\/\s*(.*)$/);
                if (bezirkMatch) {
                    kitaInfo.ort = bezirkMatch[1].trim();
                    kitaInfo.bezirk = bezirkMatch[2].trim();
                } else if (kitaInfo.ort.toLowerCase().includes('berlin')) {
                    kitaInfo.bezirk = kitaInfo.ort.replace(/berlin/i, '').trim() || 'Unbekannt';
                    kitaInfo.ort = 'Berlin';
                }
            } else {
                kitaInfo.address_full = addressBlock;
                addLog(jobId, `Could not parse address block: ${addressBlock}`, 'warn');
            }
        } else {
            addLog(jobId, "Could not find address block", 'warn');
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting address block: ${message}`, 'warn');
    }

    // --- Table Data ---
    try {
        const infoTable = $('table').first();
        if (infoTable.length > 0) {
            infoTable.find('tr').each((_, row) => {
                const cells = $(row).find('th, td');
                if (cells.length >= 2) {
                    const header = $(cells[0]).text().trim().replace(':', '');
                    const value = $(cells[1]).text().trim();
                    const lowerHeader = header.toLowerCase();
                    if (header === "Träger") {
                        kitaInfo.traeger = value;
                    } else if (lowerHeader.includes("trägertyp")) {
                        kitaInfo.traegertyp = value;
                    } else if (lowerHeader.includes("dachverb")) {
                        kitaInfo.dachverband = value;
                    } else if (lowerHeader.includes("plätze") && lowerHeader.includes("freie")) {
                        const match = value.match(/(\d+)\s*\/\s*(\?|\d+)/);
                        if (match) {
                            kitaInfo.plaetze_gesamt = match[1];
                            kitaInfo.freie_plaetze = match[2];
                        } else {
                            kitaInfo.plaetze_gesamt = value;
                            kitaInfo.freie_plaetze = "?";
                            addLog(jobId, `Could not parse Plätze format: ${value}`, 'warn');
                        }
                    } else if (lowerHeader.includes("betreuungszeit")) {
                        kitaInfo.betreuungszeit = value;
                    } else if (lowerHeader.includes("aufnahmealter")) {
                        kitaInfo.betreuungsalter_von = value.replace(/ab\s*/i, '').trim();
                    } else if (lowerHeader.includes("betreuungsalter") && !lowerHeader.includes("aufnahme")) {
                        kitaInfo.betreuungsalter_bis = value.replace(/bis\s*/i, '').trim();
                    } else if (lowerHeader.includes("pädagogisches konzept")) {
                        kitaInfo.paedagogisches_konzept = value;
                    }
                }
            });
        } else {
            addLog(jobId, "Info table not found", 'warn');
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting table data: ${message}`, 'warn');
    }

    // --- Opening Hours ---
    try {
        const hoursHeading = $('h2').filter((_, el) => $(el).text().trim().toLowerCase() === 'öffnungszeiten');
        if (hoursHeading.length > 0) {
            const nextElement = hoursHeading.first().next();
            if (nextElement.length > 0) {
                kitaInfo.oeffnungszeiten = nextElement.text().trim();
            } else {
                 addLog(jobId, "Found 'Öffnungszeiten' heading but no next element", 'warn');
            }
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting opening hours: ${message}`, 'warn');
    }

    // --- Website ---
    try {
        let foundWebsite = false;
        const internetTextElement = $('*:contains("Internet:")').filter((_, el) => $(el).text().trim() === 'Internet:');
        if (internetTextElement.length > 0) {
            const parent = internetTextElement.parent();
            const link = parent.find('a[href^="http"]');
            if (link.length > 0) {
                const href = link.attr('href');
                if (href && !href.includes('kita.de')) {
                    kitaInfo.website = href;
                    foundWebsite = true;
                }
            }
        }
        if (!foundWebsite) {
            $('a[href^="http"]').each((_, el) => {
                const href = $(el).attr('href');
                if (href && !href.includes('kita.de')) {
                    kitaInfo.website = href;
                    foundWebsite = true;
                    return false;
                }
            });
        }
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        addLog(jobId, `Error extracting website: ${message}`, 'warn');
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
