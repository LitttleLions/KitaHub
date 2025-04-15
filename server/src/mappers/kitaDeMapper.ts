// Import interfaces/types needed
import type { Company } from '../types/company.js';
import type { RawKitaDetails } from '../types/company.d.ts';

/**
 * Maps the raw scraped data and context to the structure defined by the Company type.
 * @param rawData - The raw data object extracted by extractDetailsFromHtml. Must not be null.
 * @param bundeslandName - The name of the Bundesland (from context).
 * @param bezirkName - The name of the Bezirk (from context).
 * @returns A partial Company object with mapped fields.
 */
export function mapKitaData(rawData: RawKitaDetails, bundeslandName: string, bezirkName: string): Partial<Company> {
   // Helper to safely parse numbers, returning null if invalid
   const safeParseInt = (value: string | undefined | null): number | null => {
       if (value === null || value === undefined || value === '?') return null;
       const parsed = parseInt(value, 10);
       return isNaN(parsed) ? null : parsed;
   };

    // Simple slug generation function (can be improved later for more complex cases)
    const generateSlug = (name: string | undefined): string => {
        if (!name) return `kita-${Date.now()}`; // Fallback if name is missing (should not happen due to validation)
        return name
            .toLowerCase()
            .replace(/ä/g, 'ae') // Handle German umlauts
            .replace(/ö/g, 'oe')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^\w\s-]/g, '') // Remove non-word characters (except spaces and hyphens)
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
    };


   const mapped: Partial<Company> = {
      name: rawData.name, // Name is guaranteed by validation in extractDetailsFromHtml
      slug: generateSlug(rawData.name), // Generate slug from name
      street: rawData.strasse || undefined,
      postal_code: rawData.plz || undefined,
      city: rawData.ort || undefined, // City extracted from address block
      location: bezirkName || rawData.bezirk || undefined, // Map Bezirk name to 'location' column
      bundesland: bundeslandName || undefined, // Use passed Bundesland name
      house_number: rawData.house_number || undefined, // Added house_number
      phone: rawData.phone || undefined, // Added phone
      email: rawData.email || undefined, // Added email
      website: rawData.website || undefined,
      source_url: rawData.source_url,
      logo_url: rawData.logo_url || undefined, // Added logo_url
      description: rawData.description || undefined, // Added description
      sponsor_name: rawData.traeger || undefined,
      sponsor_type: rawData.traegertyp || undefined,
      capacity_total: rawData.plaetze_gesamt || undefined,
      capacity_free: rawData.freie_plaetze || undefined,
      opening_hours_text: rawData.oeffnungszeiten || undefined,
      association: rawData.dachverband || undefined,
      min_age: rawData.betreuungsalter_von || undefined,
      max_age: rawData.betreuungsalter_bis || undefined,
      special_pedagogy: rawData.paedagogisches_konzept || undefined,
      cover_image_url: rawData.cover_image_url || undefined, // Keep cover image
      // gallery: rawData.gallery || undefined, // Temporarily remove - DB column missing
      // benefits: rawData.benefits || undefined, // Temporarily remove - DB column missing
      // certifications: rawData.certifications || undefined, // Temporarily remove - DB column missing
      // awards: rawData.awards || undefined, // Temporarily remove - DB column missing
      // video_url: rawData.video_url || undefined, // Temporarily remove - DB column missing
      // Note: is_premium, premium_until, has_open_positions are managed internally, not mapped from scrape
  };
  // Remove undefined/null keys more safely
  Object.keys(mapped).forEach((key) => {
      const typedKey = key as keyof Company;
      if (mapped[typedKey] === undefined || mapped[typedKey] === null) {
           delete mapped[typedKey];
       }
   });
   // --- DEBUG: Log the final mapped object ---
   console.log('[DEBUG] mapKitaData returning:', JSON.stringify(mapped, null, 2));
   // --- END DEBUG ---
   return mapped;
 }
