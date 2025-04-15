
import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobBoardHeroProps {
  searchText: string;
  setSearchText: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  jobType: string;
  setJobType: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const JOB_TYPES = [
  { value: "all", label: "Alle Stellenarten" },
  { value: "erzieher", label: "Erzieher/in" },
  { value: "leitung", label: "Kita-Leitung" },
  { value: "kinderpfleger", label: "Kinderpfleger/in" },
  { value: "heilerziehungspfleger", label: "Heilerziehungspfleger/in" },
  { value: "sozialassistent", label: "Sozialassistent/in" },
];

const JobBoardHero: React.FC<JobBoardHeroProps> = ({
  searchText,
  setSearchText,
  location,
  setLocation,
  jobType,
  setJobType,
  handleSearch
}) => {
  // Form submit prevention to handle it properly
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(e);
  };

  return (
    <section className="bg-gradient-to-b from-kita-cream to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Finde deinen <span className="text-kita-orange">Traumjob</span> in der Kinderbetreuung
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Entdecke über 5.000 Stellenangebote aus dem Bereich frühkindliche Bildung und Betreuung
          </p>
          
          <div className="bg-white p-4 rounded-2xl shadow-md">
            <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Jobtitel oder Stichwort"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl"
                />
              </div>
              
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ort oder PLZ"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl"
                />
              </div>
              
              <div className="relative flex-1">
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="border border-gray-200 rounded-xl pl-10">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <SelectValue placeholder="Stellenart" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <button
                type="submit"
                className="bg-kita-orange hover:bg-kita-orange/90 text-white py-3 px-6 rounded-xl font-medium"
              >
                Jobs finden
              </button>
            </form>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <span className="text-gray-500">Beliebte Suchen:</span>
            <a href="?keyword=Erzieher&location=Berlin" className="text-kita-orange hover:underline">Erzieher Berlin</a>
            <a href="?keyword=Kita-Leitung&location=München" className="text-kita-orange hover:underline">Kita-Leitung München</a>
            <a href="?keyword=Kinderpfleger&location=Hamburg" className="text-kita-orange hover:underline">Kinderpfleger Hamburg</a>
            <a href="?type=teilzeit" className="text-kita-orange hover:underline">Teilzeit Jobs</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobBoardHero;
