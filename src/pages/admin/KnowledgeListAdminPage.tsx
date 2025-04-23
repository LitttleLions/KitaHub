import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Korrigierter Import

interface KnowledgePost {
  id: string; // Geändert zu string
  title: string;
  slug: string;
  date_published: string | null;
  source_link: string;
  full_path: string | null; // Hinzufügen, um den Pfad zu nutzen
}

const KnowledgeListAdminPage: React.FC = () => {
  const [posts, setPosts] = useState<KnowledgePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('knowledge_posts')
        .select('id, title, slug, date_published, source_link, full_path') // full_path mitladen
        .order('date_published', { ascending: false });
      if (error) {
        console.error('Fehler beim Laden der Wissens-Posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wissens-Beiträge</h1>
      {loading ? (
        <p>Lade Beiträge...</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Titel</th>
              <th className="p-2 border">Slug</th>
              <th className="p-2 border">Veröffentlicht</th>
              <th className="p-2 border">Vorschau (Öffentlich)</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="p-2 border">{post.id}</td>
                <td className="p-2 border">{post.title}</td>
                <td className="p-2 border">{post.slug}</td>
                <td className="p-2 border">{post.date_published ? new Date(post.date_published).toLocaleDateString() : '-'}</td>
                <td className="p-2 border">
                  {post.full_path ? (
                    <a href={`/wissen${post.full_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                      Anzeigen
                    </a>
                  ) : (
                    <span>Kein Pfad</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KnowledgeListAdminPage;
