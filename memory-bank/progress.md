# Progress – kita.de Plattform

**Version:** 1.3
**Stand:** 15. April 2025

---

## Was funktioniert bereits?

- Frontend mit Suche, Detailseiten, Jobbörse, Matching, E-Learning
- Premium-Profile & Hervorhebung in Suche & Matching
- Admin-Bereich mit Kita-Verwaltung (CRUD, Uploads - *Bild-Upload fehlerhaft*)
- Import-Service: Status-Tracking, Logs, asynchrone Ausführung
- Containerisierte Entwicklung mit Hot Reload & Healthchecks
- Bild-Uploads via Supabase Storage (*Fehlerhaft im Admin-Bereich*)
- Modularer Backend-Service für Import (Struktur und Implementierung vollständig)
- **Alle Service-Dateien im Import-Service (`importService.ts`, `importStatusService.ts`, `knowledgeImportService.ts`) sind jetzt konsistent und idiomatisch in TypeScript umgesetzt. Keine Verwendung von `any`, alle Funktionen und Rückgabewerte explizit typisiert, zentrale Typen werden genutzt.**
- **Wissen-Bereich:** Vollständig implementiert und funktionsfähig (Import, Frontend-Anzeige, Sidebar, Kategorien).
- **Kita-Import (Vollständig modularisiert):**
    - Auswahl von Bundesland/Bezirk im Frontend.
    - Starten des Importprozesses via API.
    - Scraping der Kita-Listen-Seiten (inkl. Paginierung).
    - Scraping der Detailseiten mit modularen Extraktoren:
        - `addressExtractor.ts` (Adresse)
        - `contactExtractor.ts` (Telefon, E-Mail, Website)
        - `descriptionExtractor.ts` (Beschreibung, Konzept, Öffnungszeiten)
        - `galleryExtractor.ts` (Galerie, Video)
        - `featuresExtractor.ts` (Merkmale, Zertifikate, Auszeichnungen)
        - `tableExtractor.ts` (Träger, Plätze, Alter, Betreuungszeit etc.)
    - Mapping der vorhandenen Daten auf DB-Schema (`location`, `bundesland` korrekt).
    - Speichern/Aktualisieren der Daten in der `companies`-Tabelle via `upsert` (Supabase-Integration produktiv).
    - **Typfehler im Scraper behoben.**
    - **Docker-Build für `import-service` erfolgreich.**
    - **Kontakt-Extraktion (Adresse, Tel, Mail, Website) im Scraper robuster gemacht.**
    - **Typdefinition `RawKitaDetails` zentralisiert.**
    - **`importStatusService.js` wiederhergestellt.**
    - **Alle Extraktoren produktionsreif und mit Logging/Fallbacks ausgestattet.**
    - **Daten werden beim Import in Supabase gespeichert.**
    - **Containerstruktur:** 
        - `app` (Frontend, Port 8080)
        - `import-service` (Backend, Port 3002)
        - Gemeinsames Netzwerk `kita-net`, Healthchecks, Volumes für Live-Reload.
- **Import/Scraper Best Practices dokumentiert:** Wichtige Erkenntnisse und Best Practices aus den jüngsten Verbesserungen (robuste Extraktion, Logging, Typisierung, HTML-Beibehaltung, Watch-Modus) wurden in `activeContext.md`, `systemPatterns.md` und `techContext.md` festgehalten, um zukünftige Entwicklungen zu leiten.
- **Kita-Detailseite Datenanzeige korrigiert:** Die Anzeige von importierten Daten (Typ, Träger, Kapazität, Öffnungszeiten) auf der Detailseite funktioniert nun korrekt. Fehler in der Datenbankabfrage (`fetchCompanyById`) und im Frontend-Mapper (`mapToCompany`) wurden behoben. Die Erkenntnisse zur vollständigen Datenkette wurden dokumentiert (`activeContext.md`, `systemPatterns.md`).

- **Wissen-Bereich erweitert:** Die Knowledge-Objekte werden jetzt sauber und ohne Typfehler aus der Datenbank geladen. Die Datenstruktur ist kompatibel mit der Anzeige im Frontend. Die Typisierung kann bei Bedarf weiter verfeinert werden.
- **Build-Fehler behoben:** Durch Anpassungen in der Typisierung im Knowledge-Service und der Supabase-Konfiguration sind die Build-Fehler im Wissen-Bereich beseitigt worden.
- **Admin Kita-Liste (`/admin/kitas`):**
    - Tabelle um Spalten "Nr.", "ID", "Standort" erweitert (`src/pages/admin/AdminKitas.tsx`).
    - Clientseitige Paginierung (10 Einträge/Seite) hinzugefügt.
