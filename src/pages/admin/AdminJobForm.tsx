import React, { useEffect } from 'react';
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
import StringListInput from '@/components/ui/string-list-input'; // Import StringListInput
import ImageUploadInput from '@/components/ui/image-upload-input'; // Import ImageUploadInput
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'; // Import AlertCircle
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCompanies } from '@/services/company/companyListService';
import { Company } from '@/types/company';
import { Job } from '@/types/job';
import { fetchJobById } from '@/services/jobService';
import { createJob, updateJob, JobMutationData } from '@/services/jobMutationService'; // Import mutation functions AND type
import { toast } from '@/components/ui/use-toast';

// Define Zod schema for validation
const jobFormSchema = z.object({
  title: z.string().min(3, { message: "Titel muss mindestens 3 Zeichen lang sein." }),
  company_id: z.string({ required_error: "Bitte wählen Sie ein Unternehmen aus." }).uuid({ message: "Ungültige Unternehmens-ID." }),
  location: z.string().min(2, { message: "Ort muss mindestens 2 Zeichen lang sein." }),
  type: z.string().optional(), // e.g., Vollzeit, Teilzeit
  salary: z.string().optional(),
  employment_start: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  description: z.string().min(10, { message: "Beschreibung muss mindestens 10 Zeichen lang sein." }),
  featured: z.boolean().default(false),
  requirements: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  // Allow full URLs OR relative paths starting with / OR empty string
  kita_image_url: z.string()
    .refine(val => val === '' || z.string().url().safeParse(val).success || /^\/.+/.test(val), {
      message: "Bitte geben Sie eine gültige URL oder einen relativen Pfad (beginnend mit /) ein.",
    })
    .optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;


const AdminJobForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);
  const [isLoadingData, setIsLoadingData] = React.useState(isEditing);
  const [loadingError, setLoadingError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

   // Fetch companies for the select dropdown
   const { data: companiesData, isLoading: isLoadingCompanies } = useQuery<{ companies: Company[], total: number }, Error>({
     queryKey: ['allAdminCompaniesForSelect'],
     queryFn: () => fetchCompanies({ limit: 2000 }),
     staleTime: Infinity,
   });

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company_id: "",
      location: "",
      type: "Vollzeit",
      salary: "",
      employment_start: "",
      experience: "",
      education: "",
      description: "",
      featured: false,
      requirements: [],
      benefits: [],
      kita_image_url: "",
    },
  });

   // Fetch Job data if editing
   useEffect(() => {
    if (isEditing && id) {
      setLoadingError(null);
      fetchJobById(id)
        .then((data: Job | null) => {
          if (data) {
             const formData: Partial<JobFormData> = {
               title: data.title || "",
               company_id: data.company_id || "",
               location: data.location || "",
               type: data.type || "Vollzeit",
               salary: data.salary || "",
               employment_start: data.employment_start || "",
               experience: data.experience || "",
               education: data.education || "",
               description: data.description || "",
               featured: data.featured || false,
               requirements: data.requirements || [],
               benefits: data.benefits || [],
               kita_image_url: data.kita_image_url || "",
             };
            form.reset(formData);
          } else {
             setLoadingError("Job nicht gefunden oder konnte nicht geladen werden.");
             toast({ title: "Fehler", description: "Job nicht gefunden.", variant: "destructive" });
          }
        })
        .catch((err) => {
           console.error("Error fetching Job data:", err);
           setLoadingError("Ein Fehler ist beim Laden der Job-Daten aufgetreten.");
           toast({ title: "Fehler", description: "Job-Daten konnten nicht geladen werden.", variant: "destructive" });
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    }
  }, [id, isEditing, form]);


  const onSubmit = async (values: JobFormData) => {
    setIsSubmitting(true);
    console.log("Submitting job form data:", values);
    let result: Job | null = null;
    let success = false;

     try {
      if (isEditing && id) {
        result = await updateJob(id, values);
         if (result) {
           toast({ title: "Erfolgreich gespeichert", description: `Job "${result.title}" wurde aktualisiert.` });
           success = true;
         }
      } else {
         if (!values.title || !values.company_id || !values.description) {
            throw new Error("Titel, Unternehmen und Beschreibung sind Pflichtfelder.");
         }
         result = await createJob(values as JobMutationData & { title: string, company_id: string, description: string });
          if (result) {
           toast({ title: "Erfolgreich erstellt", description: `Job "${result.title}" wurde hinzugefügt.` });
           success = true;
         }
      }

      if (success) {
        await queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
        navigate('/admin/jobs');
      }
    } catch (error) {
       console.error("Error submitting job form:", error);
        if (!result) {
          toast({ title: "Speichern fehlgeschlagen", description: (error as Error).message || "Ein unerwarteter Fehler ist aufgetreten.", variant: "destructive" });
       }
    } finally {
      setIsSubmitting(false);
    }
  };


  const goBack = () => navigate('/admin/jobs');

   if (isLoadingData || isLoadingCompanies) {
     return (
        <Card>
           <CardContent className="flex justify-center items-center py-20">
             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             <p className="ml-3 text-muted-foreground">Lade Daten...</p>
           </CardContent>
        </Card>
      );
  }

   if (loadingError && isEditing) { // Show loading error only when editing
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
             <CardTitle>{isEditing ? 'Job bearbeiten' : 'Neuen Job hinzufügen'}</CardTitle>
             <CardDescription>
               {isEditing ? 'Ändern Sie die Details des Jobs.' : 'Füllen Sie die Details für den neuen Job aus.'}
            </CardDescription>
           </CardHeader>
           <CardContent className="grid gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jobtitel *</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Erzieher/in (m/w/d)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Company Select */}
               <FormField
                control={form.control}
                name="company_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unternehmen / Kita *</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unternehmen auswählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companiesData?.companies.map(company => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name} ({company.city || company.location})
                          </SelectItem>
                        ))}
                         {companiesData?.companies.length === 0 && <p className="p-2 text-sm text-muted-foreground">Keine Unternehmen gefunden.</p>}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arbeitsort *</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Berlin Mitte" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Job Type Select */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anstellungsart</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Anstellungsart auswählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vollzeit">Vollzeit</SelectItem>
                        <SelectItem value="Teilzeit">Teilzeit</SelectItem>
                        <SelectItem value="Minijob">Minijob</SelectItem>
                        <SelectItem value="Praktikum">Praktikum</SelectItem>
                        <SelectItem value="Ausbildung">Ausbildung</SelectItem>
                        <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gehalt (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. nach TVöD, 3000€/Monat" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="employment_start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beginn (optional)</FormLabel>
                        <FormControl>
                           {/* TODO: Consider Date Picker */}
                          <Input placeholder="z.B. sofort, 01.08.2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Erfahrung (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Berufseinsteiger, Mit Erfahrung" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bildung (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="z.B. Staatl. anerkannte/r Erzieher/in" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>

               {/* Description */}
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jobbeschreibung *</FormLabel>
                    <FormControl>
                       {/* TODO: Consider Rich Text Editor if needed */}
                      <Textarea placeholder="Beschreiben Sie die Stelle..." {...field} rows={8} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Featured Switch */}
               <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Job</FormLabel>
                      <FormDescription>
                        Hebt diesen Job in den Suchergebnissen hervor.
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

               {/* Requirements */}
               <FormField
                 control={form.control}
                 name="requirements"
                 render={({ field }) => (
                   <FormItem>
                     <StringListInput
                       field={field as any}
                       label="Anforderungen"
                       placeholder="z.B. Teamfähigkeit"
                     />
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
                       field={field as any}
                       label="Benefits"
                       placeholder="z.B. Job-Ticket"
                     />
                     <FormMessage />
                   </FormItem>
                 )}
               />

               {/* Kita Image Upload */}
               <FormField
                 control={form.control}
                 name="kita_image_url"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Zugehöriges Bild (optional)</FormLabel>
                     <FormControl>
                       <ImageUploadInput
                         currentImageUrl={field.value} // Pass value
                         onUploadSuccess={field.onChange} // Pass onChange as callback
                         bucketName="kita-images-database" // Use the same bucket
                         pathPrefix={id ? `jobs/${id}/image` : 'jobs/temp/image'} // Path specific to job image
                         label=""
                         // onUploadComplete={() => form.trigger('kita_image_url')} // Removed trigger
                       />
                     </FormControl>
                     <FormDescription>
                       Ein Bild, das auf der Job-Karte angezeigt wird.
                     </FormDescription>
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
                {isEditing ? 'Änderungen speichern' : 'Job erstellen'}
              </Button>
           </CardFooter>
         </Card>
       </form>
     </Form>
  );
};

export default AdminJobForm;
