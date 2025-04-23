import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { fetchStoryCatalog } from '@/services/kinderweltService';
import { Story } from '@/types/kinderwelt';
import { Folder, Newspaper, Sparkles, ChevronRight } from 'lucide-react'; // Import icons + ChevronRight
import { decodeHtmlEntities } from '@/utils/dataFormatUtils'; // Import the decoder function

// Helper function to shuffle an array in place (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Definiere den Typ für ein Kategorie-Term-Objekt explizit
interface Term {
  id: number;
  name: string;
  slug: string;
}

// Definiere den Typ für einen kürzlich angesehenen Post
interface RecentPost {
  id: number; // Korrektur: ID ist eine Zahl
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
  // Rename state to reflect its purpose
  const [displayedCategories, setDisplayedCategories] = useState<Term[]>([]); 
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

      // Debugging-Logs entfernt

      if (error) {
        console.error('Fehler beim Laden der neuesten Wissens-Posts:', error);
        setRecentPosts([]);
      } else {
        // Explicitly map and type the data before filtering
        const mappedPosts: RecentPost[] = (data || []).map(post => ({
          id: Number(post.id), // Ensure id is a number
          title: String(post.title), // Ensure title is a string
          full_path: post.full_path ? String(post.full_path) : null // Ensure full_path is string or null
        }));

        // Filter based on the correctly typed data
        const validPosts = mappedPosts.filter(
          (post): post is RecentPost => // Type predicate remains useful
            post !== null && !isNaN(post.id) && typeof post.title === 'string' 
            // No need to check typeof id === 'number' as it's guaranteed by mapping
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
        setDisplayedCategories([]); // Fix: Use the renamed state setter
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
        let uniqueCategories = Array.from(uniqueCategoriesMap.values())
                                      .sort((a, b) => a.name.localeCompare(b.name));
        
        // Shuffle the categories and take the top 10
        uniqueCategories = shuffleArray(uniqueCategories);
        const randomCategories = uniqueCategories.slice(0, 10);

        setDisplayedCategories(randomCategories);
      } else {
        setDisplayedCategories([]);
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
      <div className="sticky top-20 space-y-6"> {/* Adjusted spacing */}

        {/* Zufällige Kategorien */}
        {/* Added subtle background color */}
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 shadow-md"> 
          <h3 className="text-base font-semibold mb-3 text-kita-blue border-b border-blue-200 pb-2 flex items-center">
            <Folder size={18} className="mr-2" /> {/* Icon color from text */}
            Entdecke Kategorien
          </h3>
          {loadingCategories ? (
             <p className="text-sm text-gray-500 pl-1">Lade Kategorien...</p>
          ) : displayedCategories.length > 0 ? (
            <ul className="space-y-1"> {/* Reduced spacing */}
              {displayedCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/wissen/kategorie/${category.slug}`}
                    className="flex items-center text-sm text-kita-blue hover:text-kita-orange hover:bg-blue-100/70 rounded p-1.5 transition-colors duration-150" // Adjusted hover bg
                  >
                     <ChevronRight size={14} className="mr-1.5 flex-shrink-0 text-blue-400" /> {/* Icon per item */}
                    <span className="truncate">{category.name}</span> {/* Truncate long names */}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-gray-500 pl-1">Keine Kategorien gefunden.</p>
          )}
        </div>

        {/* Neueste Beiträge */}
         {/* Added subtle background color */}
         <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 shadow-md"> 
          <h3 className="text-base font-semibold mb-3 text-kita-orange border-b border-orange-200 pb-2 flex items-center">
            <Newspaper size={18} className="mr-2" /> {/* Icon color from text */}
            Neueste Beiträge
          </h3>
          {loadingRecent ? (
            <p className="text-sm text-gray-500 pl-1">Lade...</p>
          ) : recentPosts.length > 0 ? (
            <ul className="space-y-1"> {/* Reduced spacing */}
              {recentPosts.map((post) => (
                <li key={post.id}>
                  {post.full_path ? (
                    <Link
                      to={`/wissen${post.full_path}`}
                    className="flex items-center text-sm text-kita-blue hover:text-kita-orange hover:bg-orange-100/70 rounded p-1.5 transition-colors duration-150" // Adjusted hover bg
                  >
                     <ChevronRight size={14} className="mr-1.5 flex-shrink-0 text-orange-400" /> {/* Icon per item */}
                    <span className="truncate">{decodeHtmlEntities(post.title)}</span> {/* Decode title */}
                  </Link>
                  ) : (
                    <span className="flex items-center text-sm text-gray-500 p-1.5">
                       <ChevronRight size={14} className="mr-1.5 flex-shrink-0 text-gray-400" /> {/* Icon per item */}
                      <span className="truncate">{decodeHtmlEntities(post.title)} (Kein Pfad)</span> {/* Decode title */}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-gray-500 pl-1">Keine Beiträge gefunden.</p>
          )}
        </div>

        {/* Neueste Geschichten */}
         {/* Added subtle background color */}
        <div className="bg-green-50/50 p-4 rounded-lg border border-green-100 shadow-md">
          <h3 className="text-base font-semibold mb-3 text-green-700 border-b border-green-200 pb-2 flex items-center">
             <Sparkles size={18} className="mr-2" /> {/* Icon color from text */}
             Neueste Geschichten
          </h3>
          {isLoadingStories && (
            <p className="text-sm text-gray-500 pl-1">Lade Geschichten...</p>
          )}
          {isStoriesError && (
             <p className="text-sm text-red-600 pl-1">Fehler beim Laden der Geschichten.</p>
          )}
          {!isLoadingStories && !isStoriesError && latestStories && latestStories.length > 0 && (
            <ul className="space-y-1"> {/* Reduced spacing */}
              {latestStories.map((story) => (
                <li key={story.id}>
                  <Link
                    to={`/kinderwelt/${story.slug}`}
                    className="flex items-center text-sm text-kita-blue hover:text-kita-orange hover:bg-green-100/70 rounded p-1.5 transition-colors duration-150" // Adjusted hover bg
                  >
                     <ChevronRight size={14} className="mr-1.5 flex-shrink-0 text-green-500" /> {/* Icon per item */}
                    <span className="truncate">{decodeHtmlEntities(story.title)}</span> {/* Decode title */}
                  </Link>
                </li>
              ))}
            </ul>
          )}
           {!isLoadingStories && !isStoriesError && (!latestStories || latestStories.length === 0) && (
             <p className="text-sm text-gray-500 pl-1">Keine Geschichten gefunden.</p>
          )}
        </div>

      </div>
    </aside>
  );
};

export default KnowledgeSidebar;
