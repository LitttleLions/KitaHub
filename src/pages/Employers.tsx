
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight } from 'lucide-react';

const Employers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-kita-cream to-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Finden Sie qualifizierte pädagogische Fachkräfte</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Mit KITA.de Jobs erreichen Sie über 100.000 Erzieher:innen, Kinderpfleger:innen und pädagogische Fachkräfte in ganz Deutschland.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-kita-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Direkter Zugang zu qualifizierten Bewerbern</h3>
                      <p className="text-gray-600">Erreichen Sie genau die Fachkräfte, die Sie für Ihre Einrichtung suchen.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-kita-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Einfache Stellenausschreibung</h3>
                      <p className="text-gray-600">In nur wenigen Minuten erstellen Sie eine professionelle Stellenanzeige.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-kita-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Direkte Verknüpfung mit Ihrem Kita-Profil</h3>
                      <p className="text-gray-600">Nutzen Sie die Integration mit Ihrem bestehenden Kita-Profil auf kita.de.</p>
                    </div>
                  </div>
                </div>
                <Button asChild className="bg-kita-orange hover:bg-kita-orange/90 text-white px-8 py-6 text-lg">
                  <Link to="/employers/register">Jetzt kostenlos registrieren</Link>
                </Button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80" 
                  alt="Arbeitgeber im Gespräch" 
                  className="rounded-xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere Angebote für Arbeitgeber</h2>
              <p className="text-xl text-gray-600">
                Flexible Pakete für jede Einrichtungsgröße. Vom einzelnen Kindergarten bis zum großen Träger.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic plan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Einzelanzeige</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-bold text-gray-900">39€</span>
                    <span className="text-gray-500 mb-1">/ 30 Tage</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">1 Stellenanzeige</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Laufzeit: 30 Tage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Kita-Profil Integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Bewerbungsmanagement</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-white border border-kita-orange text-kita-orange hover:bg-kita-orange/5">
                    <Link to="/employers/register?plan=basic">Auswählen</Link>
                  </Button>
                </div>
              </div>
              
              {/* Standard plan */}
              <div className="bg-white rounded-xl shadow-md border border-kita-orange overflow-hidden transform scale-105">
                <div className="bg-kita-orange text-white text-center py-2 text-sm font-medium">
                  Beliebteste Option
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">5er-Paket</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-bold text-gray-900">169€</span>
                    <span className="text-gray-500 mb-1">/ 60 Tage</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">5 Stellenanzeigen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Laufzeit: 60 Tage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Top-Platzierung in Suchergebnissen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Logo-Upload</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">PDF-Upload (Konzept etc.)</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-kita-orange hover:bg-kita-orange/90 text-white">
                    <Link to="/employers/register?plan=standard">Auswählen</Link>
                  </Button>
                </div>
              </div>
              
              {/* Premium plan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Träger-Flatrate</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-bold text-gray-900">599€</span>
                    <span className="text-gray-500 mb-1">/ Jahr</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Unbegrenzte Stellenanzeigen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Laufzeit: 365 Tage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Premium-Trägerprofil</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Werbebanner-Option</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-kita-orange flex-shrink-0" />
                      <span className="text-gray-600">Automatische Stellenvorschläge</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-white border border-kita-orange text-kita-orange hover:bg-kita-orange/5">
                    <Link to="/employers/register?plan=premium">Auswählen</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it works section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">So funktioniert's</h2>
              <p className="text-xl text-gray-600">
                In nur wenigen Schritten zu qualifizierten Bewerbern
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-kita-orange/10 rounded-full flex items-center justify-center text-kita-orange text-2xl font-bold mb-6 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Registrieren</h3>
                <p className="text-gray-600">
                  Erstellen Sie ein kostenloses Arbeitgeberkonto und verbinden Sie es mit Ihrem Kita-Profil.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-kita-orange/10 rounded-full flex items-center justify-center text-kita-orange text-2xl font-bold mb-6 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Stelle erstellen</h3>
                <p className="text-gray-600">
                  Wählen Sie ein Paket und erstellen Sie Ihre Stellenanzeige mit unserem einfachen Editor.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-16 h-16 bg-kita-orange/10 rounded-full flex items-center justify-center text-kita-orange text-2xl font-bold mb-6 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bewerber finden</h3>
                <p className="text-gray-600">
                  Erhalten Sie Bewerbungen direkt über unsere Plattform und kontaktieren Sie Kandidaten.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Das sagen unsere Kunden</h2>
              <p className="text-xl text-gray-600">
                Zufriedene Arbeitgeber berichten über ihre Erfahrungen
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" 
                    alt="Testimonial"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">Martina Weber</h3>
                    <p className="text-gray-500">Kita-Leitung, Sonnenschein München</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Dank KITA.de Jobs konnten wir innerhalb weniger Wochen zwei offene Erzieher-Stellen besetzen. Die Qualität der Bewerber war hervorragend und der gesamte Prozess lief reibungslos ab."
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" 
                    alt="Testimonial"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">Thomas Schneider</h3>
                    <p className="text-gray-500">Trägervertreter, AWO Berlin</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Als großer Träger mit regelmäßigem Personalbedarf ist die Träger-Flatrate für uns die perfekte Lösung. Wir konnten unsere Recruiting-Kosten deutlich senken und gleichzeitig mehr qualifizierte Fachkräfte gewinnen."
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Button asChild className="bg-kita-orange hover:bg-kita-orange/90 text-white px-8">
                <Link to="/employers/register" className="flex items-center gap-2">
                  Jetzt starten <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* FAQ section */}
        <section className="py-16 bg-kita-cream/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Häufig gestellte Fragen</h2>
              <p className="text-xl text-gray-600">
                Antworten auf die wichtigsten Fragen unserer Arbeitgeber
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Wie kann ich meine Stellenanzeige veröffentlichen?</h3>
                <p className="text-gray-600">
                  Nach der Registrierung können Sie ein Anzeigepaket auswählen und mit dem Editor Ihre Anzeige erstellen. Nach Bezahlung wird diese innerhalb von 24 Stunden freigeschaltet.
                </p>
              </div>
              
              <div className="border-b border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Wie verbinde ich meine Stellenanzeige mit dem Kita-Profil?</h3>
                <p className="text-gray-600">
                  Bei der Erstellung Ihrer Anzeige können Sie ein vorhandenes Kita-Profil auswählen. Die Stellenanzeige wird dann automatisch auf der Profilseite der Einrichtung angezeigt.
                </p>
              </div>
              
              <div className="border-b border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Wie lange ist eine Stellenanzeige aktiv?</h3>
                <p className="text-gray-600">
                  Die Laufzeit hängt vom gewählten Paket ab: Einzelanzeige (30 Tage), 5er-Paket (60 Tage) oder Träger-Flatrate (365 Tage). Sie können die Laufzeit jederzeit verlängern.
                </p>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Wie erhalte ich Bewerbungen?</h3>
                <p className="text-gray-600">
                  Bewerber können direkt über unsere Plattform auf Ihre Anzeige reagieren. Sie erhalten eine E-Mail-Benachrichtigung und können alle Bewerbungen in Ihrem Dashboard verwalten.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link to="/employers/faq" className="text-kita-orange hover:underline font-medium flex items-center gap-1 justify-center">
                Alle FAQs ansehen <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Employers;
