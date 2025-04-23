import React, { useState, useEffect, useRef } from 'react'; // Add useRef
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added Select
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox
import { GERMAN_STATES } from '@/lib/constants'; // Import GERMAN_STATES

// --- Type Definitions ---
interface Bezirk {
  name: string;
  url: string;
}

interface ImportStatus {
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  logs: LogEntry[];
  error?: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  level: 'info' | 'warn' | 'error';
}

interface KitaResult {
  // Define structure based on actual backend response if known, otherwise use generic object
  [key: string]: any;
}

interface StartImportResponse {
    jobId: string;
}
// --- End Type Definitions ---

// Helper function for delays (only used in simulation) - Can be removed later
// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const API_BASE_URL = 'http://localhost:3000/api/import'; // Corrected port to 3000

const AdminImport: React.FC = () => {
  // --- New State Variables ---
  const [selectedBundeslandName, setSelectedBundeslandName] = useState<string | null>(null); // Store the name (label) for display/UI state
  const [selectedBundeslandUrl, setSelectedBundeslandUrl] = useState<string | null>(null); // Store the URL (value) for API calls
  const [bezirke, setBezirke] = useState<Bezirk[]>([]);
  const [selectedBezirkeUrls, setSelectedBezirkeUrls] = useState<string[]>([]);
  const [bezirkFilter, setBezirkFilter] = useState<string>(''); // State for the filter input
  const [kitaLimit, setKitaLimit] = useState<number>(10);
  // --- End New State Variables ---

  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Bereit'); // Keep for general status message
  const [importStatus, setImportStatus] = useState<ImportStatus | null>(null); // More detailed status from backend
  const [progress, setProgress] = useState<number>(0); // Can be derived from importStatus later
  const [logs, setLogs] = useState<string[]>([]); // Keep for frontend logs + formatted backend logs
  const [results, setResults] = useState<KitaResult[]>([]); // Use KitaResult[]
  const [importedKitas, setImportedKitas] = useState<string[]>([]); // Neue Liste für importierte Kitas
  const [isLoading, setIsLoading] = useState(false);
  const [isDryRun, setIsDryRun] = useState(false); // Keep for UI logic (show results)
  const pollingJobIdRef = useRef<string | null>(null); // Ref to hold the Job ID being polled
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold setTimeout ID for cleanup

  // --- Data Fetching Effects ---
  // Cleanup function to clear timeout on component unmount (Keep this part)
  useEffect(() => {
      return () => {
        if (timeoutRef.current) {
            console.log('[DEBUG] Clearing timeout on component unmount. Timeout ID:', timeoutRef.current);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

  useEffect(() => {
    // Fetch Bezirke when selectedBundeslandUrl changes (instead of name)
    if (selectedBundeslandUrl) {
      const fetchBezirke = async () => {
        addLog(`Frontend: Lade Bezirke für ${selectedBundeslandName}...`); // Log using name
        setIsLoading(true); // Indicate loading state for Bezirke
         setBezirke([]); // Clear previous Bezirke
         setSelectedBezirkeUrls([]); // Clear selection
         setBezirkFilter(''); // Reset filter when fetching new Bezirke
         try {
           // Log the URL being fetched
           const apiUrl = `${API_BASE_URL}/bezirke?bundeslandUrl=${encodeURIComponent(selectedBundeslandUrl)}`;
           console.log('[DEBUG] Frontend: Fetching Bezirke from URL:', apiUrl); // Keep this log
           addLog(`[DEBUG] Frontend: Starting fetch for ${selectedBundeslandName}...`); // Add log before fetch
           // Use selectedBundeslandUrl in the API request
           const response = await fetch(apiUrl);
           // Add log immediately after fetch returns (before checking ok)
           console.log('[DEBUG] Frontend: Fetch promise resolved. Response status:', response.status, 'Ok:', response.ok);
           addLog(`[DEBUG] Frontend: Fetch returned status ${response.status}.`);

           if (!response.ok) {
             // Log the response body if not ok, helps diagnose API errors
             let errorBody = 'Could not read error body';
             try {
               errorBody = await response.text(); // Try reading as text first
               console.error('[DEBUG] Frontend: Error response body:', errorBody);
             } catch (e) {
               console.error('[DEBUG] Frontend: Failed to read error response body:', e);
             }
             // Use selectedBundeslandName in error message for clarity
             throw new Error(`API Fehler (${response.status}) beim Laden der Bezirke für ${selectedBundeslandName}. Body: ${errorBody}`);
           }

           console.log('[DEBUG] Frontend: Response is OK. Parsing JSON...');
           addLog('[DEBUG] Frontend: Response OK, parsing JSON...');
           const data: Bezirk[] = await response.json();
           console.log('[DEBUG] Frontend: JSON parsed successfully:', data);
           addLog(`[DEBUG] Frontend: JSON parsed (${data.length} items).`);

           setBezirke(data);
           addLog(`Frontend: Bezirke für ${selectedBundeslandName} geladen (${data.length} Bezirke).`); // Keep original success log
         } catch (error) {
           // Log the error object itself for more details
           console.error('[DEBUG] Frontend: Error caught in fetchBezirke catch block:', error);
           addLog(`ERROR fetching bezirke: ${error instanceof Error ? error.message : String(error)}`, 'error');
           // Use selectedBundeslandName in error message for clarity
           setStatus(`Fehler beim Laden der Bezirke für ${selectedBundeslandName}.`);
        } finally {
            setIsLoading(false);
        }
      };
      fetchBezirke();
    } else {
      setBezirke([]); // Clear Bezirke if no Bundesland is selected
      setSelectedBezirkeUrls([]); // Clear selection
      setBezirkFilter(''); // Reset filter if no Bundesland selected
    }
  }, [selectedBundeslandUrl]); // Depend on the URL state now
  // --- End Data Fetching Effects ---


  // --- Event Handlers ---
  const handleBundeslandChange = (value: string) => {
    // Value from Select is the 'value' property (slug, e.g., "berlin")
    const selectedValue = value === 'none' ? null : value;

    // Find the full state object from the constant using the selected value (slug)
    const selectedState = GERMAN_STATES.find(state => state.value === selectedValue);

    // Set the URL state with the 'url' property from the found object
    setSelectedBundeslandUrl(selectedState ? selectedState.url : null);
    // Set the name state with the 'label' property for display
    setSelectedBundeslandName(selectedState ? selectedState.label : null);
    // Reset filter when Bundesland changes - This is already done in useEffect when bezirke are cleared/fetched
  };

  const handleBezirkChange = (checked: boolean | string, url: string) => {
      setSelectedBezirkeUrls(prev =>
          checked ? [...prev, url] : prev.filter(u => u !== url)
      );
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKitaLimit(parseInt(e.target.value, 10) || 0);
  };
  // --- End Event Handlers ---


  const startImport = async (dryRun: boolean) => {
    console.log('[DEBUG] startImport function called. dryRun:', dryRun); // DEBUG LOG 1
    // --- Clear previous timeout if it exists ---
    if (timeoutRef.current) {
        console.log('[DEBUG] Clearing previous timeout before starting new import. Timeout ID:', timeoutRef.current);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }
    // --- End Clear previous timeout ---
    // --- Validation ---
    if (selectedBezirkeUrls.length === 0) {
        addLog('ERROR: Bitte mindestens einen Bezirk auswählen.', 'error');
        setStatus('Fehler: Keine Bezirke ausgewählt.');
        return;
    }
    if (kitaLimit <= 0) {
        addLog('ERROR: Kita-Limit muss größer als 0 sein.', 'error');
        setStatus('Fehler: Ungültiges Kita-Limit.');
        return;
    }
    // --- End Validation ---

    setIsLoading(true);
    setImportStatus(null); // Reset detailed status
    setLogs([]); // Clear previous logs
    setResults([]); // Clear previous results
    setProgress(0); // Reset progress
    setStatus('Starte Import...');
    setIsDryRun(dryRun); // Remember if it's a dry run for result fetching
    // --- Log selected Bezirk names ---
    const selectedBezirkNames = bezirke
        .filter(b => selectedBezirkeUrls.includes(b.url))
        .map(b => b.name)
        .join(', ');
    addLog(`Frontend: Starte Import (Dry Run: ${dryRun}) für ${selectedBezirkeUrls.length} Bezirk(e) [${selectedBezirkNames || 'Keine ausgewählt'}] mit Limit ${kitaLimit}.`);
    // --- End Log selected Bezirk names ---

    try {
       // --- Filter selected Bezirk objects ---
       const selectedBezirkeObjects = bezirke.filter(b => selectedBezirkeUrls.includes(b.url));
       // --- End Filter ---

       // --- Actual API Call ---
       const response = await fetch(`${API_BASE_URL}/start`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         // Send dryRun, selected Bezirk objects and correct Kita Limit key
         body: JSON.stringify({
           dryRun: dryRun,
           bezirke: selectedBezirkeObjects, // Send the array of objects
           kitaLimitPerBezirk: kitaLimit
         }),
       });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unbekannter Fehler beim Start' }));
        throw new Error(`API Fehler (${response.status}): ${errorData.message}`);
      }

      const data: StartImportResponse = await response.json();
      if (!data.jobId) {
        throw new Error('Keine Job ID von API erhalten.');
      }

      setJobId(data.jobId);
      pollingJobIdRef.current = data.jobId; // Store the new Job ID in the ref
      setStatus(`Import gestartet (Job ID: ${data.jobId}). Warte auf Status...`);
      addLog(`Frontend: Import erfolgreich gestartet, Job ID: ${data.jobId}`);
      // Start polling for status
      console.log('[DEBUG] About to call pollStatus. Polling Job ID Ref:', pollingJobIdRef.current); // DEBUG LOG 2
      pollStatus(); // No longer pass jobId as argument
      // --- End API Call ---

    } catch (error) {
      // This catch block now handles errors from the fetch call itself
      console.error('[DEBUG] Error caught in startImport catch block:', error); // DEBUG LOG 3
      console.error('Error starting import via API:', error);
      setStatus('Fehler beim Starten des Imports.');
      addLog(`ERROR starting import: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setIsLoading(false);
    }
  };

  // Rewritten pollStatus using recursive setTimeout
  const pollStatus = async () => {
    const jobIdToPoll = pollingJobIdRef.current; // Get the Job ID from the ref
    if (!jobIdToPoll) {
      console.error('[DEBUG] pollStatus called but pollingJobIdRef is null. Stopping poll.');
      setIsLoading(false); // Ensure loading state is reset
      return;
    }

    console.log(`[DEBUG] Polling status for Job ID: ${jobIdToPoll}`);

    try {
      const response = await fetch(`${API_BASE_URL}/status/${jobIdToPoll}`);
      console.log(`[DEBUG] Poll fetch response status: ${response.status}`);

      if (!response.ok) {
        // Stop polling on 404 (job not found) or other critical errors
        if (response.status === 404) {
          throw new Error(`Job ${jobIdToPoll} nicht gefunden.`);
        }
        throw new Error(`API Fehler (${response.status}) beim Abrufen des Status.`);
      }

      const statusData: ImportStatus = await response.json();
      console.log('[DEBUG] Poll statusData received:', statusData);
      setImportStatus(statusData); // Store detailed status

      // Update state based on API response
      let apiStatusMessage = statusData.status || 'Unbekannter Status';
      if (statusData.status === 'running') {
        apiStatusMessage = `Verarbeite... (${statusData.progress || 0}%)`;
      } else if (statusData.status === 'completed') {
        apiStatusMessage = 'Import abgeschlossen.';
      } else if (statusData.status === 'failed') {
        apiStatusMessage = `Fehlgeschlagen: ${statusData.error || 'Unbekannter Fehler'}`;
      }

      setStatus(apiStatusMessage);
      setProgress(statusData.progress || 0);

      // Backend-Logs formatieren und immer vollständig ersetzen
      const backendLogs = (statusData.logs || []).map(
        (log: LogEntry) =>
          `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.level.toUpperCase()}: ${log.message}`
      );
      // Set logs, keeping the latest ones first
      setLogs(backendLogs.reverse()); // Reverse to show latest at the bottom in textarea

      // --- Extract Processed Kita Names from Backend Logs ---
      const processedKitaNames = (statusData.logs || [])
        .map((log: LogEntry) => {
          // Look for the "Extracted" message pattern
          const match = log.message.match(/-> Extracted:\s*(.*?)\s*\(/);
          return match ? match[1].trim() : null; // Extract name if match found
        })
        .filter((name): name is string => name !== null); // Filter out nulls and ensure type is string

      // Use a Set to store unique names and maintain insertion order roughly
      // Update the state with unique names found so far
      setImportedKitas(prev => {
        const updatedSet = new Set([...prev, ...processedKitaNames]);
        return Array.from(updatedSet);
      });
      // --- End Extraction ---

      // Check if polling should continue
      const isDone = statusData.status === 'completed' || statusData.status === 'failed';

      if (isDone) {
        console.log(`[DEBUG] Job ${jobIdToPoll} finished with status: ${statusData.status}. Stopping poll.`);
        setIsLoading(false);
        addLog(`Frontend: Polling beendet. Status: ${statusData.status}`);
        if (isDryRun) {
          fetchResults(jobIdToPoll); // Fetch results for the completed job
        }
        // Clear the timeout ref just in case (shouldn't be necessary here)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
      } else {
        // Schedule the next poll
        console.log(`[DEBUG] Job ${jobIdToPoll} still running. Scheduling next poll.`);
        // Clear previous timeout before setting a new one
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(pollStatus, 3000); // Poll again after 3 seconds
      }

    } catch (error) {
      console.error('[DEBUG] Error caught during pollStatus execution:', error);
      setStatus('Fehler beim Abrufen des Status.');
      addLog(`ERROR polling status: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setIsLoading(false); // Stop loading on error
      // Clear timeout ref on error
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
      }
    }
  };

  // fetchResults also needs to use the correct Job ID if called
  const fetchResults = async (jobIdToFetch: string) => {
      if (!jobIdToFetch) {
          console.error('[DEBUG] fetchResults called without a valid jobId.');
          return;
      }
      addLog(`Frontend: Rufe Ergebnisse für Testlauf ab (Job ID: ${jobIdToFetch})`);
      try {
         // --- Actual API Call ---
         const response = await fetch(`${API_BASE_URL}/results/${jobIdToFetch}`); // Use the passed jobId
         if (!response.ok) {
              throw new Error(`API Fehler (${response.status}) beim Abrufen der Ergebnisse.`);
        }
        const resultsData: KitaResult[] = await response.json(); // Use KitaResult[]
         // --- End API Call ---

       setResults(resultsData || []); // Use the actual resultsData from API
       addLog(`Frontend: Testlauf-Ergebnisse geladen (${(resultsData || []).length} Einträge).`); // Adjusted log message
       console.log('Testlauf Ergebnisse:', resultsData); // Ausgabe im Browser-Log zur Prüfung
    } catch (error) {
      console.error('Error fetching results:', error); // Removed (simulated)
      addLog(`ERROR fetching results: ${error instanceof Error ? error.message : String(error)}`, 'error'); // Removed (sim)
    }
  };

  // Helper to add logs with timestamp in the frontend
  const addLog = (message: string, level: 'info' | 'error' = 'info') => {
      const timestamp = new Date().toLocaleTimeString();
      // Prepend new logs to show the latest first in the Textarea
      setLogs(prev => [`[${timestamp}] ${level.toUpperCase()}: ${message}`, ...prev]);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Kita-Daten Import</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- Configuration Card --- */}
        <Card>
          <CardHeader>
            <CardTitle>Import Konfiguration</CardTitle>
            <CardDescription>
              Wähle Bundesland, Bezirke und Limit für den Import von kita.de.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bundesland Select */}
            <div className="space-y-2">
              <Label htmlFor="bundesland">Bundesland</Label>
              <Select
                onValueChange={handleBundeslandChange} // This function now sets both name and URL state
                value={selectedBundeslandUrl ?? 'none'} // Control Select with the URL/value state
                disabled={isLoading || GERMAN_STATES.length === 0}
              >
                <SelectTrigger id="bundesland">
                  <SelectValue placeholder="Bundesland auswählen..." />
                </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="none">Bitte auswählen...</SelectItem>
                   {/* Map directly over GERMAN_STATES */}
                   {GERMAN_STATES.map((state) => (
                     // Key is the unique value (slug)
                     // Value passed to onValueChange is the value (slug)
                     <SelectItem key={state.value} value={state.value}>
                       {state.label} {/* Display the label */}
                     </SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bezirk Checkbox List */}
            {/* Show this section based on selectedBundeslandName for UI consistency */}
            {selectedBundeslandName && (
              <div className="space-y-2">
                <Label>Bezirke für {selectedBundeslandName}</Label>
                {/* Filter Input */}
                <Input
                  type="text"
                  placeholder="Bezirk filtern..."
                  value={bezirkFilter}
                  onChange={(e) => setBezirkFilter(e.target.value)}
                  className="mb-2"
                  disabled={isLoading || bezirke.length === 0}
                />
                {bezirke.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
                    {/* Filter bezirke before mapping */}
                    {bezirke
                      .filter(bezirk =>
                        bezirk.name.toLowerCase().includes(bezirkFilter.toLowerCase())
                      )
                      .map((bezirk) => (
                      <div key={bezirk.url} className="flex items-center space-x-2">
                        <Checkbox
                          id={bezirk.url}
                          checked={selectedBezirkeUrls.includes(bezirk.url)}
                          onCheckedChange={(checked) => handleBezirkChange(checked, bezirk.url)}
                          disabled={isLoading}
                        />
                        <Label htmlFor={bezirk.url} className="font-normal">
                          {bezirk.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? 'Lade Bezirke...' : 'Keine Bezirke für dieses Bundesland gefunden oder Filter zu spezifisch.'}
                  </p>
                )}
              </div>
            )}

            {/* Kita Limit Input */}
            <div className="space-y-2">
              <Label htmlFor="kitaLimit">Maximale Kitas pro Bezirk</Label>
              <Input
                id="kitaLimit"
                name="kitaLimit"
                type="number"
                value={kitaLimit}
                onChange={handleLimitChange}
                min="1"
                disabled={isLoading}
              />
            </div>
            {/* --- Dry Run Checkbox --- */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="dryRun"
                checked={isDryRun}
                onCheckedChange={(checked) => setIsDryRun(Boolean(checked))} // Update state on change
                disabled={isLoading}
              />
              <Label htmlFor="dryRun" className="font-normal">
                Testlauf (Dry Run) - Kitas nur auslesen, nicht speichern
              </Label>
            </div>
            {/* --- End Dry Run Checkbox --- */}
          </CardContent>
          <CardFooter className="flex justify-start"> {/* Changed alignment */}
            {/* --- Single Start Button --- */}
            <Button
                onClick={() => startImport(isDryRun)} // Pass the state of the checkbox
                disabled={isLoading || selectedBezirkeUrls.length === 0 || kitaLimit <= 0}
                className="w-full md:w-auto" // Adjust width for responsiveness
            >
              Import starten
            </Button>
          </CardFooter>
        </Card>

        {/* --- Status & Logs Card --- */}
        <Card>
          <CardHeader>
            <CardTitle>Import Status & Logs</CardTitle>
            <CardDescription>
              Live-Fortschritt und Meldungen des Import-Prozesses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <p className="text-sm font-medium">{status}</p>
              {isLoading && <Progress value={progress} className="w-full mt-2" />}
            </div>
            <div>
              <Label htmlFor="logs">Logs</Label>
              <Textarea
                 id="logs"
                 readOnly
                 value={logs.join('\n')}
                 className="h-64 font-mono text-xs" // Increased height
                 placeholder="Logs werden hier angezeigt..."
               />
            </div>
            {isDryRun && results.length > 0 && (
               <div>
                 <Label>Testlauf Ergebnisse (Vorschau)</Label>
                 <Textarea
                  id="results"
                  readOnly
                  value={JSON.stringify(results, null, 2)}
                  className="h-64 font-mono text-xs" // Increased height
                  placeholder="Ergebnisse des Testlaufs..."
                 />
                </div>
             )}

             {/* Changed Label and description for clarity */}
             {importedKitas && importedKitas.length > 0 && (
               <div>
                 <Label>Verarbeitete Kitas (aus Logs)</Label>
                 {/* Display processed Kitas */}
                 <Textarea
                   id="processedKitas"
                   readOnly
                   value={importedKitas.join('\n')} // Join the unique names
                   className="h-32 font-mono text-xs" // Adjusted height
                   placeholder="Verarbeitete Kita-Namen erscheinen hier..."
                 />
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;
