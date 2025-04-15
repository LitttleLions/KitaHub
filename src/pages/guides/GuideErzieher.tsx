
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Lightbulb, Users, BookOpen, Award, Heart, Star, LucideIcon } from 'lucide-react';

interface CareerTip {
  title: string;
  icon: LucideIcon;
  content: string;
}

const careerTips: CareerTip[] = [
  {
    title: "Pädagogische Konzepte vertiefen",
    icon: Lightbulb,
    content: "Erweitern Sie Ihr Wissen über verschiedene pädagogische Ansätze wie Reggio, Montessori oder den situationsorientierten Ansatz. Eine fundierte theoretische Basis hilft Ihnen, Ihre pädagogische Arbeit bewusster zu gestalten und zu reflektieren."
  },
  {
    title: "Teamarbeit stärken",
    icon: Users,
    content: "Pflegen Sie einen offenen, wertschätzenden Austausch im Team. Regelmäßige Teambesprechungen, kollegiale Beratung und gemeinsame Fortbildungen fördern nicht nur die Qualität Ihrer Arbeit, sondern auch Ihre berufliche Zufriedenheit."
  },
  {
    title: "Kontinuierliche Weiterbildung",
    icon: BookOpen,
    content: "Nutzen Sie Fortbildungsangebote zu aktuellen Themen wie Inklusion, Sprachförderung oder digitale Medien. Viele Träger unterstützen Weiterbildungen finanziell und bieten Freistellungen an. Auch Online-Kurse oder Fachtagungen erweitern Ihren Horizont."
  },
  {
    title: "Selbstfürsorge praktizieren",
    icon: Heart,
    content: "Der Erzieherberuf ist emotional und körperlich fordernd. Achten Sie auf Ihre Gesundheit durch regelmäßige Pausen, rückenschonende Arbeitstechniken und Stressmanagement-Methoden. Eine ausgeglichene Work-Life-Balance ist essentiell für Ihre Berufsfreude."
  },
  {
    title: "Spezialisierung entwickeln",
    icon: Star,
    content: "Entwickeln Sie Ihre individuellen Stärken weiter. Ob musikalische Früherziehung, Naturpädagogik oder interkulturelle Arbeit – mit besonderen Kompetenzen heben Sie sich ab und eröffnen sich neue berufliche Perspektiven."
  },
  {
    title: "Berufliche Weiterentwicklung planen",
    icon: Award,
    content: "Denken Sie über Karrierewege im pädagogischen Bereich nach. Möglichkeiten sind der Aufstieg zur Kita-Leitung, eine Fachberatungstätigkeit, die Arbeit als Praxisanleiter/in oder der Wechsel in die Lehre an Fachschulen und Hochschulen."
  }
];

const ErzieherGuide = () => {
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
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Guide für Erzieher/innen
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mb-6">
              Praxisnahe Tipps, berufliche Entwicklungsmöglichkeiten und Inspiration für Ihre pädagogische Arbeit mit Kindern.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/jobs" className="bg-kita-orange hover:bg-kita-orange/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                Stellenangebote durchsuchen
              </Link>
              <a href="#weiterbildung" className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-200">
                Weiterbildungsmöglichkeiten
              </a>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Karriere-Tipps für Erzieher/innen</h2>
              
              <div className="prose max-w-none mb-8">
                <p>
                  Der Beruf des Erziehers/der Erzieherin ist anspruchsvoll und vielseitig. Sie begleiten Kinder in einer prägenden Lebensphase, gestalten Bildungsprozesse und arbeiten eng mit Familien zusammen. Gleichzeitig bietet der Beruf zahlreiche Möglichkeiten zur persönlichen und fachlichen Weiterentwicklung.
                </p>
                
                <p>
                  Unsere Expertentipps sollen Ihnen helfen, Ihre pädagogischen Kompetenzen zu erweitern, berufliche Perspektiven zu entdecken und langfristig Freude und Erfüllung in Ihrem Beruf zu finden.
                </p>
              </div>
              
              <div className="space-y-6">
                {careerTips.map((tip, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="bg-kita-orange/10 p-3 rounded-lg">
                        <tip.icon className="h-6 w-6 text-kita-orange" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                        <p className="text-gray-600">{tip.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Projektideen für den Kita-Alltag</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Naturerkundung & Umweltbewusstsein</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Jahreszeiten-Sammelaktionen im Wald</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Kita-Garten mit Hochbeeten anlegen</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Wetterstation basteln und beobachten</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Upcycling-Projekte mit Alltagsmaterialien</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Kreativ & Künstlerisch</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Atelier für experimentelles Malen einrichten</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Schattentheater mit selbstgebastelten Figuren</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Klanggeschichten erfinden und vertonen</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Kita-Kunstausstellung für Eltern organisieren</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Sprache & Kommunikation</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Kamishibai-Erzähltheater einführen</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Mehrsprachige Lieder und Fingerspiele</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Eigenes Kita-Bilderbuch gestalten</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Geschichtenerzähler aus der Nachbarschaft einladen</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Bewegung & Gesundheit</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Bewegungsbaustelle mit Alltagsmaterialien</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Wöchentliche Entspannungsreisen</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Gesunde Snacks gemeinsam zubereiten</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Sinnesgarten anlegen und pflegen</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div id="weiterbildung" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Weiterbildungsmöglichkeiten</h3>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Facherzieher/in für…</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Integration & Inklusion</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Sprachförderung</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Psychomotorik</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Musik & Rhythmik</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Leitungsqualifikationen</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Fachwirt/in für Erziehungswesen</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Sozialfachwirt/in</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Kita-Management-Kurse</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Weitere Qualifikationen</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Praxisanleitung</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Elternberatung</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Qualitätsmanagement</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Medienpädagogik</div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/guides/ausbildung" className="text-kita-orange hover:text-kita-orange/80 font-medium flex items-center justify-center gap-2">
                    Mehr zu Ausbildung & Weiterbildung
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="bg-gradient-to-r from-kita-orange/90 to-kita-orange rounded-2xl p-8 md:p-12 text-white mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Auf der Suche nach neuen beruflichen Herausforderungen?</h2>
              <p className="text-white/90 mb-8">
                Entdecken Sie attraktive Stellenangebote in über 50.000 Kitas in ganz Deutschland und finden Sie Ihren Traumjob in der Frühpädagogik.
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

export default ErzieherGuide;
