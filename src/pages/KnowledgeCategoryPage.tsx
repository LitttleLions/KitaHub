import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Korrigierter Import
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import KnowledgeSidebar from '@/components/knowledge/KnowledgeSidebar'; // Importiere Sidebar
import { decodeHtmlEntities } from '@/utils/dataFormatUtils'; // Import the decoder function

interface Post {
  id: string; // Geändert zu string
  title: string;
  full_path: string | null;
  excerpt_rendered: string;
  // Definiere den Typ für category_terms genauer
  category_terms?: { 
    id?: number; // Mache ID optional, falls nicht immer vorhanden
    name: string; 
    slug: string; 
    // Füge ggf. weitere erwartete Felder hinzu
  }[] | null; 
  featured_media_url?: string | null; // Hinzugefügt für das Bild
}

const KnowledgeCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      if (!categorySlug) {
        setError('Kategorie-Slug fehlt.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setCategoryName(null); // Reset category name

      try {
        // Supabase Abfrage, um Posts zu finden, deren 'category_terms' Array
        // ein Objekt enthält, bei dem 'slug' dem URL-Parameter entspricht.
        // Wir verwenden den 'contains'-Operator für JSONB.
        // Das Format für contains ist: '[{"slug":"wert"}]'
        const filter = JSON.stringify([{ slug: categorySlug }]);

        // Wähle auch featured_media_url aus
        const { data, error: dbError } = await supabase
          .from('knowledge_posts')
          .select('id, title, full_path, excerpt_rendered, category_terms, featured_media_url') 
          .contains('category_terms', filter)
          .order('date_published', { ascending: false }); // Neueste zuerst

        if (dbError) {
          throw dbError;
        }

        if (data && data.length > 0) {
          // Type assertion to tell TypeScript we expect the data to match Post[]
          setPosts(data as Post[]); 
          // Versuche, den Kategorienamen aus dem ersten Post zu extrahieren
          let foundName: string | null = null;
          const firstPost = data[0];
          // Greife typsicher auf category_terms zu
          // Greife typsicher auf category_terms zu (using the asserted type)
          const typedFirstPost = data[0] as Post; // Assert type for easier access
          if (typedFirstPost && Array.isArray(typedFirstPost.category_terms)) { 
            const matchingTerm = typedFirstPost.category_terms.find(
              // Check if term is an object and has the correct slug property
              (term) => term && typeof term === 'object' && term.slug === categorySlug 
            );
            // Check if matchingTerm is found and has a name property of type string
            if (matchingTerm && typeof matchingTerm.name === 'string') { 
              foundName = matchingTerm.name;
            }
          }
          setCategoryName(foundName || categorySlug); // Fallback auf Slug, wenn Name nicht gefunden
        } else {
          setPosts([]); // Set empty array of the correct type
          setCategoryName(categorySlug); // Fallback auf Slug, wenn keine Posts gefunden
          // setError('Keine Beiträge in dieser Kategorie gefunden.'); // Setze keinen harten Fehler, nur Info
        }
      } catch (err: any) {
        console.error('Fehler beim Laden der Kategorie-Posts:', err);
        setError(
          `Fehler beim Laden der Beiträge für Kategorie "${categorySlug}": ${err.message}`
        );
        setCategoryName(categorySlug); // Zeige Slug auch bei Fehler an
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByCategory();
  }, [categorySlug]);

  return (
    <>
      <Navbar />
       {/* Hero-Bereich für Kategorie */}
       <div className="bg-gradient-to-r from-kita-blue to-kita-orange text-white py-10 mb-8 text-center">
         <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold">
              {/* Zeige nur den Namen oder Slug an, ohne Präfix */}
              {categoryName || 'Kategorie wird geladen...'} 
            </h1>
            {/* Optional: Beschreibung der Kategorie hier einfügen, falls verfügbar */}
         </div>
      </div>

      {/* Hauptcontainer mit 2 Spalten Layout */}
      <main className="container mx-auto max-w-6xl px-4 pb-8 flex flex-col lg:flex-row gap-8"> {/* Breiter, Flexbox */}
        
        {/* Linke Spalte: Hauptinhalt (Liste der Posts) */}
        <div className="w-full lg:w-3/4">
          {/* Titel nicht mehr hier, da im Hero */}
          {/* <h1 className="text-3xl font-bold mb-6">
            Wissen-Kategorie: {categoryName || categorySlug}
          </h1> */}

          {loading && <p>Lade Beiträge...</p>}
        {/* Zeige Fehler nur, wenn es ein Ladefehler war, nicht "keine Beiträge gefunden" */}
        {error && !posts.length && <p className="text-red-500">{error}</p>} 
        {!loading && !error && posts.length === 0 && (
           <p>Keine Beiträge in dieser Kategorie gefunden.</p>
        )}


        {posts.length > 0 && (
           <div className="space-y-6">
             {posts.map((post) => (
               // Apply compact styling similar to OverviewPage
               <article key={post.id} className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md overflow-hidden transition-shadow duration-200 flex flex-col md:flex-row gap-3"> {/* Reduced gap, added card styles */}
                 {post.featured_media_url && (
                   // Smaller image container
                   <div className="md:w-1/4 flex-shrink-0 aspect-video md:aspect-[4/3] overflow-hidden"> {/* Adjusted width and aspect ratio */}
                     <Link to={`/wissen${post.full_path}`}>
                       <img 
                         src={post.featured_media_url} 
                         alt={decodeHtmlEntities(post.title)} // Decode alt text
                         className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                       />
                     </Link>
                   </div>
                 )}
                  {/* Adjusted padding and width */}
                 <div className={`p-3 flex flex-col ${post.featured_media_url ? "md:w-3/4" : "w-full"}`}> {/* Reduced padding */}
                    <h2 className="text-base font-semibold mb-1"> {/* Reduced text size */}
                      {post.full_path ? (
                        <Link to={`/wissen${post.full_path}`} className="text-kita-blue hover:text-kita-orange">
                          {decodeHtmlEntities(post.title)}
                        </Link>
                      ) : (
                        <span className="text-gray-700">{decodeHtmlEntities(post.title)} (Kein Pfad)</span>
                      )}
                    </h2>
                   {post.excerpt_rendered && (
                     <div
                       className="text-gray-600 text-xs mb-1 prose prose-xs max-w-none line-clamp-2" /* Reduced text size, margin, added line-clamp */
                       dangerouslySetInnerHTML={{ __html: post.excerpt_rendered.replace(/<a class="moretag".*<\/a>/, '') }} // Entferne Weiterlesen-Link
                     />
                   )}
                    {post.full_path && ( // Zeige Weiterlesen nur wenn Pfad existiert
                      <Link to={`/wissen${post.full_path}`} className="text-xs text-kita-orange hover:underline font-medium mt-auto self-start"> {/* Reduced text size, added margin-top auto */}
                         Weiterlesen
                       </Link>
                    )}
                 </div>
               </article>
             ))}
           </div>
         )}
        </div> {/* Ende linke Spalte */}

        {/* Rechte Spalte: Sidebar */}
        <KnowledgeSidebar />

      </main>
      <Footer />
    </>
  );
};

export default KnowledgeCategoryPage;
