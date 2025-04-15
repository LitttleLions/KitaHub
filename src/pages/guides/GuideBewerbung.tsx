
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const GuideBewerbung = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <Button variant="outline" size="sm" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </Button>
          
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Bewerbungstipps für Erzieher:innen</h1>
            
            <div className="prose prose-blue max-w-none">
              <p className="lead text-xl text-gray-600 mb-8">
                Eine erfolgreiche Bewerbung als Erzieher:in beginnt mit einer guten Vorbereitung und einem überzeugenden Auftritt. In diesem Guide finden Sie wertvolle Tipps für Ihre Bewerbung in einer Kindertagesstätte.
              </p>
              
              <h2>Was sollte eine gute Bewerbung enthalten?</h2>
              <p>
                Eine vollständige Bewerbung für eine Stelle als Erzieher:in besteht aus den folgenden Elementen:
              </p>
              <ul>
                <li>Anschreiben</li>
                <li>Lebenslauf</li>
                <li>Zeugnisse und Qualifikationsnachweise</li>
                <li>Referenzen (wenn vorhanden)</li>
                <li>Besondere Nachweise (z.B. erweitertes Führungszeugnis)</li>
              </ul>
              
              <h2>Das Anschreiben – Ihr erster Eindruck</h2>
              <p>
                Das Anschreiben sollte maximal eine Seite umfassen und folgende Punkte beinhalten:
              </p>
              <ul>
                <li>Warum Sie sich auf genau diese Stelle bewerben</li>
                <li>Warum Sie als Erzieher:in arbeiten möchten</li>
                <li>Was Sie besonders qualifiziert</li>
                <li>Welche pädagogischen Ansätze Sie vertreten</li>
                <li>Wann Sie verfügbar sind</li>
              </ul>
              
              <h2>Der Lebenslauf – Strukturiert und übersichtlich</h2>
              <p>
                Achten Sie im Lebenslauf auf folgende Punkte:
              </p>
              <ul>
                <li>Chronologischer Aufbau (neueste Erfahrungen zuerst)</li>
                <li>Persönliche Daten und Kontaktinformationen</li>
                <li>Bildungsweg und Qualifikationen</li>
                <li>Berufserfahrung mit konkreten Aufgaben</li>
                <li>Zusatzqualifikationen und Weiterbildungen</li>
                <li>Sprachkenntnisse und besondere Fähigkeiten</li>
              </ul>
              
              <h2>Das Vorstellungsgespräch – So bereiten Sie sich vor</h2>
              <p>
                Für ein erfolgreiches Vorstellungsgespräch sollten Sie:
              </p>
              <ul>
                <li>Informationen über die Einrichtung sammeln</li>
                <li>Das pädagogische Konzept der Kita kennen</li>
                <li>Eigene Beispiele für Ihre pädagogische Arbeit vorbereiten</li>
                <li>Kleidung wählen, die professionell, aber bequem ist</li>
                <li>Fragen an den potenziellen Arbeitgeber vorbereiten</li>
              </ul>
              
              <div className="bg-blue-50 p-6 rounded-lg mt-8">
                <h3 className="text-lg font-semibold mb-3">Checkliste für Ihre Bewerbung</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-kita-orange/20 text-kita-orange flex-shrink-0 mr-2 flex items-center justify-center">✓</span>
                    <span>Vollständige Unterlagen (Anschreiben, Lebenslauf, Zeugnisse)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-kita-orange/20 text-kita-orange flex-shrink-0 mr-2 flex items-center justify-center">✓</span>
                    <span>Korrekturlesen aller Dokumente</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-kita-orange/20 text-kita-orange flex-shrink-0 mr-2 flex items-center justify-center">✓</span>
                    <span>Personalisierung auf die jeweilige Einrichtung</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block h-5 w-5 rounded-full bg-kita-orange/20 text-kita-orange flex-shrink-0 mr-2 flex items-center justify-center">✓</span>
                    <span>Professionelles Foto (falls verwendet)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 space-y-4">
              <Button asChild className="bg-kita-orange hover:bg-kita-orange/90 text-white w-full">
                <Link to="/jobs">Aktuelle Stellenangebote durchsuchen</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/kitas">Kitas in Ihrer Nähe finden</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GuideBewerbung;
