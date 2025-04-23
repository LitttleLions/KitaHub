import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Added Link import
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import KitaHero from "@/components/kitas/KitaHero";
import KitaStats from "@/components/kitas/KitaStats";
import MediaReports from "@/components/kitas/MediaReports";
// Removed KnowledgeTeaser import
import BundeslanderNavigation from "@/components/kitas/BundeslanderNavigation";
import KitaSearchForm from "@/components/kitas/KitaSearchForm"; // Wird indirekt über KitaSearchHero verwendet
import KitaSearchHero from "@/components/kitas/KitaSearchHero"; // Import der neuen Komponente
import KitaSidebar from "@/components/kitas/KitaSidebar";
import KitaSearchResults from "@/components/kitas/KitaSearchResults";
import FeaturedKitas from "@/components/kitas/FeaturedKitas";
import HorizontalKitaCard from "@/components/kitas/HorizontalKitaCard"; // Import HorizontalKitaCard
import { fetchCompanies, fetchFeaturedCompanies } from "@/services/company"; // fetchRandomKitas removed from here
import { fetchRandomKitas } from "@/services/kitaService"; // Import fetchRandomKitas from kitaService
import { GERMAN_STATES } from '@/lib/constants'; // Import der Konstanten
import { supabase } from '@/integrations/supabase/client'; // Added supabase import
import { Company } from '@/types/company'; // Import Company type

