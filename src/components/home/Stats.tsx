
import { Briefcase, Users, Building, Award } from 'lucide-react';

const StatItem = ({ icon: Icon, count, label }: { icon: React.ElementType; count: string; label: string }) => (
  <div className="text-center p-6 bg-white rounded-xl shadow-subtle hover-card">
    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-kita-orange/10 rounded-lg text-kita-orange">
      <Icon size={24} />
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-2">{count}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

const Stats = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">KITA.de Jobs in Zahlen</h2>
          <p className="text-gray-600">
            Unsere Plattform verbindet pädagogische Fachkräfte mit Kindertageseinrichtungen in ganz Deutschland.
            Werde Teil unserer wachsenden Community!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem 
            icon={Building} 
            count="50.000+" 
            label="Kitas deutschlandweit" 
          />
          <StatItem 
            icon={Briefcase} 
            count="12.500+" 
            label="Aktive Stellenangebote" 
          />
          <StatItem 
            icon={Users} 
            count="35.000+" 
            label="Registrierte Fachkräfte" 
          />
          <StatItem 
            icon={Award} 
            count="95%" 
            label="Erfolgsquote" 
          />
        </div>
      </div>
    </section>
  );
};

export default Stats;
