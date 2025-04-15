
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, FileText, Shield, Users, CalendarClock, CheckCircle, BookOpen, LucideIcon } from 'lucide-react';

interface LegalSection {
  title: string;
  icon: LucideIcon;
  content: string;
}

const legalSections: LegalSection[] = [
  {
    title: "Gesetzliche Grundlagen",
    icon: FileText,
    content: "Die rechtlichen Rahmenbedingungen für Kindertageseinrichtungen werden im SGB VIII (Kinder- und Jugendhilfegesetz) sowie in den jeweiligen Landesgesetzen (Kita-Gesetze) geregelt. Diese definieren Anforderungen an Qualitätsstandards, Personalschlüssel, Raumgrößen und weitere wichtige Parameter. Als Träger oder Kita-Leitung sollten Sie stets die aktuellen gesetzlichen Vorgaben Ihres Bundeslandes kennen."
  },
  {
    title: "Aufsichtspflicht",
    icon: Shield,
    content: "Die Aufsichtspflicht ist ein zentrales rechtliches Thema im Kita-Alltag. Sie beginnt mit der Übergabe des Kindes an die pädagogische Fachkraft und endet mit der Abholung. Der Umfang der Aufsichtspflicht richtet sich nach Alter, Entwicklungsstand und Charakter des Kindes. Wichtig ist eine sorgfältige Dokumentation von besonderen Vorkommnissen und klare Regelungen zur Abholung und zu Ausflügen."
  },
  {
    title: "Personalplanung",
    icon: Users,
    content: "Die Personalplanung in Kitas unterliegt den gesetzlichen Vorgaben zum Fachkraft-Kind-Schlüssel. Dieser variiert je nach Bundesland und Altersstruktur der betreuten Kinder. Beachten Sie bei der Personalplanung auch Urlaubs- und Krankheitszeiten, Fortbildungen und Verfügungszeiten. Qualifiziertes Personal zu finden, ist eine der größten Herausforderungen – nutzen Sie verschiedene Rekrutierungswege und bieten Sie attraktive Arbeitsbedingungen."
  },
  {
    title: "Betreuungsvertrag",
    icon: CheckCircle,
    content: "Der Betreuungsvertrag regelt die Rechte und Pflichten zwischen Träger und Eltern. Er sollte wichtige Aspekte wie Betreuungsumfang, Kosten, Kündigungsfristen, Regelungen zur Eingewöhnung, bei Krankheit des Kindes und zur Abholung enthalten. Lassen Sie Ihren Betreuungsvertrag regelmäßig rechtlich prüfen, um sicherzustellen, dass er den aktuellen gesetzlichen Anforderungen entspricht."
  },
  {
    title: "Finanzierung & Elternbeiträge",
    icon: CalendarClock,
    content: "Die Finanzierung von Kitas basiert auf einem Mischsystem aus öffentlichen Mitteln (Kommune, Land, Bund), Trägeranteilen und Elternbeiträgen. Die genaue Zusammensetzung und die Höhe der Elternbeiträge variieren stark je nach Bundesland und Kommune. Informieren Sie sich über Förderprogramme und Zuschussmöglichkeiten, die Ihnen als Träger zur Verfügung stehen."
  },
  {
    title: "Konzeption & Qualitätssicherung",
    icon: BookOpen,
    content: "Eine schriftliche pädagogische Konzeption ist in vielen Bundesländern gesetzlich vorgeschrieben. Sie dokumentiert das pädagogische Selbstverständnis, Bildungsziele und Methoden der Einrichtung. Regelmäßige Qualitätssicherungsmaßnahmen wie interne Evaluationen, Elternbefragungen und die Teilnahme an Qualitätsentwicklungsprozessen sind wichtige Instrumente, um die pädagogische Arbeit kontinuierlich zu verbessern."
  }
];

