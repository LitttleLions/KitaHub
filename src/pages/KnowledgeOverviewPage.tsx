import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; // Korrigierter Import
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import KnowledgeSidebar from '@/components/knowledge/KnowledgeSidebar'; // Importiere Sidebar
import { decodeHtmlEntities } from '@/utils/dataFormatUtils'; // Import the decoder function

// Interface für einen einzelnen Post (vereinfacht für die Übersicht)
interface OverviewPost {
  id: string; // Geändert zu string
  title: string;
  full_path: string | null;
  excerpt_rendered: string;
  featured_media_url: string | null; // Für das Bild
}

const POSTS_PER_PAGE = 10; // Konstante für Paginierung

const KnowledgeOverviewPage: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<OverviewPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<OverviewPost[]>([]); // NEU: Für Top 3 Posts
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true); // Loading für Featured Posts
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // NEU: Für Paginierung
  const [totalPosts, setTotalPosts] = useState(0); // NEU: Für Paginierung


  // Daten für die neuesten Posts laden (mit Paginierung)
  useEffect(() => {
    const fetchLatestPosts = async () => {
      setLoadingLatest(true);
      const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE - 1;

      const { data, error: dbError } = await supabase
        .from('knowledge_posts')
        .select('id, title, full_path, excerpt_rendered, featured_media_url')
        .order('date_published', { ascending: false })
        .range(startIndex, endIndex); // Paginierung

      if (dbError) {
        console.error('Fehler beim Laden der neuesten Posts:', dbError);
        setError('Fehler beim Laden der neuesten Beiträge.');
        setLatestPosts([]); // Leere Liste bei Fehler
      } else {
        setLatestPosts(data || []);
      }
      setLoadingLatest(false);
    };
    fetchLatestPosts();
  }, [currentPage]); // Abhängigkeit von currentPage

  // Gesamtanzahl der Posts einmalig laden
  useEffect(() => {
    const fetchTotalPosts = async () => {
      const { count, error: countError } = await supabase
        .from('knowledge_posts')
        .select('*', { count: 'exact', head: true }); // Nur die Anzahl holen

      if (countError) {
        console.error('Fehler beim Laden der Gesamtanzahl der Posts:', countError);
      } else {
        setTotalPosts(count || 0);
      }
    };
    fetchTotalPosts();
  }, []);


  // Daten für die Featured Posts laden (Top 3)
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      setLoadingFeatured(true);
      const { data, error: dbError } = await supabase
        .from('knowledge_posts')
        .select('id, title, full_path, excerpt_rendered, featured_media_url')
        .order('date_published', { ascending: false })
        .limit(3); // Lade die neuesten 3 Posts

      if (dbError) {
        console.error('Fehler beim Laden der Featured Posts:', dbError);
      } else {
        setFeaturedPosts(data || []);
      }
      setLoadingFeatured(false);
    };
    fetchFeaturedPosts();
  }, []);

  const isLoading = loadingLatest || loadingFeatured; // Kombiniertes Loading
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <>
      <Navbar />
      {/* Optional: Hero-Bereich */}
      <div className="bg-gradient-to-r from-kita-blue to-kita-orange text-white py-10 mb-8 text-center">
         <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold">Kita.de News und Wissensbereich</h1>
            {/* Optional: Untertitel */}
         </div>
      </div>

      {/* Hauptcontainer mit 2 Spalten Layout */}
      <main className="container mx-auto max-w-6xl px-4 pb-8 flex flex-col lg:flex-row gap-8">
        
        {/* Linke Spalte: Hauptinhalt - Wrapped in white container */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-8">
            {/* Featured Posts Section */}
            <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Aktuelle Highlights
            </h2>
            {loadingFeatured ? (
              <p>Lade Highlights...</p>
            ) : featuredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <article key={post.id} className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
                     {post.featured_media_url && (
                       <Link to={`/wissen${post.full_path}`}>
                         <img 
                           src={post.featured_media_url} 
                           alt={post.title} 
                           className="w-full h-40 object-cover" // Feste Höhe für Karten
                         />
                       </Link>
                     )}
                     <div className="p-4 flex flex-col flex-grow">
                       <h3 className="text-md font-semibold mb-2 flex-grow"> {/* Titel nimmt verfügbaren Platz */}
                         <Link to={`/wissen${post.full_path}`} className="text-kita-blue hover:text-kita-orange">
                           {decodeHtmlEntities(post.title)} {/* Decode title */}
                         </Link>
                       </h3>
                       {/* Optional: Kurzer Auszug
                       {post.excerpt_rendered && (
                         <div 
                           className="text-gray-600 text-xs mb-3" 
                           dangerouslySetInnerHTML={{ __html: post.excerpt_rendered.substring(0, 100) + '...' }} 
                         />
                       )} */}
                       <Link to={`/wissen${post.full_path}`} className="text-sm text-kita-orange hover:underline font-medium mt-auto self-start">
                         Weiterlesen
                       </Link>
                     </div>
                   </article>
                ))}
              </div>
            ) : (
               <p>Keine Highlights gefunden.</p>
            )}
          </section>

          {/* Neueste Beiträge Liste mit Paginierung */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Alle Beiträge
            </h2>
            {loadingLatest ? (
              <p>Lade neueste Beiträge...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : latestPosts.length > 0 ? (
              <> {/* Fragment für mehrere Elemente */}
                <div className="space-y-6">
                  {latestPosts.map((post) => ( 
                    // Make list items more compact
                    <article key={post.id} className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md overflow-hidden transition-shadow duration-200 flex flex-col md:flex-row gap-3"> {/* Reduced gap */}
                      {post.featured_media_url && (
                        // Smaller image container
                        <div className="md:w-1/4 flex-shrink-0 aspect-video md:aspect-[4/3] overflow-hidden"> {/* Adjusted width and aspect ratio */}
                          <Link to={`/wissen${post.full_path}`} className="block h-full">
                            <img
                              src={post.featured_media_url}
                              alt={decodeHtmlEntities(post.title)} // Decode alt text too
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                            />
                          </Link>
                        </div>
                      )}
                      {/* Adjusted padding and width */}
                      <div className={`p-3 flex flex-col ${post.featured_media_url ? "md:w-3/4" : "w-full"}`}> {/* Reduced padding */}
                        <h3 className="text-base font-semibold mb-1"> {/* Reduced text size */}
                          <Link to={`/wissen${post.full_path}`} className="text-kita-blue hover:text-kita-orange">
                            {decodeHtmlEntities(post.title)} {/* Decode title */}
                          </Link>
                        </h3>
                        {post.excerpt_rendered && (
                          <div 
                            className="text-gray-600 text-xs mb-1 prose prose-xs max-w-none line-clamp-2" /* Reduced text size, margin, added line-clamp */
                            dangerouslySetInnerHTML={{ __html: post.excerpt_rendered.replace(/<a class="moretag".*<\/a>/, '') }} // Entferne Weiterlesen-Link
                          />
                        )}
                         <Link to={`/wissen${post.full_path}`} className="text-xs text-kita-orange hover:underline font-medium mt-auto self-start"> {/* Reduced text size, added margin-top auto */}
                            Weiterlesen
                          </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Paginierungs-Buttons */}
                {totalPosts > POSTS_PER_PAGE && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loadingLatest}
                      className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                      Zurück
                    </button>
                    <span className="text-sm text-gray-600">
                      Seite {currentPage} von {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || loadingLatest}
                      className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                      Weiter
                    </button>
                  </div>
                )}
              </> 
            ) : (
              <p>Keine Beiträge gefunden.</p> // Fallback, wenn keine Posts vorhanden sind
            )}
            </section> 
          </div> {/* Ende white container div */}
        </div> {/* Ende linke Spalte */}

        {/* Rechte Spalte: Sidebar */}
        <KnowledgeSidebar />

      </main>
      <Footer />
    </>
  );
};

export default KnowledgeOverviewPage;
