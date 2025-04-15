
import { Building, Users, Award, ChartBar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmployerFeatures = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Für Kita-Träger und Einrichtungen</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Erreichen Sie qualifizierte Fachkräfte mit Ihren Stellenangeboten auf kita.de – Deutschlands größter Kita-Plattform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-kita-cream rounded-full text-kita-orange mb-4">
              <Building className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">50.000+ Kitas</h3>
            <p className="text-gray-600 text-sm">
              Direkter Zugang zur größten Datenbank von Kindertagesstätten in Deutschland
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-kita-cream rounded-full text-kita-orange mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Zielgruppen-Matching</h3>
            <p className="text-gray-600 text-sm">
              Ihre Anzeigen erreichen genau die Fachkräfte, die zu Ihrer Einrichtung passen
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-kita-cream rounded-full text-kita-orange mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Premium-Sichtbarkeit</h3>
            <p className="text-gray-600 text-sm">
              Heben Sie sich mit Premium-Features von anderen Stellenangeboten ab
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-kita-cream rounded-full text-kita-orange mb-4">
              <ChartBar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Erfolgs-Tracking</h3>
            <p className="text-gray-600 text-sm">
              Analysieren Sie die Performance Ihrer Stellenanzeigen mit detaillierten Statistiken
            </p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Stellen Sie jetzt Ihre Anzeige ein</h3>
              <p className="text-gray-600 mb-6">
                Unsere Premium-Packages bieten Ihnen maximale Sichtbarkeit und direkte Kontaktmöglichkeiten zu qualifizierten Bewerber:innen im Kita-Bereich.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-kita-orange hover:bg-kita-orange/90">
                  Stellenanzeige schalten
                </Button>
                <Button variant="outline">
                  Mehr erfahren
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Einzelanzeige ab 39 EUR</h4>
                  <p className="text-sm text-gray-500">30 Tage online, mit Profilverknüpfung</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">5er-Paket für 169 EUR</h4>
                  <p className="text-sm text-gray-500">Ideal für Träger mit mehreren Einrichtungen</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Flatrate für nur 599 EUR / Jahr</h4>
                  <p className="text-sm text-gray-500">Unbegrenzte Anzeigen für große Träger</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerFeatures;
