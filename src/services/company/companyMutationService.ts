import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/company";
import { toast } from "@/components/ui/use-toast";
import { mapToCompany } from "./companyMapper";
import { generateSlug } from "@/lib/utils"; // Move import here

// Type for the data expected by insert/update, based on the form schema
// We use Partial<Company> for flexibility, but ensure required fields are handled
export type CompanyMutationData = Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>; // Export the type

/**
 * Creates a new company (Kita) record in Supabase.
 * @param companyData - The data for the new company.
 * @returns The created Company object or null if an error occurred.
 */
// Removed misplaced import from here

/**
 * Creates a new company (Kita) record in Supabase.
 * @param companyData - The data for the new company. Must include 'name'.
 * @returns The created Company object or null if an error occurred.
 */
export const createCompany = async (companyData: CompanyMutationData & { name: string }): Promise<Company | null> => {
  try {
    // Generate slug from name if not provided
    const slug = companyData.slug || generateSlug(companyData.name);

    const dataToInsert = {
      ...companyData,
      slug: slug, // Ensure slug is included
      is_premium: companyData.is_premium ?? false, // Ensure boolean fields are explicitly set
      // Remove fields managed by DB or not part of insert
      id: undefined,
      created_at: undefined,
      updated_at: undefined,
    };

    // Remove undefined properties to avoid inserting nulls unintentionally for optional fields
    Object.keys(dataToInsert).forEach(key => dataToInsert[key as keyof typeof dataToInsert] === undefined && delete dataToInsert[key as keyof typeof dataToInsert]);


    const { data, error } = await supabase
      .from('companies')
      .insert(dataToInsert) // Pass the cleaned data object directly
      .select()
      .single();

    if (error) {
      console.error("Error creating company:", error);
      toast({
        title: "Fehler beim Erstellen",
        description: `Die Kita konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive",
      });
      return null;
    }

    return data ? mapToCompany(data) : null;

  } catch (error) {
    console.error("Unexpected error creating company:", error);
     toast({
        title: "Unerwarteter Fehler",
        description: "Beim Erstellen der Kita ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    return null;
  }
};

/**
 * Updates an existing company (Kita) record in Supabase.
 * @param id - The ID of the company to update.
 * @param companyData - The data to update.
 * @returns The updated Company object or null if an error occurred.
 */
export const updateCompany = async (id: string, companyData: CompanyMutationData): Promise<Company | null> => {
  console.log(`[updateCompany] Attempting update for ID: ${id}`);
  console.log("[updateCompany] Data received:", companyData);

  const dataToUpdate = {
    ...companyData,
    updated_at: new Date().toISOString(),
  };
   // Remove undefined properties to avoid sending nulls unintentionally
   Object.keys(dataToUpdate).forEach(key => dataToUpdate[key as keyof typeof dataToUpdate] === undefined && delete dataToUpdate[key as keyof typeof dataToUpdate]);

  console.log("[updateCompany] Data being sent to Supabase:", dataToUpdate);


  try {
    // Step 1: Perform the update operation
    const { error: updateError } = await supabase
      .from('companies')
      .update(dataToUpdate) // Use the cleaned data
      .eq('id', id);

    // Check for update error *after* the operation
    if (updateError) {
      console.error("Error during company update operation:", updateError);
      toast({
        title: "Fehler beim Speichern (Update)",
        description: `Die Kita konnte nicht aktualisiert werden: ${updateError.message}`,
        variant: "destructive",
      });
      return null;
    }

    // Step 2: If update was successful (or at least didn't error), fetch the updated row
    const { data: selectData, error: selectError } = await supabase
      .from('companies')
      .select() // Select all columns
      .eq('id', id)
      .single(); // Expect exactly one row

    if (selectError) {
       console.error("Error selecting company after update:", selectError);
       toast({
        title: "Fehler beim Speichern (Select)",
        description: `Die aktualisierte Kita konnte nicht abgerufen werden: ${selectError.message}`, // More specific error
        variant: "destructive",
      });
      // Depending on requirements, you might still want to return null or handle differently
      // If the update likely succeeded but select failed, it's an inconsistent state.
      return null;
    }

     return selectData ? mapToCompany(selectData) : null;

  } catch (error) {
    console.error("Unexpected error updating company:", error);
     toast({
        title: "Unerwarteter Fehler",
        description: "Beim Aktualisieren der Kita ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    return null;
  }
};

/**
 * Deletes a company (Kita) record from Supabase by its ID.
 * Note: This does NOT automatically delete associated storage objects (images).
 * @param id - The ID of the company to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting company:", error);
      toast({
        title: "Fehler beim Löschen",
        description: `Die Kita konnte nicht gelöscht werden: ${error.message}`,
        variant: "destructive",
      });
      return false;
    }

    toast({
       title: "Erfolgreich gelöscht",
       description: "Die Kita wurde entfernt.",
       // action: <Trash2 className="text-green-500" />, // Optional icon
     });
    return true;

  } catch (error) {
    console.error("Unexpected error deleting company:", error);
     toast({
        title: "Unerwarteter Fehler",
        description: "Beim Löschen der Kita ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    return false;
  }
};
