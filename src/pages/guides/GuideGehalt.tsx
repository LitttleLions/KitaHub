
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, DollarSign, Building, LineChart, Briefcase, Award, LucideIcon } from 'lucide-react';

interface SalaryGuideSection {
  title: string;
  description: string;
  icon: LucideIcon;
}

const salaryGuideSections: SalaryGuideSection[] = [
  {
    title: "Einsteiger-Gehälter für Erzieher/innen",
    description: "Als frisch ausgebildete/r Erzieher/in kannst du in Deutschland mit einem Einstiegsgehalt von etwa 2.800 bis 3.300 EUR brutto monatlich rechnen. Diese Werte variieren je nach Bundesland, Träger und Einrichtungsgröße.",
    icon: DollarSign,
  },
  {
    title: "Gehälter nach Erfahrung",
    description: "Mit zunehmender Berufserfahrung steigt auch dein Gehalt. Nach 5 Jahren kannst du bis zu 3.600 EUR brutto erreichen, langjährige Fachkräfte mit 10+ Jahren Erfahrung können bis zu 4.200 EUR oder mehr verdienen.",
    icon: LineChart,
  },
  {
    title: "Regionale Unterschiede",
    description: "In Metropolregionen wie München, Hamburg oder Frankfurt liegen die Gehälter oft 10-15% über dem Bundesdurchschnitt. In ländlichen Regionen oder in ostdeutschen Bundesländern können die Gehälter niedriger ausfallen.",
    icon: Building,
  },
  {
    title: "Zusatzqualifikationen",
    description: "Spezielle Fachkenntnisse wie Heilpädagogik, Sprachförderung oder Leitungsqualifikationen können dein Gehalt um 200-500 EUR monatlich erhöhen. Viele Träger fördern solche Weiterbildungen finanziell.",
    icon: Award,
  },
  {
    title: "Verhandlungstipps",
    description: "Bereite dich auf Gehaltsverhandlungen gut vor, indem du aktuelle Tarifverträge kennst, deine Qualifikationen herausstellst und konkrete Erfolge aus deiner bisherigen Arbeit benennen kannst.",
    icon: Briefcase,
  },
];

const GuideGehalt = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="/" className="text-gray-500 hover:text-kita-orange flex items-center gap-1 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </div>
          
          {/* Hero section */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 md:p-12 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gehalts-Guide für pädagogische Fachkräfte
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mb-6">
              Informiere dich über aktuelle Gehälter im Kita-Bereich, regionale Unterschiede und wertvolle Tipps für deine nächste Gehaltsverhandlung.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/jobs" className="bg-kita-orange hover:bg-kita-orange/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                Zu den Stellenangeboten
              </Link>
              <a href="#gehalt-tabelle" className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-200">
                Gehaltstabelle ansehen
              </a>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Was verdienen Erzieher/innen in Deutschland?</h2>
              
              <div className="prose max-w-none">
                <p>
                  Die Gehälter für pädagogische Fachkräfte in Kindertagesstätten haben sich in den letzten Jahren positiv entwickelt. Der anhaltende Fachkräftemangel hat dazu geführt, dass Träger und Einrichtungen attraktivere Vergütungen anbieten, um qualifiziertes Personal zu gewinnen und zu halten.
                </p>
                
                <p>
                  Die Vergütung von Erzieher/innen richtet sich in Deutschland hauptsächlich nach den geltenden Tarifverträgen. Die wichtigsten sind:
                </p>
                
                <ul>
                  <li><strong>TVöD SuE</strong> (Tarifvertrag für den öffentlichen Dienst - Sozial- und Erziehungsdienst): Gilt für kommunale Einrichtungen</li>
                  <li><strong>TV-L</strong> (Tarifvertrag der Länder): Für Einrichtungen in Trägerschaft der Bundesländer</li>
                  <li><strong>AVR</strong> (Arbeitsvertragsrichtlinien): Verschiedene Versionen für konfessionelle Träger wie Diakonie, Caritas etc.</li>
                  <li><strong>Haustarifverträge</strong>: Bei privaten Trägern oder größeren Kita-Ketten</li>
                </ul>
                
                <p>
                  Je nach Qualifikation, Berufserfahrung und Verantwortungsbereich werden Erzieher/innen in unterschiedliche Entgeltgruppen eingestuft.
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Faktoren, die dein Gehalt beeinflussen</h3>
                
                <div className="space-y-6">
                  {salaryGuideSections.map((section, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="bg-kita-orange/10 p-3 rounded-lg">
                          <section.icon className="h-6 w-6 text-kita-orange" />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{section.title}</h4>
                          <p className="text-gray-600">{section.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Aktuelle Gehälter nach Tarifvertrag</h3>
                
                <div id="gehalt-tabelle" className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">TVöD SuE (2023)</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="text-gray-600 text-sm">Entgeltgruppe</div>
                        <div className="text-gray-600 text-sm">Bruttogehalt</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2 mb-2">
                        <div>S8a (Stufe 1)</div>
                        <div className="font-medium">3.000 €</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2 mb-2">
                        <div>S8a (Stufe 3)</div>
                        <div className="font-medium">3.500 €</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>S8a (Stufe 6)</div>
                        <div className="font-medium">4.100 €</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Leitung (TVöD SuE)</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="text-gray-600 text-sm">Position</div>
                        <div className="text-gray-600 text-sm">Bruttogehalt</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-2 mb-2">
                        <div>Kleine Kita</div>
                        <div className="font-medium">4.200 - 4.800 €</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>Große Kita</div>
                        <div className="font-medium">5.000 - 5.800 €</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link to="/jobs" className="text-kita-orange hover:text-kita-orange/80 font-medium flex items-center justify-center gap-2">
                      Aktuelle Stellenangebote anzeigen
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="bg-gradient-to-r from-kita-orange/90 to-kita-orange rounded-2xl p-8 md:p-12 text-white mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Bereit für den nächsten Karriereschritt?</h2>
              <p className="text-white/90 mb-8">
                Finde deinen Traumjob mit fairer Bezahlung in einer unserer über 50.000 Kitas in ganz Deutschland.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/jobs" className="bg-white text-kita-orange hover:bg-gray-100 px-6 py-3 rounded-lg font-medium">
                  Stellenangebote durchsuchen
                </Link>
                <Link to="/kitas" className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg font-medium">
                  Kitas entdecken
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GuideGehalt;
