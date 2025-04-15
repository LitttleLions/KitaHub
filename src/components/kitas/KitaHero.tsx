
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, School } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from 'framer-motion';

const BUNDESLAENDER = [
  "Alle Bundesländer",
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen"
];

const KitaHero = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  const [bundesland, setBundesland] = useState("Alle Bundesländer");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchText) params.set('q', searchText);
    if (location) params.set('location', location);
    if (bundesland !== "Alle Bundesländer") params.set('bundesland', bundesland);
    navigate(`/kitas?${params.toString()}`);
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Die perfekte Kita für Ihr Kind finden
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Durchsuchen Sie über 50.000 Kindertagesstätten in ganz Deutschland und finden Sie die passende Einrichtung in Ihrer Nähe.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Name der Kita oder des Trägers"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="md:col-span-3 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Ort oder PLZ"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="md:col-span-3">
                  <Select value={bundesland} onValueChange={setBundesland}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Bundesland auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUNDESLAENDER.map((bl) => (
                        <SelectItem key={bl} value={bl}>
                          {bl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full bg-kita-green hover:bg-kita-green/90 text-white flex items-center justify-center gap-2">
                    <Search className="h-4 w-4" />
                    <span>Suchen</span>
                  </Button>
                </div>
              </div>
            </form>
            
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-gray-500">Häufige Suchen:</span>
              {['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt'].map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setLocation(city);
                    setBundesland("Alle Bundesländer"); // Reset Bundesland when using quick search
                    handleSearch(new Event('submit') as any);
                  }}
                >
                  {city}
                </Button>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-8 flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              asChild
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
            >
              <a href="#bundeslaender">Suche nach Bundesland</a>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
            >
              <a href="#wissen">Wissenswertes zur Kita</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default KitaHero;
