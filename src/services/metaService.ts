import { supabase } from '@/integrations/supabase/client';
import { GERMAN_STATES } from '@/lib/constants'; // Import GERMAN_STATES for mapping

/**
 * Fetches distinct districts (bezirk) for a given state slug (e.g., 'berlin').
 * @param bundeslandSlug - The URL slug of the German state.
 * @returns A promise that resolves to an array of distinct district names or an empty array on error.
 */
export async function fetchBezirkeByBundesland(bundeslandSlug: string): Promise<string[]> {
  if (!bundeslandSlug || bundeslandSlug === 'all') {
    return []; // No state selected or 'all' selected
  }

  // Find the corresponding state object to get the DB value (e.g., "Berlin")
  const state = GERMAN_STATES.find(s => s.value === bundeslandSlug);
  if (!state) {
    console.error(`Error: Could not find DB value for Bundesland slug: ${bundeslandSlug}`);
    return [];
  }
  const bundeslandDbValue = state.dbValue; // Use the correct DB value for the query

  try {
    // Use a standard select query to get distinct districts
    // Use 'bezirk' as the column name, matching the likely DB schema despite frontend type 'district'
    const { data, error } = await supabase
      .from('companies')
      .select('bezirk') // Use 'bezirk' for the actual DB query
      .eq('bundesland', bundeslandDbValue) // Filter by the correct DB state name
      .not('bezirk', 'is', null) // Ensure bezirk is not null
      .neq('bezirk', ''); // Ensure bezirk is not an empty string

    if (error) {
      // Log the specific error from Supabase
      console.error(`Error fetching Bezirke for ${bundeslandDbValue}:`, error);
      // Return empty array, but the error indicates a schema mismatch if it persists
      return [];
    }

    // Process the result to get unique, non-empty district names
    // Map using 'bezirk' as that's what the query selected
    const distinctBezirke = [...new Set(data?.map((item: any) => item.bezirk).filter(Boolean) as string[])];
    return distinctBezirke.sort(); // Sort alphabetically

  } catch (error) {
    console.error(`Unexpected error fetching Bezirke for ${bundeslandDbValue}:`, error);
    return [];
  }
}

/*
Note: The Supabase RPC function 'get_distinct_bezirke' is no longer used by this function.
The query now directly selects distinct values from the 'companies' table using the 'bezirk' column.
Ensure the 'companies' table actually has a column named 'bezirk'.

Example SQL for the previously intended RPC function (for reference):

CREATE OR REPLACE FUNCTION get_distinct_bezirke(p_bundesland text)
RETURNS TABLE(bezirk text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT c.bezirk
  FROM companies c
  WHERE c.bundesland = p_bundesland AND c.bezirk IS NOT NULL AND c.bezirk <> '';
END;
$$ LANGUAGE plpgsql;

*/
