Product Requirements Document (PRD) – kita.de Plattform

Version: 1.0
Datum: 01.04.2025
Projektleitung: Team kita.de
1. Überblick & Zielsetzung

kita.de ist eine der größten Kita-Suchplattformen in Deutschland mit über 50.000 Einträgen und Millionen Besuchern pro Jahr. Das Ziel ist es, ein zentrales, modernes Portal rund um das Thema frühkindliche Bildung, Betreuung und Familienorganisation zu sein – mit Suchfunktion, Content, digitalen Services und Monetarisierungsmodellen.

Dieses PRD dokumentiert die aktuellen und geplanten Funktionsbereiche der Plattform.
2. Module & Funktionen
2.1 Startseite

Ziel: Direkter Einstieg in Suche, Content und Tools für Eltern & Fachkräfte

Funktionen:

    Header mit Navigation: Kitas, Wissen, Jobbörse, Kurse, Matching

    Hero-Bereich mit CTA-Buttons (z. B. „Jetzt Kita finden“)

    Kita-Suchfeld mit Ort/Postleitzahl + Autofill

    Teaserblöcke für: Ratgeber, Jobangebote, E-Learning, News

    Statistik-Bereich: Anzahl Kitas, Träger, Kurse

    Footer mit Quicklinks & rechtlichen Informationen

2.2 Kita-Suche & Listenansicht

Ziel: Strukturierte, leicht navigierbare Suche nach Kindertageseinrichtungen

Funktionen:

    Filter: Ort/Umkreis, Konzept, Träger, Öffnungszeiten, Sprachprofil

    Liste mit Kartenansicht, paginiert

    Jede Kita-Karte mit: Name, Adresse, Kurzprofil, ggf. Premium-Badge

    Interne Verlinkung zur Detailseite

2.3 Kita-Detailseiten (inkl. Premium-Option)

Ziel: Darstellung der Einrichtungsinformationen, plus Sichtbarkeits-Upgrade für Träger

Standard-Features:

    Name, Adresse, Träger, Kontakt

    Beschreibung & pädagogisches Konzept

    Öffnungszeiten, Altersgruppe

    Verlinkung auf Google Maps

Premium-Features:

    Logo & Fotogalerie

    Video-Integration (z. B. Kita-Tour)

    Verlinkung zu Jobanzeigen der Einrichtung

    Highlight in Suchergebnissen („Premium Kita“)

    Träger-Dashboard mit Statistikzugang

2.4 Jobbörse

Ziel: Vermittlung pädagogischen Fachpersonals direkt durch Träger

Funktionen für Arbeitgeber:

    Konto mit Login

    Inseratsformular mit Feldern: Titel, Beschreibung, Anforderungen, Beginn, Gehalt

    Anbindung an bestehendes Kita-Profil

    Buchbare Laufzeitoptionen (30/90/365 Tage)

    Rechnungsfunktion (Stripe/Paypal)

    Paketangebote (z. B. 5er-Paket, Flatrate)

Funktionen für Bewerber:innen:

    Suchfunktion: Region, Beruf, Arbeitszeit

    Detailansicht mit Kontaktmöglichkeit

    Merkliste

    E-Mail-Alert für neue Jobs

2.5 E-Learning-Bereich

Ziel: Weiterbildung für Fachkräfte & Eltern über Online-Kurse

Funktionen:

    Kursübersicht mit Filter (Thema, Dauer, Preis)

    Kursdetailseiten mit Info, Dozent:in, Video, PDF, Quiz

    Registrierung & Benutzerkonto mit Fortschrittsanzeige

    Teilnahmezertifikat (PDF-Export)

    Bezahlfunktion für Einzelkurse oder Abos

    Kurseditor für Admins (Anlegen, Freigabe, Medienverwaltung)

2.6 Matching-Modul für Eltern (KI-gestützt)

Ziel: Eltern erhalten durch gezielte Eingaben passende Kitas vorgeschlagen

