
import React from 'react';
import { Button } from "@/components/ui/button";
import KitaCard from "./KitaCard";
import { Company } from '@/types/company';

interface KitaSearchResultsProps {
  isLoading: boolean;
  data: { companies: Company[], total: number } | undefined;
  page: number;
  limit: number;
  paginate: (page: number) => void;
}

const KitaSearchResults: React.FC<KitaSearchResultsProps> = ({
  isLoading,
  data,
  page,
  limit,
  paginate
}) => {
  // Sort companies to show premium listings first
  const sortedCompanies = React.useMemo(() => {
    if (!data?.companies) return [];
    return [...data.companies].sort((a, b) => {
      // Premium kitas come first
      if (a.is_premium && !b.is_premium) return -1;
      if (!a.is_premium && b.is_premium) return 1;
      // Then sort by name
      return a.name.localeCompare(b.name);
    });
  }, [data?.companies]);

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isLoading ? 'Kitas werden geladen...' : `${data?.total || 0} Kindertagesstätten gefunden`}
        </h2>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : sortedCompanies && sortedCompanies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCompanies.map((kita, index) => (
              <KitaCard key={kita.id} kita={kita} index={index} />
            ))}
          </div>
          
          {/* Pagination */}
          {data?.total && data.total > limit && (
            <div className="mt-10 flex justify-center">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => paginate(page - 1)}
                  disabled={page === 1}
                >
                  Zurück
                </Button>
                
                {Array.from({ length: Math.ceil(data.total / limit) }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - page) < 3 || p === 1 || p === Math.ceil(data.total / limit))
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
                        onClick={() => paginate(p)}
                        className={p === page ? "bg-kita-orange hover:bg-kita-orange/90" : ""}
                      >
                        {p}
                      </Button>
                    );
                  })}
                
                <Button
                  variant="outline"
                  onClick={() => paginate(page + 1)}
                  disabled={page === Math.ceil(data.total / limit)}
                >
                  Weiter
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Kitas gefunden</h3>
            <p className="text-gray-500">
              Versuchen Sie es mit anderen Suchkriterien oder entfernen Sie einige Filter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KitaSearchResults;
