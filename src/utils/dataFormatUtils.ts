
import { Json } from "@/integrations/supabase/types";

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
  // Kita-themed cover images 
  const coverImages = [
    "/lovable-uploads/DSC06105.jpg", // Kids playing
    "/lovable-uploads/DSC02648.jpg", // Classroom
    "/lovable-uploads/DSC03540-Bearbeitet.jpg", // Creative play
    "/lovable-uploads/DSC04166-Bearbeitet.jpg", // Outdoor play
    "/lovable-uploads/DSC06302-Bearbeitet.jpg", // Kids at table
    "/lovable-uploads/DSC06503-Bearbeitet-2.jpg", // Reading corner
    "/lovable-uploads/DSC06567.jpg", // Play area
    "/lovable-uploads/DSC06589.jpg", // Kids crafting
    "/lovable-uploads/DSC07099-Bearbeitet-Bearbeitet.jpg", // Garden
    "/lovable-uploads/kinder-kita-basteln.jpg", // Art activity
    "/lovable-uploads/kindergarten-2204239_1920.jpg", // Playground
    "/lovable-uploads/csm_Kindergarten_Kita_draussen_Garten_Rawpixelcom_AdobeStock_151211155_1920x1080_529e70ed69.jpg" // Garden view
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
