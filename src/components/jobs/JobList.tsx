
import React from 'react';
import { Button } from "@/components/ui/button";
import JobCard from "@/components/jobs/JobCard";
import { Job } from "@/types/job";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  isPreview?: boolean;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  isPreview = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(isPreview ? 6 : 10)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-semibold mb-2">Keine Stellenangebote gefunden</h3>
        <p className="text-gray-600 mb-6">
          Versuchen Sie es mit anderen Suchkriterien oder entfernen Sie einige Filter.
        </p>
        <Button onClick={() => window.history.back()} variant="outline">
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} clickable />
        ))}
      </div>
      
      {!isPreview && onPageChange && total > limit && (
        <div className="mt-10 flex justify-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              Zurück
            </Button>
            
            {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1)
              .filter(p => Math.abs(p - page) < 3 || p === 1 || p === Math.ceil(total / limit))
              .map((p, i, arr) => {
                if (i > 0 && arr[i - 1] !== p - 1) {
                  return (
                    <span key={`ellipsis-${p}`} className="flex items-center px-4">
                      ...
                    </span>
                  );
                }
                return (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    onClick={() => onPageChange(p)}
                    className={p === page ? "bg-kita-orange hover:bg-kita-orange/90" : ""}
                  >
                    {p}
                  </Button>
                );
              })}
            
            <Button
              variant="outline"
              onClick={() => onPageChange(page + 1)}
              disabled={page === Math.ceil(total / limit)}
            >
              Weiter
            </Button>
          </div>
        </div>
      )}
      
      {isPreview && (
        <div className="mt-10 text-center">
          <Button 
            asChild
            className="bg-kita-orange hover:bg-kita-orange/90"
          >
            <a href="/jobs">Alle Stellenangebote anzeigen</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;
