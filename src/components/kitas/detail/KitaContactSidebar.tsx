import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Building,
  Medal, // Keep Medal for generic award/cert icon
  Gift, // Keep Gift (though placeholder logic is removed)
  Heart,
  CheckCircle,
  ExternalLink 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Company } from '@/types/company';
import { Job } from '@/types/job';
import { Json } from '@/integrations/supabase/types'; // Import Json type

interface KitaContactSidebarProps {
  kita: Company;
  jobs: Job[] | undefined; 
}

// Helper to check if a value is a non-empty array
const isNonEmptyArray = (value: Json | null | undefined): value is any[] => Array.isArray(value) && value.length > 0;

const KitaContactSidebar: React.FC<KitaContactSidebarProps> = ({ kita, jobs }) => {

  // Process benefits, awards, and certifications safely, assuming they might contain strings
  const benefitsArray: string[] = isNonEmptyArray(kita.benefits) 
    ? kita.benefits.filter((b): b is string => typeof b === 'string') 
    : [];
    
  const awardsArray: string[] = isNonEmptyArray(kita.awards) 
    ? kita.awards.filter((a): a is string => typeof a === 'string') 
    : [];

  const certificationsArray: string[] = isNonEmptyArray(kita.certifications) 
    ? kita.certifications.filter((c): c is string => typeof c === 'string') 
    : [];
    
  // Combine awards and certifications for display
  const displayItems = [...awardsArray, ...certificationsArray];

  return (
    <Card>
      <CardContent className="pt-6 space-y-6"> {/* Consistent spacing between sections */}
        
        {/* Kontakt & Informationen Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Kontakt & Informationen</h3>
          <div className="space-y-3 text-sm"> {/* Consistent spacing and text size */}
            {/* Standort */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-kita-orange mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700 mb-0.5">Standort</p>
                {(kita.street || kita.house_number) && (
                  <p className="text-gray-600">
                    {kita.street || ''} {kita.house_number || ''}
                  </p>
                )}
                {(kita.postal_code || kita.city) && (
                   <p className="text-gray-600">
                     {kita.postal_code || ''} {kita.city || ''}
                   </p>
                )}
                {!kita.street && !kita.house_number && !kita.postal_code && !kita.city && (
                   <p className="text-gray-500 italic">Keine Adresse verfügbar</p>
                )}
              </div>
            </div>
            {/* Telefon */}
            {kita.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-kita-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 mb-0.5">Telefon</p>
                  <a href={`tel:${kita.phone}`} className="text-gray-600 hover:text-kita-orange">
                    {kita.phone}
                  </a>
                </div>
              </div>
            )}
            {/* E-Mail */}
            {kita.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-kita-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 mb-0.5">E-Mail</p>
                  <a href={`mailto:${kita.email}`} className="text-gray-600 hover:text-kita-orange">
                    {kita.email}
                  </a>
                </div>
              </div>
            )}
            {/* Website */}
            {kita.website && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-kita-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 mb-0.5">Website</p>
                  <a href={kita.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-kita-orange break-all">
                    {kita.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>
            )}
             {/* Einrichtungstyp */}
             {kita.type && (
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-kita-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 mb-0.5">Einrichtungstyp</p>
                  <p className="text-gray-600">{kita.type}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mitarbeitervorteile Section */}
        {benefitsArray.length > 0 && (
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Mitarbeitervorteile</h3>
            <div className="space-y-2">
              {benefitsArray.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Auszeichnungen & Zertifikate Section */}
        {displayItems.length > 0 && (
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Auszeichnungen & Zertifikate</h3>
            <div className="space-y-2">
              {displayItems.map((item, index) => (
                 <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                   <Medal className="h-5 w-5 text-amber-500 flex-shrink-0" /> {/* Using Medal as generic icon */}
                   <span>{item}</span> {/* Displaying the string item */}
                 </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Buttons Section */}
        <div className="pt-6 border-t space-y-3">
          {/* Favorite Button */}
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Heart className="h-4 w-4" />
            Als Favorit speichern
          </Button>
          {/* Website Button */}
          {kita.website && (
             <Button variant="outline" asChild className="w-full flex items-center justify-center gap-2">
               <a href={kita.website} target="_blank" rel="noopener noreferrer">
                 <ExternalLink className="h-4 w-4" />
                 Website besuchen
               </a>
             </Button>
          )}
        </div>

      </CardContent>
    </Card>
  );
};

export default KitaContactSidebar;
