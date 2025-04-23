men# System Patterns – kita.de Plattform

**Version:** 1.0  
**Stand:** April 2025

---

## Architekturübersicht

- **Frontend:** React + TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend:** Node.js + Express (Import-Service)
- **Datenbank:** Supabase (Postgres)
  - **Client-Strategie:** Es werden zwei getrennte Supabase-Clients verwendet:
    - **Frontend-Client:** `src/integrations/supabase/client.ts` nutzt den `ANON_KEY` für öffentliche Lesezugriffe und Operationen, die den RLS-Policies unterliegen.
    - **Backend-Client (Service Role):** `server/src/supabaseServiceRoleClient.ts` nutzt den `SERVICE_ROLE_KEY` für privilegierte Backend-Operationen (z.B. Storage-Uploads, DB-Schreibzugriffe unter Umgehung von RLS).
- **Containerisierung:** Docker, docker-compose (derzeit deaktiviert, siehe `progress.md`)
- **Kommunikation:** HTTP, REST-APIs

---

## Design- & Architektur-Patterns

- **Component-based UI:** Wiederverwendbare React-Komponenten (KitaCard, JobCard, Filter, Tabs)
- **State Management:**
  - React Query für Server State (Daten holen, Caching)
  - React Context für globale App-States (Favoriten, User)
- **Routing:** React Router (Client-seitig)
- **Styling:** Utility-First mit Tailwind, Design-System via Shadcn UI
- **Backend-Import-Service:**
  - Modular (Scraper, Parser, Mapper, Services)
  - API-Endpunkte für Import-Status, Start, Ergebnisse
  - Statusverwaltung im Speicher
  - **Robuste Extraktion:** Einsatz dedizierter, robuster Extraktor-Funktionen (z.B. `extractAddress`) anstelle von komplexen Fallbacks oder Regex, um die Zuverlässigkeit der Datenextraktion zu erhöhen.
  - **Konsistentes Logging:** Gezieltes und klares Logging von Erfolgen, Fehlern (z.B. übersprungene Datensätze) und extrahierten Daten zur Verbesserung der Nachvollziehbarkeit und Fehlersuche.
  - **HTML-Formatierung erhalten:** Übernahme von HTML-Inhalten für bestimmte Felder (z.B. Beschreibungen) zur Beibehaltung der Formatierung für das Frontend.
- **Datenformatierung & Anzeige (Frontend):**
  - **Zentrale Hilfsfunktionen:** Nutzung von Utility-Funktionen (z.B. in `src/utils/dataFormatUtils.ts`) für konsistente Datenformatierung und -darstellung.
  - **Konsistente Zufallsbilder (Kita Cover):** Einsatz der Funktion `getDisplayCoverImageUrl` (`dataFormatUtils.ts`) in allen relevanten Kita-Komponenten (`KitaCard`, `FeaturedKitaCard`, `HorizontalKitaCard`, `KitaDetailHeader`). Diese Funktion liefert entweder das spezifische Kita-Bild oder ein konsistent pro Kita ausgewähltes Zufallsbild aus `/public/images/kitas/` als Fallback, um visuelle Abwechslung zu gewährleisten.
- **Containerisierung:**
  - Frontend & Backend als separate Docker-Container
  - Gemeinsames Netzwerk, Hot Reload, Healthchecks
  - **Wichtiges Pattern:** Die Ports in Dockerfile (EXPOSE), docker-compose (ports) und im Node/Express-Server müssen exakt übereinstimmen (z.B. 3002). Healthchecks und API-Endpoints müssen auf den gleichen Port zeigen. Abweichungen führen dazu, dass der Service von außen nicht erreichbar ist oder Healthchecks fehlschlagen. (Wiederkehrender Stolperstein!)
- **Admin-Bereich:**
  - Dediziertes Layout, Sidebar-Navigation
  - Formulare mit react-hook-form + zod
  - Upload-Komponenten für Bilder
  - Wiederverwendbare Komponenten für Listen, Tags, Dialoge
- **Vollständige Datenkette (Frontend):** Um Daten aus der Datenbank im Frontend anzuzeigen, muss sichergestellt sein, dass:
  1. Die Daten in der Datenbank vorhanden sind.
  2. Die API-Abfrage (z.B. `fetchCompanyById`) die Felder explizit abfragt (`select`).
  3. Der Frontend-Mapper (z.B. `mapToCompany`) die abgefragten Daten korrekt in das Frontend-Objekt überträgt.
  4. Die Frontend-Komponente die Daten aus dem Objekt tatsächlich anzeigt. Ein Bruch an einer Stelle dieser Kette führt dazu, dass Daten nicht sichtbar sind.
  - **Layout-Pattern:** Öffentliche Seiten rendern `<Navbar />` und `<Footer />` individuell in ihrer Haupt-JSX-Struktur. Admin-Seiten verwenden ein separates `<AdminLayout />`.
