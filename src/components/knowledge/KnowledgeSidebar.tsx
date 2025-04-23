import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { fetchStoryCatalog } from '@/services/kinderweltService';
import { Story } from '@/types/kinderwelt';

// Definiere den Typ für ein Kategorie-Term-Objekt explizit
interface Term {
  id: number;
  name: string;
  slug: string;
}

// Definiere den Typ für einen kürzlich angesehenen Post
interface RecentPost {
  id: string;
  title: string;
  full_path: string | null;
}

// Definiere den Typ für einen Post, wie er aus der DB kommt (nur relevante Teile)
interface KnowledgePostFromDb {
  // Erlaube null/undefined und unvollständige Objekte im Array, oder das Array selbst kann null sein
  category_terms: (Partial<Term> | null)[] | null; 
}

const KnowledgeSidebar: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [allCategories, setAllCategories] = useState<Term[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Datenabruf für neueste Wissensbeiträge
  useEffect(() => {
    const fetchRecentPosts = async () => {
      setLoadingRecent(true);
      const { data, error } = await supabase
        .from('knowledge_posts')
        .select('id, title, full_path')
        .order('date_published', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Fehler beim Laden der neuesten Wissens-Posts:', error);
        setRecentPosts([]);
      } else {
        const validPosts = (data || []).filter(
          (post): post is RecentPost => 
            post !== null && typeof post.id === 'string' && typeof post.title === 'string'
        );
        setRecentPosts(validPosts);
      }
      setLoadingRecent(false);
    };
    fetchRecentPosts();
  }, []);

  // Effekt zum Laden aller eindeutigen Kategorien
  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from('knowledge_posts')
        .select('category_terms');

      if (error) {
        console.error('Fehler beim Laden der Kategorien:', error);
        setAllCategories([]);
      } else if (data) {
        const uniqueCategoriesMap = new Map<number, Term>();
        (data as KnowledgePostFromDb[]).forEach(post => {
          // Prüfe explizit, ob category_terms ein Array ist
          if (Array.isArray(post.category_terms)) {
            // Iteriere durch das Array
            for (const term of post.category_terms) {
              // **Vereinfachte, robuste Prüfung:** Stelle sicher, dass term existiert und alle benötigten Felder die korrekten Typen haben
              if (term && 
                  typeof term.id === 'number' && 
                  typeof term.name === 'string' && 
                  typeof term.slug === 'string') 
              {
                // Erstelle ein neues Objekt, um Typsicherheit zu gewährleisten (obwohl term hier schon sicher sein sollte)
                const validTerm: Term = { id: term.id, name: term.name, slug: term.slug };
                uniqueCategoriesMap.set(validTerm.id, validTerm);
              }
              // Ignoriere alle anderen Fälle (null, undefined, unvollständige Objekte)
            }
          }
        });
        const uniqueCategories = Array.from(uniqueCategoriesMap.values())
                                      .sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(uniqueCategories);
      } else {
        setAllCategories([]);
      }
      setLoadingCategories(false);
    };
    fetchAllCategories();
  }, []);

  // Datenabruf für die neuesten 3 Kinderwelt-Geschichten mit React Query
  const {
    data: latestStories,
    isLoading: isLoadingStories,
    isError: isStoriesError
  } = useQuery<Story[], Error>({
    queryKey: ['latestStories'],
    queryFn: () => fetchStoryCatalog({ limit: 3 }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <aside className="w-full lg:w-1/4 pl-0 lg:pl-4">
      <div className="sticky top-20 space-y-6">

        {/* Alle Kategorien */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold mb-3 text-gray-800 border-b pb-2">Alle Kategorien</h3>
          {loadingCategories ? (
             <p className="text-sm text-gray-500">Lade Kategorien...</p>
          ) : allCategories.length > 0 ? (
            <ul className="space-y-1.5">
              {allCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/wissen/kategorie/${category.slug}`}
                    className="text-sm text-kita-blue hover:text-kita-orange hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-gray-500">Keine Kategorien gefunden.</p>
          )}
        </div>

        {/* Neueste Beiträge */}
         <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold mb-3 text-gray-800 border-b pb-2">Neueste Beiträge</h3>
          {loadingRecent ? (
            <p className="text-sm text-gray-500">Lade...</p>
          ) : recentPosts.length > 0 ? (
            <ul className="space-y-2">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  {post.full_path ? (
                    <Link
                      to={`/wissen${post.full_path}`}
                      className="text-sm text-kita-blue hover:text-kita-orange hover:underline"
                    >
                      {post.title}
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-500">{post.title} (Kein Pfad)</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-gray-500">Keine Beiträge gefunden.</p>
          )}
        </div>

        {/* Neueste Geschichten */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-base font-semibold mb-3 text-gray-800 border-b pb-2">Neueste Geschichten</h3>
          {isLoadingStories && (
            <p className="text-sm text-gray-500">Lade Geschichten...</p>
          )}
          {isStoriesError && (
             <p className="text-sm text-red-600">Fehler beim Laden der Geschichten.</p>
          )}
          {!isLoadingStories && !isStoriesError && latestStories && latestStories.length > 0 && (
            <ul className="space-y-2">
              {latestStories.map((story) => (
                <li key={story.id}>
                  <Link
                    to={`/kinderwelt/${story.slug}`}
                    className="text-sm text-kita-blue hover:text-kita-orange hover:underline"
                  >
                    {story.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
           {!isLoadingStories && !isStoriesError && (!latestStories || latestStories.length === 0) && (
             <p className="text-sm text-gray-500">Keine Geschichten gefunden.</p>
          )}
        </div>

      </div>
    </aside>
  );
};

export default KnowledgeSidebar;
