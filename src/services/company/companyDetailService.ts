
 import { supabase } from "@/integrations/supabase/client";
 import { Company } from "@/types/company";
 // import { toast } from "@/hooks/use-toast"; // Commented out: Server-side code shouldn't use UI hooks
 import { mapToCompany } from "./companyMapper";

 // Function for fetching a company by its ID
export const fetchCompanyById = async (id: string): Promise<Company | null> => {
  try {
    // Explicitly select all required fields again, based on verified schema
    const selectFields = `
      id, name, slug, logo_url, cover_image_url, location, type, founded_year, 
      employees, website, phone, email, description, gallery, benefits, rating, 
      review_count, created_at, updated_at, latitude, longitude, street, 
      house_number, postal_code, city, is_premium, premium_until, 
      has_open_positions, video_url, certifications, special_pedagogy, 
      awards, bundesland
    `;
    const { data, error } = await supabase
      .from('companies')
      .select(selectFields)
      .eq('id', id)
      .maybeSingle();

     if (error) {
       console.error("Error fetching company by ID:", error);
       // toast({ // Commented out
       //   title: "Fehler beim Laden",
       //   description: "Die Kita-Informationen konnten nicht geladen werden.",
       //   variant: "destructive",
       // });
       return null;
     }

    if (!data) return null;

    // Map to company object
    return mapToCompany(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Function for fetching a company by its slug
export const fetchCompanyBySlug = async (slug: string): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

     if (error) {
       console.error("Error fetching company by slug:", error);
       // toast({ // Commented out
       //   title: "Fehler beim Laden",
       //   description: "Die Kita-Informationen konnten nicht geladen werden.",
       //   variant: "destructive",
       // });
       return null;
     }

    if (!data) return null;

    // Map to company object
    return mapToCompany(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};
