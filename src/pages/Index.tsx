import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeaturedKitaCard from '../components/kitas/FeaturedKitaCard';
import JobCard from '../components/jobs/JobCard';
// KitaSearchForm wird jetzt in KitaSearchHero importiert
import KitaSearchHero from '@/components/kitas/KitaSearchHero'; // Import KitaSearchHero
import { fetchFeaturedKitas, fetchRandomKitas } from '../services/kitaService';
import { fetchFeaturedJobs } from '../services/jobService';
import { supabase } from '@/integrations/supabase/client'; // Korrekter Importpfad
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Index = () => {
  const [randomKitas, setRandomKitas] = useState([]);
  const { data: featuredKitas = [] } = useQuery({ queryKey: ['featuredKitas'], queryFn: () => fetchFeaturedKitas() });
  const { data: featuredJobs = [] } = useQuery({ queryKey: ['featuredJobs'], queryFn: () => fetchFeaturedJobs() });
  const [randomKnowledge, setRandomKnowledge] = useState([]);
  const navigate = useNavigate(); // Hook für Navigation

  // State für die Suchfelder
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  const [selectedState, setSelectedState] = useState('all'); // State für Bundesland

  useEffect(() => {
    async function loadRandomKitas() {
      const kitas = await fetchRandomKitas(4);
      setRandomKitas(kitas);
    }
    loadRandomKitas();

    async function loadRandomKnowledge() {
      // Fetch more posts (e.g., 15) to choose randomly from
      const { data, error } = await supabase
        .from('knowledge_posts')
        .select('id, title, slug, full_path, featured_media_url')
        .order('date_published', { ascending: false })
        .limit(15); // Load more posts

      console.log('Supabase knowledge query result (initial fetch):', { data, error }); // Debug-Ausgabe 1

      if (error) {
        console.error('Error fetching initial knowledge posts:', error);
        setRandomKnowledge([]);
      } else if (data && data.length > 0) {
        // Select 3 random posts from the fetched data
        const shuffled = data.sort(() => 0.5 - Math.random());
        setRandomKnowledge(shuffled.slice(0, 3));
      } else {
        setRandomKnowledge([]);
      }
    }
    loadRandomKnowledge();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12 py-12 bg-gradient-to-r from-blue-50 via-white to-green-50 text-center">
           <KitaSearchHero
                searchText={searchText}
                setSearchText={setSearchText}
                location={location}
                setLocation={setLocation}
                selectedState={selectedState}
                setSelectedState={setSelectedState}
                handleSearch={(e) => {
                  e.preventDefault();
                  const params = new URLSearchParams();
                  if (searchText) params.set('q', searchText);
                  if (location) params.set('location', location);
                  if (selectedState !== 'all') params.set('bundesland', selectedState);
                  navigate(`/kitas?${params.toString()}`);
                }}
                title="Die perfekte Kita für Ihr Kind finden"
                subtitle="Durchsuchen Sie über 50.000 Kindertagesstätten in ganz Deutschland und finden Sie die passende Einrichtung in Ihrer Nähe."
                showFrequentSearches={true}
                showBottomLinks={true}
                bgColor="bg-gradient-to-r from-blue-50 via-white to-green-50" // Match background from previous attempt
             />
        </section>

        {/* Recommended Kitas */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Empfohlene Kindertagesstätten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredKitas.map((kita) => (
              <FeaturedKitaCard key={kita.id} kita={kita} />
            ))}
          </div>
        </section>

        {/* Mini Kita List */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Weitere Kitas entdecken</h3>
          {/* Adjusted grid for smaller appearance */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {randomKitas.map((kita) => (
              <FeaturedKitaCard key={kita.id} kita={kita} isMini />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/kitas" className="text-kita-orange font-semibold hover:underline">
              Alle Kitas ansehen &rarr;
            </Link>
          </div>
        </section>

        {/* Recommended Jobs */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Empfohlene Stellenangebote</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/jobs" className="text-kita-orange font-semibold hover:underline">
              Alle Stellenangebote ansehen &rarr;
            </Link>
          </div>
        </section>

        {/* Knowledge Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Wissensbereich</h2>
          {/* Debug-Ausgabe entfernt */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {randomKnowledge.length > 0 ? (
              randomKnowledge.map((knowledge) => {
                console.log('Rendering knowledge item:', knowledge); // Debug-Ausgabe 3 bleibt vorerst
                const imageUrl = knowledge.featured_media_url; // Nur featured_media_url verwenden
                // Ensure linkPath starts with /wissen/ and ends with /
                let linkPath = knowledge.full_path?.startsWith('/wissen')
                                 ? knowledge.full_path
                                 : `/wissen/${knowledge.slug}`;
                if (!linkPath.endsWith('/')) {
                  linkPath += '/';
                }

                return (
                  <article key={knowledge.id} className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
                    {imageUrl && (
                      <Link to={linkPath}>
                        <img
                          src={imageUrl}
                          alt={knowledge.title}
                          className="w-full h-40 object-cover"
                        />
                      </Link>
                    )}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-md font-semibold mb-2 flex-grow">
                        <Link to={linkPath} className="text-kita-blue hover:text-kita-orange">
                          {knowledge.title}
                        </Link>
                      </h3>
                      {/* Teaser wird vorerst nicht angezeigt, da Spalte fehlt */}
                      {/* {knowledge.teaser && (
                        <p className="text-gray-600 text-sm mb-2">{knowledge.teaser}</p>
                      )} */}
                      <Link to={linkPath} className="text-sm text-kita-orange hover:underline font-medium mt-auto self-start">
                        Weiterlesen
                      </Link>
                    </div>
                  </article>
                );
              })
            ) : (
              <p>Keine Wissensbeiträge zum Anzeigen gefunden.</p> // Fallback, wenn keine Daten da sind
            )}
          </div>
          <div className="mt-4 text-center">
            {/* Corrected link to /wissen */}
            <Link to="/wissen" className="text-kita-orange font-semibold hover:underline">
              Mehr Wissen entdecken &rarr;
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
