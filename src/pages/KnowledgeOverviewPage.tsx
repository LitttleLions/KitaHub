import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../server/src/supabaseClient'; // Pfad anpassen
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import KnowledgeSidebar from '@/components/knowledge/KnowledgeSidebar'; // Importiere Sidebar

// Interface für einen einzelnen Post (vereinfacht für die Übersicht)
interface OverviewPost {
  id: number;
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
        
        {/* Linke Spalte: Hauptinhalt */}
        <div className="w-full lg:w-3/4 space-y-8">
          
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
                           {post.title}
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
                  {latestPosts.map((post) => ( // Korrekte Map-Funktion hier
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
                        <h3 className="text-xl font-semibold mb-1">
                          <Link to={`/wissen${post.full_path}`} className="text-kita-blue hover:text-kita-orange">
                            {post.title}
                          </Link>
                        </h3>
                        {post.excerpt_rendered && (
                          <div 
                            className="text-gray-600 text-sm mb-2 prose prose-sm max-w-none" 
                            dangerouslySetInnerHTML={{ __html: post.excerpt_rendered.replace(/<a class="moretag".*<\/a>/, '') }} // Entferne Weiterlesen-Link
                          />
                        )}
                         <Link to={`/wissen${post.full_path}`} className="text-sm text-kita-orange hover:underline font-medium">
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

        </div> {/* Ende linke Spalte */}

        {/* Rechte Spalte: Sidebar */}
        <KnowledgeSidebar />

      </main>
      <Footer />
    </>
  );
};

export default KnowledgeOverviewPage;
