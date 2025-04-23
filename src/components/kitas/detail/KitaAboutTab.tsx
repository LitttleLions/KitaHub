import React from 'react';
// Added Baby, UtensilsCrossed, BookOpen icons
import { Clock, MapPin, Globe, Phone, Mail, Calendar, Building, Users, CheckCircle, Briefcase, Info, Baby, UtensilsCrossed, BookOpen } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge';
import { Company } from '@/types/company';
// KitaPremiumSection is not used directly here, removed import

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
    <> {/* Outer fragment */}
      {/* Main content wrapper - Removed card styling (bg, shadow, padding) */}
      <div> 
        <h2 className="text-2xl font-semibold mb-6">Über {kita.name}</h2>
        
        {/* Info Boxes Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Opening Hours Box */}
          {kita.opening_hours_text && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 shadow-sm">
              <Clock className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Öffnungszeiten</h4>
                <p className="text-sm text-blue-700 whitespace-pre-line">{kita.opening_hours_text}</p>
              </div>
            </div>
          )}
          {/* Age Groups Box */}
          {(kita.min_age !== null || kita.max_age !== null) && ( // Show if min or max age exists
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3 shadow-sm">
              <Baby className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">Altersgruppen</h4>
                {/* Display age range or placeholder text */}
                <p className="text-sm text-green-700">
                  {kita.min_age !== null && kita.max_age !== null 
                    ? `Betreuungsalter: ${kita.min_age} - ${kita.max_age} Jahre` 
                    : kita.min_age !== null 
                    ? `Ab ${kita.min_age} Jahren` 
                    : kita.max_age !== null 
                    ? `Bis ${kita.max_age} Jahre` 
                    : "Informationen zu Altersgruppen folgen."} 
                  {/* Placeholder for specific groups like in image */}
                  {/* <br />Krippengruppe: 1-3 Jahre
                  <br />Kindergartengruppe: 3-6 Jahre */}
                </p>
              </div>
            </div>
          )}
           {/* Meals Box (Placeholder) */}
           <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3 shadow-sm">
              <UtensilsCrossed className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Verpflegung</h4>
                <p className="text-sm text-amber-700">
                  {/* Placeholder text - replace with kita.meals_info when available */}
                  Informationen zur Verpflegung folgen. (z.B. Frühstück, Mittagessen, Snacks)
                </p>
              </div>
            </div>
           {/* Pedagogical Concept Box (Placeholder) */}
           <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-start gap-3 shadow-sm">
              <BookOpen className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-purple-800 mb-1">Pädagogischer Ansatz</h4>
                <p className="text-sm text-purple-700">
                  {/* Placeholder text - replace with kita.pedagogical_concept_summary when available */}
                   Details zum pädagogischen Konzept finden Sie in der Beschreibung. (z.B. Situationsorientiert, Offenes Konzept)
                </p>
              </div>
            </div>
        </div>

        {/* Description Section */}
        <div className="prose prose-blue max-w-none mb-8">
          {kita.description ? (
            <div dangerouslySetInnerHTML={{ __html: kita.description }} />
          ) : (
            <p>
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

        {/* Details Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8"> 
          <h3 className="text-xl font-semibold mb-4">Details zur Einrichtung</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            {kita.location && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-kita-orange mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Standort</p>
                  <p className="text-gray-600">{kita.location}</p>
                  {kita.bundesland && (
                    <p className="text-gray-500 text-sm">{kita.bundesland}</p>
                  )}
                </div>
              </div>
            )}
            {/* Website */}
            {kita.website && (
              <div className="flex items-start">
                <Globe className="h-5 w-5 text-kita-orange mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Website</p>
                  <a
                    href={kita.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-kita-orange break-all"
                  >
                    {kita.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
            {/* Phone */}
            {kita.phone && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-kita-orange mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Telefon</p>
                  <a href={`tel:${kita.phone}`} className="text-gray-600 hover:text-kita-orange">
                    {kita.phone}
                  </a>
                </div>
              </div>
            )}
            {/* Email */}
            {kita.email && (
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-kita-orange mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">E-Mail</p>
                  <a href={`mailto:${kita.email}`} className="text-gray-600 hover:text-kita-orange">
                    {kita.email}
                  </a>
                </div>
              </div>
            )}
            {/* Founded Year */}
            {kita.founded_year && (
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-kita-orange mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Gegründet</p>
                  <p className="text-gray-600">{kita.founded_year}</p>
                </div>
              </div>
            )}
            {/* Type */}
            {kita.type && (
              <div className="flex items-start">
                <Building className="h-5 w-5 text-kita-orange mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Einrichtungstyp</p>
                  <p className="text-gray-600">{kita.type}</p>
                </div>
              </div>
            )}
            {/* Capacity */}
            {kita.capacity_total && (
              <div className="flex items-start">
                <Users className="h-5 w-5 text-kita-orange mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Plätze Gesamt</p>
                  <p className="text-gray-600">{kita.capacity_total}</p>
                </div>
              </div>
            )}
            {/* Sponsor */}
            {(kita.sponsor_name || kita.sponsor_type) && (
              <div className="flex items-start">
                <Briefcase className="h-5 w-5 text-kita-orange mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Träger</p>
                  {kita.sponsor_name && <p className="text-gray-600">{kita.sponsor_name}</p>}
                  {kita.sponsor_type && <p className="text-gray-500 text-sm">{kita.sponsor_type}</p>}
               </div>
             </div>
            )}
          </div> {/* Closing grid for details */}
        </div> {/* Closing details card */}

        {/* Benefits Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Was wir bieten</h3>
          <div className="flex flex-wrap gap-2"> 
            {kitaBenefits.map((benefit, index) => (
              <Badge 
                key={index} 
                variant="default" 
                className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 rounded-full px-4 py-1 text-sm font-medium"
              >
                {benefit}
              </Badge>
            ))}
          </div>
        </div> {/* Closing benefits section */}
      </div> {/* Closing main content wrapper */}
    </> /* Closing outer fragment */
  );
};

export default KitaAboutTab;