Funktionen:

    Interaktives Formular:
    • Wohnort
    • Betreuungszeit
    • Konzept (z. B. Montessori)
    • Sprachen, Inklusion, Bio-Küche

    Matching-Algorithmus: semantische Filterung nach Kriterien

    Ergebnisliste als individualisierte Treffer

    Highlighting von Premium-Kitas

    Möglichkeit zur Kontaktaufnahme

3. Inhalte & Verbindungen zwischen den Bereichen
Bereich	Verknüpft mit…
Kita-Suche	Detailseite, Matching, Premium, Jobbörse
Premium-Kitas	Kita-Suche (Highlight), Matching (Vorrang), Jobbörse
Jobbörse	Kita-Profile, Startseite-Teaser, Newsletter
Matching	Datenbank, Elternbereich, Premium, Kontaktformular
E-Learning	Nutzerprofil, Newsletter, Trägerbereich
4. Monetarisierungsmöglichkeiten

    Premium-Profile: Sichtbarkeitspakete für Kitas (monatlich oder jährlich)

    Jobbörse: Bezahlte Stellenanzeigen mit Flatrates oder Paketen

    E-Learning: Kursgebühren, Weiterbildungsabos

    Matching: Premium-Platzierung für passende Kitas

    Affiliate-Links & Werbung: z. B. Produktvergleiche für Eltern

5. UI/UX-Vorgaben (plattformweit)

    Mobile First

    Klar strukturierte Navigation

    Farbwelt: warm, familiennah, professionell

    Einheitliches Icon-Set & Komponenten-Design

    CMS: WordPress als Backend-Basis

    Tracking: DSGVO-konformes Event-Tracking (GA4)



Technical Description of Current Implementation

Here's a detailed technical description of the current implementation:

Architecture Overview: The kita.de platform is a React-based web application built with modern front-end technologies. It follows a component-based architecture with several key modules including Kita search, Job board, Matching system, and E-Learning.

Technology Stack:

    Frontend Framework: React with TypeScript
    Routing: React Router for client-side navigation
    State Management: React Query for server state, React Context for application state
    Styling: Tailwind CSS with custom theming
    UI Components: Shadcn UI library for consistent design
    Data Fetching: Supabase integration for database access

Key Modules:

    Kita Search System:
        Interactive search interface with filtering by location, bundesland, and keywords
        Results display with card-based UI showing premium listings first
        Detailed profile pages with gallery, information tabs, and contact options

    Job Board:
        Search interface with multiple filters (location, job type, experience level)
        Job listing cards with company information
        Detail pages with comprehensive job descriptions
        Application tracking for registered users

    Matching Module:
        Preference collection form with weighted criteria
        Algorithm to match parent requirements with Kita attributes
        Results page with sorting by match score and premium status
        Favorites functionality to save preferred matches
        Mobile-responsive design for all interfaces

    E-Learning Platform:
        Course catalog with filtering
        Learning progress tracking
        Certificate generation
        Integrated payment system

Data Structure:

    Companies/Kitas: Comprehensive profiles with location, pedagogy, and media. See [Companies Table Structure Documentation](./companies_table_structure.md) for details on how Kita-specific data is stored.
    Jobs: Detailed listings linked to company profiles. See [Jobs Table Structure Documentation](./jobs_table_structure.md) for details.
    Image Handling: Images for dynamic content (like Kitas) are referenced via URLs (`logo_url`, `cover_image_url`, `gallery`) stored in the database. Static images for theme elements and placeholders are stored locally (primarily in `/public/images/static/` and `/public/images/kitas/`). Frontend components include error handling to display placeholders (e.g., `/public/placeholder.svg`) for missing or broken image links. See [Image Usage Specification](./image_usage_specification.md) for detailed implementation and conventions.
    Users: Authentication and personalization data
    Courses: E-learning content structure

Integration Points:

    Supabase database for all data storage and retrieval
    Custom services layer to abstract data access
    Context providers for shared state (favorites, user preferences)

### Current Implementation Details for Key Features

Based on code analysis (April 2025), here's a summary of how key features are implemented:

**1. Kita Search & Detail View:**

*   **Data Source:** Kita data is stored in the `public.companies` table. There is no separate `kitas` table in the `public` schema.
*   **Search/List View (e.g., `/kitas`):**
    *   Likely uses a function like `fetchCompanies` to retrieve a list of Kitas.
    *   Filters are applied based on user input (location, etc.).
    *   Results are displayed using the `KitaCard.tsx` component.
