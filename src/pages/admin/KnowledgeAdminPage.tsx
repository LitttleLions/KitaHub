import React, { useState } from 'react';

const KnowledgeAdminPage: React.FC = () => {
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  const [importPreview, setImportPreview] = useState<any[] | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]); // Neuer State für Logs

  const [limit, setLimit] = useState(20); // Default Limit erhöht
  // const [offset, setOffset] = useState(0); // Offset wird nicht mehr verwendet

  const fetchPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      // Korrigiere den Port auf 3000
      const response = await fetch('http://localhost:3000/api/import/knowledge/preview'); 
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setPreviewData(data);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden der Vorschau');
    } finally {
      setLoading(false);
    }
  };

  // Helper zum Loggen
  const addLog = (message: string) => {
    setLogMessages(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const startImport = async (dryRun: boolean) => {
    setImportLoading(true);
    setImportStatus(null);
    setImportPreview(null);
    setLogMessages([]); // Logs zurücksetzen
    // Logge nur Limit
    addLog(`Starte Import (Dry Run: ${dryRun}, Limit: ${limit})...`); 
    try {
      // Korrigiere den Port auf 3000
      const response = await fetch('http://localhost:3000/api/import/knowledge/start', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sende nur limit und dryRun im Body
        body: JSON.stringify({ limit, dryRun }), 
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      // Verwende nur noch dryRun in der Statusmeldung (Offset kommt vom Backend, falls relevant)
      let statusMsg = data.message || `Import abgeschlossen (Dry Run: ${dryRun})`; 
      if (typeof data.count === 'number') {
        // Die Backend-Nachricht enthält bereits die Details, wir können sie direkt verwenden
        // oder die Anzahl hier hinzufügen, falls die Backend-Nachricht generisch ist.
        // Nehmen wir an, die Backend-Nachricht ist spezifisch genug.
        // statusMsg += ` - Verarbeitete Beiträge: ${data.count}`; 
        addLog(`Backend meldet: ${data.count} Beiträge verarbeitet.`);
      } else {
         addLog(`Backend meldet: Import abgeschlossen.`);
      }
      setImportStatus(statusMsg);

      if (dryRun && data.preview && Array.isArray(data.preview)) {
        setImportPreview(data.preview);
        if (data.preview.length > 0) {
          addLog(`Vorschau geladen (${data.preview.length} Beiträge):`);
          data.preview.forEach((post: any) => {
            addLog(`  - ID: ${post.id}, Titel: ${post.title}`);
          });
        } else {
          addLog("Keine Beiträge in der Vorschau gefunden für diese Seite.");
        }
      } else if (!dryRun && typeof data.count === 'number' && data.count > 0) {
          addLog(`Import erfolgreich in Datenbank geschrieben.`);
      } else if (!dryRun) {
          addLog("Keine neuen Beiträge importiert oder Fehler im Backend.");
      }
    } catch (err: any) {
      setImportStatus('Fehler: ' + (err.message || 'Unbekannter Fehler'));
      addLog(`Fehler: ${err.message || 'Unbekannter Fehler'}`);
    } finally {
      setImportLoading(false);
      addLog("Importvorgang beendet.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wissen Import & Vorschau</h1>
      <button
        onClick={fetchPreview}
        className="px-4 py-2 bg-kita-orange text-white rounded hover:bg-kita-orange/90 mb-4"
      >
        Wissen-API Vorschau laden
      </button>

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anzahl Posts (Limit):</label>
          <input
            type="number"
            value={limit}
            min={1}
            max={100} // Max per_page laut WP API Doku
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border px-2 py-1 rounded w-24"
          />
        </div>
        {/* Offset-Feld entfernt */}
      </div>

      <button
        onClick={() => startImport(true)}
        disabled={importLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4 mr-2 disabled:opacity-50"
      >
        {importLoading ? 'Test-Import läuft...' : 'Test-Import (nur lesen)'}
      </button>

      <button
        onClick={() => startImport(false)}
        disabled={importLoading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4 disabled:opacity-50"
      >
        {importLoading ? 'Import läuft...' : 'Import starten (schreiben)'}
      </button>

      {loading && <p>Lade Vorschau...</p>}
      {error && <p className="text-red-500">Fehler: {error}</p>}
      {importStatus && <p className="mt-2">{importStatus}</p>}

      {importPreview && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">Import-Vorschau (Dry Run)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px] text-xs">
            {JSON.stringify(importPreview, null, 2)}
          </pre>
        </div>
      )}

      {/* Log-Bereich */}
      {logMessages.length > 0 && (
         <div className="mt-6">
           <h2 className="font-semibold mb-2">Import Log</h2>
           <pre className="bg-black text-green-400 p-4 rounded overflow-auto max-h-[300px] text-xs font-mono">
             {logMessages.join('\n')}
           </pre>
         </div>
       )}

      {/* API Vorschau (wird seltener gebraucht, daher ans Ende) */}
      {previewData && (
         <div className="mt-6">
           <h2 className="font-semibold mb-2">API Rohdaten-Vorschau</h2>
           <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px]">
             {JSON.stringify(previewData, null, 2)}
           </pre>
         </div>
       )}
    </div>
  );
};

export default KnowledgeAdminPage;
