
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Users, 
  Building,
  ParkingCircle,
  Music,
  School,
  ShieldCheck,
  Medal,
  Gift,
  Heart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Company } from '@/types/company';
import { Job } from '@/types/job';

interface KitaContactSidebarProps {
  kita: Company;
  jobs: Job[] | undefined;
}

const KitaContactSidebar: React.FC<KitaContactSidebarProps> = ({ kita, jobs }) => {

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Kontakt & Informationen</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium mb-0.5">Standort</p>
              {/* Display street and house number if available */}
              {(kita.street || kita.house_number) && (
                <p className="text-gray-600">
                  {kita.street || ''} {kita.house_number || ''}
                </p>
              )}
              {/* Display postal code and city if available */}
              {(kita.postal_code || kita.city) && (
                 <p className="text-gray-600">
                   {kita.postal_code || ''} {kita.city || ''}
                 </p>
              )}
              {/* Fallback if no address parts exist */}
              {!kita.street && !kita.house_number && !kita.postal_code && !kita.city && (
                 <p className="text-gray-500 italic">Keine Adresse verfügbar</p>
              )}
            </div>
          </div>

          {kita.phone && (
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
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
              <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">E-Mail</p>
                <a href={`mailto:${kita.email}`} className="text-gray-600 hover:text-kita-orange">
                  {kita.email}
                </a>
              </div>
            </div>
          )}
          
          {kita.website && (
            <div className="flex items-start">
              <Globe className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Website</p>
                <a href={kita.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-kita-orange">
                  {kita.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          
          {kita.founded_year && (
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Gegründet</p>
                <p className="text-gray-600">{kita.founded_year}</p>
              </div>
            </div>
          )}
          
          {kita.employees && (
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Mitarbeiter</p>
                <p className="text-gray-600">{kita.employees}</p>
              </div>
            </div>
          )}
          
          {kita.type && (
            <div className="flex items-start">
              <Building className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Einrichtungstyp</p>
                <p className="text-gray-600">{kita.type}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Facilities */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Ausstattung</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShieldCheck className="h-4 w-4 text-kita-green" /> Sichere Spielplätze
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ParkingCircle className="h-4 w-4 text-kita-green" /> Parkplätze
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Music className="h-4 w-4 text-kita-green" /> Musikraum
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <School className="h-4 w-4 text-kita-green" /> Lernbereich
            </div>
          </div>
        </div>
        
        {/* Certifications */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Auszeichnungen</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-amber-500" />
              <span className="text-sm">Qualitätssiegel für Kitas</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-blue-500" />
              <span className="text-sm">Familienfreundliche Einrichtung</span>
            </div>
          </div>
        </div>
        
        {jobs && jobs.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Offene Stellen</h3>
            <Button asChild className="w-full bg-kita-orange hover:bg-kita-orange/90">
              <Link to={`/jobs?company=${kita.id}`}>
                Alle Stellenangebote ansehen
              </Link>
            </Button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Heart className="h-4 w-4" />
            Als Favorit speichern
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KitaContactSidebar;
