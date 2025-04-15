
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Über KITA.de Jobs</h1>
            <p className="text-xl text-gray-600">
              Die führende Jobbörse für pädagogische Fachkräfte in Deutschland
            </p>
          </div>
          
          {/* Main content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
              <div className="aspect-video relative">
                <img 
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80" 
                  alt="Kinder beim Spielen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Unsere Mission</h2>
                <p className="text-gray-600 mb-6">
                  Bei KITA.de Jobs verbinden wir qualifizierte pädagogische Fachkräfte mit den besten Kindertageseinrichtungen in ganz Deutschland. Unsere Plattform ist speziell auf die Bedürfnisse des frühkindlichen Bildungssektors zugeschnitten.
                </p>
                <p className="text-gray-600 mb-6">
                  Mit über 50.000 Kita-Profilen in unserer Datenbank bieten wir eine einzigartige Möglichkeit, den perfekten Arbeitsplatz oder die idealen Mitarbeiter zu finden. Wir glauben, dass jedes Kind eine qualitativ hochwertige Betreuung verdient, und das beginnt mit der Unterstützung der Menschen, die tagtäglich mit unseren Kindern arbeiten.
                </p>
                <p className="text-gray-600">
                  KITA.de Jobs ist mehr als nur eine Jobbörse – wir sind eine Community für Erzieherinnen und Erzieher, Kinderpfleger, Sozialpädagogen und alle anderen Fachkräfte, die im Bereich der frühkindlichen Bildung arbeiten.
                </p>
              </div>
            </div>
            
            {/* Why choose us */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="bg-kita-orange/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-kita-orange">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Direkte Verbindung</h3>
                <p className="text-gray-600">
                  Wir verbinden Fachkräfte direkt mit Einrichtungen, ohne Umwege oder teure Vermittlungsgebühren.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="bg-kita-orange/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-kita-orange">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Spezialisiert</h3>
                <p className="text-gray-600">
                  Wir konzentrieren uns ausschließlich auf den Bereich frühkindliche Bildung und verstehen die besonderen Anforderungen.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="bg-kita-orange/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-kita-orange">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.5 20.25h-9a1.5 1.5 0 0 1-1.5-1.5v-10.5a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">KI-gestützt</h3>
                <p className="text-gray-600">
                  Unsere intelligenten Matching-Algorithmen finden die besten Übereinstimmungen zwischen Bewerbern und Stellen.
                </p>
              </div>
            </div>
            
            {/* Team */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Unser Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-square">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80" 
                    alt="Team Mitglied" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">Julia Schmidt</h3>
                  <p className="text-kita-orange mb-2">Gründerin & CEO</p>
                  <p className="text-gray-600 text-sm">
                    15 Jahre Erfahrung im Kita-Management und leidenschaftliche Verfechterin für bessere Arbeitsbedingungen.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-square">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" 
                    alt="Team Mitglied" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">Thomas Müller</h3>
                  <p className="text-kita-orange mb-2">Technischer Direktor</p>
                  <p className="text-gray-600 text-sm">
                    Experte für digitale Plattformen mit Fokus auf Benutzerfreundlichkeit und Innovation.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="aspect-square">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80" 
                    alt="Team Mitglied" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">Sarah Weber</h3>
                  <p className="text-kita-orange mb-2">Kundenbetreuung</p>
                  <p className="text-gray-600 text-sm">
                    Ehemalige Erzieherin mit einem tiefen Verständnis für die Bedürfnisse pädagogischer Fachkräfte.
                  </p>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="bg-kita-cream rounded-xl shadow-sm p-8 md:p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Starten Sie jetzt!</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Egal ob Sie eine offene Stelle zu besetzen haben oder Ihren nächsten Karriereschritt planen – KITA.de Jobs ist Ihr Partner für den frühkindlichen Bildungsbereich.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild className="bg-kita-orange hover:bg-kita-orange/90 text-white">
                  <Link to="/jobs">Stellenangebote durchsuchen</Link>
                </Button>
                <Button asChild variant="outline" className="border-kita-orange/20 text-kita-orange hover:bg-kita-orange/5">
                  <Link to="/employers">Für Arbeitgeber</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
