import { supabase } from '@/integrations/supabase/client';

// Fetch featured kitas (e.g., premium or highlighted)
export async function fetchFeaturedKitas() {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('is_premium', true)
    .limit(4);

  if (error) {
    console.error('Error fetching featured kitas:', error);
    return [];
  }
  return data || [];
}

// Fetch random kitas for mini list
export async function fetchRandomKitas(limit = 4) {
  // Try fetching more items than needed to allow for client-side randomization
  // as a fallback if a dedicated random function isn't available.
  // Let's fetch 3 times the limit to get a decent pool.
  const fetchLimit = limit * 3;

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    // .order('created_at', { ascending: false }) // Remove fixed order
    .limit(fetchLimit); // Fetch more items

  if (error) {
    console.error('Error fetching kitas for randomization:', error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Client-side shuffle and slice as a fallback randomization method
  const shuffledData = data.sort(() => 0.5 - Math.random());
  return shuffledData.slice(0, limit);
}
