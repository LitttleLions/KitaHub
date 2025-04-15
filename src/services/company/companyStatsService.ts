
import { supabase } from "@/integrations/supabase/client";

// Function to fetch company statistics
export const fetchCompanyStats = async (): Promise<{ 
  totalCompanies: number; 
  bundeslandStats: Array<{ bundesland: string; count: number }>
}> => {
  try {
    // Get total number of companies
    const { count: totalCompanies, error: countError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error("Error fetching company count:", countError);
      return { totalCompanies: 0, bundeslandStats: [] };
    }

    // Get counts by bundesland
    const { data: bundeslandData, error: bundeslandError } = await supabase
      .from('companies')
      .select('bundesland')
      .not('bundesland', 'is', null);

    if (bundeslandError) {
      console.error("Error fetching bundesland stats:", bundeslandError);
      return { totalCompanies: totalCompanies || 0, bundeslandStats: [] };
    }

    // Calculate counts for each bundesland
    const bundeslandCounts: Record<string, number> = {};
    bundeslandData.forEach(item => {
      const bundesland = item.bundesland as string;
      if (bundesland) {
        bundeslandCounts[bundesland] = (bundeslandCounts[bundesland] || 0) + 1;
      }
    });

    const bundeslandStats = Object.entries(bundeslandCounts).map(([bundesland, count]) => ({
      bundesland,
      count
    }));

    return {
      totalCompanies: totalCompanies || 0,
      bundeslandStats
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { totalCompanies: 0, bundeslandStats: [] };
  }
};
