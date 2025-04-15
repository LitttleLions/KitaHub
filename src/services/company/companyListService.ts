import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { processJsonField } from "@/utils/dataFormatUtils";
import { mapToCompany } from "./companyMapper";

interface FetchCompaniesParams {
  keyword?: string;
  location?: string;
  bundesland?: string;
  isPremium?: boolean;
  limit?: number;
  offset?: number;
}

export async function fetchCompanies({
  keyword = '',
  location = '',
  bundesland,
  isPremium,
  limit = 20,
  offset = 0
}: FetchCompaniesParams = {}) {
  try {
    let query = supabase
      .from('companies')
      .select('*', { count: 'exact' });

    // Filter by keyword (name or description)
    if (keyword) {
      query = query.or(`name.ilike.%${keyword}%,description.ilike.%${keyword}%`);
    }

    // Filter by location
    if (location) {
      query = query.or(`location.ilike.%${location}%,bundesland.ilike.%${location}%`);
    }

    // Filter by bundesland
    if (bundesland) {
      query = query.eq('bundesland', bundesland);
    }

    // Filter by premium status
    if (isPremium !== undefined) {
      query = query.eq('is_premium', isPremium);
    }

    // Sort premium first, then by name
    query = query.order('is_premium', { ascending: false }).order('name');

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error("Error fetching companies:", error);
      return { companies: [], total: 0 };
    }

    const companies: Company[] = data.map(mapToCompany);

    return {
      companies,
      total: count || 0
    };
  } catch (error) {
    console.error("Unexpected error in fetchCompanies:", error);
    return { companies: [], total: 0 };
  }
}

export async function fetchFeaturedCompanies(limit = 4) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_premium', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching featured companies:", error);
      return [];
    }

    return data.map(mapToCompany);
  } catch (error) {
    console.error("Unexpected error in fetchFeaturedCompanies:", error);
    return [];
  }
}

/**
 * Fetches companies filtered by bundesland
 * 
 * @param bundesland - The bundesland to filter by
 * @param limit - Maximum number of results to return
 * @returns Array of Company objects in the specified bundesland
 */
export async function fetchCompaniesByBundesland(bundesland: string, limit = 8) {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('bundesland', bundesland)
      .order('is_premium', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching companies by bundesland:", error);
      return [];
    }

    return data.map(mapToCompany);
  } catch (error) {
    console.error("Unexpected error in fetchCompaniesByBundesland:", error);
    return [];
  }
}
