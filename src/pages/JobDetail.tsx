
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query'; // Import useQueryClient
import { fetchJobById } from '@/services/jobService';
import { Job } from '@/types/job';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building, 
  Calendar, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  Heart,
  Share,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient(); // Get query client instance
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const jobData = await fetchJobById(id);
      setJob(jobData);
      setIsLoading(false);
    };
    
    loadJob();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 text-kita-orange">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v2" />
            </svg>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stellenangebot nicht gefunden</h1>
            <p className="text-gray-600 mb-6">
              Das gesuchte Stellenangebot existiert nicht oder wurde bereits entfernt.
            </p>
            <Button asChild className="bg-kita-orange hover:bg-kita-orange/90">
              <Link to="/jobs">Alle Stellenangebote ansehen</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Format job posted date to "vor X Tagen" etc.
  const postedDateText = job.posted_date 
    ? formatDistanceToNow(new Date(job.posted_date), { 
        addSuffix: true, 
        locale: de 
      })
    : 'Kürzlich';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-gray-50">
        {/* Job header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white rounded-lg shadow-subtle flex items-center justify-center overflow-hidden border border-gray-100">
                  {job.company && job.company.logo_url ? (
                    <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <div className="flex items-center text-gray-600 text-sm">
                    {job.company && (
                      // Use company ID for the link, matching the route in App.tsx
                      <Link to={`/company/${job.company.id}`} className="hover:text-kita-orange mr-2">
                        {job.company.name}
                      </Link>
                    )}
                    <span>•</span>
                    <span className="ml-2">{postedDateText}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  className={`${isSaved ? 'text-kita-orange border-kita-orange/20' : 'text-gray-700'}`}
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Gespeichert' : 'Speichern'}
                </Button>
                
                <Button variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Teilen
                </Button>
                
                <Button className="bg-kita-orange hover:bg-kita-orange/90">
                  Jetzt bewerben
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job highlights */}
              <div className="bg-white rounded-xl shadow-subtle p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Building className="h-5 w-5 text-kita-orange mr-2" />
                      <span className="text-sm text-gray-500">Anstellungsart</span>
                    </div>
                    <p className="font-medium">{job.type || 'Nicht angegeben'}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-kita-orange mr-2" />
                      <span className="text-sm text-gray-500">Standort</span>
                    </div>
                    <p className="font-medium">{job.location || 'Flexibel'}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Briefcase className="h-5 w-5 text-kita-orange mr-2" />
                      <span className="text-sm text-gray-500">Erfahrung</span>
                    </div>
                    <p className="font-medium">{job.experience || 'Nicht angegeben'}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <GraduationCap className="h-5 w-5 text-kita-orange mr-2" />
                      <span className="text-sm text-gray-500">Ausbildung</span>
                    </div>
                    <p className="font-medium">{job.education || 'Nicht angegeben'}</p>
                  </div>
                </div>
              </div>
              
              {/* Job description */}
              <div className="bg-white rounded-xl shadow-subtle p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Stellenbeschreibung</h2>
                {job.description ? (
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                ) : (
                  <p className="text-gray-500">Keine detaillierte Beschreibung verfügbar.</p>
                )}
              </div>
              
              {/* Requirements */}
              {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                <div className="bg-white rounded-xl shadow-subtle p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Anforderungen</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-50 flex items-center justify-center mr-3 mt-0.5">
                          <ChevronRight className="h-3.5 w-3.5 text-kita-orange" />
                        </div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Benefits */}
              {job.benefits && Array.isArray(job.benefits) && job.benefits.length > 0 && (
                <div className="bg-white rounded-xl shadow-subtle p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Vorteile</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center mr-3 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application CTA */}
              <div className="bg-white rounded-xl shadow-subtle p-6">
                <h3 className="font-medium text-gray-900 mb-4">Interessiert?</h3>
                <Button className="w-full bg-kita-orange hover:bg-kita-orange/90 mb-4">
                  Jetzt bewerben
                </Button>
                <p className="text-sm text-gray-500 mb-4">
                  Oder kontaktieren Sie den Ansprechpartner direkt:
                </p>
                
                {job.company && (
                  <ul className="space-y-3">
                    {job.company.email && (
                      <li className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-kita-orange mr-2 flex-shrink-0" />
                        <a 
                          href={`mailto:${job.company.email}`} 
                          className="text-gray-700 hover:text-kita-orange transition-colors"
                        >
                          {job.company.email}
                        </a>
                      </li>
                    )}
                    
                    {job.company.phone && (
                      <li className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-kita-orange mr-2 flex-shrink-0" />
                        <a 
                          href={`tel:${job.company.phone}`} 
                          className="text-gray-700 hover:text-kita-orange transition-colors"
                        >
                          {job.company.phone}
                        </a>
                      </li>
                    )}
                    
                    {job.company.website && (
                      <li className="flex items-center text-sm">
                        <ExternalLink className="h-4 w-4 text-kita-orange mr-2 flex-shrink-0" />
                        <a 
                          href={job.company.website} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-kita-orange transition-colors"
                        >
                          Website besuchen
                        </a>
                      </li>
                    )}
                  </ul>
                )}
              </div>
              
              {/* Company info */}
              {job.company && (
                <div className="bg-white rounded-xl shadow-subtle p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Über die Kita</h3>

                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-white rounded-lg shadow-subtle flex items-center justify-center overflow-hidden border border-gray-100 mr-3">
                      {job.company.logo_url ? (
                        <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-cover" />
                      ) : (
                        <Building className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{job.company.name}</h4>
                      {job.company.location && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.company.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {job.company.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 line-clamp-3">{job.company.description.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                    </div>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                    // Invalidate cache on click before navigating
                    onClick={() => {
                       if (job.company?.id) {
                         queryClient.invalidateQueries({ queryKey: ['kita', job.company.id] });
                       }
                    }}
                   >
                    <Link to={`/company/${job.company.id}`}>
                      Kita-Profil ansehen
                    </Link>
                  </Button>
                </div>
              )}
              
              {/* Similar jobs - placeholder */}
              <div className="bg-white rounded-xl shadow-subtle p-6">
                <h3 className="font-medium text-gray-900 mb-4">Ähnliche Stellenangebote</h3>
                <p className="text-sm text-gray-500">
                  Derzeit keine ähnlichen Angebote verfügbar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobDetail;
