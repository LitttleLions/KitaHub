import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import Link
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import KnowledgeSidebar from '@/components/knowledge/KnowledgeSidebar';
import Breadcrumbs from '@/components/layout/Breadcrumbs'; // Import Breadcrumbs
import { decodeHtmlEntities } from '@/utils/dataFormatUtils';

// Define a more specific type for the post data, including breadcrumbs
interface KnowledgePost {
  id: number; // Changed from string to number to match Supabase type
  title: string;
  full_path: string | null;
  content_rendered: string;
  date_published: string | null;
  authors?: { name?: string } | null;
  category_terms?: any[] | null; // Using any[] for simplicity
  tag_terms?: any[] | null; // Using any[] for simplicity
  featured_media_url?: string | null;
  breadcrumbs?: { name: string; item?: string }[] | null; // Add breadcrumbs type
}

const KnowledgePostPage: React.FC = () => {
  const location = useLocation();
  const [post, setPost] = useState<KnowledgePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      const path = location.pathname.replace('/wissen', '');

      if (!path || path === '/') {
        setError('Kein gültiger Beitragspfad angegeben.');
        setLoading(false);
        return;
      }

      // Select necessary fields including breadcrumbs
      const { data, error: dbError } = await supabase
        .from('knowledge_posts')
        .select('*, category_terms, tag_terms, authors, featured_media_url, breadcrumbs') // Select breadcrumbs
        .eq('full_path', path)
        .single();

      if (dbError || !data) {
        console.error('Fehler beim Laden des Wissens-Beitrags:', dbError?.message || 'Keine Daten zurückgegeben');
        setError('Beitrag nicht gefunden oder Fehler beim Laden.');
        setPost(null);
      } else {
        // Use type assertion (first to unknown, then to specific type)
        setPost(data as unknown as KnowledgePost);
      }
      setLoading(false);
    };
    fetchPost();
  }, [location.pathname]);

  const heroStyle = post?.featured_media_url
    ? { backgroundImage: `url(${post.featured_media_url})` }
    : {};
  const heroClasses = post?.featured_media_url
    ? 'bg-cover bg-center text-white relative'
    : 'bg-gradient-to-r from-kita-blue to-kita-orange text-white';

  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <div className={`py-12 md:py-16 ${heroClasses}`} style={heroStyle}>
        {post?.featured_media_url && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        )}
        <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
          {loading && <p className="text-xl text-white/80">Lade Titel...</p>}
          {error && !post && <p className="text-xl text-red-300">Fehler beim Laden des Titels.</p>}
          {post && (
            <>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                {decodeHtmlEntities(post.title)}
              </h1>
              <p className="text-sm md:text-base text-white/80">
                Veröffentlicht am: {post.date_published ? new Date(post.date_published).toLocaleDateString() : '-'}
                {post.authors?.name && (
                  <span className="ml-4">von: {post.authors.name}</span>
                )}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Render Breadcrumbs below Hero if post data is available */}
      {post && <Breadcrumbs items={post.breadcrumbs} />}

      {/* Render Category Links below Breadcrumbs */}
      {post?.category_terms && post.category_terms.length > 0 && (
        <div className="container mx-auto max-w-6xl px-4 pt-3 pb-1"> {/* Added container and padding */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-600 mr-2">Kategorien:</span>
            {post.category_terms.map((category: any) => ( // Assuming 'any' for now based on interface
              <Link
                key={category.id || category.slug} // Use id or slug as key
                to={`/wissen/kategorie/${category.slug}`}
                className="bg-kita-blue-lightest text-kita-blue text-xs font-semibold px-2.5 py-0.5 rounded-full hover:bg-kita-blue-lighter hover:text-kita-darkblue transition-colors duration-150"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main content area */}
      <main className="container mx-auto max-w-6xl px-4 pt-4 pb-8 flex flex-col lg:flex-row gap-8"> {/* Adjusted top padding */}
        {/* Left Column: Main Content */}
        <div className="w-full lg:w-3/4 bg-white p-6 md:p-8 rounded-lg shadow-md">
          {loading && <p>Lade Inhalt...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !post && !error && <p>Beitrag nicht gefunden.</p>}
          {post && (
            <article className="prose prose-lg lg:prose-xl max-w-none
                              prose-headings:font-semibold prose-headings:text-gray-800
                              prose-p:text-gray-700 prose-p:leading-relaxed
                              prose-a:text-kita-blue hover:prose-a:text-kita-orange hover:prose-a:underline
                              prose-ul:list-disc prose-ul:pl-6 prose-li:my-1
                              prose-ol:list-decimal prose-ol:pl-6 prose-li:my-1
                              prose-strong:font-medium">
              <div dangerouslySetInnerHTML={{ __html: post.content_rendered }} />
              {post.tag_terms && post.tag_terms.length > 0 && (
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-sm mb-2 text-gray-600">Schlagwörter:</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tag_terms.map((tag: any) => (
                      <span key={tag.id} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div> {/* End Left Column */}

        {/* Right Column: Sidebar */}
        <KnowledgeSidebar />
      </main> {/* End Main Content Area */}
      <Footer />
    </> // End Fragment
  );
};

export default KnowledgePostPage;
