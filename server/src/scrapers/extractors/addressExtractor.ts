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

    // Explizit nach <p class="address"> suchen (robust, case-insensitive)
    let addressElement = contactContainer.find('p.address');
    addLog(jobId, `[DEBUG] p.address elements found in contactContainer: ${addressElement.length}`, 'info');
    if (addressElement.length === 0) {
        addressElement = $('p.address');
        addLog(jobId, `[DEBUG] p.address elements found in whole page: ${addressElement.length}`, 'info');
    }

    // --- NEU: Adress-Parsing direkt aus addressLines (wie Logging) ---
    const addressHtml = $('p.address').html();
    if (addressHtml) {
        const addressLines = addressHtml.split(/<br\s*\/?\s*>/i).map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
        if (addressLines.length >= 2) {
            // Zeile 1: Straße und Hausnummer
            const streetMatch = addressLines[0].match(/^(.*?)(\d+.*)$/);
            if (streetMatch) {
                addressResult.strasse = streetMatch[1].trim();
                addressResult.house_number = streetMatch[2].trim();
            } else {
                addressResult.strasse = addressLines[0];
            }
            // Zeile 2: PLZ und Ort
            const plzOrtMatch = addressLines[1].match(/(\d{5})\s*(.*)/);
            if (plzOrtMatch) {
                addressResult.plz = plzOrtMatch[1];
                addressResult.ort = plzOrtMatch[2].trim();
            } else {
                addressResult.ort = addressLines[1];
            }
            // Zeile 3: Bezirk (optional)
            if (addressLines[2]) {
                addressResult.bezirk = addressLines[2];
            }
            addressResult.address_full = addressLines.join(' | ');
            addLog(jobId, `[PARSE] Address parsed from <br>-split: ${JSON.stringify(addressResult)}`, 'info');
            return addressResult;
        }
    }

    if (addressElement.length === 0) {
        addLog(jobId, "Could not find address element", 'warn');
    }

    return addressResult;
}
