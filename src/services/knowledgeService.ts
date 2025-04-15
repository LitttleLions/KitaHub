import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Fetch random knowledge objects for display
export async function fetchRandomKnowledge(limit = 3) {
  const { data, error } = await supabase
    .from('knowledge_posts')
    .select('id, title, slug, teaser, image_url')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching random knowledge:', error);
    return [];
  }
  return data || [];
}