const GuideRechtliches = () => {
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
              Rechtliches & Organisation
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mb-6">
              Informationen zu rechtlichen Grundlagen, Verwaltung und Organisation einer Kindertagesstätte.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/kitas" className="bg-kita-orange hover:bg-kita-orange/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                Kitas in Ihrer Nähe finden
              </Link>
              <a href="#checkliste" className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-200">
                Rechtliche Checkliste
              </a>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rechtliche und organisatorische Aspekte im Kita-Alltag</h2>
              
              <div className="prose max-w-none mb-8">
                <p>
                  Die Leitung und Organisation einer Kindertagesstätte umfasst neben der pädagogischen Arbeit zahlreiche rechtliche und administrative Aufgaben. Ein fundiertes Verständnis der gesetzlichen Rahmenbedingungen und eine gut strukturierte Organisation sind wesentliche Voraussetzungen für eine erfolgreiche Kita-Führung.
                </p>
                
                <p>
                  Dieser Guide bietet einen Überblick über die wichtigsten rechtlichen und organisatorischen Themen, mit denen sich Kita-Leitungen und Träger auseinandersetzen müssen. Er ersetzt keine professionelle Rechtsberatung, kann jedoch als Orientierungshilfe dienen.
                </p>
              </div>
              
              <div className="space-y-6">
                {legalSections.map((section, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="bg-kita-orange/10 p-3 rounded-lg">
                        <section.icon className="h-6 w-6 text-kita-orange" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                        <p className="text-gray-600">{section.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Organisation & Verwaltung</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Personalmanagement</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Dienstplangestaltung unter Berücksichtigung pädagogischer Erfordernisse</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Mitarbeitergespräche und Teamentwicklung</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Fortbildungsplanung und -management</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Konfliktmanagement im Team</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Büromanagement</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Dokumentationspflichten (Entwicklungsberichte, Unfälle etc.)</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Digitale Tools zur Verwaltungsvereinfachung</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Datenschutz und Datensicherheit in der Kita</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Effiziente Ablage- und Ordnungssysteme</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Elternkommunikation</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Elterngespräche professionell führen</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Informationsmanagement (Newsletter, Aushänge, digitale Kanäle)</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Umgang mit Beschwerden und Kritik</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Elternmitwirkung gestalten (Elternbeirat, Elternabende)</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Infrastruktur & Sicherheit</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Gebäude- und Raumkonzepte für Kitas</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Hygienemanagement und -vorschriften</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Sicherheitsstandards und Unfallprävention</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Erste-Hilfe-Maßnahmen und Notfallpläne</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div id="checkliste" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Rechtliche Checkliste</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Betriebserlaubnis</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Gültige Betriebserlaubnis nach § 45 SGB VIII</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Pädagogisches Konzept</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Raumkonzept mit Flächenangaben</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Personal</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Personalschlüssel entsprechend Landesvorgaben</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Qualifikationsnachweise der Mitarbeiter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Erweiterte Führungszeugnisse</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Gesundheitszeugnisse</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Sicherheit & Gesundheit</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Brandschutzkonzept</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Hygieneplan</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Erste-Hilfe-Ausbildung der Mitarbeiter</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Sicherheitsbeauftragte/r benannt</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Verträge & Versicherungen</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Aktuelle Betreuungsverträge</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Arbeitsverträge</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Haftpflichtversicherung</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Gebäudeversicherung</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/guides/rechtsfragen-kita" className="text-kita-orange hover:text-kita-orange/80 font-medium flex items-center justify-center gap-2">
                    Ausführlicher Rechtsleitfaden
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional resources */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Downloads & Vorlagen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Muster-Betreuungsvertrag</h3>
                <p className="text-gray-600 mb-4">Eine Vorlage für einen rechtssicheren Betreuungsvertrag, die Sie an die Bedürfnisse Ihrer Einrichtung anpassen können.</p>
                <Link to="/downloads/muster-betreuungsvertrag" className="text-kita-orange hover:text-kita-orange/80 font-medium">Download</Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Hygieneplan-Vorlage</h3>
                <p className="text-gray-600 mb-4">Eine umfassende Vorlage für einen Hygieneplan gemäß den aktuellen gesetzlichen Anforderungen.</p>
                <Link to="/downloads/hygieneplan-vorlage" className="text-kita-orange hover:text-kita-orange/80 font-medium">Download</Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Checkliste für Aufsichtspflicht</h3>
                <p className="text-gray-600 mb-4">Eine praktische Checkliste zur Wahrnehmung der Aufsichtspflicht in verschiedenen Situationen des Kita-Alltags.</p>
                <Link to="/downloads/aufsichtspflicht-checkliste" className="text-kita-orange hover:text-kita-orange/80 font-medium">Download</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GuideRechtliches;
