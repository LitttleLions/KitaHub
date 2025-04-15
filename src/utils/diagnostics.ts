
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Function to check database connection
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Try to ping the database with a simple query
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error("Database connection error:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
};

// Function to check if premium columns exist
export const checkPremiumColumnsExist = async (): Promise<boolean> => {
  try {
    // Try to query a company with premium fields
    const { data, error } = await supabase
      .from('companies')
      .select('is_premium')
      .limit(1);
    
    if (error) {
      console.error("Premium columns check error:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Premium columns check failed:", error);
    return false;
  }
};

// Function to run diagnostics
export const runDiagnostics = async (): Promise<{ message: string, success: boolean }> => {
  const dbConnection = await checkDatabaseConnection();
  
  if (!dbConnection) {
    return {
      message: "Datenbankverbindung konnte nicht hergestellt werden.",
      success: false
    };
  }
  
  const premiumColumnsExist = await checkPremiumColumnsExist();
  
  if (!premiumColumnsExist) {
    return {
      message: "Premium-Spalten existieren nicht in der Datenbank.",
      success: false
    };
  }
  
  return {
    message: "Alle Diagnose-Checks erfolgreich.",
    success: true
  };
};

// Function to display diagnostics results
export const showDiagnosticsResults = async (): Promise<void> => {
  const results = await runDiagnostics();
  
  if (results.success) {
    toast({
      title: "Diagnostics erfolgreich",
      description: results.message,
      variant: "default",
    });
  } else {
    toast({
      title: "Diagnostik fehlgeschlagen",
      description: results.message,
      variant: "destructive",
    });
  }
};