- **Admin Import (`/admin/import`):**
    - Bundesland-Import-Fehler behoben (korrekte Zuordnung via `server/src/services/importService.ts` und `server/src/config/germanStates.ts`).
    - Bundesländer-Auswahl nutzt nun `GERMAN_STATES`-Konstante (`src/lib/constants.ts`).
    - Bezirks-Abruf funktioniert wieder (korrekte URL wird an Backend gesendet).
    - **Bezirks-Filter implementiert:** Ein Filterfeld wurde in `src/pages/admin/AdminImport.tsx` hinzugefügt, um die Bezirksliste bei langen Listen durchsuchbar zu machen. Die Implementierung erfolgte via `write_to_file`.
    - **Bezirks-Scraping (Paginierung):** Der Scraper (`server/src/scrapers/kitaDeScraper.ts`) wurde angepasst, um die alphabetische Paginierung auf den Bundeslandseiten zu berücksichtigen.
    - **Fortschrittsanzeige Admin-Import:** Backend (`importService.ts`, `importStatusService.ts`) wurde angepasst, um Fortschritt granularer zu melden.
    - **Startseiten-Layout:** Padding um Hero entfernt, `<Features>` und `<Stats>` vor Footer platziert (`Index.tsx`).
    - **Filter-Problem `/kitas`:** Datenbankfehler beim Bezirksabruf behoben (`metaService.ts` verwendet nun korrekten Spaltennamen `bezirk`).
- **Kinderwelt (MVP):**
    - Frontend-Struktur (Seiten, Komponenten, Service, Typen, Routing, Navigation) erstellt.
    - Backend-Struktur (DB-Tabelle `stories`, Typen, DB-Service, OpenAI-Service, API-Routen) erstellt.
    - Funktion zum Generieren von Geschichten via Frontend-Formular implementiert (ruft Backend-API auf).
    - OpenAI-Integration für Text- und Titelgenerierung (Markdown) funktionsfähig.
    - Speichern und Abrufen der Geschichten aus Supabase implementiert.
    - RLS-Policy für INSERT in `stories` hinzugefügt.
    - Markdown-Rendering auf Detailseite implementiert (`react-markdown`).
    - Layout-Problem (doppelter Header/Footer) behoben durch Umstellung auf individuelles Layout pro Seite.
    - "Zurück"-Link und Sidebar für verwandte Geschichten auf Detailseite hinzugefügt.
    - Platzhalterbild für fehlende Cover-Bilder implementiert.
- **Kinderwelt Filter (Implementiert):**
    - Backend (`kinderweltDbService.ts`) kann nach Alter, Lesezeit und Thema filtern.
    - Frontend (`KinderweltKatalogPage.tsx`) enthält Filter-UI (Dropdowns) und übergibt Filter an API.
    - Frontend-Typen (`src/types/kinderwelt.ts`) für Filter (`AgeRange`, `ReadingTimeRange`) definiert.
- **Supabase Client Trennung (Behoben):**
    - Kritischer Fehler durch Verwechslung von Frontend- (Anon Key) und Backend-Client (Service Role Key) behoben.
    - Backend-Client umbenannt (`supabaseServiceRoleClient.ts`), Frontend-Imports korrigiert.
    - Korrektes Laden von `.env`-Variablen im Backend sichergestellt (`tsx --env-file`).
    - RLS Policies für Storage (`story-images`) für `service_role` bestätigt/korrigiert.
- **Kinderwelt Bildgenerierung (Funktionsfähig):**
    - Backend (`openaiService.ts`) generiert Metadaten und Bildbeschreibungen (`[Bild: ...]`).
    - Backend (`leonardoService.ts`) implementiert zur Generierung von Bildern via Leonardo.ai (Flux Speed) und Upload zu Supabase Storage (funktioniert nach Client-Fix).
    - Backend-Route (`kinderweltRoutes.ts`) integriert Text- und Bildgenerierung (berücksichtigt nun Zielvorgaben aus Frontend) und speichert URLs in DB.
    - Frontend (`KinderweltStoryPage.tsx`) zeigt Cover-Bild an und ersetzt `[Bild: ...]`-Marker durch `<img>`-Tags.
    - Frontend-Formular (`StoryGeneratorForm.tsx`) erweitert um Auswahl für Alter, Lesezeit, Thema.
    - OpenAI-Prompt (`openaiService.ts`) angepasst, um Zielvorgaben zu berücksichtigen und klarere Bildbeschreibungen (mit Tierart) anzufordern.
    - Layout der Katalogseite (`KinderweltKatalogPage.tsx`) angepasst (Liste oben, Formular unten).
