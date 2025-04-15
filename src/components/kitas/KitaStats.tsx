import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchCompanyStats } from '@/services/companyService';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import JobCard from '@/components/jobs/JobCard';
import { fetchFeaturedJobs } from '@/services/jobService';
import { Job } from '@/types/job';

const KitaStats = () => {
  // Update the type to match what fetchCompanyStats returns
  const [stats, setStats] = useState({ totalCompanies: 0, tragerCount: 0 });
  const [displayedKitaCount, setDisplayedKitaCount] = useState(0);
  const [displayedTragerCount, setDisplayedTragerCount] = useState(0);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const companyStats = await fetchCompanyStats();
        // Transform the data to the format we need
        const statsData = {
          totalCompanies: companyStats.totalCompanies,
          // Estimate tragerCount as 20% of totalCompanies for now
          tragerCount: Math.round(companyStats.totalCompanies * 0.2)
        };
        setStats(statsData);
        
        // Start the counter animation
        animateValue(0, statsData.totalCompanies, 2000, setDisplayedKitaCount);
        animateValue(0, statsData.tragerCount, 2000, setDisplayedTragerCount);
        
        // Load featured jobs
        const jobs = await fetchFeaturedJobs(2);
        setFeaturedJobs(jobs);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const animateValue = (
    start: number, 
    end: number, 
    duration: number, 
    setter: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const startTime = Date.now();
    
    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      
      setter(value);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  const formatter = new Intl.NumberFormat('de-DE');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">Kita.de in Zahlen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-kita-cream rounded-xl p-6 shadow-sm">
                  <p className="text-gray-600 mb-2">Registrierte Kitas</p>
                  <p className="text-4xl font-bold text-kita-orange">
                    {formatter.format(displayedKitaCount)}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
                  <p className="text-gray-600 mb-2">Träger und Einrichtungen</p>
                  <p className="text-4xl font-bold text-blue-500">
                    {formatter.format(displayedTragerCount)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Über kita.de</h3>
              <p className="text-gray-600 mb-4">
                Kita.de ist die führende Plattform für Kindertageseinrichtungen in Deutschland.
                Wir verbinden Eltern, Erzieher:innen und Einrichtungen miteinander und bieten
                umfassende Informationen und Services rund um die Kinderbetreuung.
              </p>
              <Button asChild variant="outline">
                <Link to="/about">
                  Mehr erfahren <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-2">Top-Stellenangebote</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
                <div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>
              </div>
            ) : featuredJobs.length > 0 ? (
              <div className="space-y-4">
                {featuredJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
                <Button asChild className="w-full mt-2 bg-kita-orange hover:bg-kita-orange/90 text-white">
                  <Link to="/jobs">
                    Alle Stellenangebote ansehen <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-4">Aktuell keine Stellenangebote verfügbar.</p>
                <Button asChild>
                  <Link to="/jobs">Alle Stellenangebote</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KitaStats;
