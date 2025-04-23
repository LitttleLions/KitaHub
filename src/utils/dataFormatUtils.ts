
import { Json } from "@/integrations/supabase/types";
import { Company } from '@/types/company'; // Import Company type

// Process JSON fields from the database to ensure they are always arrays
export function processJsonField(field: Json | null): string[] {
  if (!field) return [];
  
  // If it's already an array, return it
  if (Array.isArray(field)) return field as string[];
  
  // If it's a string, try to parse it as JSON
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [field];
    } catch (e) {
      return [field];
    }
  }
  
  // If it's an object, return its values as an array
  if (typeof field === 'object') {
    return Object.values(field).map(v => String(v));
  }
  
  // Default fallback: return a single-item array with the stringified field
  return [String(field)];
}

/**
 * Get a placeholder image based on an index or type from our curated collection
 * of high-quality, themed images related to childcare and education
 */
export function getPlaceholderImage(index: number, type: 'avatar' | 'cover' | 'gallery' = 'cover'): string {
  // Kita-themed cover images from /public/images/kitas/
  const coverImages = [
    "/images/kitas/backwinkel-blog-partizipation-in-kindergarten-und-kita-heroimage.jpg",
    "/images/kitas/Blogbeitraege-Titelbilder.jpg",
    "/images/kitas/csm_Kindergarten_Kita_draussen_Garten_Rawpixelcom_AdobeStock_151211155_1920x1080_529e70ed69.jpg",
    "/images/kitas/csm_Kita_Hedwig_Garten_a05873f643.webp",
    "/images/kitas/csm_Kleinkind_Spielen_Kita_Rawpixelcom_AdobeStock_247708997_1920x1080_280dacac7b.jpg",
    "/images/kitas/erzieherin-liest-vor-istock-533571126-jpg--56863-.jpg",
    "/images/kitas/fittosize_689_a8720d32e2063e8b48017354f8db0b2a_kindergarten_einstieg.jpg",
    "/images/kitas/gefaehrlicher-kita-trend-bild.jpg",
    "/images/kitas/Interview_Erzieher_AdobeStock_265761973.jpeg",
    "/images/kitas/kinder-kita-basteln.jpg",
    "/images/kitas/Kindergaerten_Kitas_320819860_1920_tiny-1024x683.jpg",
    "/images/kitas/kindergarten-2204239_1920.jpg",
    "/images/kitas/kindergarten-kind-oksix-ado.webp",
    "/images/kitas/kita-nordwest-kita-uebersicht-hero-1500x786-crop.jpg",
    "/images/kitas/stadt-deggendorf-ergaenzungskraft-grundschule-1024x684.jpg"
  ];

  // Avatar-style images (smaller, more icon-like)
  const avatarImages = [
    "/lovable-uploads/f77a299d-8602-4290-82d2-e1774c25eb45.png", // Logo style 1
    "/lovable-uploads/82144b82-ae34-4325-a4fd-8a60626783c9.png", // Logo style 2
    "/lovable-uploads/b1441a30-c373-4713-9817-e7bb7ebc2478.png" // Logo style 3
  ];

  // Gallery-style images (detail shots, interior views)
  const galleryImages = [
    "/lovable-uploads/DSC07494-Bearbeitet-Bearbeitet.jpg", // Interior 1
    "/lovable-uploads/DSC07674-Bearbeitet-Bearbeitet.jpg", // Interior 2
    "/lovable-uploads/csm_Kita_Hedwig_Garten_a05873f643.webp", // Garden
    "/lovable-uploads/Blogbeitraege-Titelbilder.jpg", // Play area
    "/lovable-uploads/DSC02958.jpg", // Activity corner
    "/lovable-uploads/stadt-deggendorf-ergaenzungskraft-grundschule-1024x684.jpg" // Classroom wide
  ];

  // Use the appropriate image set based on the requested type
  const imageSet = type === 'avatar' 
    ? avatarImages 
    : (type === 'gallery' ? galleryImages : coverImages);
  
  // Ensure the index is within bounds of the selected image array
  const safeIndex = Math.abs(index) % imageSet.length;
  return imageSet[safeIndex];
}

// Alias for getPlaceholderImage for backward compatibility
export const getRandomImageUrl = getPlaceholderImage;

// Helper function to calculate a deterministic index from a string (like kita.id)
function calculateIndexFromString(id: string): number {
  if (!id) return 0;
  // Simple sum of character codes
  return id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

/**
 * Determines the appropriate cover image URL to display for a Kita.
 * Returns the specific cover image if available and valid,
 * otherwise returns a deterministic placeholder image based on the Kita ID.
 * @param kita - The Company object representing the Kita.
 * @returns The URL string of the image to display.
 */
export function getDisplayCoverImageUrl(kita: Company): string {
  const specificImageUrl = kita.cover_image_url;
  // Define the specific placeholder filename to treat as invalid
  const invalidPlaceholderFilename = 'profile_kita_100x100.jpg';

  // Check if a specific, valid image URL is provided
  // It's valid if it exists and does NOT end with the invalid placeholder filename
  if (specificImageUrl && !specificImageUrl.endsWith(invalidPlaceholderFilename)) {
    return specificImageUrl;
  }

  // If no valid specific image, calculate a deterministic index from the kita ID
  const index = calculateIndexFromString(kita.id);
  
  // Return a placeholder image from the 'cover' category
  return getPlaceholderImage(index, 'cover');
}

/**
 * Decodes HTML entities in a string.
 * Uses the browser's built-in capabilities for robust decoding.
 * @param text The string containing HTML entities.
 * @returns The string with HTML entities decoded.
 */
export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return '';
  try {
    // Use a temporary DOM element to decode entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  } catch (e) {
    console.error("Error decoding HTML entities:", e);
    // Fallback: return the original text if decoding fails (e.g., in non-browser environment)
    return text;
  }
}
