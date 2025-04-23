import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Interface für die API-Antwort (angepasst an den neuen Endpunkt)
interface StartKnowledgeImportResponse {
    message: string;
    processedPosts?: number;
    upsertedPosts?: number;
    dryRun: boolean;
    preview?: { id: number; title: string }[];
}

const KnowledgeAdminPage: React.FC = () => {
  // State für API-Vorschau
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [errorPreview, setErrorPreview] = useState<string | null>(null);

  // State für den Import-Prozess
  const [importStatus, setImportStatus] = useState<string>('Bereit');
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<StartKnowledgeImportResponse | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Import-Parameter States
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1); // Startseite
  const [totalPagesToFetch, setTotalPagesToFetch] = useState(1); // Anzahl Seiten
  const [isDryRun, setIsDryRun] = useState(true); // Dry Run State for mass import

  // States for Specific Import by Search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{id: number, title: string, slug: string, link: string}[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]); // Store selected post IDs
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [specificImportLoading, setSpecificImportLoading] = useState(false);
  const [specificImportDryRun, setSpecificImportDryRun] = useState(true); // Separate dry run state

  // --- API Vorschau Funktion ---
  const fetchPreview = async () => {
    setLoadingPreview(true);
    setErrorPreview(null);
    try {
      const response = await fetch('http://localhost:3000/api/import/knowledge/preview');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setPreviewData(data);
    } catch (err: any) {
      setErrorPreview(err.message || 'Fehler beim Laden der Vorschau');
    } finally {
      setLoadingPreview(false);
    }
  };

  // --- Helper zum Loggen ---
  const addLog = (message: string) => {
    setLogMessages(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  // --- Import Start Funktion ---
  const startImport = async () => {
    setImportLoading(true);
    setImportStatus('Starte Wissensimport...');
    setImportResult(null);
    setLogMessages([]); // Reset logs
    addLog(`Frontend: Starte Wissensimport (Dry Run: ${isDryRun}) - Seite: ${page}, Limit: ${limit}, Seiten gesamt: ${totalPagesToFetch}`);

    try {
        const response = await fetch('http://localhost:3000/api/import/knowledge', { // Use new endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                limit: limit,
                page: page,
                totalPagesToFetch: totalPagesToFetch,
                dryRun: isDryRun,
            }),
        });

        const data: StartKnowledgeImportResponse = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API Fehler (${response.status})`);
        }

        setImportStatus(data.message);
        setImportResult(data);
        addLog(`Frontend: Wissensimport abgeschlossen. ${data.message}`);

        if (data.preview && data.preview.length > 0) {
            addLog(`Vorschau (Dry Run - erste ${data.preview.length} Posts):`);
            data.preview.forEach(p => addLog(`  - ID: ${p.id}, Titel: ${p.title}`));
        } else if (isDryRun) {
             addLog("Keine Posts in der Vorschau (Dry Run).");
        }

        if (!isDryRun && data.upsertedPosts !== undefined) {
             addLog(`Erfolgreich ${data.upsertedPosts} Posts in die Datenbank geschrieben/aktualisiert.`);
        }

    } catch (error) {
        console.error('Error starting knowledge import:', error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        setImportStatus(`Fehler: ${errorMsg}`);
        addLog(`ERROR starting knowledge import: ${errorMsg}`);
    } finally {
        setImportLoading(false);
        addLog("Importvorgang beendet.");
    }
    // Removed duplicate finally block here
  };

  // --- Handler Functions for Specific Import ---

  const handleSearch = async () => {
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);
    setSelectedPosts([]); // Clear selection on new search
    addLog(`Frontend: Starte Suche nach "${searchTerm}"...`);

    try {
        const response = await fetch(`http://localhost:3000/api/import/knowledge/search?term=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
            throw new Error(errorData.message || `HTTP error ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data);
        addLog(`Frontend: Suche erfolgreich. ${data.length} Ergebnisse gefunden.`);
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('Error searching knowledge posts:', error);
        setSearchError(errorMsg);
        addLog(`ERROR searching knowledge posts: ${errorMsg}`);
    } finally {
        setSearchLoading(false);
    }
  };

  const handleCheckboxChange = (postId: number, isChecked: boolean) => {
    setSelectedPosts(prev =>
        isChecked ? [...prev, postId] : prev.filter(id => id !== postId)
    );
  };

  const handleSpecificImport = async () => {
    if (selectedPosts.length === 0) return;

    setSpecificImportLoading(true);
    // Use the main import status/log for feedback
    setImportStatus(`Starte spezifischen Import für ${selectedPosts.length} Posts...`);
    setImportResult(null);
    // Optionally clear main logs or add a separator
    addLog("--- Starting Specific Import ---");
    addLog(`Frontend: Starte spezifischen Import (Dry Run: ${specificImportDryRun}) für IDs: ${selectedPosts.join(', ')}`);

    try {
        const response = await fetch('http://localhost:3000/api/import/knowledge/specific', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postIds: selectedPosts,
                dryRun: specificImportDryRun,
            }),
        });

        // Specific import endpoint responds with 202 and jobId immediately
        const data = await response.json();

        if (!response.ok) {
             // Try to get more specific error message from response body if possible
            throw new Error(data.message || `API Fehler (${response.status})`);
        }

        setImportStatus(data.message + ` (Job ID: ${data.jobId})`); // Update status with Job ID
        addLog(`Frontend: Spezifischer Import gestartet. Job ID: ${data.jobId}. Status prüfen (falls implementiert) unter: ${data.statusUrl}`);
        // Reset search/selection after starting import? Optional.
        // setSearchResults([]);
        // setSelectedPosts([]);

    } catch (error) {
        console.error('Error starting specific knowledge import:', error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        setImportStatus(`Fehler beim Starten des spezifischen Imports: ${errorMsg}`);
        addLog(`ERROR starting specific knowledge import: ${errorMsg}`);
    } finally {
        setSpecificImportLoading(false);
         addLog("Spezifischer Importvorgang (Start) beendet.");
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold">Wissen Import & Vorschau</h1>

      {/* Import Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Import Konfiguration (WordPress)</CardTitle>
          <CardDescription>
            Konfiguriere und starte den Import von Wissensbeiträgen von kita.de/wissen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="knowledgePage">Startseite</Label>
              <Input
                id="knowledgePage"
                type="number"
                value={page}
                onChange={(e) => setPage(parseInt(e.target.value, 10) || 1)}
                min="1"
                disabled={importLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="knowledgeLimit">Posts pro Seite</Label>
              <Input
                id="knowledgeLimit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value, 10) || 1)}
                min="1"
                max="100" // WP API limit
                disabled={importLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="knowledgeTotalPages">Seiten gesamt</Label>
              <Input
                id="knowledgeTotalPages"
                type="number"
                value={totalPagesToFetch}
                onChange={(e) => setTotalPagesToFetch(parseInt(e.target.value, 10) || 1)}
                min="1"
                disabled={importLoading}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="knowledgeDryRun"
              checked={isDryRun}
              onCheckedChange={(checked) => setIsDryRun(Boolean(checked))}
              disabled={importLoading}
            />
            <Label htmlFor="knowledgeDryRun" className="font-normal">
              Testlauf (Dry Run) - Beiträge nur lesen, nicht speichern
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={startImport}
            disabled={importLoading || limit <= 0 || page <= 0 || totalPagesToFetch <= 0}
          >
            {importLoading ? 'Importiere...' : 'Wissensimport starten'}
          </Button>
        </CardFooter>
      </Card>

      {/* Import Status & Results Card */}
      <Card>
        <CardHeader>
            <CardTitle>Import Status & Ergebnis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label>Status</Label>
                <p className="text-sm font-medium">{importStatus}</p>
            </div>
            {importResult && (
                <div>
                    <Label>Ergebnis Details</Label>
                    <Textarea
                        readOnly
                        value={JSON.stringify(importResult, null, 2)}
                        className="mt-1 h-32 font-mono text-xs"
                        placeholder="Details des letzten Imports..."
                    />
                </div>
            )}
             {/* Log-Bereich */}
            {logMessages.length > 0 && (
                <div>
                    <Label htmlFor="importLogs">Import Log</Label>
                    <Textarea
                        id="importLogs"
                        readOnly
                        value={logMessages.join('\n')}
                        className="mt-1 h-64 font-mono text-xs bg-black text-green-400"
                        placeholder="Logs werden hier angezeigt..."
                    />
                </div>
            )}
        </CardContent>
      </Card>

      {/* API Preview Card */}
      <Card>
        <CardHeader>
            <CardTitle>API Rohdaten-Vorschau</CardTitle>
            <CardDescription>Zeigt die ersten 5 Posts direkt von der WordPress API.</CardDescription>
        </CardHeader>
        <CardContent>
            {loadingPreview && <p>Lade Vorschau...</p>}
            {errorPreview && <p className="text-red-500">Fehler: {errorPreview}</p>}
            {previewData && (
                <Textarea
                    readOnly
                    value={JSON.stringify(previewData, null, 2)}
                    className="mt-1 h-96 font-mono text-xs"
                />
            )}
        </CardContent>
        <CardFooter>
            <Button
                onClick={fetchPreview}
                disabled={loadingPreview}
                variant="outline"
            >
                {loadingPreview ? 'Lade...' : 'API Vorschau laden'}
            </Button>
        </CardFooter>
      </Card>

      {/* Specific Import Card */}
      <Card>
        <CardHeader>
          <CardTitle>Gezielter Import nach Stichwort</CardTitle>
          <CardDescription>
            Suche nach Beiträgen auf kita.de/wissen und importiere ausgewählte Posts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex space-x-2">
            <div className="flex-grow space-y-1">
              <Label htmlFor="searchTerm">Suchbegriff</Label>
              <Input
                id="searchTerm"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="z.B. Schwangerschaft, Eingewöhnung..."
                disabled={searchLoading || specificImportLoading}
              />
               <p className="text-xs text-gray-500 pt-1">Für exakte Titelsuche: Begriff in Anführungszeichen setzen (z.B. "Eltern").</p>
            </div>
            <Button onClick={handleSearch} disabled={searchLoading || !searchTerm.trim()} className="self-end">
              {searchLoading ? 'Suche...' : 'Suchen'}
            </Button>
          </div>

          {/* Search Results */}
          {searchError && <p className="text-red-500 text-sm">Fehler bei der Suche: {searchError}</p>}
          {searchResults.length > 0 && (
            <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
              <Label>Suchergebnisse:</Label>
              {searchResults.map((post) => (
                <div key={post.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`select-post-${post.id}`}
                    checked={selectedPosts.includes(post.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(post.id, Boolean(checked))}
                  />
                  <Label htmlFor={`select-post-${post.id}`} className="font-normal text-sm flex-grow">
                    {post.title} (ID: {post.id}, Slug: {post.slug})
                  </Label>
                   <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Link</a>
                </div>
              ))}
            </div>
          )}
           {searchResults.length === 0 && !searchLoading && searchTerm && !searchError && (
             <p className="text-sm text-gray-500">Keine Ergebnisse für "{searchTerm}" gefunden.</p>
           )}

          {/* Specific Import Options */}
          {selectedPosts.length > 0 && (
             <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="specificDryRun"
                  checked={specificImportDryRun}
                  onCheckedChange={(checked) => setSpecificImportDryRun(Boolean(checked))}
                  disabled={specificImportLoading}
                />
                <Label htmlFor="specificDryRun" className="font-normal">
                  Testlauf (Dry Run) für ausgewählte Posts
                </Label>
              </div>
          )}

        </CardContent>
         {selectedPosts.length > 0 && (
            <CardFooter>
              <Button
                onClick={handleSpecificImport}
                disabled={specificImportLoading || selectedPosts.length === 0}
              >
                {specificImportLoading ? 'Importiere Auswahl...' : `Importiere ${selectedPosts.length} ausgewählte Posts`}
              </Button>
            </CardFooter>
         )}
      </Card>

    </div>
  );
};

export default KnowledgeAdminPage;
