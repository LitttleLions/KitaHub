import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../server/src/supabaseClient'; // Pfad anpassen

interface Term {
  id: number;
  name: string;
  slug: string;
}

interface RecentPost {
  id: number;
  title: string;
  full_path: string | null;
}

// Keine Props mehr benötigt, da die Sidebar ihre Daten selbst holt
// interface KnowledgeSidebarProps {
//   currentCategories?: Term[]; 
// }

const KnowledgeSidebar: React.FC = () => { // Keine Props mehr
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [allCategories, setAllCategories] = useState<Term[]>([]); // State für alle Kategorien
  const [loadingCategories, setLoadingCategories] = useState(true); // Loading-State für Kategorien

  // Effekt zum Laden der neuesten Posts (unverändert)
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
      } else {
        setRecentPosts(data || []);
      }
      setLoadingRecent(false);
    };
    fetchRecentPosts();
  }, []);

  // Effekt zum Laden aller eindeutigen Kategorien
  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoadingCategories(true);
      // Hole die category_terms von allen Posts (nur diese Spalte)
      const { data, error } = await supabase
        .from('knowledge_posts')
        .select('category_terms'); 

      if (error) {
        console.error('Fehler beim Laden der Kategorien:', error);
        setAllCategories([]);
      } else if (data) {
        // Verarbeite die Daten, um eindeutige Kategorien zu erhalten
        const uniqueCategoriesMap = new Map<number, Term>();
        data.forEach(post => {
          // Stelle sicher, dass category_terms ein Array ist
          if (Array.isArray(post.category_terms)) {
            post.category_terms.forEach((term: Term) => {
              if (term && typeof term === 'object' && term.id && term.name && term.slug) {
                 // Füge zur Map hinzu (überschreibt Duplikate automatisch anhand der ID)
                 uniqueCategoriesMap.set(term.id, term);
              }
            });
          }
        });
        // Konvertiere die Map-Werte zurück in ein Array und sortiere nach Namen
        const uniqueCategories = Array.from(uniqueCategoriesMap.values())
                                      .sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(uniqueCategories);
      }
      setLoadingCategories(false);
    };
    fetchAllCategories();
  }, []);

  // Styling-Verbesserungen: Mehr Struktur, modernere Optik
  return (
    <aside className="w-full lg:w-1/4 pl-0 lg:pl-4"> {/* Etwas weniger Abstand links */}
      <div className="sticky top-20 space-y-6"> {/* Sticky Position & Abstand */}
        
        {/* Alle Kategorien */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"> {/* Card-ähnliches Styling */}
          <h3 className="text-base font-semibold mb-3 text-gray-800 border-b pb-2">Alle Kategorien</h3> {/* Kleinere Überschrift, Linie */}
          {loadingCategories ? (
             <p className="text-sm text-gray-500">Lade Kategorien...</p>
          ) : allCategories.length > 0 ? (
            <ul className="space-y-1.5"> {/* Etwas mehr Abstand */}
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
         <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"> {/* Card-ähnliches Styling */}
          <h3 className="text-base font-semibold mb-3 text-gray-800 border-b pb-2">Neueste Beiträge</h3> {/* Kleinere Überschrift, Linie */}
          {loadingRecent ? (
            <p className="text-sm text-gray-500">Lade...</p>
          ) : recentPosts.length > 0 ? (
            <ul className="space-y-2"> {/* Etwas mehr Abstand */}
              {recentPosts.map((post) => (
                <li key={post.id}> {/* Keine Linie mehr hier */}
                  {post.full_path ? (
                    <Link 
                      to={`/wissen${post.full_path}`} 
                      className="text-sm text-kita-blue hover:text-kita-orange hover:underline" // Unterstreichen bei Hover
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
             <p className="text-sm text-gray-500">Keine Beiträge gefunden.</p> // Fallback, wenn keine Posts geladen wurden
          )}
        </div> {/* Korrektes schließendes div für "Neueste Beiträge" */}
      </div> {/* Korrektes schließendes div für "sticky top-20 space-y-6" */}
    </aside>
  );
};

export default KnowledgeSidebar;
