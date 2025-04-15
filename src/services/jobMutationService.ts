import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "@/components/ui/use-toast";
// Assuming mapJobData exists in jobService or similar to map DB data to Job type
// We might need to adjust imports or create a dedicated mapper if needed
import { mapJobData } from "./jobService";

// Type for the data expected by insert/update, based on the form schema
// Omit fields managed by DB or derived in mapping
export type JobMutationData = Partial<Omit<Job, 'id' | 'created_at' | 'updated_at' | 'company_name' | 'company_logo' | 'company' | 'posted_date'>>; // Export the type

/**
 * Creates a new job record in Supabase.
 * @param jobData - The data for the new job.
 * @returns The created Job object or null if an error occurred.
 */
export const createJob = async (jobData: JobMutationData & { title: string, company_id: string, description: string }): Promise<Job | null> => {
  try {
    const dataToInsert = {
      ...jobData,
      posted_date: new Date().toISOString(), // Set posted_date on creation
      // Ensure boolean fields are explicitly set if needed, Zod default helps
      featured: jobData.featured ?? false,
    };

    // Remove undefined properties
    Object.keys(dataToInsert).forEach(key => dataToInsert[key as keyof typeof dataToInsert] === undefined && delete dataToInsert[key as keyof typeof dataToInsert]);

    const { data, error } = await supabase
      .from('jobs')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) {
      console.error("Error creating job:", error);
      toast({
        title: "Fehler beim Erstellen",
        description: `Der Job konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }

    // Need to map the raw DB data back to the Job type, potentially fetching company info again
    return data ? await mapJobData(data) : null;

  } catch (error) {
    console.error("Unexpected error creating job:", error);
     toast({
        title: "Unerwarteter Fehler",
        description: "Beim Erstellen des Jobs ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    return null;
  }
};

/**
 * Updates an existing job record in Supabase.
 * @param id - The ID of the job to update.
 * @param jobData - The data to update.
 * @returns The updated Job object or null if an error occurred.
 */
export const updateJob = async (id: string, jobData: JobMutationData): Promise<Job | null> => {
  try {
     const dataToUpdate = {
      ...jobData,
      updated_at: new Date().toISOString(), // Manually set updated_at timestamp
    };
     // Remove undefined properties
     Object.keys(dataToUpdate).forEach(key => dataToUpdate[key as keyof typeof dataToUpdate] === undefined && delete dataToUpdate[key as keyof typeof dataToUpdate]);


    // Step 1: Perform the update operation
    const { error: updateError } = await supabase
      .from('jobs')
      .update(dataToUpdate)
      .eq('id', id);

    if (updateError) {
      console.error("Error during job update operation:", updateError);
      toast({
        title: "Fehler beim Speichern (Update)",
        description: `Der Job konnte nicht aktualisiert werden: ${updateError.message}`,
        variant: "destructive",
      });
      return null;
    }

    // Step 2: If update was successful, fetch the updated row to return the full Job object
    const { data: selectData, error: selectError } = await supabase
      .from('jobs')
      .select()
      .eq('id', id)
      .single();

    if (selectError) {
       console.error("Error selecting job after update:", selectError);
       toast({
        title: "Fehler beim Speichern (Select)",
        description: `Der aktualisierte Job konnte nicht abgerufen werden: ${selectError.message}`,
        variant: "destructive",
      });
      return null;
    }

     // Need to map the raw DB data back to the Job type
     return selectData ? await mapJobData(selectData) : null;

  } catch (error) {
    console.error("Unexpected error updating job:", error);
     toast({
        title: "Unerwarteter Fehler",
        description: "Beim Aktualisieren des Jobs ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    return null;
  }
};

/**
 * Deletes a job record from Supabase by its ID.
 * @param id - The ID of the job to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteJob = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Fehler beim Löschen",
        description: `Der Job konnte nicht gelöscht werden: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }

     toast({
       title: "Erfolgreich gelöscht",
       description: "Der Job wurde entfernt.",
     });
    return true;

  } catch (error) {
    console.error("Unexpected error deleting job:", error);
     toast({
        title: "Unerwarteter Fehler",
        description: "Beim Löschen des Jobs ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    return false;
  }
};
