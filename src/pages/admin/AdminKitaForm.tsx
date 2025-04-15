import React, { useEffect } from 'react'; // Keep only the correct imports
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploadInput from '@/components/ui/image-upload-input';
import StringListInput from '@/components/ui/string-list-input'; // Import StringListInput
import ImageListInput from '@/components/ui/image-list-input'; // Import ImageListInput
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchCompanyById } from '@/services/company/companyDetailService';
import { createCompany, updateCompany, CompanyMutationData } from '@/services/company/companyMutationService';
import { Company } from '@/types/company';
import { toast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Define Zod schema for validation (subset for now)
const kitaFormSchema = z.object({
  name: z.string().min(2, { message: "Name muss mindestens 2 Zeichen lang sein." }),
  description: z.string().optional(),
  street: z.string().optional(),
  house_number: z.string().optional(),
  postal_code: z.string().optional(),
  city: z.string().optional(),
  bundesland: z.string().optional(),
  is_premium: z.boolean().default(false),
  // Allow full URLs OR relative paths starting with / OR empty string
  logo_url: z.string()
    .refine(val => val === '' || z.string().url().safeParse(val).success || /^\/.+/.test(val), {
      message: "Bitte geben Sie eine gültige URL oder einen relativen Pfad (beginnend mit /) ein.",
    })
    .optional(),
  cover_image_url: z.string()
     .refine(val => val === '' || z.string().url().safeParse(val).success || /^\/.+/.test(val), {
      message: "Bitte geben Sie eine gültige URL oder einen relativen Pfad (beginnend mit /) ein.",
    })
    .optional(),
  type: z.string().optional(),
  founded_year: z.string().optional(), // Could add regex validation later
  employees: z.string().optional(), // Could add regex/enum validation later
  website: z.string().url({ message: "Bitte geben Sie eine gültige URL ein." }).optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }).optional().or(z.literal('')),
  latitude: z.number({ invalid_type_error: "Breitengrad muss eine Zahl sein." }).optional().nullable(),
  longitude: z.number({ invalid_type_error: "Längengrad muss eine Zahl sein." }).optional().nullable(),
  video_url: z.string().url({ message: "Bitte geben Sie eine gültige URL ein." }).optional().or(z.literal('')),
  special_pedagogy: z.string().optional(),
  benefits: z.array(z.string()).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  awards: z.array(z.string()).optional().default([]),
  gallery: z.array(z.string().url()).optional().default([]), // Array of URLs for gallery
});

type KitaFormData = z.infer<typeof kitaFormSchema>;

const AdminKitaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get query client instance
  const isEditing = Boolean(id);
  const [isLoadingData, setIsLoadingData] = React.useState(isEditing);
  const [loadingError, setLoadingError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<KitaFormData>({
    resolver: zodResolver(kitaFormSchema),
    defaultValues: { // Set default values
      name: "",
      description: "",
      street: "",
      house_number: "",
      postal_code: "",
      city: "",
      bundesland: "",
      is_premium: false,
      logo_url: "",
      cover_image_url: "",
      type: "",
      founded_year: "",
      employees: "",
      website: "",
      phone: "",
      email: "",
      latitude: null,
      longitude: null,
      video_url: "",
      special_pedagogy: "",
      benefits: [],
      certifications: [],
      awards: [],
      gallery: [],
    },
  });

  // Fetch data if editing
  useEffect(() => {
    if (isEditing && id) {
      setLoadingError(null); // Reset error on new fetch attempt
      fetchCompanyById(id)
        .then((data: Company | null) => {
          if (data) {
            // Map fetched data to form data structure, handling potential nulls
            const formData: Partial<KitaFormData> = {
              name: data.name || "",
              description: data.description || "",
              street: data.street || "",
              house_number: data.house_number || "",
              postal_code: data.postal_code || "",
              city: data.city || data.location || "", // Fallback to location if city is null
              bundesland: data.bundesland || "",
              is_premium: data.is_premium || false,
              logo_url: data.logo_url || "",
              cover_image_url: data.cover_image_url || "",
              type: data.type || "",
              founded_year: data.founded_year || "",
              employees: data.employees || "",
              website: data.website || "",
              phone: data.phone || "",
              email: data.email || "",
              latitude: data.latitude ?? null, // Use ?? for potential 0 values
              longitude: data.longitude ?? null,
              video_url: data.video_url || "",
              special_pedagogy: data.special_pedagogy || "",
              benefits: data.benefits || [],
              certifications: data.certifications || [],
              awards: data.awards || [],
              gallery: data.gallery || [],
            };
            form.reset(formData); // Populate form with fetched data
          } else {
             setLoadingError("Kita nicht gefunden oder konnte nicht geladen werden.");
             toast({ title: "Fehler", description: "Kita nicht gefunden.", variant: "destructive" });
          }
        })
        .catch((err) => {
           console.error("Error fetching Kita data:", err);
           setLoadingError("Ein Fehler ist beim Laden der Kita-Daten aufgetreten.");
           toast({ title: "Fehler", description: "Daten konnten nicht geladen werden.", variant: "destructive" });
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    }
  }, [id, isEditing, form]); // Dependency array includes id, isEditing, form

  const onSubmit = async (values: KitaFormData) => {
    setIsSubmitting(true);
    console.log("Submitting form data:", values);
    let result: Company | null = null;
    let success = false;

    try {
      if (isEditing && id) {
        console.log(`Attempting to update Kita ID: ${id}`);
        result = await updateCompany(id, values);
        if (result) {
           toast({
             title: "Erfolgreich gespeichert",
             description: `Kita "${result.name}" wurde aktualisiert.`,
             action: <CheckCircle className="text-green-500" />,
           });
           success = true;
        }
      } else {
        console.log("Attempting to create new Kita");
        // Ensure name is passed correctly for createCompany type requirement
        if (!values.name) throw new Error("Name is required to create a Kita.");
        result = await createCompany(values as CompanyMutationData & { name: string });
         if (result) {
           toast({
             title: "Erfolgreich erstellt",
             description: `Kita "${result.name}" wurde hinzugefügt.`,
             action: <CheckCircle className="text-green-500" />,
           });
           success = true;
         }
      }

      if (success && result) {
        const kitaId = id || result.id; // Get the ID for the updated/created kita

        // Update the specific query cache for the detail page directly
        if (kitaId) {
          queryClient.setQueryData(['kita', kitaId], result);
          // Also update potential job list cache if needed later
          // queryClient.invalidateQueries({ queryKey: ['kitaJobs', kitaId] });
        }

        // Invalidate the list query to refetch the list view
        await queryClient.invalidateQueries({ queryKey: ['adminCompanies'] });

        navigate('/admin/kitas'); // Navigate back
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Toast is likely already shown by the service function, but add a fallback
       if (!result) { // Avoid double toast if service showed one
          toast({
            title: "Speichern fehlgeschlagen",
            description: "Ein unerwarteter Fehler ist aufgetreten.",
            variant: "destructive",
          });
       }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => navigate('/admin/kitas');

  if (isLoadingData && isEditing) { // Show loading only when editing and fetching
     return (
        <Card>
           <CardContent className="flex justify-center items-center py-20">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             <p className="ml-3 text-muted-foreground">Lade Kita-Daten...</p>
           </CardContent>
        </Card>
      );
  }

  if (loadingError) {
     return (
        <Card>
           <CardContent className="flex items-center justify-center p-6 text-red-600">
             <AlertCircle className="h-5 w-5 mr-2" />
             <p>{loadingError}</p>
             <Button variant="outline" size="sm" onClick={goBack} className="ml-4">Zurück zur Liste</Button>
           </CardContent>
        </Card>
     )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Kita bearbeiten' : 'Neue Kita hinzufügen'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Ändern Sie die Details der Kita.' : 'Füllen Sie die Details für die neue Kita aus.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name der Kita *</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B. Kita Sonnenschein" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beschreibung</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Beschreiben Sie die Kita..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* Address Fields in a Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Straße</FormLabel>
                      <FormControl>
                        <Input placeholder="Musterstraße" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="house_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hausnummer</FormLabel>
                      <FormControl>
                        <Input placeholder="12a" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postleitzahl</FormLabel>
                      <FormControl>
                        <Input placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stadt</FormLabel>
                      <FormControl>
                        <Input placeholder="Musterstadt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bundesland"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bundesland</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Bundesland auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Baden-Württemberg">Baden-Württemberg</SelectItem>
                          <SelectItem value="Bayern">Bayern</SelectItem>
                          <SelectItem value="Berlin">Berlin</SelectItem>
                          <SelectItem value="Brandenburg">Brandenburg</SelectItem>
                          <SelectItem value="Bremen">Bremen</SelectItem>
                          <SelectItem value="Hamburg">Hamburg</SelectItem>
                          <SelectItem value="Hessen">Hessen</SelectItem>
                          <SelectItem value="Mecklenburg-Vorpommern">Mecklenburg-Vorpommern</SelectItem>
                          <SelectItem value="Niedersachsen">Niedersachsen</SelectItem>
                          <SelectItem value="Nordrhein-Westfalen">Nordrhein-Westfalen</SelectItem>
                          <SelectItem value="Rheinland-Pfalz">Rheinland-Pfalz</SelectItem>
                          <SelectItem value="Saarland">Saarland</SelectItem>
                          <SelectItem value="Sachsen">Sachsen</SelectItem>
                          <SelectItem value="Sachsen-Anhalt">Sachsen-Anhalt</SelectItem>
                          <SelectItem value="Schleswig-Holstein">Schleswig-Holstein</SelectItem>
                          <SelectItem value="Thüringen">Thüringen</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>

             {/* Type (Art der Einrichtung) */}
             <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Art der Einrichtung</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Art auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* TODO: Define actual types based on usage/requirements */}
                          <SelectItem value="Krippe">Krippe</SelectItem>
                          <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="Hort">Hort</SelectItem>
                          <SelectItem value="Kita">Kita (Krippe + Kiga)</SelectItem>
                          <SelectItem value="Sonstige">Sonstige</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

             {/* Contact & Details Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="founded_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gründungsjahr</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="z.B. 1995" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="employees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mitarbeiteranzahl</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="z.B. 10-20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Webseite</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="030 123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-Mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="info@kita.de" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Premium)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://youtube.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>

             {/* Coordinates Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breitengrad (Latitude)</FormLabel>
                      <FormControl>
                         {/* Use valueAsNumber for number inputs */}
                         <Input
                           type="number"
                           step="any" // Allow decimals
                           placeholder="z.B. 52.5200"
                           {...field}
                           value={field.value ?? ''} // Handle null value
                           onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                         />
                      </FormControl>
                       <FormDescription>Wird i.d.R. automatisch ermittelt (Geocoding TODO).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Längengrad (Longitude)</FormLabel>
                      <FormControl>
                         <Input
                           type="number"
                           step="any"
                           placeholder="z.B. 13.4050"
                           {...field}
                           value={field.value ?? ''} // Handle null value
                           onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                         />
                      </FormControl>
                       <FormDescription>Wird i.d.R. automatisch ermittelt (Geocoding TODO).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>

             {/* Special Pedagogy */}
             <FormField
              control={form.control}
              name="special_pedagogy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spezielle Pädagogik (Premium)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Beschreiben Sie besondere pädagogische Ansätze..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Is Premium */}
            <FormField
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Premium Eintrag</FormLabel>
                    <FormDescription>
                      Markiert diesen Eintrag als Premium (schaltet Zusatzfunktionen frei).
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

             {/* Logo Upload */}
             <FormField
               control={form.control}
               name="logo_url"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Logo</FormLabel>
                   <FormControl>
                     <ImageUploadInput
                       currentImageUrl={field.value} // Pass value
                       onUploadSuccess={field.onChange} // Pass onChange as callback
                       bucketName="kita-images-database"
                       pathPrefix={id ? `kitas/${id}/logos` : 'kitas/temp/logos'}
                       label=""
                       // onUploadComplete={() => form.trigger('logo_url')} // Remove trigger for now
                     />
                   </FormControl>
                   <FormDescription>
                     Laden Sie das Kita-Logo hoch (max. 2MB).
                   </FormDescription>
                   <FormMessage />
                 </FormItem>
               )}
             />

             {/* Cover Image Upload */}
              <FormField
               control={form.control}
               name="cover_image_url"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Cover Bild</FormLabel>
                   <FormControl>
                     <ImageUploadInput
                       currentImageUrl={field.value} // Pass value
                       onUploadSuccess={field.onChange} // Pass onChange as callback
                       bucketName="kita-images-database"
                       pathPrefix={id ? `kitas/${id}/covers` : 'kitas/temp/covers'}
                       label=""
                       // onUploadComplete={() => form.trigger('cover_image_url')} // Remove trigger for now
                     />
                   </FormControl>
                   <FormDescription>
                     Laden Sie ein repräsentatives Cover-Bild hoch (max. 5MB).
                   </FormDescription>
                   <FormMessage />
                 </FormItem>
               )}
             />

             {/* Benefits */}
             <FormField
               control={form.control}
               name="benefits"
               render={({ field }) => (
                 <FormItem>
                   <StringListInput
                     field={field as any} // Cast needed as field type is complex
                     label="Benefits / Angebote"
                     placeholder="z.B. Eigener Garten"
                   />
                   <FormMessage />
                 </FormItem>
               )}
             />

              {/* Certifications (Premium) */}
             <FormField
               control={form.control}
               name="certifications"
               render={({ field }) => (
                 <FormItem>
                   <StringListInput
                     field={field as any}
                     label="Zertifizierungen (Premium)"
                     placeholder="z.B. Kneipp-zertifiziert"
                   />
                   <FormMessage />
                 </FormItem>
               )}
             />

              {/* Awards (Premium) */}
             <FormField
               control={form.control}
               name="awards"
               render={({ field }) => (
                 <FormItem>
                   <StringListInput
                     field={field as any}
                     label="Auszeichnungen (Premium)"
                     placeholder="z.B. Deutscher Kita-Preis 2023"
                   />
                   <FormMessage />
                 </FormItem>
               )}
             />

             {/* Gallery (Premium) */}
              <FormField
               control={form.control}
               name="gallery"
               render={({ field }) => (
                 <FormItem>
                   <ImageListInput
                     field={field as any}
                     bucketName="kita-images-database"
                     pathPrefix={id ? `kitas/${id}/gallery` : 'kitas/temp/gallery'} // Specific path for gallery
                     label="Bildergalerie (Premium)"
                   />
                   <FormMessage />
                 </FormItem>
               )}
             />


          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
             <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Abbrechen
             </Button>
             <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isEditing ? 'Änderungen speichern' : 'Kita erstellen'}
             </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AdminKitaForm;
// Remove the duplicated closing tags and export at the end
