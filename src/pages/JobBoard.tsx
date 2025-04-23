import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobFilters from "@/components/jobs/JobFilters";
import JobList from "@/components/jobs/JobList";
import AIMatchingCard from "@/components/jobs/AIMatchingCard";
import JobBoardHero from "@/components/jobs/JobBoardHero";
import JobStats from "@/components/jobs/JobStats";
import EmployerFeatures from "@/components/jobs/EmployerFeatures";
import { fetchJobs } from "@/services/jobService";

const JobBoard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('type') || 'all'); // Default to 'all' instead of ''
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', searchText, location, jobType, page],
    queryFn: () => fetchJobs({
      keyword: searchText,
      location,
      type: jobType !== 'all' ? jobType : undefined, // Don't filter if 'all' is selected
      limit,
      offset: (page - 1) * limit
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);

    const params = new URLSearchParams();
    if (searchText) params.set('q', searchText);
    if (location) params.set('location', location);
    if (jobType && jobType !== 'all') params.set('type', jobType);

    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if we're in search view
  const isSearchView = searchParams.size > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {!isSearchView ? (
          <>
            <JobBoardHero
              searchText={searchText}
              setSearchText={setSearchText}
              location={location}
              setLocation={setLocation}
              jobType={jobType}
              setJobType={setJobType}
              handleSearch={handleSearch}
            />
            <JobStats />
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Aktuelle Stellenangebote in Kitas</h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Entdecken Sie aktuelle Jobangebote aus dem Bereich frühkindliche Bildung und Betreuung auf kita.de
                  </p>
                </div>
                <JobList
                  jobs={data?.jobs.slice(0, 6) || []}
                  isLoading={isLoading}
                  isPreview={true}
                />
              </div>
            </section>
            <EmployerFeatures />
          </>
        ) : (
          <>
            {/* Search Results View */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 pt-24">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Stellenangebote im Kitabereich
                  </h1>
                  <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Jobtitel oder Stichwort"
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ort oder PLZ"
                        className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-kita-orange hover:bg-kita-orange/90 text-white py-3 px-6 rounded-xl font-medium"
                    >
                      Suchen
                    </button>
                  </form>
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="container mx-auto px-4">
                 {/* Wrapper div for white background, padding, shadow */}
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar with filters */}
                    <div className="w-full lg:w-1/4">
                    <JobFilters />

                    {/* AI Matching Card */}
                    <div className="mt-6">
                      <AIMatchingCard />
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="w-full lg:w-3/4">
                    <h2 className="text-2xl font-bold mb-6">
                      {isLoading ? 'Stellenangebote werden geladen...' :
                        `${data?.total || 0} Stellenangebote gefunden`}
                    </h2>

                    <JobList
                      jobs={data?.jobs || []}
                      isLoading={isLoading}
                      total={data?.total || 0}
                      page={page}
                      limit={limit}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
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

export default JobBoard;
