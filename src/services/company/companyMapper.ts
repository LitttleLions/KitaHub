
import { Json } from "@/integrations/supabase/types";
import { Company } from "@/types/company";
import { processJsonField } from "@/utils/dataFormatUtils";

// Maps database records to Company type objects
export function mapToCompany(item: any): Company {
  return {
    id: item.id,
    name: item.name || "",
    slug: item.slug || "",
    logo_url: item.logo_url || "",
    cover_image_url: item.cover_image_url || "",
    location: item.location || "",
    type: item.type || "",
    founded_year: item.founded_year || "",
    employees: item.employees || "",
    website: item.website || "",
    phone: item.phone || "",
    email: item.email || "",
    description: item.description || "",
    gallery: processJsonField(item.gallery),
    benefits: processJsonField(item.benefits),
    rating: item.rating || 0,
    review_count: item.review_count || 0,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    latitude: item.latitude, // Map latitude
    longitude: item.longitude, // Map longitude
    street: item.street || "", // Map street
    house_number: item.house_number || "", // Map house_number
    postal_code: item.postal_code || "", // Map postal_code
    // Map city, use legacy location as fallback if city is empty
    city: item.city || item.location || "", 
    is_premium: Boolean(item.is_premium),
    has_open_positions: Boolean(item.has_open_positions),
    video_url: item.video_url || "",
    special_pedagogy: item.special_pedagogy || "",
    certifications: processJsonField(item.certifications),
    awards: processJsonField(item.awards),
    bundesland: item.bundesland || "",
    premium_until: item.premium_until,
    // Add mappings for newly fetched fields
    sponsor_name: item.sponsor_name || "",
    sponsor_type: item.sponsor_type || "",
    capacity_total: item.capacity_total || "",
    capacity_free: item.capacity_free || "",
    opening_hours_text: item.opening_hours_text || "",
    association: item.association || "",
    min_age: item.min_age || "",
    max_age: item.max_age || "",
    source_url: item.source_url || ""
  };
}
