import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="block mb-4">
              <img 
                src="/lovable-uploads/b1441a30-c373-4713-9817-e7bb7ebc2478.png" 
                alt="KITA.de" 
                className="h-10"
              />
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              KITA.de Jobs ist die führende Jobbörse für pädagogische Fachkräfte in Deutschland. 
              Unsere Plattform verbindet Erzieher/innen mit über 50.000 Kindertageseinrichtungen.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-kita-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-kita-orange transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-kita-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-kita-orange transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Stellen finden</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Alle Stellenangebote
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=erzieher" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Erzieher/in Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=leitung" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Kita-Leitung Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=kinderpfleger" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Kinderpfleger/in Jobs
                </Link>
              </li>
              <li>
                <Link to="/jobs?type=tagespflege" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Tagespflege Jobs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Für Arbeitgeber</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/employers" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Stellenanzeigen schalten
                </Link>
              </li>
              <li>
                <Link to="/employers/pricing" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Preise & Pakete
                </Link>
              </li>
              <li>
                <Link to="/employers/faq" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Häufige Fragen
                </Link>
              </li>
              <li>
                <Link to="/employers/register" className="text-gray-600 hover:text-kita-orange transition-colors">
                  Als Arbeitgeber registrieren
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Kontakt</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-kita-orange" />
                <a href="mailto:info@kita-jobs.de" className="text-gray-600 hover:text-kita-orange transition-colors">
                  info@kita-jobs.de
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-kita-orange" />
                <a href="tel:+4902345678901" className="text-gray-600 hover:text-kita-orange transition-colors">
                  +49 (0) 234 5678901
                </a>
              </li>
              <li className="mt-4">
                <Link to="/contact" className="text-kita-orange hover:underline transition-colors">
                  Kontaktformular
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} KITA.de Jobs. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/impressum" className="text-sm text-gray-500 hover:text-kita-orange transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="text-sm text-gray-500 hover:text-kita-orange transition-colors">
                Datenschutz
              </Link>
              <Link to="/agb" className="text-sm text-gray-500 hover:text-kita-orange transition-colors">
                AGB
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
