

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  cover_image_url: string;
  location: string;
  type: string;
  founded_year: string;
  employees: string;
  website: string;
  phone: string;
  email: string | null; // Allow null based on DB type
  description: string | null; // Allow null based on DB type
  gallery: Json | null; // Match DB type (Json | null)
  benefits: Json | null; // Match DB type (Json | null)
  rating: number | null; // Allow null based on DB type
  review_count: number | null; // Allow null based on DB type
  created_at: string | null; // Allow null based on DB type
  updated_at: string | null; // Allow null based on DB type
  latitude?: number; // Add latitude
  longitude?: number;
  street?: string; // Add street
  house_number?: string; // Add house_number
  postal_code?: string; // Add postal_code
  city?: string; // Add city
  district?: string; // Added district field
  is_premium: boolean | null; // Allow null based on DB type
  premium_until?: string | null; // Allow null based on DB type
  has_open_positions: boolean | null; // Allow null based on DB type
  video_url?: string | null; // Allow null based on DB type
  certifications?: Json | null; // Match DB type (Json | null)
  special_pedagogy?: string | null; // Allow null based on DB type
  awards?: Json | null; // Match DB type (Json | null)
  bundesland?: string | null; // Allow null based on DB type
  // Fields added for import feature
  sponsor_name?: string | null; // Allow null based on DB type
  sponsor_type?: string | null; // Allow null based on DB type
  capacity_total?: string | null; // Match DB type (string | null)
  capacity_free?: string | null; // Match DB type (string | null)
  opening_hours_text?: string | null; // Allow null based on DB type
  association?: string | null; // Allow null based on DB type
  min_age?: string | null; // Match DB type (string | null)
  max_age?: string | null; // Match DB type (string | null)
  source_url?: string | null; // Allow null based on DB type
}

// Re-import Json type if it's not globally available (it should be via Database type)
import { Json } from "@/integrations/supabase/types";
