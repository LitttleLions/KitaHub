import { createClient } from '@supabase/supabase-js';

// Umgebungsvariablen sollten bereits beim Serverstart geladen sein.
// dotenv.config() hier entfernen, um Frontend-Konflikte zu vermeiden.

const SUPABASE_URL = process.env.SUPABASE_URL;
// Verwende den Service Role Key für Backend-Operationen
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Prüfe, ob die Variablen vorhanden sind (wichtig beim Serverstart)
if (!SUPABASE_URL) {
  console.error('FEHLER: Supabase URL ist nicht in den Umgebungsvariablen definiert!');
  throw new Error('Supabase URL ist nicht in den Umgebungsvariablen definiert.');
}
if (!SUPABASE_SERVICE_KEY) {
  console.error('FEHLER: Supabase Service Key ist nicht in den Umgebungsvariablen definiert!');
  // Wichtig: Nicht den Anon-Key für Backend-Operationen verwenden, die erhöhte Rechte benötigen!
  throw new Error('Supabase Service Key ist nicht in den Umgebungsvariablen definiert.');
}

// Initialisiere den Client mit dem Service Role Key
// Die Umgebungsvariablen werden direkt aus process.env gelesen.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        // Optional: Deaktiviere Auto-Refresh-Token, da wir den Service Key verwenden
        autoRefreshToken: false,
        persistSession: false
    }
});

// Optional: Log nur beim Start, nicht bei jedem Import
// console.log('Supabase Client für Backend initialisiert (mit Service Key).');
