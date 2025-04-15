
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, GraduationCap, BookOpen, Clock, Star, Users, Award, LucideIcon } from 'lucide-react';

interface EducationPathType {
  title: string;
  duration: string;
  requirements: string;
  description: string;
}

interface AdvancedTrainingType {
  title: string;
  icon: LucideIcon;
  description: string;
}

const educationPaths: EducationPathType[] = [
  {
    title: "Staatlich anerkannte/r Erzieher/in",
    duration: "2-5 Jahre (je nach Vorbildung)",
    requirements: "Mittlerer Schulabschluss, abgeschlossene Berufsausbildung oder Fachhochschulreife",
    description: "Die klassische Ausbildung zum/zur Erzieher/in umfasst theoretischen Unterricht an einer Fachschule für Sozialpädagogik sowie praktische Phasen in verschiedenen pädagogischen Einrichtungen. Die Ausbildung schließt mit einer staatlichen Prüfung ab."
  },
  {
    title: "Duales Studium Frühpädagogik",
    duration: "3-3,5 Jahre",
    requirements: "Allgemeine Hochschulreife oder Fachhochschulreife",
    description: "Verbindet theoretisches Wissen an einer Hochschule mit praktischer Arbeit in einer Kindertageseinrichtung. Abschluss ist in der Regel ein Bachelor of Arts (B.A.) in Frühpädagogik, Kindheitspädagogik oder einem ähnlichen Studiengang."
  },
  {
    title: "Kinderpfleger/in (Sozialassistent/in)",
    duration: "2 Jahre",
    requirements: "Hauptschulabschluss",
    description: "Eine grundlegende Ausbildung, die zur Mitarbeit in Kindertageseinrichtungen qualifiziert. Kinderpfleger/innen unterstützen Erzieher/innen bei ihrer pädagogischen Arbeit. Diese Ausbildung kann als Einstieg in den Beruf oder als Vorstufe zur Erzieherausbildung dienen."
  },
  {
    title: "Quereinstieg mit pädagogischer Zusatzqualifikation",
    duration: "1-2 Jahre (berufsbegleitend)",
    requirements: "Abgeschlossene Berufsausbildung oder Studium in einem verwandten Bereich",
    description: "Für Menschen aus anderen Berufsfeldern bieten viele Bundesländer Qualifizierungsprogramme an, die einen Quereinstieg in den Erzieherberuf ermöglichen. Diese Programme kombinieren oft Theorie und Praxis und führen zu einer staatlichen Anerkennung."
  }
];

const advancedTrainings: AdvancedTrainingType[] = [
  {
    title: "Kita-Leitung & Management",
    icon: Users,
    description: "Qualifiziert dich für Leitungspositionen in Kindertageseinrichtungen. Inhalte: Personalführung, Qualitätsmanagement, Betriebswirtschaft, Recht und Verwaltung, Konzeptionsentwicklung."
  },
  {
    title: "Facherzieher/in für Integration/Inklusion",
    icon: Star,
    description: "Spezialisierung auf die Arbeit mit Kindern mit besonderem Förderbedarf. Erweiterung der pädagogischen Kompetenzen für inklusive Bildungsprozesse und die Zusammenarbeit mit Therapeuten und Fachdiensten."
  },
  {
    title: "Praxisanleitung",
    icon: BookOpen,
    description: "Befähigt zur qualifizierten Anleitung von Auszubildenden und Praktikanten in der Einrichtung. Vermittlung von Methoden der Praxisreflexion, Beratung und Beurteilung."
  },
  {
    title: "Fachkraft für Sprachförderung",
    icon: Award,
    description: "Vertieftes Wissen zur Sprachentwicklung und -förderung im Kindesalter. Methoden zur alltagsintegrierten Sprachbildung und Unterstützung bei Mehrsprachigkeit oder Sprachauffälligkeiten."
  }
];

