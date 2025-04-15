
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import SearchInput from '@/components/ui/SearchInput';
import { ListFilter, MapPin, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { fetchJobs } from '@/services/jobService';
import { Job } from '@/types';

const Jobs = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get('keyword') || '';
  const locationParam = searchParams.get('location') || '';
  
  const [filters, setFilters] = useState<{type?: string[]}>({});
  const [keyword, setKeyword] = useState(keywordParam);
  const [locationFilter, setLocationFilter] = useState(locationParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  
  useEffect(() => {
    // Suche nur starten, wenn mindestens ein Parameter gesetzt ist oder wenn keine Suchparameter gesetzt sind
    const hasSearchParams = keyword || locationFilter || (filters.type && filters.type.length > 0);
    
    const loadJobs = async () => {
      setIsLoading(true);
      
      // Pass filters.type directly as it's now compatible with the updated fetchJobs parameters
      const { jobs: fetchedJobs, total } = await fetchJobs({
        keyword: keyword,
        location: locationFilter,
        type: filters.type,
        limit: limit,
        offset: (page - 1) * limit
      });
      
      setJobs(fetchedJobs);
      setTotalJobs(total);
      setIsLoading(false);
    };
    
    loadJobs();
    
    // Suchparameter aktualisieren
    const newSearchParams = new URLSearchParams();
    if (keyword) newSearchParams.set('keyword', keyword);
    if (locationFilter) newSearchParams.set('location', locationFilter);
    setSearchParams(newSearchParams);
    
  }, [keyword, locationFilter, filters, page, setSearchParams]);
  
  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(1); // Bei neuer Suche zurück zur ersten Seite
  };
  
  const handleLocationSearch = (value: string) => {
    setLocationFilter(value);
    setPage(1); // Bei neuer Suche zurück zur ersten Seite
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Bei neuen Filtern zurück zur ersten Seite
  };

  const resetSearch = () => {
    setKeyword('');
    setLocationFilter('');
    setFilters({});
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Stellenangebote</h1>
              <p className="text-gray-600">
                {totalJobs} Stellen gefunden
                {keyword && ` für "${keyword}"`}
                {locationFilter && ` in "${locationFilter}"`}
              </p>
            </div>
            
            <Button
              variant="outline"
              className="mt-4 md:mt-0 flex items-center gap-2 md:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <ListFilter className="h-4 w-4" />
              Filter {isFilterOpen ? 'schließen' : 'öffnen'}
            </Button>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 lg:w-2/3">
              <SearchInput 
                placeholder="Stellentitel, Schlüsselwörter oder Unternehmen" 
                onSearch={handleSearch}
                className="w-full"
                initialValue={keyword}
              />
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => handleLocationSearch(e.target.value)}
                className="block w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-kita-orange focus:border-transparent shadow-sm transition-all"
                placeholder="Ort oder PLZ"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar with filters */}
            <div className={`w-full md:w-1/3 lg:w-1/4 order-2 md:order-1 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
              <JobFilters onFilterChange={handleFilterChange} />
            </div>
            
            {/* Main content with job listings */}
            <div className="w-full md:w-2/3 lg:w-3/4 order-1 md:order-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="h-8 w-8 text-kita-orange animate-spin" />
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-4 animate-fade-in">
                  {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-subtle p-8 text-center animate-fade-in">
                  <div className="text-xl font-semibold text-gray-900 mb-2">
                    Keine Stellenangebote gefunden
                  </div>
                  <p className="text-gray-600 mb-6">
                    Versuche es mit anderen Suchbegriffen oder weniger Filtern.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={resetSearch}
                    className="text-kita-orange border-kita-orange/20 hover:bg-kita-orange/5"
                  >
                    Suche zurücksetzen
                  </Button>
                </div>
              )}
              
              {/* Pagination - einfache Variante */}
              {!isLoading && jobs.length > 0 && totalJobs > limit && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Zurück
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page * limit >= totalJobs}
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;
