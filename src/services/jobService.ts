
 import { supabase } from "@/integrations/supabase/client";
 import { Job } from "@/types/job";
 import { Company } from "@/types/company";
 // import { toast } from "@/hooks/use-toast"; // Commented out: Server-side code shouldn't use UI hooks
 import { getPlaceholderImage, processJsonField } from "@/utils/dataFormatUtils";
 import { Json } from "@/integrations/supabase/types";

// Function to fetch company by ID
export const fetchCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching company:", error);
      return null;
    }

    if (!data) return null;

    // Convert database row to Company type
    return {
      id: data.id,
      name: data.name || "",
      slug: data.slug || "",
      logo_url: data.logo_url || "",
      cover_image_url: data.cover_image_url || getPlaceholderImage(0),
      location: data.location || "",
      type: data.type || "",
      founded_year: data.founded_year || "",
      employees: data.employees || "",
      website: data.website || "",
      phone: data.phone || "",
      email: data.email || "",
      description: data.description || "",
      gallery: processJsonField(data.gallery),
      benefits: processJsonField(data.benefits),
      rating: data.rating || 0,
      review_count: data.review_count || 0,
      is_premium: Boolean(data.is_premium),
      has_open_positions: Boolean(data.has_open_positions),
      premium_until: data.premium_until,
      video_url: data.video_url || "",
      special_pedagogy: data.special_pedagogy || "",
      certifications: processJsonField(data.certifications),
      awards: processJsonField(data.awards),
      bundesland: data.bundesland || "",
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString()
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Helper function to map DB job data to Job interface
// Export it so it can be reused in mutation service
export const mapJobData = async (item: any): Promise<Job> => {
  // Get company info if we have company_id
  let company = null;
  if (item.company_id) {
    company = await fetchCompanyById(item.company_id);
  }

  return {
    id: item.id,
    title: item.title || "",
    company_id: item.company_id || "",
    company_name: company ? company.name : "",
    company_logo: company ? company.logo_url : "",
    location: item.location || "",
    type: item.type || "",
    salary: item.salary || "",
    posted_date: item.posted_date || new Date().toISOString(),
    employment_start: item.employment_start || "",
    experience: item.experience || "",
    education: item.education || "",
    description: item.description || "",
    requirements: processJsonField(item.requirements),
    benefits: processJsonField(item.benefits),
    kita_image_url: item.kita_image_url || getPlaceholderImage(0),
    featured: Boolean(item.featured),
    clickable: item.clickable !== false,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
    expired_at: item.expired_at,
    company: company || undefined
  };
};

// Function to fetch job by ID
export const fetchJobById = async (id: string): Promise<Job | null> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
       .single();

     if (error) {
       console.error("Error fetching job:", error);
       // toast({ // Commented out
       //   title: "Fehler beim Laden des Jobs",
       //   description: "Der angeforderte Job konnte nicht geladen werden.",
       //   variant: "destructive",
       // });
       return null;
     }
    
    if (!data) return null;
    
    return await mapJobData(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

// Function to fetch jobs by company ID
export const fetchJobsByCompanyId = async (companyId: string): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId);

    if (error) {
      console.error("Error fetching jobs by company ID:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Convert database rows to Job array with Promise.all to handle async mapping
    return await Promise.all(data.map(mapJobData));
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
};

// Function to fetch jobs based on parameters
export const fetchJobs = async (params: {
  keyword?: string;
  location?: string;
  type?: string | string[];
  limit?: number;
  offset?: number;
}): Promise<{ jobs: Job[], total: number }> => {
  try {
    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' });

    if (params.keyword) {
      query = query.or(`title.ilike.%${params.keyword}%,description.ilike.%${params.keyword}%`);
    }

    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }

    if (params.type) {
      if (Array.isArray(params.type)) {
        query = query.in('type', params.type);
      } else {
        query = query.eq('type', params.type);
      }
    }

    query = query
      .order('featured', { ascending: false })
      .order('posted_date', { ascending: false })
      .limit(params.limit || 10)
      .range(params.offset || 0, (params.offset || 0) + (params.limit || 10) - 1);

    const { data, error, count } = await query;

     if (error) {
       console.error("Error fetching jobs:", error);
       // toast({ // Commented out
       //   title: "Fehler beim Laden",
       //   description: "Die Stellenangebote konnten nicht geladen werden.",
       //   variant: "destructive",
       // });
       return { jobs: [], total: 0 };
     }

    if (!data) return { jobs: [], total: 0 };

    // Map data with Promise.all to handle async operations
    const jobs = await Promise.all(data.map(mapJobData));

    return {
      jobs,
      total: count || 0
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { jobs: [], total: 0 };
  }
};

// Function to fetch featured jobs
export const fetchFeaturedJobs = async (limit: number = 3): Promise<Job[]> => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('featured', true)
      .order('posted_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching featured jobs:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Map data with Promise.all to handle async operations
    return await Promise.all(data.map(mapJobData));
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
};