*   **Detail View (`/kita/:id` and `/company/:id` -> `src/pages/KitaDetail.tsx`):**
    *   The routes `/kita/:id` and `/company/:id` both render the `KitaDetail.tsx` component.
    *   Fetches specific Kita data using `fetchCompanyById(id)` from the `companies` table (via `companyDetailService`).
    *   Fetches associated jobs using `fetchJobsByCompanyId(id)` from the `jobs` table (via `jobService`).
    *   Uses a tabbed interface (`Über uns`, `Stellenangebote`, `Galerie`, `Bewertungen`).
    *   Delegates display logic to sub-components in `src/components/kitas/detail/`:
        *   `KitaAboutTab.tsx`: Shows basic info, `description`, and `benefits` (JSONB array of strings).
        *   `KitaPremiumSection.tsx`: Shows premium fields (`video_url`, `special_pedagogy`, `certifications`, `awards` - last two are JSONB arrays of strings).
        *   `KitaJobsTab.tsx`: Displays fetched jobs.
        *   `KitaGalleryTab.tsx`: Displays images from the `gallery` field (JSONB array of strings).

**2. Job Search & Detail View:**

*   **Data Source:** Job data comes from `public.jobs`, linked via `company_id` to `public.companies`.
*   **Search/List View (`/jobs` -> `src/pages/JobBoard.tsx`):**
    *   Uses `fetchJobs` with filters for keyword (`q`), `location`, and `type`.
    *   Displays results via `JobList.tsx`, which uses `JobCard.tsx`.
    *   `JobCard.tsx` shows key fields: `title`, `location`, `type`, `salary`, `posted_date`, `kita_image_url`, and linked `company.name`, `company.logo_url`.
*   **Detail View (`/jobs/{id}` -> `src/pages/JobDetail.tsx`):**
    *   Fetches specific job data (including linked company) using `fetchJobById(id)`.
    *   Displays highlights (`type`, `location`, `experience`, `education`).
    *   Shows `description` (HTML), `requirements` (JSONB array of strings), and `benefits` (JSONB array of strings).
    *   Includes company contact details and a link to the company profile.

### Potential Code Consolidation Opportunities

Analysis of the standard Kita search (list-based) and the Kita radius search (map-based) reveals potential areas for code consolidation to reduce duplication and improve maintainability:

1.  **Filter Components:** The filter logic and UI elements used in `src/components/kitas/KitaSearchForm.tsx` (standard search) and `src/components/kitas/map-search/SearchFilters.tsx` (radius search) share significant overlap (e.g., care type, opening hours, sponsor, concept). Consider extracting common filter elements and logic into a shared, reusable component or hook to ensure consistency and simplify updates.
2.  **Results Display & Kita Card:** Both `src/components/kitas/KitaSearchResults.tsx` (standard search results) and `src/components/kitas/map-search/ResultsList.tsx` (radius search results list) display lists of Kitas. It is crucial to ensure both components consistently reuse the `src/components/kitas/KitaCard.tsx` component for rendering individual Kita entries. Further investigation could reveal opportunities to consolidate the list-rendering logic itself, although differences in pagination vs. scrolling/map-binding need consideration.

Modulbeschreibungen

Erweiterungsmodule kita.de
1. Modul: Kita-Umkreissuche mit Kartenansicht

Ziel: Eltern sollen schnell und interaktiv Kitas in ihrer Umgebung finden.
Funktion:

    Postleitzahl- oder Ortssuche mit einstellbarem Umkreis

    Filter (Konzept, Öffnungszeiten, Träger etc.)

    Ergebnisliste links, interaktive Karte rechts

    Hover & Klick verbinden Liste und Karte

    Markierung von Premium-Kitas
    Verbindung zu anderen Bereichen:

    Kita-Detailseite, Jobangebote, Matching-Modul

2. Modul: Premium-Kita-Profil & Sichtbarkeit

