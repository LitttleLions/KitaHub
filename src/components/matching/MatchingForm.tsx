
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Import all necessary icons from lucide-react
import { 
  Calendar as CalendarIcon, MapPin, Baby, Clock, BookOpen, Gift, CalendarDays, 
  Check, Star, Building, Music, Trees, Bus, Utensils, Users, HeartHandshake, 
  Palette, Brain, Mountain 
} from 'lucide-react'; 
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button, type ButtonProps } from '@/components/ui/button'; // Import ButtonProps
// Checkbox no longer directly used
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Add Card imports
import { Slider } from '@/components/ui/slider'; // Add Slider import
import { Switch } from '@/components/ui/switch'; // Add Switch import
import { cn } from '@/lib/utils';
import { MatchingCriteria } from '@/types/matching';

const formSchema = z.object({
  location: z.string().min(2, { message: 'Bitte gib mindestens 2 Zeichen ein' }),
  childAge: z.coerce.number().min(0).max(6),
  careType: z.enum(['halbtags', 'ganztags', 'flexibel']),
  pedagogicalConcepts: z.array(z.string()).min(0),
  additionalOffers: z.array(z.string()).min(0),
  startDate: z.date(),
  priorityFactors: z.object({
    location: z.boolean().default(true),
    concept: z.boolean().default(false),
    additionalOffers: z.boolean().default(false),
    careType: z.boolean().default(false)
  })
});

type FormValues = z.infer<typeof formSchema>;

// Define types for options with icons
interface OptionWithIcon {
  value: string;
  label: string;
  icon: React.ElementType;
}

// Added icons to options and applied type
const pedagogicalConceptOptions: OptionWithIcon[] = [
  { value: 'montessori', label: 'Montessori', icon: Palette },
  { value: 'reggio', label: 'Reggio', icon: HeartHandshake },
  { value: 'waldorf', label: 'Waldorf / Steiner', icon: Brain },
  { value: 'religios', label: 'Religiös', icon: Building }, // Placeholder icon
  { value: 'integrativ', label: 'Integrativ', icon: Users },
  { value: 'natur', label: 'Natur / Wald', icon: Trees },
  { value: 'bewegung', label: 'Bewegung', icon: Mountain } // Placeholder icon
];

const additionalOfferOptions: OptionWithIcon[] = [
  { value: 'bilingual', label: 'Bilinguale Betreuung', icon: Users }, // Placeholder icon
  { value: 'musik', label: 'Musikalische Förderung', icon: Music },
  { value: 'sport', label: 'Sportkita', icon: Mountain }, // Placeholder icon
  { value: 'garten', label: 'Eigener Garten', icon: Trees },
  { value: 'ausfluge', label: 'Regelmäßige Ausflüge', icon: Bus },
  { value: 'essen', label: 'Bio-Verpflegung', icon: Utensils },
  { value: 'integration', label: 'Inklusion / Integration', icon: HeartHandshake }
];

// Helper component for clickable option cards
const OptionCard = ({ label, icon: Icon, isSelected, onClick }: { label: string; icon: React.ElementType; isSelected: boolean; onClick: () => void }) => (
  <div
    onClick={onClick}
    className={cn(
      "border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer transition-colors relative", // Added relative positioning
      isSelected ? "border-kita-orange bg-kita-orange/10 ring-2 ring-kita-orange" : "border-gray-200 hover:bg-gray-50"
    )}
  >
    <Icon className={cn("h-6 w-6 mb-1", isSelected ? "text-kita-orange" : "text-gray-500")} />
    <span className={cn("text-sm text-center font-medium", isSelected ? "text-kita-orange" : "text-gray-700")}>{label}</span>
    {isSelected && <Check className="h-4 w-4 text-kita-orange absolute top-2 right-2" />}
  </div>
);


const MatchingForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      childAge: 3,
      careType: 'ganztags',
      pedagogicalConcepts: [],
      additionalOffers: [],
      startDate: new Date(),
      priorityFactors: {
        location: true,
        concept: false,
        additionalOffers: false,
        careType: false
      }
    }
  });

  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    
    // Calculate weighted priorities
    const priorities = Object.entries(values.priorityFactors).reduce((acc, [key, isEnabled]) => {
      acc[key as keyof typeof acc] = isEnabled ? 0.3 : 0.1;
      return acc;
    }, {} as Record<string, number>);
    
    // Normalize priorities to sum to 1
    const sum = Object.values(priorities).reduce((sum, val) => sum + val, 0);
    Object.keys(priorities).forEach(key => {
      priorities[key] = priorities[key] / sum;
    });
    
    // Create the matching criteria object
    const matchingCriteria: MatchingCriteria = {
      location: values.location,
      childAge: values.childAge,
      careType: values.careType,
      pedagogicalConcepts: values.pedagogicalConcepts,
      additionalOffers: values.additionalOffers,
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      priorityFactor: {
        location: priorities.location,
        concept: priorities.concept,
        additionalOffers: priorities.additionalOffers,
        careType: priorities.careType
      }
    };
    
    // Store criteria in session storage for the results page
    sessionStorage.setItem('matchingCriteria', JSON.stringify(matchingCriteria));
    
    // Navigate to results page
    setTimeout(() => {
      navigate('/matching/results');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12"> {/* Increased spacing */}
        
        {/* Section 1: Basic Info */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Basisinformationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <MapPin className="h-5 w-5 text-kita-orange" />
                    Wohnort / PLZ
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Berlin oder 10115" {...field} className="text-base"/>
                  </FormControl>
                  <FormDescription>
                    Gib deinen Wohnort oder deine Postleitzahl ein.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="childAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Baby className="h-5 w-5 text-kita-orange" />
                    Alter des Kindes: {field.value} {field.value === 1 ? 'Jahr' : 'Jahre'}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      min={0}
                      max={6}
                      step={1}
                      className="py-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="careType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-kita-orange" />
                    Gewünschte Betreuungszeit
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
                    >
                      {['halbtags', 'ganztags', 'flexibel'].map((type) => (
                        <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                             <RadioGroupItem value={type} id={`careType-${type}`} className="peer sr-only" />
                           </FormControl>
                           <FormLabel 
                             htmlFor={`careType-${type}`}
                             className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-kita-orange [&:has([data-state=checked])]:border-kita-orange cursor-pointer w-full"
                           >
                             <span className="font-semibold mb-1 text-center">
                               {type === 'halbtags' ? 'Halbtags' : type === 'ganztags' ? 'Ganztags' : 'Flexibel'}
                             </span>
                             <span className="text-xs text-muted-foreground text-center">
                               {type === 'halbtags' ? '(bis 5 Std.)' : type === 'ganztags' ? '(7-9 Std.)' : '(> 9 Std.)'}
                             </span>
                           </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2 text-base">
                    <CalendarDays className="h-5 w-5 text-kita-orange" />
                    Gewünschter Starttermin
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal text-base",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: de })
                          ) : (
                            <span>Datum auswählen</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={de}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section 2: Pedagogical Concepts */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-kita-orange" />
              Pädagogisches Konzept
            </CardTitle>
            <FormDescription>Wähle ein oder mehrere Konzepte aus, die dir wichtig sind.</FormDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="pedagogicalConcepts"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pedagogicalConceptOptions.map((option) => (
                      <OptionCard
                        key={option.value}
                        label={option.label}
                        icon={option.icon}
                        isSelected={field.value?.includes(option.value)}
                        onClick={() => {
                          const currentValues = field.value || [];
                          const newValue = currentValues.includes(option.value)
                            ? currentValues.filter((v) => v !== option.value)
                            : [...currentValues, option.value];
                          field.onChange(newValue);
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage className="pt-2" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section 3: Additional Offers */}
        <Card className="shadow-sm">
           <CardHeader>
             <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
               <Gift className="h-5 w-5 text-kita-orange" />
               Zusatzangebote
             </CardTitle>
             <FormDescription>Welche zusätzlichen Angebote sind dir wichtig?</FormDescription>
           </CardHeader>
           <CardContent>
             <FormField
               control={form.control}
               name="additionalOffers"
               render={({ field }) => (
                 <FormItem>
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     {additionalOfferOptions.map((option) => (
                       <OptionCard
                         key={option.value} // Key should be here
                         label={option.label}
                         icon={option.icon} // Use icon prop
                         isSelected={field.value?.includes(option.value)}
                         onClick={() => {
                           const currentValues = field.value || [];
                           const newValue = currentValues.includes(option.value)
                             ? currentValues.filter((v) => v !== option.value)
                             : [...currentValues, option.value];
                           field.onChange(newValue);
                         }}
                       />
                     ))}
                   </div>
                   <FormMessage className="pt-2" />
                 </FormItem>
               )}
             />
           </CardContent>
         </Card>

        {/* Section 4: Priorities */}
        <Card className="shadow-sm bg-gray-50">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Star className="h-5 w-5 text-kita-orange" />
              Was ist dir besonders wichtig?
            </CardTitle>
            <FormDescription>
              Lege fest, welche Faktoren bei deiner Suche stärker gewichtet werden sollen.
            </FormDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="priorityFactors.location"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">Standort/Entfernung</FormLabel>
                    <FormDescription>
                      Kitas in deiner Nähe bevorzugen.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priorityFactors.concept"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">Pädagogisches Konzept</FormLabel>
                    <FormDescription>
                      Ausgewählte Konzepte stark gewichten.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priorityFactors.additionalOffers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">Zusatzangebote</FormLabel>
                    <FormDescription>
                      Ausgewählte Angebote stark gewichten.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priorityFactors.careType"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-medium">Betreuungszeiten</FormLabel>
                    <FormDescription>
                      Gewünschte Betreuungszeit stark gewichten.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4"> {/* Centered button */}
          <Button 
            type="submit" 
            size="lg" // Larger button
            className="bg-kita-orange hover:bg-kita-orange/90 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-md transition-transform transform hover:scale-105" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Suche läuft..." : "Passende Kitas finden"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MatchingForm;
