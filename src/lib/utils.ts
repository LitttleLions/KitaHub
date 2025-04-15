import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// List of available static images for placeholders
const staticImagePaths = [
  '/images/static/97ce3ee3-19e8-40c6-b8d7-c87ef19f3658.webp',
  '/images/static/12714354_shift-1240x0_1BkTuT_Pmgp10.jpg',
  '/images/static/backwinkel-blog-partizipation-in-kindergarten-und-kita-heroimage.jpg',
  '/images/static/denk-mit-kita-tagesablauf-morgenkreis.jpg',
  '/images/static/erzieherin-liest-vor-istock-533571126-jpg--56863-.jpg',
  '/images/static/fittosize_689_a8720d32e2063e8b48017354f8db0b2a_kindergarten_einstieg.jpg',
  '/images/static/Interview_Erzieher_AdobeStock_265761973.jpeg',
  '/images/static/kinder-kita-basteln.jpg',
  '/images/static/Kindergaerten_Kitas_320819860_1920_tiny-1024x683.jpg',
  '/images/static/stadt-deggendorf-ergaenzungskraft-grundschule-1024x684.jpg',
];

/**
 * Returns a static image path from the predefined list.
 * Uses modulo operator to cycle through images based on the index.
 * If no index is provided, returns a random image.
 * @param index Optional numerical index to get a specific (but cycling) image.
 * @returns A string path to a static image.
 */
export function getRandomStaticImage(index?: number): string {
  if (index !== undefined && index !== null) {
    const validIndex = Math.max(0, Math.floor(index)); // Ensure index is a non-negative integer
    return staticImagePaths[validIndex % staticImagePaths.length];
  } else {
    // Return a truly random image if no index is provided
    const randomIndex = Math.floor(Math.random() * staticImagePaths.length);
    return staticImagePaths[randomIndex];
  }
}

/**
 * Generates a URL-friendly slug from a string.
 * Replaces spaces with hyphens and converts to lowercase.
 * Removes special characters.
 * @param text The input string.
 * @returns The generated slug.
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars except -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
