
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Heart, Calendar, Check, Clock, Users, BookOpen, LucideIcon } from 'lucide-react';

interface GuideSection {
  title: string;
  icon: LucideIcon;
  content: string;
}

const guideSections: GuideSection[] = [
  {
    title: "Der richtige Zeitpunkt für die Kita-Suche",
    icon: Calendar,
    content: "Beginnen Sie frühzeitig – idealerweise 9-12 Monate vor dem gewünschten Starttermin. Besonders in Großstädten sind lange Wartelisten keine Seltenheit. Nutzen Sie unsere Kita-Finder-Funktion, um einen Überblick über die Einrichtungen in Ihrer Nähe zu erhalten und kontaktieren Sie mehrere Kitas gleichzeitig."
  },
  {
    title: "Kriterien für die Kita-Auswahl",
    icon: Check,
    content: "Überlegen Sie, welche Faktoren für Ihre Familie wichtig sind: Nähe zum Wohnort oder Arbeitsplatz, Öffnungszeiten, pädagogisches Konzept, Gruppengröße, Außenbereich, Verpflegung, zusätzliche Angebote wie Sprachförderung oder musikalische Früherziehung. Vergleichen Sie diese Kriterien mit den Profilen verschiedener Einrichtungen auf unserer Plattform."
  },
  {
    title: "Die Eingewöhnungsphase",
    icon: Heart,
    content: "Die Eingewöhnung ist eine sensible Zeit für Ihr Kind. Die meisten Kitas arbeiten nach dem Berliner oder Münchner Modell, bei denen Sie Ihr Kind anfangs begleiten und sich dann schrittweise zurückziehen. Rechnen Sie mit 2-4 Wochen für diesen Prozess. Eine gut geplante Eingewöhnung schafft Vertrauen und Sicherheit für Ihr Kind."
  },
  {
    title: "Kommunikation mit Erzieher:innen",
    icon: Users,
    content: "Pflegen Sie einen regelmäßigen Austausch mit den pädagogischen Fachkräften. Viele Kitas bieten Tür- und Angel-Gespräche, regelmäßige Entwicklungsgespräche und Elternabende an. Teilen Sie wichtige Informationen zu Ihrem Kind mit und bleiben Sie offen für Feedback. Eine partnerschaftliche Kommunikation kommt letztendlich Ihrem Kind zugute."
  },
  {
    title: "Kita-Alltag unterstützen",
    icon: Clock,
    content: "Unterstützen Sie die Kita-Erfahrung Ihres Kindes, indem Sie zuhause über den Kita-Tag sprechen, Freundschaften fördern und an Kita-Aktivitäten teilnehmen. Achten Sie auf ausreichend Schlaf und eine gesunde Ernährung, damit Ihr Kind den Kita-Alltag gut bewältigen kann. Bereiten Sie praktische Kleidung und Wechselkleidung vor."
  },
  {
    title: "Förderung zu Hause",
    icon: BookOpen,
    content: "Greifen Sie Themen und Aktivitäten aus der Kita zu Hause auf. Lesen Sie Bücher, die zu aktuellen Projekten passen, singen Sie gemeinsam Lieder aus der Kita oder führen Sie ähnliche kreative Aktivitäten durch. So schaffen Sie Kontinuität zwischen Kita und Zuhause und unterstützen den Lernprozess Ihres Kindes."
  }
];

const ElternGuide = () => {
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
              Guide für Eltern
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mb-6">
              Hilfreiche Tipps und Informationen zur Kita-Suche, Eingewöhnung und Unterstützung Ihres Kindes in der frühkindlichen Bildung.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/kitas" className="bg-kita-orange hover:bg-kita-orange/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                Kitas in Ihrer Nähe finden
              </Link>
              <a href="#checkliste" className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-200">
                Checkliste für Kita-Besuche
              </a>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Die Kita-Zeit: Ein wichtiger Lebensabschnitt</h2>
              
              <div className="prose max-w-none">
                <p>
                  Der Eintritt in die Kindertagesstätte markiert einen wichtigen Meilenstein in der Entwicklung Ihres Kindes. Hier werden nicht nur grundlegende soziale Kompetenzen erworben, sondern auch die Basis für lebenslanges Lernen gelegt. Die richtige Kita zu finden und Ihr Kind optimal durch diese Zeit zu begleiten, ist daher ein wichtiges Anliegen für viele Eltern.
                </p>
                
                <p>
                  Unser Eltern-Guide bietet Ihnen praktische Tipps und Informationen, um diesen Prozess erfolgreich zu gestalten – von der Kita-Suche über die Eingewöhnung bis hin zur Zusammenarbeit mit den pädagogischen Fachkräften.
                </p>
              </div>
              
              <div className="mt-8 space-y-8">
                {guideSections.map((section, index) => (
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
            </div>
            
            <div className="lg:col-span-1">
              <div id="checkliste" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Checkliste für Kita-Besuche</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Vor dem Besuch</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Termin für Besichtigung vereinbaren</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Informationen zur Kita recherchieren</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Fragen notieren</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Während des Besuchs</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Räumlichkeiten anschauen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Nach pädagogischem Konzept fragen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Tagesablauf erklären lassen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Nach Eingewöhnungsmodell fragen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Kosten und Verpflegung klären</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Atmosphäre zwischen Erzieher:innen und Kindern beobachten</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Nach dem Besuch</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Eindrücke notieren</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Mehrere Kitas vergleichen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-gray-700">Auf Warteliste setzen lassen</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/kitas" className="text-kita-orange hover:text-kita-orange/80 font-medium flex items-center justify-center gap-2">
                    Kitas in Ihrer Nähe finden
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional resources */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Weitere Ressourcen für Eltern</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Informationen zu Kita-Kosten</h3>
                <p className="text-gray-600 mb-4">Erfahren Sie mehr über Kita-Gebühren, mögliche Zuschüsse und finanzielle Unterstützungsmöglichkeiten.</p>
                <Link to="/guides/kita-kosten" className="text-kita-orange hover:text-kita-orange/80 font-medium">Mehr erfahren</Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Pädagogische Konzepte</h3>
                <p className="text-gray-600 mb-4">Lernen Sie verschiedene pädagogische Ansätze kennen, von Montessori und Waldorf bis hin zu Reggio und situationsorientierten Ansätzen.</p>
                <Link to="/guides/paedagogische-konzepte" className="text-kita-orange hover:text-kita-orange/80 font-medium">Mehr erfahren</Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Übergang Kita-Grundschule</h3>
                <p className="text-gray-600 mb-4">Tipps zur Vorbereitung Ihres Kindes auf den Schuleintritt und zur Gestaltung eines sanften Übergangs.</p>
                <Link to="/guides/kita-schule-uebergang" className="text-kita-orange hover:text-kita-orange/80 font-medium">Mehr erfahren</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ElternGuide;