Ziel: Träger erhalten durch Buchung eines Premium-Profils mehr Sichtbarkeit und Kontrolle über ihre Darstellung.
Funktion:

    Hervorgehobene Platzierung in Suchlisten

    Erweiterte Inhalte auf Detailseite (Bilder, Video, Konzepte)

    Verlinkung zu offenen Stellen

    Statistikzugang für Träger (Views, Klicks)
    Verbindung zu anderen Bereichen:

    Kita-Suche, Jobbörse, Matching-Modul

3. Modul: KI-gestütztes Kita-Matching

Ziel: Eltern finden passende Kitas auf Basis persönlicher Bedürfnisse.
Funktion:

    Interaktives Formular (Ort, Betreuungszeit, Konzept etc.)

    Algorithmus errechnet passende Einrichtungen

    Ergebnisansicht mit Matching-Score

    Optionale Dialogführung (Chatbot)
    Verbindung zu anderen Bereichen:

    Verlinkung zu Kita-Detailseiten

    Premium-Kitas bevorzugt dargestellt

    Optional: Speicherung via Login/Newsletter

11.
Die Menüstruktur für die App sollte immer fest sein:
Startseite

Kita-Suche
→ Untermenü:

    Umkreissuche (mit Karte & Filterfunktionen)

    KI-Matching (persönlicher Suchassistent für Eltern)

Eltern → Untermenü:

    Ratgeber für Eltern

    E-Learning für Eltern

    Kita-Matching (Zweitverlinkung)
    (führt zur gleichen Funktion wie im Menüpunkt 2)

Kitas & Träger → Untermenü:

    Für Arbeitgeber

        Stellenanzeigen schalten

        Premium-Kita-Profil buchen

    Ratgeber für Träger & Leitungen

    E-Learning für Fachkräfte & Teams

Jobbörse → Untermenü:

    Jobs finden

    Jobs inserieren

    Preise & Pakete

eLearning  → Untermenü:

    Alle Kurse

    Meine Lernübersicht

    Zertifikate

Über kita.de → Untermenü:

    Das Team

    Presse

    Kontakt

    Kooperationspartner


🔹 Hauptmodule

1. Startseite

Ziel: Direkter Einstieg in alle Kernbereiche, modernisiert und responsiv

Funktionen:

Suchbox für Kita-Umkreissuche

Prominente CTAs: "Kita finden", "Jobs suchen", "Kurse starten"

Teaser für Jobbörse, E-Learning, Ratgeber

Statistik-Block: Anzahl Kitas, Kurse, aktive Träger

2. Kita-Suche

a) Umkreissuche mit Karte

Funktionalität:

Eingabe von Ort oder PLZ + Umkreisauswahl

Filter (Betreuungsform, Konzept, Trägerart, Sprache, Öffnungszeiten)

Ergebnisliste links, interaktive Karte rechts

Verlinkung zu Kita-Detailseiten

Premium-Kitas oben gelistet mit Badge

b) KI-basiertes Matching für Eltern

Funktionalität:

Interaktives Formular: Kriterien wie Alter, Betreuungszeiten, Konzept, Sprache

Matching-Logik mit Gewichtung

Ergebnisliste mit Matching-Score & Highlighting von Premium-Kitas

Favoriten speichern

3. Kita-Detailseiten & Premium-Profile

Standard-Inhalte:

Name, Adresse, Kontakt, Konzeptbeschreibung

Verlinkung zu Träger, Google Maps

Premium-Erweiterung:

Foto- & Videoeinbindung

Besonderheiten & Auszeichnungen

Verlinkung zu Stellenanzeigen

Statistik-Dashboard für Träger

4. Jobbörse

Für Träger & Einrichtungen:

Login & Inserate-Editor

Buchung von Einzel- oder Paketangeboten

Laufzeit wählbar (30/90/365 Tage)

Für Bewerber:innen:

Filterbare Jobsuche (Ort, Funktion, Arbeitszeit)

Merkliste & Alert-Funktion

5. E-Learning

Funktionalität:

Kursübersicht mit Filter (Zielgruppe, Thema, Preis)

Kursdetailseiten mit Lektionen, Medien, Quiz

