# Kita Jobs Hub - Import Server

Dieses Verzeichnis enthält den separaten Node.js/Express-Backend-Server, der für den Import von Kita-Daten von externen Quellen (z.B. `kita.de`) zuständig ist.

## Architektur

Der Server ist als eigenständiges CommonJS-Projekt aufgebaut, um Konflikte mit der ES-Modul-Konfiguration des Haupt-Frontend-Projekts zu vermeiden.

-   **Framework:** Express.js
-   **Sprache:** TypeScript (kompiliert zu CommonJS)
-   **Modulsystem:** CommonJS (`require`/`module.exports`)
-   **Abhängigkeiten:** Werden über `server/package.json` verwaltet.
-   **Konfiguration:** `server/tsconfig.json`

## Struktur

-   `src/`: Enthält den TypeScript-Quellcode.
    -   `server.ts`: Hauptdatei zum Starten des Express-Servers und Definieren der API-Routen.
    -   `services/`: Beinhaltet die Geschäftslogik.
        -   `importService.ts`: Kernlogik für das Scraping von `kita.de` und die Datenverarbeitung.
        -   `importStatusService.ts`: In-Memory-Speicher für den Status und die Logs von Import-Jobs.
-   `dist/`: Enthält den kompilierten JavaScript-Code (wird durch `npm run build` erzeugt).
-   `package.json`: Definiert Abhängigkeiten und Skripte für den Server.
-   `tsconfig.json`: TypeScript-Konfiguration für den Server-Build.

## API Endpunkte

Der Server stellt folgende Endpunkte bereit (standardmäßig auf Port 3001):

-   **`POST /api/import/start`**
    -   Startet einen neuen Import-Job.
    -   **Request Body:** `{ "dryRun": boolean, "config": object }`
        -   `dryRun`: Wenn `true`, werden Daten nur gesammelt, aber nicht gespeichert.
        -   `config`: Objekt mit Import-Einstellungen (z.B. `startLocation`, `batchSize`, `maxKitas`).
    -   **Response (Success):** `202 Accepted` - `{ "jobId": string }`
    -   **Response (Error):** `400 Bad Request`, `500 Internal Server Error`
-   **`GET /api/import/status/:jobId`**
    -   Fragt den Status, Fortschritt und Logs eines laufenden oder abgeschlossenen Jobs ab.
    -   **URL Parameter:** `jobId` (die ID aus dem `/start`-Aufruf).
    -   **Response (Success):** `200 OK` - `{ status: string, progress: number, logs: LogEntry[], error?: string, startTime: number, endTime?: number, isDryRun: boolean }`
    -   **Response (Error):** `404 Not Found`, `500 Internal Server Error`
-   **`GET /api/import/results/:jobId`**
    -   Ruft die gesammelten Daten eines **abgeschlossenen Testlaufs (dry run)** ab.
    -   **URL Parameter:** `jobId`.
    -   **Response (Success):** `200 OK` - `KitaResult[]` (Array der gesammelten Kita-Daten)
    -   **Response (Error):** `404 Not Found` (wenn Job nicht gefunden, kein Testlauf oder nicht abgeschlossen), `500 Internal Server Error`

## Setup & Start

1.  **Abhängigkeiten installieren:**
    ```bash
    cd server
    npm install
    ```
2.  **Entwicklungsmodus (mit Auto-Restart bei Änderungen):**
    ```bash
    cd server
    npm run dev
    ```
    (Dieser Befehl kompiliert zuerst den Code und startet dann den Server mit `nodemon`)
3.  **Produktionsstart:**
    ```bash
    cd server
    npm run build
    npm start
    ```

## Wichtige Hinweise & TODOs

-   Die Scraping-Logik in `importService.ts` (insbesondere die CSS-Selektoren in `extractDetailsFromHtml`) **muss überprüft und an die Live-Struktur von `kita.de` angepasst werden.**
-   Die Supabase-Client-Initialisierung muss korrekt in den Server integriert werden (aktuell auskommentiert in `importService.ts`).
-   Das Job-Status-Tracking (`importStatusService.ts`) ist aktuell nur In-Memory und nicht persistent. Für Produktionsumgebungen sollte eine Datenbanklösung erwogen werden.
-   Geocoding für Adressen ist noch nicht implementiert.
-   Fehlerbehandlung kann weiter verfeinert werden.