- **Typ-Synchronisation (Supabase):** Bei Diskrepanzen zwischen Datenbank-Schema und Frontend-Typen (z.B. `src/types/company.ts`) müssen die Frontend-Typen an die Datenbank angepasst werden. Die generierten Supabase-Typen (`src/integrations/supabase/types.ts`) dienen als Referenz. Bei Bedarf müssen Komponenten, die die angepassten Typen verwenden, ebenfalls aktualisiert werden (z.B. durch Hinzufügen von Typprüfungen `Array.isArray()` oder Anpassung von Logik).

---

## Komponentenbeziehungen

- **Kita-Suche** nutzt **KitaCard**, Filter-Komponenten, Karten-Komponenten
 - **Kita-Detail** nutzt Tabs: Über uns, Jobs, Galerie, Premium
- **Jobbörse** nutzt JobCard, Filter, Detailansicht
- **Matching** nutzt Formular, Ergebnisliste, Favoriten
- **E-Learning** nutzt Kurslisten, Detail, Fortschritt, Zertifikate
- **Admin** nutzt Tabellen, Formulare, Uploads, Statusanzeigen
- **Import-Service** wird vom Admin-Bereich angesteuert
- **Kinderwelt** nutzt Katalogseite (`KinderweltKatalogPage`), Detailseite (`KinderweltStoryPage`), Vorschaukarte (`StoryCard`), Hero-Bereich (`KinderweltHero`), Generierungsformular (`StoryGeneratorForm`), Sidebar (`RelatedStoriesSidebar`).

---

## Kinderwelt Architektur

- **Frontend:**
  - Eigene Seiten (`/kinderwelt`, `/kinderwelt/:slug`) und Komponenten (`src/components/kinderwelt/`).
  - Datenabruf und -mutation (Generierung) via React Query (`useQuery`, `useMutation`) und `kinderweltService.ts`.
  - Anzeige von Markdown-Inhalten mit `react-markdown` und `remark-gfm`.
  - Layout mit individueller Einbindung von `Navbar` und `Footer`. Detailseite mit 2-Spalten-Layout (Hauptinhalt + Sidebar).
- **Backend:**
  - Eigener Router (`kinderweltRoutes.ts`) unter `/api/kinderwelt`.
  - Endpunkte für Katalog (`GET /`), Detail (`GET /:slug`), Generierung (`POST /generate-and-save`).
  - Service (`kinderweltDbService.ts`) für Datenbankoperationen auf `stories`-Tabelle (Supabase).
  - Service (`openaiService.ts`) zur Kommunikation mit OpenAI API (Chat Completions) für Titel- und Textgenerierung (Markdown).
  - Verwendung von `slugify` zur URL-Generierung.
- **Datenfluss (Generierung):**
  1. Frontend (`StoryGeneratorForm`) sendet Prompt an Backend (`POST /generate-and-save`).
  2. Backend (`kinderweltRoutes.ts`) ruft `openaiService.generateStory` auf.
  3. `openaiService` sendet Prompt an OpenAI API.
  4. OpenAI antwortet mit Titel und Markdown-Text.
  5. Backend extrahiert Titel, generiert Slug, speichert alles via `kinderweltDbService.createStory` in Supabase (`stories`-Tabelle).
  6. Backend sendet gespeicherte Story als JSON zurück an Frontend.
  7. Frontend (`KinderweltKatalogPage`) invalidiert Query (`stories`) und zeigt neue Story an.

---

## Kritische Implementierungspfade

- **Kita-Import-Flow:** Admin (`/admin/import`) → Backend-API (`/api/import/start`) → Scraper (`kitaDeScraper`) → Status/Logs (`importStatusService`) → Ergebnis
- **Wissens-Import-Flow (Massenimport):** Admin (`/admin/knowledge`) → Backend-API (`POST /api/import/knowledge`) → Service (`knowledgeImportService` mit Paginierung, asynchron) → Status/Logs (`importStatusService`) → Ergebnis (Job-ID)
- **Wissens-Import-Flow (Gezielt):** Admin (`/admin/knowledge`) → Suche (`GET /api/import/knowledge/search`) → Auswahl → Backend-API (`POST /api/import/knowledge/specific`) → Service (`knowledgeImportService` mit IDs, asynchron) → Status/Logs (`importStatusService`) → Ergebnis (Job-ID)
- **Wissens-Admin-Flow:** Liste (`/admin/knowledge-list`, paginiert, Suche, Sortierung) → Bearbeiten-Button → Editierseite (`/admin/knowledge/edit/:postId`) → Formular (`react-hook-form`) → Speichern-Button → Service (`updateKnowledgePost`) → DB Update
- **Kita-Suche:** Filter → API → Ergebnisliste → Detail
- **Job-Flow:** Job-Formular → API → Jobliste → Detail
- **Matching:** Formular → Algorithmus → Ergebnisliste
- **E-Learning:** Kurskauf → Fortschritt → Zertifikat