Benutzerkonto mit Fortschrittsanzeige & Zertifikat (PDF)

Zugang per Einzelkauf oder Abo-Modell

Admin-Interface zur Kurserstellung

6. Eltern- & Trägerbereiche

Eltern-Menü

Kita-Matching

Kita-Umkreissuche

Ratgeber für Eltern (Erziehung, Betreuung, Rechte)

E-Learning für Eltern

Träger-Menü

Stellenanzeigen schalten

Premium-Kita buchen

Ratgeber für Träger (Leitung, Personal, Recht)

E-Learning für Fachkräfte

📄 Hauptnavigation (fixiert)

Startseite

Kita-Suche

Umkreissuche

Kita-Matching

Eltern

Ratgeber

E-Learning

Kitas & Träger

Arbeitgeber-Angebote

Träger-Ratgeber

E-Learning für Teams

Jobbörse

Jobs finden

Jobs inserieren

Kurse

Kursliste

Zertifikate & Fortschritt

Über kita.de

💡 Design- & UX-Kriterien

Responsive (Mobile First)

Farbwelt: freundlich, warm, vertrauensvoll

Icons für Schnellzugriff (z. B. Kita-Typ, Job-Typ)

Einheitliche Bildsprache

Schnellladende Karten- & Suchfunktion

💼 Monetarisierung

Premium-Einträge für Kitas

Bezahlte Stellenanzeigen (Einzel, Paket, Flatrate)

Kursverkauf / Fortbildungsabos

Affiliate-Links & Advertorials

🔗 Modulverknüpfungen

Modul

Verlinkung zu

Kita-Detailseite

Jobangebote, Trägerprofil, Matching

Jobbörse

Kita-Detailseite, Träger-Dashboard

Matching

Kita-Suche, Premium-Hervorhebung

E-Learning

Eltern- & Trägerbereich, Nutzerkonto

---

## 6. Admin Area (Neu hinzugefügt April 2025)

**Ziel:** Bereitstellung einer zentralen Oberfläche für Administratoren und (später) berechtigte Nutzergruppen (z.B. Kita-Träger) zur Verwaltung von Kern-Daten der Plattform.

**Funktionen (Initial - Basisstruktur):**

*   **Routing:** Eigener Bereich unter `/admin`.
*   **Layout:** Dediziertes Admin-Layout (`src/components/layout/AdminLayout.tsx`) mit fester Sidebar für die Navigation und einem Hauptinhaltsbereich.
*   **Seiten (Platzhalter):**
    *   Dashboard (`/admin` -> `src/pages/admin/AdminDashboard.tsx`): Startseite des Admin-Bereichs.
    *   Kita-Verwaltung (`/admin/kitas` -> `src/pages/admin/AdminKitas.tsx`): Platzhalter für die Liste und Verwaltung von Kitas/Unternehmen.
    *   Job-Verwaltung (`/admin/jobs` -> `src/pages/admin/AdminJobs.tsx`): Platzhalter für die Liste und Verwaltung von Jobs.
*   **Technologie:** Nutzt den bestehenden Frontend-Stack (React, TS, Vite, Shadcn UI, React Router).
*   **Authentifizierung:** Initial **nicht** implementiert, aber die Struktur ist darauf vorbereitet.

**Implementierte Funktionen (Stand: April 2025):**

