
import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface JobFiltersProps {
  onFilterChange?: (filters: Record<string, any>) => void;
}

const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    employmentType: [],
    distance: '50'
  });

  const handleFilterChange = (category: string, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (Array.isArray(newFilters[category])) {
        if (newFilters[category].includes(value)) {
          newFilters[category] = newFilters[category].filter((item: string) => item !== value);
        } else {
          newFilters[category] = [...newFilters[category], value];
        }
      } else {
        newFilters[category] = value;
      }
      
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-subtle overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-kita-orange mr-2" />
            <h3 className="font-medium">Filter</h3>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            <ChevronDown 
              className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>
      
      <div className={`p-5 space-y-6 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {/* Position / Job Type */}
        <div>
          <h4 className="font-medium mb-3 text-sm">Position</h4>
          <div className="space-y-2">
            {[
              { id: 'erzieher', label: 'Erzieher/in' },
              { id: 'leitung', label: 'Kita-Leitung' },
              { id: 'kinderpfleger', label: 'Kinderpfleger/in' },
              { id: 'heilerziehungspfleger', label: 'Heilerziehungspfleger/in' },
              { id: 'sozialassistent', label: 'Sozialassistent/in' }
            ].map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  id={`jobType-${item.id}`}
                  type="checkbox"
                  checked={filters.jobType.includes(item.id)}
                  onChange={() => handleFilterChange('jobType', item.id)}
                  className="h-4 w-4 rounded border-gray-300 text-kita-orange focus:ring-kita-orange"
                />
                <label htmlFor={`jobType-${item.id}`} className="ml-2 text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Experience Level */}
        <div>
          <h4 className="font-medium mb-3 text-sm">Erfahrung</h4>
          <div className="space-y-2">
            {[
              { id: 'entry', label: 'Berufseinsteiger' },
              { id: 'junior', label: '1-3 Jahre' },
              { id: 'mid', label: '3-5 Jahre' },
              { id: 'senior', label: '5+ Jahre' }
            ].map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  id={`experience-${item.id}`}
                  type="checkbox"
                  checked={filters.experience.includes(item.id)}
                  onChange={() => handleFilterChange('experience', item.id)}
                  className="h-4 w-4 rounded border-gray-300 text-kita-orange focus:ring-kita-orange"
                />
                <label htmlFor={`experience-${item.id}`} className="ml-2 text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Employment Type */}
        <div>
          <h4 className="font-medium mb-3 text-sm">Anstellungsart</h4>
          <div className="space-y-2">
            {[
              { id: 'fulltime', label: 'Vollzeit' },
              { id: 'parttime', label: 'Teilzeit' },
              { id: 'temporary', label: 'Befristet' },
              { id: 'minijob', label: 'Minijob' }
            ].map(item => (
              <div key={item.id} className="flex items-center">
                <input
                  id={`employmentType-${item.id}`}
                  type="checkbox"
                  checked={filters.employmentType.includes(item.id)}
                  onChange={() => handleFilterChange('employmentType', item.id)}
                  className="h-4 w-4 rounded border-gray-300 text-kita-orange focus:ring-kita-orange"
                />
                <label htmlFor={`employmentType-${item.id}`} className="ml-2 text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Distance */}
        <div>
          <h4 className="font-medium mb-3 text-sm">Entfernung</h4>
          <div className="space-y-2">
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={filters.distance}
              onChange={(e) => handleFilterChange('distance', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5 km</span>
              <span>{filters.distance} km</span>
              <span>100 km</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-kita-orange border-kita-orange/20 hover:bg-kita-orange/5"
            onClick={() => {
              setFilters({
                jobType: [],
                experience: [],
                employmentType: [],
                distance: '50'
              });
              if (onFilterChange) {
                onFilterChange({
                  jobType: [],
                  experience: [],
                  employmentType: [],
                  distance: '50'
                });
              }
            }}
          >
            Filter zurücksetzen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
