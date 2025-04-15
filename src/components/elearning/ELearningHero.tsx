
import React from 'react';
import { Search, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getRandomStaticImage } from '@/lib/utils'; // Import the utility

interface ELearningHeroProps {
  onSearch?: (query: string) => void;
}

const ELearningHero: React.FC<ELearningHeroProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const heroBgImage = getRandomStaticImage(); // Get a random image

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-kita-cream to-white py-16 md:py-24">
      <div className="absolute inset-0 bg-cover bg-center opacity-10" 
           style={{ backgroundImage: `url(${heroBgImage})` }} /> {/* Use the random image path */}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-kita-green/10 text-kita-green text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            <span>Neu auf kita.de</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
            Online lernen für <span className="text-kita-green">Kita-Profis</span> und <span className="text-kita-orange">Eltern</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Entdecken Sie praxisnahe Kurse für den Kita-Alltag, die pädagogische Leitung oder für die Familie – lernen Sie in Ihrem eigenen Tempo.
          </p>
          
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suchen Sie nach Kursen oder Themen..."
                className="pl-10 py-3 h-12 text-base rounded-lg border-gray-300 focus:border-kita-green focus:ring focus:ring-kita-green/20"
              />
            </div>
            <Button 
              type="submit" 
              className="bg-kita-green hover:bg-kita-green/90 text-white h-12 px-6"
            >
              Suchen
            </Button>
          </form>
          
          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm text-gray-600">
            <span>Beliebt:</span>
            <a href="/elearning?search=Eingewöhnung" className="hover:text-kita-green hover:underline">Eingewöhnung</a>
            <a href="/elearning?search=Digitalisierung" className="hover:text-kita-green hover:underline">Digitalisierung</a>
            <a href="/elearning?search=Leitung" className="hover:text-kita-green hover:underline">Leitung</a>
            <a href="/elearning?search=Inklusion" className="hover:text-kita-green hover:underline">Inklusion</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELearningHero;
