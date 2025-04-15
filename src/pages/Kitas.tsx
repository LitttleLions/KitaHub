
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import KitaHero from "@/components/kitas/KitaHero";
import KitaStats from "@/components/kitas/KitaStats";
import MediaReports from "@/components/kitas/MediaReports";
import KnowledgeTeaser from "@/components/kitas/KnowledgeTeaser";
import BundeslanderNavigation from "@/components/kitas/BundeslanderNavigation";
import KitaSearchForm from "@/components/kitas/KitaSearchForm"; // Wird indirekt über KitaSearchHero verwendet
import KitaSearchHero from "@/components/kitas/KitaSearchHero"; // Import der neuen Komponente
import KitaSidebar from "@/components/kitas/KitaSidebar";
import KitaSearchResults from "@/components/kitas/KitaSearchResults";
import FeaturedKitas from "@/components/kitas/FeaturedKitas";
import { fetchCompanies, fetchFeaturedCompanies } from "@/services/company";
import { GERMAN_STATES } from '@/lib/constants'; // Import der Konstanten

const Kitas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [bundesland, setBundesland] = useState(searchParams.get('bundesland') || 'all');
  const [selectedBezirk, setSelectedBezirk] = useState(searchParams.get('bezirk') || 'all'); // State für Bezirk
  const [showPremiumOnly, setShowPremiumOnly] = useState(searchParams.get('premium') === 'true');
  const [page, setPage] = useState(1);
  const limit = 15;

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
                <h2 className="text-2xl font-bold mb-6">Empfohlene Kindertagesstätten</h2>
                <FeaturedKitas
                  isLoading={isLoadingFeatured}
                  featuredCompanies={featuredCompanies}
                  showHeading={false}
                />
              </div>
            </section>
            
            <KitaStats />
            <MediaReports />
            <div id="wissen">
              <KnowledgeTeaser />
            </div>
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
                  <KitaSearchResults
                    isLoading={isLoadingRegular}
                    data={regularData}
                    page={page}
                    limit={limit}
                    paginate={paginate}
                  />
                </div>
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
