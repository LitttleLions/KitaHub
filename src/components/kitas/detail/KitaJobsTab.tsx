
import React from 'react';
import JobCard from '@/components/jobs/JobCard';
import { Job } from '@/types/job';

interface KitaJobsTabProps {
  jobs: Job[] | undefined;
  isLoading: boolean;
}

const KitaJobsTab: React.FC<KitaJobsTabProps> = ({ jobs, isLoading }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Offene Stellenangebote</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Aktuell keine offenen Stellenangebote vorhanden.</p>
        </div>
      )}
    </>
  );
};

export default KitaJobsTab;
