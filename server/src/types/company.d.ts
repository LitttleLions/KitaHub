// Interface for the final structured company data in the database
export interface Company {
  id?: string;
  name: string;
  slug: string; // Added required slug property
  description?: string;
  street?: string;
  house_number?: string;
  postal_code?: string;
  city?: string;
  location?: string; // Changed from district to match DB structure based on user feedback
  latitude?: number;
  longitude?: number;
  bundesland?: string;
  type?: string;
  special_pedagogy?: string;
  benefits?: string[];
  gallery?: string[];
  certifications?: string[];
  awards?: string[];
  video_url?: string;
  is_premium?: boolean;
  sponsor_name?: string; // Renamed from traeger
  sponsor_type?: string; // Renamed from traegertyp
  capacity_total?: string; // Renamed from plaetze_gesamt
  capacity_free?: string; // Renamed from freie_plaetze
  opening_hours_text?: string; // Renamed from oeffnungszeiten
  association?: string; // Renamed from dachverband
  min_age?: string; // Renamed from betreuungsalter_von
  max_age?: string; // Renamed from betreuungsalter_bis
  care_time?: string; // Renamed from betreuungszeit
  pedagogical_concept?: string; // Renamed from paedagogisches_konzept
  source_url?: string;
  logo_url?: string;
  cover_image_url?: string;
  website?: string;
  phone?: string;
  email?: string;
}

// Interface for the raw, potentially incomplete data scraped from a detail page
export interface RawKitaDetails {
    source_url: string;
    name?: string;
    strasse?: string;
    plz?: string;
    ort?: string;
    bezirk?: string;
    address_full?: string; // Fallback
    traeger?: string;
    traegertyp?: string;
    dachverband?: string;
    plaetze_gesamt?: string; // Keep as string initially from scraping
    freie_plaetze?: string; // Keep as string initially from scraping
    betreuungszeit?: string;
    betreuungsalter_von?: string; // Keep as string initially from scraping
    betreuungsalter_bis?: string; // Keep as string initially from scraping
    paedagogisches_konzept?: string;
    oeffnungszeiten?: string;
    website?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
    cover_image_url?: string;
    gallery?: string[];
    benefits?: string[];
    certifications?: string[];
    awards?: string[];
    video_url?: string;
    house_number?: string;
    description?: string;
}
