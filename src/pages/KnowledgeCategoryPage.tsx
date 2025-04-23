import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Korrigierter Import
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import KnowledgeSidebar from '@/components/knowledge/KnowledgeSidebar'; // Importiere Sidebar

interface Post {
  id: string; // Geändert zu string
  title: string;
  full_path: string | null;
  excerpt_rendered: string;
  // Passe den Typ an das an, was die DB wahrscheinlich zurückgibt (Array von Strings oder komplexeres JSON?)
  // Vorerst als any[], um den Fehler zu beheben, muss ggf. genauer typisiert werden, wenn die Struktur klar ist.
  category_terms?: any[] | null; 
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
          setPosts(data);
          // Vereinfachte Logik: Verwende den Slug als Namen, da die Struktur von category_terms unklar ist
          // TODO: Wenn die Struktur von category_terms klar ist (z.B. Array von Objekten),
          // kann die Logik zum Extrahieren des Namens wiederhergestellt werden.
          setCategoryName(categorySlug); 
        } else {
          setPosts([]);
          setCategoryName(categorySlug); 
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
              Kategorie: {categoryName || categorySlug}
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
               // Verwende das gleiche Artikel-Layout wie auf der Übersichtsseite
               <article key={post.id} className="flex flex-col md:flex-row gap-4 border-b pb-6">
                 {post.featured_media_url && (
                   <div className="md:w-1/4 flex-shrink-0">
                     <Link to={`/wissen${post.full_path}`}>
                       <img 
                         src={post.featured_media_url} 
                         alt={post.title} 
                         className="w-full h-32 object-cover rounded-md shadow-sm" 
                       />
                     </Link>
                   </div>
                 )}
                 <div className={post.featured_media_url ? "md:w-3/4" : "w-full"}>
                   <h2 className="text-xl font-semibold mb-1">
                     {post.full_path ? (
                       <Link to={`/wissen${post.full_path}`} className="text-kita-blue hover:text-kita-orange">
                         {post.title}
                       </Link>
                     ) : (
                       <span className="text-gray-700">{post.title} (Kein Pfad)</span>
                     )}
                   </h2>
                   {post.excerpt_rendered && (
                     <div 
                       className="text-gray-600 text-sm mb-2 prose prose-sm max-w-none" 
                       dangerouslySetInnerHTML={{ __html: post.excerpt_rendered.replace(/<a class="moretag".*<\/a>/, '') }} // Entferne Weiterlesen-Link
                     />
                   )}
                    {post.full_path && ( // Zeige Weiterlesen nur wenn Pfad existiert
                      <Link to={`/wissen${post.full_path}`} className="text-sm text-kita-orange hover:underline font-medium">
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
