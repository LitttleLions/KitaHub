import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar'; // Wiederhergestellt
import Footer from '@/components/layout/Footer'; // Wiederhergestellt
import FeaturedKitaCard from '../components/kitas/FeaturedKitaCard';
import JobCard from '../components/jobs/JobCard';
import Features from '@/components/home/Features'; // Import Features component
import Stats from '@/components/home/Stats'; // Import Stats component
// KitaSearchForm wird jetzt in KitaSearchHero importiert
import KitaSearchHero from '@/components/kitas/KitaSearchHero'; // Import KitaSearchHero
import { fetchFeaturedKitas, fetchRandomKitas } from '../services/kitaService';
import { fetchFeaturedJobs } from '../services/jobService';
import { supabase } from '@/integrations/supabase/client'; // Korrekter Importpfad
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Company } from '@/types/company'; // Re-add Company import for featuredKitas
import { Job } from '@/types/job'; // Import Job type
import BundeslanderNavigation from '@/components/kitas/BundeslanderNavigation'; // Import BundeslanderNavigation
import HorizontalKitaCard from '@/components/kitas/HorizontalKitaCard'; // Import HorizontalKitaCard again
// Removed KitaListItem import

const Index = () => {
  const [randomKitas, setRandomKitas] = useState<any[]>([]); // State type remains any[]
  // Remove explicit type from useQuery, let it infer. Default to empty array.
  const { data: featuredKitas = [] } = useQuery({ queryKey: ['featuredKitas'], queryFn: fetchFeaturedKitas }); // Keep featuredKitas as inferred
  // Wrap fetchFeaturedJobs in an anonymous function to fix type error
  const { data: featuredJobs = [] } = useQuery<Job[]>({ queryKey: ['featuredJobs'], queryFn: () => fetchFeaturedJobs() });
  const [randomKnowledge, setRandomKnowledge] = useState<any[]>([]); // Use any[] for now
  const navigate = useNavigate(); // Hook für Navigation

  // State für die Suchfelder
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  const [selectedState, setSelectedState] = useState('all'); // State für Bundesland

  useEffect(() => {
    async function loadRandomKitas() {
      const kitas = await fetchRandomKitas(12); // Fetch 12 random kitas for the grid
      setRandomKitas(kitas); // Set directly, state is now any[]
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
      <Navbar /> {/* Wiederhergestellt */}
      {/* Hero Section - Apply new gradient and padding */}
      {/* Adjusted gradient to match image (light sky blue to light violet) */}
      <section className="mb-12 bg-gradient-to-b from-sky-50 to-violet-50 text-center py-16 md:py-20"> {/* Adjusted gradient */}
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
               bgColor="bg-transparent" // Make hero background transparent, rely on section background
            />
       </section>

      <main className="container mx-auto px-4 md:px-6 py-8"> {/* Re-add container for the rest */}

         {/* Recommended Kitas */}
         <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Empfohlene Kindertagesstätten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Use type assertion 'as Company' */}
            {featuredKitas.map((kita, idx) => (
              <FeaturedKitaCard key={kita.id} kita={kita as Company} index={idx} />
            ))}
          </div>
        </section>

        {/* Mini Kita List */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Weitere Kitas entdecken</h3>
          {/* Using adjusted HorizontalKitaCard in a 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
             {/* Remove type assertion as randomKitas is any[] and HorizontalKitaCard likely accepts partial data */}
            {randomKitas.map((kita) => (
              <HorizontalKitaCard key={kita.id} kita={kita} />
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
            {/* Now featuredJobs should be correctly typed as Job[] */}
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
              randomKnowledge.map((knowledge: any) => { // Use any for now if type is complex/unknown
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
                  // Applied consistent card styling
                  <article key={knowledge.id} className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-200 flex flex-col">
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
         {/* Bundeslander Navigation Section - Added here */}
         <BundeslanderNavigation />
         {/* Features Section - Moved here */}
         <Features />
       </main>
       {/* Stats Section before Footer */}
       <Stats />
       <Footer /> {/* Wiederhergestellt */}
     </>
   );
};

export default Index;
