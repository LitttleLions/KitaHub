
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Apple, Activity, BrainCircuit, Moon, Salad, Sun, LucideIcon } from 'lucide-react';

interface NutritionTip {
  title: string;
  icon: LucideIcon;
  content: string;
}

const nutritionTips: NutritionTip[] = [
  {
    title: "Gesunde Ernährung als Bildungsthema",
    icon: Apple,
    content: "Vermitteln Sie Kindern spielerisch Wissen über gesunde Lebensmittel. Projekte wie das gemeinsame Anlegen eines Gemüsegartens, Kochaktionen oder Einrichtung eines 'Entdeckertischs' mit verschiedenen Obst- und Gemüsesorten fördern die Neugier und das Interesse der Kinder an gesunder Ernährung."
  },
  {
    title: "Bewegung im Kita-Alltag",
    icon: Activity,
    content: "Sorgen Sie für vielfältige Bewegungsmöglichkeiten sowohl drinnen als auch draußen. Kinder haben einen natürlichen Bewegungsdrang, der nicht nur ihre körperliche Entwicklung fördert, sondern auch ihre kognitiven Fähigkeiten und ihr emotionales Wohlbefinden unterstützt."
  },
  {
    title: "Entspannung und Stressbewältigung",
    icon: Moon,
    content: "Schaffen Sie Rückzugsmöglichkeiten und feste Ruhephasen im Tagesablauf. Kinder brauchen Zeiten, in denen sie zur Ruhe kommen können. Entspannungsübungen, Traumreisen oder ruhige Vorlesesituationen helfen Kindern, einen Ausgleich zum oft lebhaften Kita-Alltag zu finden."
  },
  {
    title: "Körper- und Gesundheitsbewusstsein",
    icon: BrainCircuit,
    content: "Unterstützen Sie Kinder dabei, ihren eigenen Körper kennenzulernen und ein positives Körpergefühl zu entwickeln. Projekte zu Themen wie 'Mein Körper', altersentsprechende Aufklärung oder Gespräche über Gefühle stärken das Körperbewusstsein und die emotionale Gesundheit."
  },
  {
    title: "Mahlzeitengestaltung in der Kita",
    icon: Salad,
    content: "Gestalten Sie gemeinsame Mahlzeiten als soziale Ereignisse. Eine angenehme Atmosphäre, Tischrituale und die Beteiligung der Kinder bei der Vorbereitung machen Essen zu einem positiven Gemeinschaftserlebnis und fördern eine gesunde Esskultur."
  },
  {
    title: "Aufenthalt an der frischen Luft",
    icon: Sun,
    content: "Planen Sie täglich Zeit für Aktivitäten im Freien ein, bei (fast) jedem Wetter. Der Aufenthalt in der Natur stärkt das Immunsystem, fördert die motorische Entwicklung und bietet vielfältige Sinneserfahrungen, die in geschlossenen Räumen nicht möglich sind."
  }
];

const GuideGesundheit = () => {
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
              Gesundheit & Ernährung in der Kita
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mb-6">
              Praxisnahe Tipps und Informationen zu gesunder Ernährung, Bewegung und Wohlbefinden für Kinder im Kita-Alter.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/kitas" className="bg-kita-orange hover:bg-kita-orange/90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                Kitas in Ihrer Nähe finden
              </Link>
              <a href="#rezepte" className="bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium border border-gray-200">
                Gesunde Rezeptideen
              </a>
            </div>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gesundheitsförderung im Kita-Alltag</h2>
              
              <div className="prose max-w-none mb-8">
                <p>
                  Gesundheitsförderung in der Kita bedeutet mehr als nur die Vermeidung von Krankheiten. Es geht darum, das körperliche, geistige und soziale Wohlbefinden der Kinder zu stärken und ihnen ein gesundes Aufwachsen zu ermöglichen. Dabei spielen Ernährung, Bewegung, Entspannung und ein positives Körperbewusstsein gleichermaßen wichtige Rollen.
                </p>
                
                <p>
                  Kindertagesstätten haben großen Einfluss auf die Entwicklung gesundheitsbezogener Verhaltensweisen, da Kinder hier viel Zeit verbringen und wichtige Gewohnheiten ausbilden. Eine ganzheitliche Gesundheitsförderung sollte daher fester Bestandteil des pädagogischen Konzepts sein.
                </p>
              </div>
              
              <div className="space-y-6">
                {nutritionTips.map((tip, index) => (
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Bewegungsideen für den Kita-Alltag</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Drinnen</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Bewegungslandschaften mit Alltagsmaterialien</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Tanzen zu verschiedenen Musikstilen</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Bewegungsspiele wie "Feuer, Wasser, Sturm"</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Yoga und kindgerechte Entspannungsübungen</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Draußen</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Naturspaziergänge mit Bewegungsaufgaben</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Balance-Parcours mit Naturmaterialien</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Wettspiele wie Sackhüpfen oder Eierlaufen</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Jahreszeitliche Aktivitäten (Schneeballschlacht, Pfützenspringen)</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div id="rezepte" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gesunde Rezeptideen für Kitas</h3>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Frühstücksideen</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Overnight-Oats mit frischem Obst</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Bunte Gemüsesticks mit Dips</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Vollkornbrote mit lustigen Gesichtern</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Mittagessen</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Gemüse-Nudel-Auflauf</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Bunter Couscous-Salat</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Regenbogen-Wraps mit Hummus</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Snacks & Nachtisch</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Fruchtspieße mit Joghurtdip</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Apfel-Haferflocken-Kekse</div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="min-w-4 font-bold text-kita-orange">•</div>
                        <div className="text-gray-700">Selbstgemachtes Fruchteis am Stiel</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Tipp:</h4>
                    <p className="text-gray-600 text-sm">
                      Beziehen Sie die Kinder in die Zubereitung ein! Das fördert nicht nur ihre feinmotorischen Fähigkeiten, sondern weckt auch die Neugier auf neue Lebensmittel. Kinder probieren eher, was sie selbst zubereitet haben.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional resources */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Materialien & Ressourcen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ernährungsbildung</h3>
                <p className="text-gray-600 mb-4">Kostenlose Materialien zur Ernährungsbildung in Kitas, altersgerechte Projekte und Spiele zum Thema gesunde Ernährung.</p>
                <Link to="/guides/ernaehrungsbildung" className="text-kita-orange hover:text-kita-orange/80 font-medium">Mehr erfahren</Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bewegungsförderung</h3>
                <p className="text-gray-600 mb-4">Ideen und Konzepte zur Bewegungsförderung im Kita-Alltag, inklusive Spielesammlungen und Bewegungslandschaften.</p>
                <Link to="/guides/bewegungsfoerderung" className="text-kita-orange hover:text-kita-orange/80 font-medium">Mehr erfahren</Link>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Entspannung & Resilienz</h3>
                <p className="text-gray-600 mb-4">Methoden und Übungen zur Förderung von Entspannung, Achtsamkeit und emotionaler Gesundheit bei Kindern.</p>
                <Link to="/guides/entspannung-resilienz" className="text-kita-orange hover:text-kita-orange/80 font-medium">Mehr erfahren</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GuideGesundheit;
