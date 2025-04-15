
import { Sparkles, Target, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Features = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-kita-cream">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex mb-4 items-center rounded-full bg-kita-orange/10 px-3 py-1 text-sm font-medium text-kita-orange">
            <Sparkles className="h-4 w-4 mr-1" /> Innovative Funktionen
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Entdecke unsere KI-gestützten Features</h2>
          <p className="text-gray-600">
            Mit unseren innovativen Tools findest du schneller den perfekten Job oder die ideale pädagogische Fachkraft für deine Einrichtung.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-10">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-kita-orange/10 rounded-xl flex items-center justify-center text-kita-orange">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">KI-basiertes Matching</h3>
                  <p className="text-gray-600">
                    Unser intelligenter Algorithmus analysiert dein Profil und findet passende Stellen basierend auf deinen Fähigkeiten, Erfahrungen und Vorlieben.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-kita-green/10 rounded-xl flex items-center justify-center text-kita-green">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Kita-Chat Assistent</h3>
                  <p className="text-gray-600">
                    Unser KI-Assistent beantwortet deine Fragen zu Stellenangeboten, gibt Bewerbungstipps und unterstützt bei der Job- oder Mitarbeitersuche.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-kita-blue/10 rounded-xl flex items-center justify-center text-kita-blue">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Echtzeit-Benachrichtigungen</h3>
                  <p className="text-gray-600">
                    Erhalte sofortige Benachrichtigungen über neue, passende Stellenangebote oder Bewerbungsupdates direkt auf dein Smartphone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Button asChild className="bg-kita-orange hover:bg-kita-orange/90 text-white">
                <Link to="/register">Jetzt kostenlos registrieren</Link>
              </Button>
              <Link to="/features" className="ml-4 text-kita-orange font-medium hover:underline">
                Mehr erfahren
              </Link>
            </div>
          </div>
          
          <div className="order-1 md:order-2 bg-white p-6 rounded-xl shadow-card">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative">
              <img 
                src="/lovable-uploads/82144b82-ae34-4325-a4fd-8a60626783c9.png" 
                alt="KI-basiertes Matching" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="text-white">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-kita-orange mr-2" />
                    <span className="font-medium">97% Matching</span>
                  </div>
                  <h3 className="text-xl font-bold">Erzieher/in in Berlin-Mitte</h3>
                  <p className="text-sm opacity-80 mt-1">Basierend auf deinen Qualifikationen und Präferenzen</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 border border-green-100 bg-green-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-1 bg-green-100 rounded-md">
                  <Sparkles className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">KI-Empfehlung</h4>
                  <p className="text-xs text-green-600 mt-1">
                    Diese Stelle passt perfekt zu deinen Erfahrungen in der Vorschulpädagogik und deinem Wunsch nach einem urbanen Arbeitsumfeld.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
