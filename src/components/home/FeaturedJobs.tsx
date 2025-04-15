
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { fetchFeaturedJobs } from '@/services/jobService';
import { Job } from '@/types/job';
import { toast } from '@/hooks/use-toast';

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const featuredJobs = await fetchFeaturedJobs(6);
        setJobs(featuredJobs);
        
        // If no jobs are returned, show a toast error
        if (featuredJobs.length === 0) {
          console.error("Keine Featured Jobs gefunden");
          toast({
            title: "Hinweis",
            description: "Es konnten keine empfohlenen Stellenangebote gefunden werden.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Fehler beim Laden der Featured Jobs:", error);
        toast({
          title: "Fehler beim Laden",
          description: "Die empfohlenen Stellenangebote konnten nicht geladen werden.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Empfohlene Stellenangebote</h2>
            <p className="text-gray-600 max-w-2xl">
              Entdecke die neuesten und beliebtesten Stellenangebote aus über 50.000 Kindertagesstätten in ganz Deutschland.
            </p>
          </div>
          <Link to="/jobs" className="mt-4 md:mt-0 group flex items-center text-kita-orange font-medium hover:text-kita-orange/80 transition-colors">
            Alle Stellenangebote
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} clickable={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Keine empfohlenen Stellenangebote verfügbar.</p>
            <Button asChild className="mt-4 bg-kita-orange hover:bg-kita-orange/90 text-white">
              <Link to="/jobs">Alle Stellenangebote ansehen</Link>
            </Button>
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button asChild className="bg-kita-orange hover:bg-kita-orange/90 text-white px-8">
            <Link to="/jobs">Alle Stellenangebote ansehen</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
