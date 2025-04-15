
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MapPin, Filter, Search, Award } from 'lucide-react';

interface SearchFiltersProps {
  location: string;
  setLocation: (value: string) => void;
  radius: string;
  setRadius: (value: string) => void;
  careType: string[];
  setCareType: (value: string[]) => void;
  openingHours: string[];
  setOpeningHours: (value: string[]) => void;
  sponsorType: string[];
  setSponsorType: (value: string[]) => void;
  concept: string[];
  setConcept: (value: string[]) => void;
  specialFeatures: string[];
  setSpecialFeatures: (value: string[]) => void;
  showPremiumOnly: boolean;
  setShowPremiumOnly: (value: boolean) => void;
}

// Available radius options
const RADIUS_OPTIONS = [
  { value: '1', label: '1 km' },
  { value: '5', label: '5 km' },
  { value: '10', label: '10 km' },
  { value: '25', label: '25 km' },
  { value: '50', label: '50 km' },
];

// Care type options
const CARE_TYPE_OPTIONS = [
  { id: 'krippe', label: 'Krippe (0-3 Jahre)' },
  { id: 'kindergarten', label: 'Kindergarten (3-6 Jahre)' },
  { id: 'hort', label: 'Hort (Schulkinder)' },
];

// Opening hours options
const OPENING_HOURS_OPTIONS = [
  { id: 'early', label: 'Frühbetreuung (vor 7:30 Uhr)' },
  { id: 'late', label: 'Spätbetreuung (nach 16:30 Uhr)' },
  { id: 'fullday', label: 'Ganztags' },
];

// Sponsor type options
const SPONSOR_TYPE_OPTIONS = [
  { id: 'public', label: 'Öffentlich' },
  { id: 'private', label: 'Frei' },
  { id: 'religious', label: 'Konfessionell' },
];

// Concept options
const CONCEPT_OPTIONS = [
  { id: 'montessori', label: 'Montessori' },
  { id: 'waldorf', label: 'Waldorf' },
  { id: 'situational', label: 'Situationsansatz' },
  { id: 'forest', label: 'Waldkindergarten' },
  { id: 'reggio', label: 'Reggio' },
  { id: 'openConcept', label: 'Offenes Konzept' },
];

// Special features options
const SPECIAL_FEATURES_OPTIONS = [
  { id: 'language', label: 'Sprachförderung' },
  { id: 'inclusion', label: 'Inklusion' },
  { id: 'accessibility', label: 'Barrierefreiheit' },
  { id: 'bilingual', label: 'Mehrsprachig' },
  { id: 'availableSpots', label: 'Freie Plätze' },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  location,
  setLocation,
  radius,
  setRadius,
  careType,
  setCareType,
  openingHours,
  setOpeningHours,
  sponsorType,
  setSponsorType,
  concept,
  setConcept,
  specialFeatures,
  setSpecialFeatures,
  showPremiumOnly,
  setShowPremiumOnly,
}) => {
  // Helper function to handle checkbox arrays
  const handleCheckboxChange = (
    currentValues: string[],
    setValues: (values: string[]) => void,
    value: string
  ) => {
    if (currentValues.includes(value)) {
      setValues(currentValues.filter(v => v !== value));
    } else {
      setValues([...currentValues, value]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Location search */}
      <div>
        <div className="mb-1">
          <Label htmlFor="location">Postleitzahl oder Ort</Label>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="z.B. München oder 80331"
            className="pl-10"
          />
        </div>
      </div>

      {/* Radius selection */}
      <div>
        <div className="mb-1">
          <Label htmlFor="radius">Umkreis</Label>
        </div>
        <Select value={radius} onValueChange={setRadius}>
          <SelectTrigger id="radius" className="w-full">
            <SelectValue placeholder="Umkreis wählen" />
          </SelectTrigger>
          <SelectContent>
            {RADIUS_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Premium filter */}
      <div className="flex items-center space-x-2 py-2 border-t border-b border-gray-100">
        <Checkbox
          id="premium-only"
          checked={showPremiumOnly}
          onCheckedChange={() => setShowPremiumOnly(!showPremiumOnly)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="premium-only" className="flex items-center">
            <Award className="h-4 w-4 mr-1 text-amber-500" />
            Nur Premium-Kitas anzeigen
          </Label>
          <p className="text-sm text-gray-500">Kitas mit erweitertem Profil</p>
        </div>
      </div>

      {/* Advanced filters in accordion */}
      <Accordion type="multiple" className="w-full">
        {/* Care Type Filter */}
        <AccordionItem value="careType">
          <AccordionTrigger className="text-sm font-medium">Betreuungsform</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CARE_TYPE_OPTIONS.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`care-type-${option.id}`}
                    checked={careType.includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange(careType, setCareType, option.id)}
                  />
                  <Label htmlFor={`care-type-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Opening Hours Filter */}
        <AccordionItem value="openingHours">
          <AccordionTrigger className="text-sm font-medium">Öffnungszeiten</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {OPENING_HOURS_OPTIONS.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`opening-hours-${option.id}`}
                    checked={openingHours.includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange(openingHours, setOpeningHours, option.id)}
                  />
                  <Label htmlFor={`opening-hours-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sponsor Type Filter */}
        <AccordionItem value="sponsorType">
          <AccordionTrigger className="text-sm font-medium">Trägerform</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {SPONSOR_TYPE_OPTIONS.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sponsor-type-${option.id}`}
                    checked={sponsorType.includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange(sponsorType, setSponsorType, option.id)}
                  />
                  <Label htmlFor={`sponsor-type-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Pedagogical Concept Filter */}
        <AccordionItem value="concept">
          <AccordionTrigger className="text-sm font-medium">Pädagogisches Konzept</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {CONCEPT_OPTIONS.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`concept-${option.id}`}
                    checked={concept.includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange(concept, setConcept, option.id)}
                  />
                  <Label htmlFor={`concept-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Special Features Filter */}
        <AccordionItem value="specialFeatures">
          <AccordionTrigger className="text-sm font-medium">Besondere Angebote</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {SPECIAL_FEATURES_OPTIONS.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`special-features-${option.id}`}
                    checked={specialFeatures.includes(option.id)}
                    onCheckedChange={() => handleCheckboxChange(specialFeatures, setSpecialFeatures, option.id)}
                  />
                  <Label htmlFor={`special-features-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SearchFilters;