const Kitas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [bundesland, setBundesland] = useState(searchParams.get('bundesland') || 'all');
  const [selectedBezirk, setSelectedBezirk] = useState(searchParams.get('bezirk') || 'all'); // State für Bezirk
  const [showPremiumOnly, setShowPremiumOnly] = useState(searchParams.get('premium') === 'true');
  const [page, setPage] = useState(1);
  const limit = 15;
  const [knowledgeArticles, setKnowledgeArticles] = useState<any[]>([]); // State for knowledge articles
  const [randomKitasForTeaser, setRandomKitasForTeaser] = useState<Company[]>([]); // State for random kitas

  // Mapping von Slug zu DB-Schreibweise für Bundesland
  const bundeslandDbValue = (() => {
    const state = GERMAN_STATES.find(s => s.value === bundesland);
    return state ? state.dbValue : bundesland;
  })();

  useEffect(() => {
    // Update bundesland & bezirk from URL when it changes
    const urlBundesland = searchParams.get('bundesland') || 'all';
    const urlBezirk = searchParams.get('bezirk') || 'all';
    setBundesland(urlBundesland);
    // Only set Bezirk if Bundesland is also set (not 'all')
    if (urlBundesland !== 'all') {
      setSelectedBezirk(urlBezirk);
    } else {
      setSelectedBezirk('all'); // Reset Bezirk if Bundesland is 'all'
    }

    // Update premium filter from URL
    const urlPremium = searchParams.get('premium');
    if (urlPremium !== null) {
      setShowPremiumOnly(urlPremium === 'true');
    }

    // Fetch knowledge articles on mount
    async function loadKnowledgeArticles() {
      const { data, error } = await supabase
        .from('knowledge_posts')
        .select('id, title, slug, full_path, featured_media_url') // Select necessary fields
        .order('date_published', { ascending: false })
        .limit(4); // Fetch 4 articles

      if (error) {
        console.error('Error fetching knowledge articles for Kitas page:', error);
        setKnowledgeArticles([]);
      } else {
        setKnowledgeArticles(data || []);
      }
    }
    loadKnowledgeArticles();

    // Fetch random kitas for the teaser section
    async function loadRandomKitasForTeaser() {
        const kitas = await fetchRandomKitas(12); // Fetch 12 for the teaser grid
        setRandomKitasForTeaser(kitas);
    }
    loadRandomKitasForTeaser();


  }, [searchParams]);

  const { data: regularData, isLoading: isLoadingRegular, refetch } = useQuery({
    // Add selectedBezirk to queryKey
    queryKey: ['companies', searchText, location, bundesland, selectedBezirk, showPremiumOnly, page],
    queryFn: () => fetchCompanies({
      keyword: searchText,
      location,
      bundesland: bundeslandDbValue !== 'all' ? bundeslandDbValue : undefined,
      bezirk: selectedBezirk !== 'all' ? selectedBezirk : undefined, // Add bezirk filter
      isPremium: showPremiumOnly ? true : undefined,
      limit,
      offset: (page - 1) * limit
    }),
  });

  const { data: featuredCompanies, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ['featuredCompanies'],
    queryFn: () => fetchFeaturedCompanies(4),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (searchText) params.set('q', searchText);
    if (location) params.set('location', location);
    if (bundesland !== 'all') {
       params.set('bundesland', bundesland);
       // Only set bezirk param if bundesland is also set
       if (selectedBezirk !== 'all') params.set('bezirk', selectedBezirk);
       else params.delete('bezirk'); // Remove bezirk if 'all'
    } else {
       params.delete('bundesland'); // Remove bundesland if 'all'
       params.delete('bezirk'); // Also remove bezirk if bundesland is 'all'
    }
    if (showPremiumOnly) params.set('premium', 'true');
    setSearchParams(params);
    // refetch is automatically called by react-query when queryKey changes
  };

  const handleBundeslandChange = (value: string) => {
    setBundesland(value);
    setPage(1);
    // Reset Bezirk when Bundesland changes
    setSelectedBezirk('all');
    const params = new URLSearchParams(searchParams);
    if (value !== 'all') {
      params.set('bundesland', value);
      params.delete('bezirk'); // Remove bezirk param when changing bundesland
    } else {
      params.delete('bundesland');
      params.delete('bezirk'); // Remove bezirk param if bundesland is 'all'
    }
    setSearchParams(params);
    // refetch is automatically called by react-query when queryKey changes
  };

  // Handler for Bezirk change
  const handleBezirkChange = (value: string) => {
    setSelectedBezirk(value);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (value !== 'all') {
      params.set('bezirk', value);
    } else {
      params.delete('bezirk');
    }
    setSearchParams(params);
    // refetch is automatically called by react-query when queryKey changes
  };


  const togglePremiumFilter = () => {
    const newValue = !showPremiumOnly;
    setShowPremiumOnly(newValue);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (newValue) {
      params.set('premium', 'true');
    } else {
      params.delete('premium');
    }
    setSearchParams(params);
    refetch();
  };

  const paginate = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSearchView = searchParams.size > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Show the hero section only if no search params */}
        {!isSearchView ? (
          <>
            <KitaHero />
            
            {/* Featured Kitas Section - Full width container */}
            <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="container mx-auto px-4 md:px-6">
                {/* Added font-display */}
                <h2 className="text-2xl font-bold font-display mb-6">Empfohlene Kindertagesstätten</h2>
                <FeaturedKitas
                  isLoading={isLoadingFeatured}
                  featuredCompanies={featuredCompanies}
                  showHeading={false}
                />
                 {/* Removed the simple button */}
              </div>
            </section>

            {/* Mini Kita List Section (copied from Index.tsx) */}
            <section className="py-12 bg-white"> {/* Added bg-white and padding */}
              <div className="container mx-auto px-4 md:px-6">
                <h3 className="text-2xl font-bold font-display mb-6">Weitere Kitas entdecken</h3> {/* Adjusted heading size */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {randomKitasForTeaser.map((kita) => (
                    <HorizontalKitaCard key={kita.id} kita={kita} />
                  ))}
                </div>
                <div className="mt-8 text-center"> {/* Adjusted margin */}
                  <Link to="/kitas" className="text-kita-orange font-semibold hover:underline">
                    Alle Kitas ansehen &rarr;
                  </Link>
                </div>
              </div>
            </section>

            <KitaStats />
            {/* <MediaReports /> */} {/* Removed MediaReports component */}
            {/* Replaced KnowledgeTeaser with Knowledge Section */}
            <section id="wissen" className="py-12 bg-white">
              <div className="container mx-auto px-4 md:px-6">
                 {/* Added font-display */}
                <h2 className="text-2xl font-bold font-display mb-6 text-center">Wissenswertes rund um die Kita</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {knowledgeArticles.length > 0 ? (
                    knowledgeArticles.map((knowledge: any) => {
                      const imageUrl = knowledge.featured_media_url;
                      let linkPath = knowledge.full_path?.startsWith('/wissen')
                                       ? knowledge.full_path
                                       : `/wissen/${knowledge.slug}`;
                      if (!linkPath.endsWith('/')) {
                        linkPath += '/';
                      }
                      return (
                        <article key={knowledge.id} className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-200 flex flex-col">
                          {imageUrl && (
                            <Link to={linkPath} className="block aspect-video overflow-hidden">
                              <img
                                src={imageUrl}
                                alt={knowledge.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Added group-hover
                              />
                            </Link>
                          )}
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-md font-semibold mb-2 flex-grow">
                              <Link to={linkPath} className="text-kita-blue hover:text-kita-orange">
                                {knowledge.title}
                              </Link>
                            </h3>
                            <Link to={linkPath} className="text-sm text-kita-orange hover:underline font-medium mt-auto self-start">
                              Weiterlesen
                            </Link>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <p className="col-span-full text-center text-gray-500">Keine Wissensbeiträge gefunden.</p>
                  )}
                </div>
                 <div className="mt-8 text-center">
                   <Link to="/wissen" className="text-kita-orange font-semibold hover:underline">
                     Mehr Wissen entdecken &rarr;
                   </Link>
                 </div>
              </div>
            </section>
            <div id="bundeslaender">
              <BundeslanderNavigation />
            </div>
          </>
        ) : (
          <>
            {/* Search results view - Use KitaSearchHero */}
            <KitaSearchHero
              searchText={searchText}
              setSearchText={setSearchText}
              location={location}
              setLocation={setLocation}
              selectedState={bundesland} // Pass bundesland state
              setSelectedState={handleBundeslandChange} // Pass handler
              handleSearch={handleSearch}
              title="Kita-Suche" // Title for the search results page
              showFrequentSearches={false} // Hide frequent searches on results page
              bgColor="bg-gradient-to-r from-blue-50 to-indigo-50" // Keep background
            />

            {/* Search Results */}
            <section className="py-12">
              <div className="container mx-auto px-4 md:px-6">
                {/* Wrapper div for white background, padding, shadow */}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar - Filters */}
                    <div className="w-full md:w-64 shrink-0">
                    <KitaSidebar
                      bundesland={bundesland}
                      handleBundeslandChange={handleBundeslandChange}
                      selectedBezirk={selectedBezirk} // Pass state
                      handleBezirkChange={handleBezirkChange} // Pass handler
                      showPremiumOnly={showPremiumOnly}
                      togglePremiumFilter={togglePremiumFilter}
                    />
                  </div>

                  {/* Results */}
                  <div className="w-full"> {/* Added this wrapper div for results */}
                    <KitaSearchResults
                      isLoading={isLoadingRegular}
                      data={regularData}
                      page={page}
                      limit={limit}
                      paginate={paginate}
                    />
                  </div> {/* Closing results wrapper div */}
                  </div> {/* Closing flex container */}
                </div> {/* Closing white background container */}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Kitas;
