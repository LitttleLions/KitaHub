import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches distinct districts (bezirk) for a given state (bundesland).
 * @param bundesland - The German state to fetch districts for.
 * @returns A promise that resolves to an array of distinct district names or an empty array on error.
 */
export async function fetchBezirkeByBundesland(bundesland: string): Promise<string[]> {
  if (!bundesland || bundesland === 'all') {
    return []; // No state selected or 'all' selected
  }

  try {
    // Use Supabase RPC function to get distinct districts efficiently
    const { data, error } = await supabase.rpc('get_distinct_bezirke', {
      p_bundesland: bundesland
    });

    if (error) {
      console.error('Error fetching Bezirke:', error);
      return [];
    }

    // The RPC function should return an array of strings (district names)
    return data || [];

  } catch (error) {
    console.error('Unexpected error fetching Bezirke:', error);
    return [];
  }
}

/* 
Note: The Supabase RPC function 'get_distinct_bezirke' needs to be created in the database.
Example SQL for the function:

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