const GuideAusbildung = () => {
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ausbildung & Weiterbildung im Kita-Bereich
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mb-6">
              Entdecke vielfältige Bildungswege in die frühkindliche Pädagogik und informiere dich über Möglichkeiten zur beruflichen Weiterentwicklung.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/jobs" className="bg-kita-orange hover:bg-kita-orange/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                Zu den Stellenangeboten
              </Link>
              <a href="#weiterbildung" className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-200">
                Weiterbildungsangebote
              </a>
            </div>
          </div>
          
          {/* Main content */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-kita-orange" />
              Ausbildungswege in die Frühpädagogik
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {educationPaths.map((path, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Clock className="h-4 w-4 text-kita-orange" />
                      <span><strong>Dauer:</strong> {path.duration}</span>
                    </div>
                    
                    <div className="text-gray-600 mb-4">
                      <strong>Zugangsvoraussetzungen:</strong> {path.requirements}
                    </div>
                    
                    <p className="text-gray-700">{path.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Advanced Training Section */}
          <div id="weiterbildung" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Award className="h-6 w-6 text-kita-orange" />
              Weiterbildungsmöglichkeiten für Fachkräfte
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advancedTrainings.map((training, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-kita-orange/10 p-3 rounded-lg">
                      <training.icon className="h-6 w-6 text-kita-orange" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">{training.title}</h4>
                      <p className="text-gray-600">{training.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Finanzierungsmöglichkeiten für Weiterbildungen</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">•</div>
                  <div><strong>Bildungsgutschein der Agentur für Arbeit:</strong> Unter bestimmten Voraussetzungen können Weiterbildungen für Arbeitssuchende oder von Arbeitslosigkeit bedrohte Personen gefördert werden.</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">•</div>
                  <div><strong>Aufstiegs-BAföG:</strong> Fördert die berufliche Fortbildung zum Fachwirt, Techniker, Meister oder in vergleichbaren Qualifikationen.</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">•</div>
                  <div><strong>Bildungsprämie:</strong> Zuschuss zu einer beruflichen Weiterbildung für Personen mit geringem Einkommen.</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-5 mt-1">•</div>
                  <div><strong>Trägerfinanzierung:</strong> Viele Kita-Träger übernehmen die Kosten für die Weiterbildung ihrer Mitarbeiter/innen ganz oder teilweise.</div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Studies & Research */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-kita-orange" />
              Studiengänge & akademische Weiterbildung
            </h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Bachelor-Studiengänge</h3>
                  <ul className="space-y-4">
                    <li className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900">Kindheitspädagogik / Frühpädagogik (B.A.)</h4>
                      <p className="text-gray-600 mt-1">Fokus auf Bildungs- und Entwicklungsprozesse in der frühen Kindheit, pädagogische Konzepte und Methoden.</p>
                    </li>
                    <li className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900">Pädagogik der Kindheit (B.A.)</h4>
                      <p className="text-gray-600 mt-1">Verbindet Theorie und Praxis der Bildung, Erziehung und Betreuung von Kindern.</p>
                    </li>
                    <li>
                      <h4 className="font-medium text-gray-900">Integrative Frühpädagogik (B.A.)</h4>
                      <p className="text-gray-600 mt-1">Spezialisierung auf inklusive pädagogische Arbeit mit Kindern mit und ohne Förderbedarf.</p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Master-Studiengänge</h3>
                  <ul className="space-y-4">
                    <li className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900">Management in Bildungseinrichtungen (M.A.)</h4>
                      <p className="text-gray-600 mt-1">Qualifiziert für Leitungspositionen, Schwerpunkt auf Management, Organisation und Führung.</p>
                    </li>
                    <li className="border-b border-gray-100 pb-4">
                      <h4 className="font-medium text-gray-900">Bildungswissenschaften (M.A.)</h4>
                      <p className="text-gray-600 mt-1">Vertiefende wissenschaftliche Auseinandersetzung mit Bildungsprozessen und -systemen.</p>
                    </li>
                    <li>
                      <h4 className="font-medium text-gray-900">Inklusive Pädagogik und Kommunikation (M.A.)</h4>
                      <p className="text-gray-600 mt-1">Fokus auf inklusive Bildungsprozesse und barrierefreie Kommunikation in pädagogischen Kontexten.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="bg-gradient-to-r from-kita-orange/90 to-kita-orange rounded-2xl p-8 md:p-12 text-white mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Bereit für deinen Bildungsweg?</h2>
              <p className="text-white/90 mb-8">
                Finde passende Ausbildungs- und Arbeitsplätze in unseren über 50.000 Kitas in ganz Deutschland.
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

export default GuideAusbildung;
