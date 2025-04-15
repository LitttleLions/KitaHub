import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../server/src/supabaseClient'; // Pfad anpassen, falls nötig
import Navbar from '@/components/layout/Navbar'; // Importiere Navbar
import Footer from '@/components/layout/Footer'; // Importiere Footer
import KnowledgeSidebar from '@/components/knowledge/KnowledgeSidebar'; // Importiere Sidebar

const KnowledgePostPage: React.FC = () => {
  const location = useLocation();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      // Extrahiere den Pfad nach /wissen/
      const path = location.pathname.replace('/wissen', ''); // z.B. /kategorie/beitrag-slug/

      if (!path || path === '/') {
        setError('Kein gültiger Beitragspfad angegeben.');
        setLoading(false);
        return;
      }

      // Versuche, den Post anhand des full_path zu finden
      // Lade auch category_terms, tag_terms UND authors
      const { data, error: dbError } = await supabase
        .from('knowledge_posts')
        .select('*, category_terms, tag_terms, authors') // authors hinzugefügt
        .eq('full_path', path) // Suche nach exaktem Pfad
        .single();
      
      // Logging hinzufügen
      console.log('KnowledgePostPage - Extrahierter Pfad:', path);
      console.log('KnowledgePostPage - Supabase Query Error:', dbError);
      console.log('KnowledgePostPage - Supabase Query Data:', data);


      if (dbError || !data) {
        console.error('Fehler beim Laden des Wissens-Beitrags:', dbError?.message || 'Keine Daten zurückgegeben');
        setError('Beitrag nicht gefunden oder Fehler beim Laden.');
      } else {
        setPost(data);
        console.log('KnowledgePostPage - Post erfolgreich geladen:', data.id);
      }
      setLoading(false);
    };
    fetchPost();
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className="pt-16"> {/* Add padding top to avoid overlap with fixed Navbar */}
        {/* Optionaler Header-Bereich für den Titel */}
        {post && (
          <div className="bg-gray-50 py-8 mb-8">
            <div className="container mx-auto max-w-6xl px-4"> {/* Breiterer Container für 2 Spalten */}
              <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
              <p className="text-gray-500 text-sm mt-2"> {/* Kleinere Schrift */}
                Veröffentlicht am: {post.date_published ? new Date(post.date_published).toLocaleDateString() : '-'}
                {/* Autor anzeigen, falls vorhanden */}
                {post.authors?.name && (
                  <span className="ml-4">von: {post.authors.name}</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Hauptcontainer mit 2 Spalten Layout */}
        <div className="container mx-auto max-w-6xl px-4 pb-8 flex flex-col lg:flex-row gap-8"> {/* Breiter, Flexbox */}
          
          {/* Linke Spalte: Hauptinhalt */}
          <div className="w-full lg:w-3/4"> {/* Breite für Hauptinhalt */}
            {loading && <p>Lade Beitrag...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {post && (
            /* Prose-Klassen für den gerenderten HTML-Inhalt */
            <article className="prose prose-lg lg:prose-xl max-w-none 
                              prose-headings:font-semibold prose-headings:text-gray-800 
                              prose-p:text-gray-700 prose-p:leading-relaxed
                              prose-a:text-kita-blue hover:prose-a:text-kita-orange hover:prose-a:underline
                              prose-ul:list-disc prose-ul:pl-6 prose-li:my-1
                              prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1
                              prose-strong:font-medium">
              {/* Titel und Datum werden jetzt im Header angezeigt */}
              {/* Rendere den HTML-Inhalt */}
              <div dangerouslySetInnerHTML={{ __html: post.content_rendered }} />

              {/* Anzeige der Tags */}
              {post.tag_terms && post.tag_terms.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-sm mb-2 text-gray-600">Schlagwörter:</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tag_terms.map((tag: any) => (
                      <span key={tag.id} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded">
                        {tag.name}
                        {/* Optional: Link zu Tag-Seite: <Link to={`/wissen/tag/${tag.slug}`}>{tag.name}</Link> */}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
            )}
          </div>

          {/* Rechte Spalte: Sidebar - Keine Props mehr nötig */}
          <KnowledgeSidebar />

        </div>
      </main>
      <Footer />
    </>
  );
};

export default KnowledgePostPage;
