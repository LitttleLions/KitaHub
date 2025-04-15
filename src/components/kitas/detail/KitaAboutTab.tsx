
import React from 'react';
import { Clock, MapPin, Globe, Phone, Mail, Calendar, Building, Users, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Company } from '@/types/company';
import KitaPremiumSection from './KitaPremiumSection';

interface KitaAboutTabProps {
  kita: Company;
  defaultBenefits: string[];
}

const KitaAboutTab: React.FC<KitaAboutTabProps> = ({ kita, defaultBenefits }) => {
  // Use provided benefits or default ones
  const kitaBenefits = kita.benefits && kita.benefits.length > 0 
    ? kita.benefits 
    : defaultBenefits;

  return (
    <>
      {/* About Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-4">Über {kita.name}</h2>
        
        <div className="prose prose-blue max-w-none">
          {kita.description ? (
            <div dangerouslySetInnerHTML={{ __html: kita.description }} className="text-gray-700" />
          ) : (
            <p className="text-gray-700">
              {kita.name} ist eine Kindertagesstätte mit einem besonderen pädagogischen Konzept, 
              das die individuellen Bedürfnisse jedes Kindes in den Mittelpunkt stellt. Unsere 
              erfahrenen Erzieherinnen und Erzieher schaffen eine liebevolle und fördernde 
              Umgebung, in der Kinder spielerisch lernen und ihre Persönlichkeit entfalten können.
              <br /><br />
              Wir legen großen Wert auf eine enge Zusammenarbeit mit den Eltern und bieten 
              flexible Betreuungszeiten an, um Familien bestmöglich zu unterstützen.
            </p>
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {kita.location && (
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-kita-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Standort</p>
                <p className="text-gray-600">{kita.location}</p>
                {kita.bundesland && (
                  <p className="text-gray-500 text-sm">{kita.bundesland}</p>
                )}
              </div>
            </div>
          )}
          
          {kita.website && (
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-kita-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Website</p>
                <a 
                  href={kita.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-kita-orange"
                >
                  {kita.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          
          {kita.phone && (
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-kita-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Telefon</p>
                <a href={`tel:${kita.phone}`} className="text-gray-600 hover:text-kita-orange">
                  {kita.phone}
                </a>
              </div>
            </div>
          )}
          
          {kita.email && (
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-kita-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">E-Mail</p>
                <a href={`mailto:${kita.email}`} className="text-gray-600 hover:text-kita-orange">
                  {kita.email}
                </a>
              </div>
            </div>
          )}
          
          {kita.founded_year && (
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-kita-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Gegründet</p>
                <p className="text-gray-600">{kita.founded_year}</p>
              </div>
            </div>
          )}
          
          {kita.type && (
            <div className="flex items-start">
              <Building className="h-5 w-5 text-kita-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Einrichtungstyp</p>
                <p className="text-gray-600">{kita.type}</p>
              </div>
            </div>
          )}
          
          {kita.employees && (
            <div className="flex items-start">
              <Users className="h-5 w-5 text-kita-orange mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Mitarbeiter</p>
                <p className="text-gray-600">{kita.employees}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Was wir bieten</h3>
          <div className="flex flex-wrap gap-3">
            {kitaBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default KitaAboutTab;
