
import { Link } from 'react-router-dom';
import { MapPin, Clock, Euro, Building, Heart } from 'lucide-react';
import { Job } from '@/types/job';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { getPlaceholderImage } from '@/utils/dataFormatUtils';
import CompanyAvatar from '@/components/ui/company-avatar';

interface JobCardProps {
  job: Job;
  clickable?: boolean;
}

const JobCard = ({ job, clickable = false }: JobCardProps) => {
  // Format the date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `vor ${formatDistanceToNow(date, { locale: de })}`;
    } catch (error) {
      console.error("Fehler beim Formatieren des Datums:", error);
      return "kürzlich";
    }
  };

  // Get a consistent placeholder image based on job ID or index
  const getJobPlaceholderImage = () => {
    // Hash the job ID to get a consistent index for the same job
    const hash = job.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return getPlaceholderImage(hash, 'cover');
  };

  return (
    <Link 
      to={`/jobs/${job.id}`}
      className={`block bg-white rounded-xl border ${job.featured ? 'border-kita-orange/30' : 'border-gray-100'} shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 relative`}
    >
      {clickable && (
        <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm z-10">
          <Heart className="h-4 w-4 text-kita-orange fill-kita-orange" />
        </div>
      )}
      
      <div className={`p-6 ${job.featured ? 'bg-kita-cream' : ''}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <CompanyAvatar
              src={job.company?.logo_url}
              name={job.company?.name || 'Unbekannt'}
              fallbackIndex={job.id.charCodeAt(0)}
              size="md"
              className="bg-white border border-gray-100"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">{job.company?.name}</span>
              {job.featured && (
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-kita-orange text-white">
                  Empfohlen
                </span>
              )}
            </div>
            <h3 className="font-semibold text-lg mt-1 text-gray-900">{job.title}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-1 text-kita-orange" />
                {job.location}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="h-4 w-4 mr-1 text-kita-orange" />
                {formatDate(job.posted_date)}
              </div>
              {job.salary && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Euro className="h-4 w-4 mr-1 text-kita-orange" />
                  {job.salary}
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                {job.type || 'Vollzeit'}
              </span>
            </div>
          </div>
        </div>
        
        {job.kita_image_url || true ? (
          <div className="mt-4 bg-gray-50 rounded-lg overflow-hidden h-24">
            <img 
              src={job.kita_image_url || getJobPlaceholderImage()} 
              alt={`${job.company?.name} Ambiente`} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = getJobPlaceholderImage();
              }}
            />
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default JobCard;