- **Wissen-Sidebar (`KnowledgeSidebar.tsx`):**
    - Zeigt nun die 3 neuesten Kinderwelt-Geschichten unterhalb der neuesten Wissensbeiträge an.
    - Datenabruf für Geschichten via `fetchStoryCatalog` mit `limit: 3` implementiert.
    - Verarbeitung der `category_terms` zur Anzeige aller Kategorien robuster gestaltet.

---

## Was fehlt noch? / Aktuelle Probleme

- **Refaktorisierung Kita-Import (Priorität 1):**
    - Hilfsfunktionen auslagern (`utils/cheerioUtils.ts`).
    - Hauptfunktion `extractDetailsFromHtml` weiter vereinfachen.
    - Tests für Extraktoren implementieren.
    - Umfassenden Testlauf durchführen.
    - Optional: DB-Schema erweitern und Mapper anpassen.
- **Fehlerbehebung Bild-Uploads im Admin-Bereich:** Uploads für Jobs/Kitas schlagen fehl oder Vorschau verschwindet.
- **Vollständige CRUD-Logik für Jobs im Admin-Bereich:** Implementierung abschließen.
- **Authentifizierung & Rollen im Admin-Bereich:** Fehlt aktuell (Sicherheitsrisiko).
- **Automatisiertes Geocoding:** Muss bei Import & Formulareingabe integriert werden.
- **Konsistente Platzhalter:** Für fehlende Bilder implementieren.
- **Storage-Bereinigung:** Bei Löschungen implementieren.
- **Produktions-Setup:** Reverse Proxy & SSL konfigurieren.
- **Tests:** Automatisierte Tests für Backend und Frontend fehlen weitgehend.
- **Kinderwelt (Offene Punkte):**
    - **Test der erweiterten Generierung:** Überprüfen, ob die Zielvorgaben (Alter, Lesezeit, Thema) korrekt berücksichtigt werden und die Bildqualität (Tiererkennung) verbessert ist.
    - **SEO-Optimierung:** Structured Data auf Detailseite (`KinderweltStoryPage.tsx`).
    - **Generierungs-Endpunkt absichern:** Admin-Auth für `POST /api/kinderwelt/generate-and-save`.
    - **Audio-Generierung (TTS):** Implementierung.
    - **PDF-Generierung:** Implementierung.
    - **Interaktive Elemente (Quiz, Ausmalbild):** Implementierung (MVP++).
    - **Empfehlungs-Widget:** Implementierung (Phase 2).
    - Teaser-Banner auf anderen Seiten (optional).
- **Backend:** Untersuchung der verbleibenden TypeScript-Fehler in Express-Routen.
- **Docker-Entfernung:**
  - Docker und docker-compose wurden aus dem Entwicklungsprozess entfernt, um lokale Entwicklung und Debugging zu vereinfachen.
  - Die Docker-Konfigurationsdateien (`Dockerfile`, `docker-compose.yml`) bleiben im Projekt erhalten, um eine spätere Reaktivierung zu ermöglichen.
  - Um wieder auf Docker umzusteigen, müssen die Docker-Container neu gebaut und gestartet werden mit `docker-compose up --build`.
  - Die Ports und Netzwerkeinstellungen in Docker müssen beachtet werden, wie in den System Patterns dokumentiert.
  - Diese Information ist hier dokumentiert, um den Wechsel zwischen lokalen und containerisierten Umgebungen transparent zu halten.

---

## Entwicklung der Entscheidungen

- Fokus auf Containerisierung für einfaches Setup
- Modularisierung des Import-Services für bessere Wartbarkeit
- Nutzung von Supabase für Datenhaltung & Storage
- Schrittweise Erweiterung des Admin-Bereichs
- Mobile First & Performance-Optimierung im Frontend
- Monetarisierung über Premium, Jobs, Kurse, Affiliate
- **Kita-Import:** Ursprünglich direkter Import, jetzt über asynchronen Job mit Status-Tracking und detailliertem Logging. Der Fokus lag zunächst auf Fehlerbehebung (Typfehler, Build), dann auf Refaktorisierung und Stabilisierung des Scraping-Teils durch Aufteilung in Extraktor-Module. Diese Phase ist abgeschlossen und die gewonnenen Erkenntnisse sind als Best Practices dokumentiert (siehe oben und `activeContext.md`). Die korrekte Zuordnung von Bundesländern wurde sichergestellt.
- **Admin-Import UI:** Umstellung der Bundesländer-Auswahl auf Konstanten zur Fehlervermeidung. Notwendigkeit eines Filters für die Bezirksliste erkannt.
