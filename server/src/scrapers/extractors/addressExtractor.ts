import * as cheerio from 'cheerio';
import { Element } from 'domhandler'; // Import Element type from domhandler
import { addLog } from '../../services/importStatusService.js';
import { cleanText } from '../utils/cheerioUtils.js';
import type { RawKitaDetails } from '../../types/company.d.ts'; // Use 'import type'

// Type for the result of the address extraction
export type AddressExtractionResult = Pick<
    RawKitaDetails,
    'strasse' | 'house_number' | 'plz' | 'ort' | 'bezirk' | 'address_full'
>;

/**
 * Extracts address details (street, house number, zip code, city, district)
 * from a given Cheerio context (contact container or body).
 * Uses multiple selectors and regex patterns for robustness.
 *
 * @param $ - The CheerioAPI instance for the page.
 * @param contactContainer - A Cheerio object representing the most likely container for contact info.
 * @param jobId - The ID of the current import job for logging.
 * @returns An object containing the extracted address fields.
 */
export function extractAddress(
    $: cheerio.CheerioAPI,
    contactContainer: cheerio.Cheerio<Element>, // Revert to Cheerio<Element>
    jobId: string
): AddressExtractionResult {
    // Initialize with all possible keys to satisfy the type
    const addressResult: AddressExtractionResult = {
        strasse: undefined,
        house_number: undefined,
        plz: undefined,
        ort: undefined,
        bezirk: undefined,
        address_full: undefined
    };
    let addressFound = false;

    // Explizit nach <p class="address"> suchen (robust, case-insensitive)
    let addressElement = contactContainer.find('p.address');
    addLog(jobId, `[DEBUG] p.address elements found in contactContainer: ${addressElement.length}`, 'info');
    if (addressElement.length === 0) {
        addressElement = $('p.address');
        addLog(jobId, `[DEBUG] p.address elements found in whole page: ${addressElement.length}`, 'info');
    }
    if (addressElement.length === 0) {
        // Try specific selectors first within the container
        addressElement = contactContainer.find('.address, .adresse, p:contains("Straße"), p:contains("Adresse"), div:contains("Straße"), div:contains("Adresse")').first();

        if (addressElement.length === 0) {
            // Fallback 1: Look for paragraphs/divs containing a 5-digit number (PLZ) within the container
            contactContainer.find('p, div').each((index: number, el: Element) => { // Add types
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
            $('p, address, div.address, div.adresse').each((index: number, el: Element) => { // Add types
                const text = $(el).text();
                if (/\d{1,4}[a-zA-Z]?\s*,\s*\d{5}|\d{5}\s+\w+/.test(text) && text.length < 150) {
                    addressElement = $(el);
                    addLog(jobId, `Address found using body fallback selector.`, 'info');
                    return false;
                }
            });
        }
    }

    // Noch robusteres Logging: Immer alles loggen
    addLog(jobId, `[DEBUG] addressElement selector result: length=${addressElement.length}, hasClassAddress=${addressElement.hasClass('address')}`, 'info');
    const html = addressElement.html();
    addLog(jobId, `[DEBUG] addressElement.html (for .address): ${html}`, 'info');
    let lines: string[] = [];
    if (html) {
        lines = html.split(/<br\s*\/?\s*>/i).map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
    }
    addLog(jobId, `[DEBUG] address lines after split: ${JSON.stringify(lines)}`, 'info');

    // Robust: <p class="address"> HTML direkt splitten (ohne Cheerio)
    if (addressElement.length > 0 && addressElement.hasClass('address')) {
        const html = addressElement.html() || '';
        const lines = html.split(/<br\s*\/?\s*>/i).map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
        if (lines.length >= 2) {
            // 1. Zeile: Straße und Hausnummer
            const streetMatch = lines[0].match(/^(.*?)(\d+.*)$/);
            if (streetMatch) {
                addressResult.strasse = streetMatch[1].trim();
                addressResult.house_number = streetMatch[2].trim();
            } else {
                addressResult.strasse = lines[0];
            }
            // 2. Zeile: PLZ und Stadt
            const plzOrtMatch = lines[1].match(/(\d{5})\s*(.*)/);
            if (plzOrtMatch) {
                addressResult.plz = plzOrtMatch[1];
                addressResult.ort = plzOrtMatch[2].trim();
            } else {
                addressResult.ort = lines[1];
            }
            // 3. Zeile: Bezirk (optional)
            if (lines.length > 2) {
                addressResult.bezirk = lines[2];
            }
            addLog(jobId, `Address parsed from <p class='address'> (html split): ${addressResult.strasse} ${addressResult.house_number}, ${addressResult.plz} ${addressResult.ort}${addressResult.bezirk ? ' (' + addressResult.bezirk + ')' : ''}`, 'info');
            return addressResult;
        }
    }

    if (addressElement.length > 0) {
        // Extract text, clean up whitespace, remove labels wie "Adresse:"
        const addressText = cleanText(addressElement.text());

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

                addressResult.plz = plz;
                addressResult.ort = city.replace(/,.*/, '').trim(); // Remove anything after a comma in city

                // Extract Street and House Number
                const houseNumberMatch = streetAndHouse.match(/^(.*?)\s+([\d]+(?:[\s-]?[\d\w\/]+)?)$/); // Allow / in house numbers
                if (houseNumberMatch) {
                    addressResult.strasse = houseNumberMatch[1].trim().replace(/,$/, '');
                    addressResult.house_number = houseNumberMatch[2].trim();
                } else {
                    // Handle cases like "Am Park 5-7" or "Hauptstr. 12a"
                    const complexHouseNrMatch = streetAndHouse.match(/^(.*?)\s+([\d]+[a-zA-Z]?\s*[-\/]?\s*[\d]*[a-zA-Z]?)$/);
                     if (complexHouseNrMatch) {
                         addressResult.strasse = complexHouseNrMatch[1].trim().replace(/,$/, '');
                         addressResult.house_number = complexHouseNrMatch[2].trim();
                     } else {
                        addressResult.strasse = streetAndHouse.replace(/,$/, ''); // Store full string if no number found
                        addLog(jobId, `Could not separate street and house number from: ${streetAndHouse} in ${addressText}`, 'warn');
                     }
                }

                // Refined Bezirk extraction
                const cityPartForBezirk = city; // Use original city string before trimming
                const bezirkMatch = cityPartForBezirk.match(/(?:\(| \/ | - |,\s*Bezirk\s+)(.*?)(?:\)|$)/i);
                if (bezirkMatch && bezirkMatch[1]) {
                    addressResult.bezirk = bezirkMatch[1].trim();
                    // Clean up ort if district was appended
                    if (addressResult.ort) {
                        addressResult.ort = addressResult.ort.replace(bezirkMatch[0], '').trim();
                    }
                } else if (addressResult.ort && addressResult.ort.toLowerCase().includes('berlin') && addressResult.ort.length > 6) {
                    const potentialBezirk = addressResult.ort.replace(/berlin/i, '').replace(/[-()]/g, '').trim();
                     if (potentialBezirk && potentialBezirk.length > 2 && potentialBezirk.toLowerCase() !== 'berlin') {
                        addressResult.bezirk = potentialBezirk;
                        addressResult.ort = 'Berlin';
                    }
                }
                addressFound = true;
                addLog(jobId, `Address parsed: ${addressResult.strasse} ${addressResult.house_number}, ${addressResult.plz} ${addressResult.ort}${addressResult.bezirk ? ' (' + addressResult.bezirk + ')' : ''}`, 'info');
                break; // Stop after first successful match
            }
        }
        if (!addressFound) {
            addressResult.address_full = addressText; // Store raw text if parsing fails
            addLog(jobId, `Could not parse address structure: ${addressText}`, 'warn');
        }
    }

    // Fallback: Wenn alles andere fehlschlägt, versuche addressElement.text() an PLZ zu splitten (mit Korrektur für fehlende Leerzeichen)
    if (addressElement.length > 0 && !addressFound) {
        let addressText = cleanText(addressElement.text());
        // Füge vor der PLZ ein Leerzeichen ein, falls dort keines ist
        addressText = addressText.replace(/(\d)(\d{5})/, '$1 $2');
        // Versuche, an 5-stellige PLZ zu splitten
        const plzMatch = addressText.match(/(\d{5})/);
        if (plzMatch) {
            const plzIndex = addressText.indexOf(plzMatch[1]);
            const before = addressText.substring(0, plzIndex).trim();
            const after = addressText.substring(plzIndex + 5).trim();
            addressResult.plz = plzMatch[1];
            // Straße und Hausnummer
            const streetMatch = before.match(/^(.*?)(\d+.*)$/);
            if (streetMatch) {
                addressResult.strasse = streetMatch[1].trim();
                addressResult.house_number = streetMatch[2].trim();
            } else {
                addressResult.strasse = before;
            }
            // Ort und evtl. Bezirk
            const afterParts = after.split(/\s*berlin\s*/i);
            if (afterParts.length > 1) {
                addressResult.ort = 'Berlin';
                addressResult.bezirk = afterParts[1].replace(/\//, '').trim();
            } else {
                addressResult.ort = after;
            }
            addLog(jobId, `Address parsed from fallback PLZ split (with space fix): ${addressResult.strasse} ${addressResult.house_number}, ${addressResult.plz} ${addressResult.ort}${addressResult.bezirk ? ' (' + addressResult.bezirk + ')' : ''}`, 'info');
            return addressResult;
        }
    }

    if (addressElement.length === 0) {
        addLog(jobId, "Could not find address element", 'warn');
    }

    return addressResult;
}
