
import React from 'react';
import FeaturedKitaCard from './FeaturedKitaCard';
import { Company } from '@/types/company';

interface FeaturedKitasProps {
  isLoading: boolean;
  featuredCompanies: Company[] | undefined;
  showHeading?: boolean;
}

const FeaturedKitas: React.FC<FeaturedKitasProps> = ({
  isLoading,
  featuredCompanies,
  showHeading = true
}) => {
  return (
    <section className="py-6">
      {showHeading && (
        <h2 className="text-2xl font-bold mb-6">Empfohlene Kindertagesstätten</h2>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-72 bg-gray-100 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : featuredCompanies && featuredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredCompanies.map((kita, index) => (
            <FeaturedKitaCard key={kita.id} kita={kita} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine empfohlenen Kitas gefunden</h3>
            <p className="text-gray-500">
              Aktuell sind keine empfohlenen Kindertagesstätten verfügbar.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedKitas;
