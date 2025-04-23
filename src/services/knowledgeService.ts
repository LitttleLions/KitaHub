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

// Define the type for a single knowledge post based on the Supabase schema
// We need more fields than just the random fetch provides
export type KnowledgePostAdmin = Database['public']['Tables']['knowledge_posts']['Row'];
export type KnowledgePostAdminUpdate = Database['public']['Tables']['knowledge_posts']['Update'];

// Fetch paginated knowledge posts for the admin list, optionally filtering by title and sorting
export async function fetchKnowledgePostsPaginated(
  page: number,
  pageSize: number,
  searchTerm?: string, // Add optional searchTerm parameter
  sortColumn: string = 'date_published', // Default sort column
  sortDirection: 'asc' | 'desc' = 'desc' // Default sort direction
): Promise<{ posts: KnowledgePostAdmin[], count: number | null }> {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;

  let query = supabase
    .from('knowledge_posts')
    .select('*', { count: 'exact' }); // Select all columns and request count

  // Apply search filter if searchTerm is provided
  if (searchTerm && searchTerm.trim() !== '') {
    query = query.ilike('title', `%${searchTerm.trim()}%`); // Case-insensitive search on title
  }

  // Apply ordering and pagination
  query = query
    .order(sortColumn, { ascending: sortDirection === 'asc', nullsFirst: false }) // Apply dynamic sorting
    .range(startIndex, endIndex); // Apply pagination range

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching paginated knowledge posts:', error);
    throw error; // Re-throw error to be handled by the caller (e.g., React Query)
  }

  return { posts: data || [], count: count };
}

// Fetch a single knowledge post by its ID (assuming 'id' is the primary key)
export async function fetchKnowledgePostById(postId: string): Promise<KnowledgePostAdmin | null> {
    const { data, error } = await supabase
        .from('knowledge_posts')
        .select('*')
        .eq('id', postId) // Use the internal ID
        .single(); // Expect a single result

    if (error) {
        console.error(`Error fetching knowledge post with id ${postId}:`, error);
        // Handle specific errors like 'PGRST116' (Not found) if needed
        if (error.code === 'PGRST116') {
            return null; // Post not found
        }
        throw error;
    }
    return data;
}

// Update a knowledge post
export async function updateKnowledgePost(postId: string, updates: KnowledgePostAdminUpdate): Promise<KnowledgePostAdmin | null> {
    const { data, error } = await supabase
        .from('knowledge_posts')
        .update(updates)
        .eq('id', postId) // Use the internal ID
        .select() // Select the updated row
        .single(); // Expect a single result

    if (error) {
        console.error(`Error updating knowledge post with id ${postId}:`, error);
        throw error;
    }
    console.log(`Knowledge post ${postId} updated successfully.`);
    return data;
}