*   **Kita-Verwaltung (`/admin/kitas`):**
    *   **Listenansicht:** Zeigt eine Tabelle aller Kitas/Unternehmen an, abgerufen von Supabase (`fetchCompanies`). Enthält Spalten für Name, Stadt, Bundesland, Premium-Status und Aktionen (Bearbeiten/Löschen). Lade- und Fehlerzustände werden behandelt (`useQuery`).
    *   **Navigation:** Button "Neue Kita hinzufügen" führt zu `/admin/kitas/new`. Bearbeiten-Button in jeder Zeile führt zu `/admin/kitas/edit/:id`.
    *   **Löschen:** Löschen-Button öffnet einen Bestätigungsdialog (`AlertDialog`). Nach Bestätigung wird die Kita via `deleteCompany` gelöscht und die Liste aktualisiert (`useMutation`, `invalidateQueries`).
    *   **Formular (`/admin/kitas/new`, `/admin/kitas/edit/:id` -> `src/pages/admin/AdminKitaForm.tsx`):**
        *   Nutzt `react-hook-form` und `zod` für Formularlogik und Validierung.
        *   **Implementierte Felder:** Name, Beschreibung, Adresse (Straße, Nr, PLZ, Stadt), Bundesland (Select), Art der Einrichtung (Select), Gründungsjahr, Mitarbeiteranzahl, Webseite, Telefon, E-Mail, Koordinaten (Lat/Lng), Video-URL, Spezielle Pädagogik, Premium-Status (Switch), Logo (Upload), Cover-Bild (Upload), Benefits (Liste), Zertifizierungen (Liste), Auszeichnungen (Liste), Bildergalerie (Multi-Upload).
        *   **Daten laden:** Im Bearbeitungsmodus werden die Daten der Kita via `fetchCompanyById` geladen und das Formular vorausgefüllt.
        *   **Daten speichern:** Beim Absenden werden die Daten via `createCompany` oder `updateCompany` an Supabase gesendet. Erfolgs-/Fehlermeldungen werden via `toast` angezeigt. Bei Erfolg wird zur Listenansicht zurücknavigiert und die Liste invalidiert.
        *   **Bild-Upload:** Logo, Cover und Galeriebilder werden über wiederverwendbare Komponenten (`ImageUploadInput`, `ImageListInput`) zu Supabase Storage (`kita-images-database`) hochgeladen. Pfade sind strukturiert (z.B. `kitas/{id}/logos/...`).
        *   **Listen-Eingabe:** Benefits, Zertifizierungen, Auszeichnungen können über eine wiederverwendbare Komponente (`StringListInput`) als Text-Tags hinzugefügt/entfernt werden.
        *   Slug wird automatisch aus dem Namen generiert (`generateSlug` in `utils.ts`).
    *   **Bekanntes UI-Problem:** Die Bildvorschau in den Upload-Feldern (Logo, Cover, Galerie) zeigt das hochgeladene Bild nur kurz an und verschwindet dann wieder. Die Funktionalität ist davon nicht betroffen.
*   **Job-Verwaltung (`/admin/jobs`):**
    *   **Listenansicht:** Zeigt eine Tabelle aller Jobs an, abgerufen von Supabase (`fetchJobs`). Enthält Spalten für Titel, Unternehmen, Ort, Typ, Veröffentlichungsdatum, Featured-Status und Platzhalter für Aktionen (Bearbeiten/Löschen). Lade- und Fehlerzustände werden behandelt (`useQuery`).
    *   **Navigation:** Button "Neuen Job hinzufügen" führt zu `/admin/jobs/new`. Bearbeiten-Button in jeder Zeile führt zu `/admin/jobs/edit/:id`.
    *   **Formular (`/admin/jobs/new`, `/admin/jobs/edit/:id` -> `src/pages/admin/AdminJobForm.tsx`):**
        *   Grundgerüst erstellt mit `react-hook-form` und `zod`.
        *   Felder für Titel, Unternehmen (Select), Ort, Typ (Select), Gehalt, Beginn, Erfahrung, Bildung, Beschreibung, Featured (Switch), Requirements (Liste), Benefits (Liste), Bild-URL (Upload) sind implementiert.
        *   Lädt Liste der Unternehmen für die Auswahl.
        *   **TODO:** Implementierung der Datenlade- und Speicherlogik (Create/Update/Delete für Jobs).
