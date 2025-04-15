

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
  email: string;
  description: string;
  gallery: string[];
  benefits: string[];
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  latitude?: number; // Add latitude
  longitude?: number;
  street?: string; // Add street
  house_number?: string; // Add house_number
  postal_code?: string; // Add postal_code
  city?: string; // Add city
  district?: string; // Added district field
  is_premium: boolean;
  premium_until?: string;
  has_open_positions: boolean;
  video_url?: string;
  certifications?: string[];
  special_pedagogy?: string;
  awards?: string[];
  bundesland?: string;
  // Fields added for import feature
  sponsor_name?: string;
  sponsor_type?: string;
  capacity_total?: number | null; // Changed type to number | null
  capacity_free?: number | null; // Changed type to number | null
  opening_hours_text?: string;
  association?: string;
  min_age?: number | null; // Changed type to number | null
  max_age?: number | null; // Changed type to number | null
  source_url?: string; // Added for import uniqueness
}
