
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
import KitaSearchForm from "@/components/kitas/KitaSearchForm";
import KitaSidebar from "@/components/kitas/KitaSidebar";
import KitaSearchResults from "@/components/kitas/KitaSearchResults";
import FeaturedKitas from "@/components/kitas/FeaturedKitas";
import { fetchCompanies, fetchFeaturedCompanies } from "@/services/company";

const Kitas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [bundesland, setBundesland] = useState(searchParams.get('bundesland') || 'all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(searchParams.get('premium') === 'true');
  const [page, setPage] = useState(1);
  const limit = 15;

  useEffect(() => {
    // Update bundesland from URL when it changes
    const urlBundesland = searchParams.get('bundesland');
    if (urlBundesland) {
      setBundesland(urlBundesland);
    }
    
    // Update premium filter from URL
    const urlPremium = searchParams.get('premium');
    if (urlPremium !== null) {
      setShowPremiumOnly(urlPremium === 'true');
    }
  }, [searchParams]);

  const { data: regularData, isLoading: isLoadingRegular, refetch } = useQuery({
    queryKey: ['companies', searchText, location, bundesland, showPremiumOnly, page],
    queryFn: () => fetchCompanies({ 
      keyword: searchText, 
      location, 
      bundesland: bundesland !== 'all' ? bundesland : undefined, 
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
    if (bundesland !== 'all') params.set('bundesland', bundesland);
    if (showPremiumOnly) params.set('premium', 'true');
    setSearchParams(params);
    refetch();
  };

  const handleBundeslandChange = (value: string) => {
    setBundesland(value);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (value !== 'all') {
      params.set('bundesland', value);
    } else {
      params.delete('bundesland');
    }
    setSearchParams(params);
    refetch();
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
            {/* Search results view */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 pt-24">
              <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                    Kita-Suche
                  </h1>
                  
                  <KitaSearchForm
                    searchText={searchText}
                    setSearchText={setSearchText}
                    location={location}
                    setLocation={setLocation}
                    handleSearch={handleSearch}
                  />
                </div>
              </div>
            </section>
            
            {/* Search Results */}
            <section className="py-12">
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Sidebar - Filters */}
                  <div className="w-full md:w-64 shrink-0">
                    <KitaSidebar
                      bundesland={bundesland}
                      handleBundeslandChange={handleBundeslandChange}
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
