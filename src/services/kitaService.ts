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
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching random kitas:', error);
    return [];
  }
  return data || [];
}