*   **Daten-Import (`/admin/import` -> `src/pages/admin/AdminImport.tsx`):**
    *   **Ziel:** Ermöglicht das gezielte Importieren von Kita-Daten von externen Quellen (initial `kita.de`).
    *   **Funktionalität (Stand April 2025 - Nach Refactoring):**
        *   **Auswahl:** UI zur Auswahl von Bundesländern (feste Liste) und Bezirken (dynamisch geladen via Backend-API basierend auf Bundesland-Auswahl).
        *   **Limit:** Eingabefeld zur Begrenzung der maximal zu importierenden Kitas pro ausgewähltem Bezirk.
        *   **Modus:** Option für "Testlauf" (nur Daten sammeln) oder "Import" (Daten sammeln und speichern - Speichern noch nicht implementiert).
        *   **Start:** Button zum Starten des Importprozesses. Sendet die ausgewählten Bezirks-URLs und das Limit an den Backend-Import-Service.
        *   **Status & Logs:** Anzeige des Job-Status (z.B. "läuft", "abgeschlossen", "fehlgeschlagen"), des Fortschritts (Prozent) und detaillierter Log-Meldungen vom Backend.
        *   **Ergebnisvorschau:** Anzeige der gesammelten Daten nach einem erfolgreichen Testlauf.
    *   **Technische Umsetzung (aktualisiert April 2025):**
        *   **Frontend:** React-Komponente (`AdminImport.tsx`) mit State Management für UI-Auswahl, Konfiguration und Statusanzeige. Nutzt Fetch API für die Kommunikation mit dem Backend.
        *   **Backend:** Node.js/Express-Server (`server/`), der **vollständig containerisiert** ist.
            *   **Beide Komponenten (Frontend & Backend) laufen als separate Docker-Container**, werden gemeinsam via `docker-compose` gesteuert und sind über ein gemeinsames Netzwerk verbunden.
            *   **API:** Stellt Endpunkte bereit für:
                *   `GET /api/import/bundeslaender`: Liefert feste Liste der Bundesländer.
                *   `GET /api/import/bezirke`: Liefert Bezirke für ein Bundesland (dynamisch via Scraper).
                *   `POST /api/import/start`: Startet den Import für ausgewählte Bezirke mit Limit.
                *   `GET /api/import/status/:jobId`: Gibt Status, Fortschritt und Logs zurück.
                *   `GET /api/import/results/:jobId`: Gibt Ergebnisse eines Testlaufs zurück.
            *   **Logik:** Modular aufgebaut (`services`, `scrapers`, `parsers`, `mappers`). Nutzt `axios` und `cheerio` für das Scraping. Implementiert Retry-Mechanismen und parallele Verarbeitung. Job-Status wird im Arbeitsspeicher verwaltet (`importStatusService`).
            *   **Hot Reload & Healthchecks:** Beide Container unterstützen Hot Reload (Vite bzw. nodemon) und haben Healthchecks für automatische Überwachung.
    *   **TODOs (Import):** CSS-Selektoren im Scraper verfeinern, Supabase-Integration für das Speichern implementieren, Geocoding hinzufügen.

**Geplante Erweiterungen (Allgemein Admin):**

*   Implementierung der **Datenlogik (CRUD)** für Jobs im Admin-Formular.
*   Implementierung der **Löschfunktion** für Jobs.
*   Implementierung des Bereichs für **allgemeine Einstellungen**.
*   Implementierung eines **Authentifizierungs- und Autorisierungssystems**.
 *   Behebung des UI-Problems bei der Bildvorschau.
 *   Implementierung von Geocoding für Koordinaten.
 *   Löschen von Storage-Objekten beim Löschen einer Kita/eines Bildes.

---

## Technische Architektur & Server-Setup

Die gesamte Plattform läuft in der Entwicklungsumgebung **vollständig containerisiert**:

- **Frontend (React + Vite)** und **Backend (Import-Service)** sind separate Docker-Container.
- Beide werden über **docker-compose** gemeinsam gestartet, gestoppt und überwacht.
- Sie kommunizieren über ein gemeinsames Docker-Netzwerk (`kita-net`).
- Hot Reload ist für beide aktiv (Vite bzw. nodemon).
- Healthchecks sorgen für automatische Überwachung und Neustart bei Fehlern.
- Die Container sind so konfiguriert, dass Quellcodeänderungen sofort wirksam werden (Volume-Mounts).
- In Produktion wird empfohlen, einen Reverse Proxy (z.B. nginx) vorzuschalten.

**Ausführliche Details zur Server-Architektur, Docker-Konfiguration, Start- und Steuerungsskripten sowie Entwicklungsumgebung findest du in:**

[→ ServerArchitecture.md](./ServerArchitecture.md)
