# Fehlerbehebung & Erkenntnisse (Supabase Client Trennung & Kinderwelt Bilder)

Ein kritisches Problem war die versehentliche Verwendung des Backend-Supabase-Clients (mit `SERVICE_ROLE_KEY`) in Frontend-Komponenten. Dies führte zu Authentifizierungsfehlern und verhinderte u.a. das korrekte Funktionieren des Bild-Uploads im `leonardoService`. Folgende Korrekturen wurden vorgenommen:

1.  **Supabase Client Trennung:**
    *   Der Backend-Supabase-Client wurde eindeutig benannt: `server/src/supabaseServiceRoleClient.ts`. Er verwendet den `SUPABASE_SERVICE_ROLE_KEY` aus den Umgebungsvariablen und ist für privilegierte Operationen (DB-Schreibzugriffe, Storage-Uploads unter Umgehung von RLS) vorgesehen.
    *   Der Frontend-Supabase-Client (`src/integrations/supabase/client.ts`) verwendet weiterhin den `SUPABASE_ANON_KEY` und unterliegt den RLS Policies.
    *   Fehlerhafte Imports des Backend-Clients in Frontend-Komponenten (`KnowledgeSidebar.tsx`, `KnowledgeListAdminPage.tsx`, `KnowledgePostPage.tsx`, `KnowledgeOverviewPage.tsx`, `KnowledgeCategoryPage.tsx`) wurden korrigiert, sodass sie nun den korrekten Frontend-Client nutzen.
    *   Die alte, nun redundante Backend-Client-Datei `server/src/supabaseClient.ts` wurde identifiziert und kann gelöscht werden.
2.  **Umgebungsvariablen (.env):**
    *   Das Laden der `.env`-Datei im Backend wurde korrigiert. Das `dev`-Skript in `server/package.json` wurde angepasst (`"dev": "tsx watch --env-file .env src/server.ts"`).
    *   Manuelle Aufrufe von `dotenv.config()` wurden aus `server.ts` und `supabaseServiceRoleClient.ts` entfernt, da `tsx --env-file` dies übernimmt.
3.  **Supabase Storage RLS:**
    *   Es wurde sichergestellt, dass die Row Level Security (RLS) Policies für den `story-images` Bucket korrekt konfiguriert sind, um `INSERT`-Operationen für die `service_role` zu erlauben, was für den Upload durch den `leonardoService` notwendig ist.
4.  **Ergebnis:**
    *   Durch diese Korrekturen funktionieren die Backend-Operationen, die den Service Role Key benötigen (wie der Bild-Upload im `leonardoService`), nun korrekt.
    *   Frontend-Komponenten verwenden den Anon Key und respektieren die RLS Policies.
    *   Die Generierung von Kinderwelt-Geschichten inklusive Bild-Upload und -Anzeige ist nun funktionsfähig.

---

## Kinderwelt Verbesserungen (April 2025)

Basierend auf Nutzerfeedback wurden folgende Verbesserungen implementiert:

1.  **Erweitertes Generierungsformular:**
    *   Das Formular (`src/components/kinderwelt/StoryGeneratorForm.tsx`) wurde um Auswahlfelder für Zielalter, Zieldauer und Zielthema erweitert.
    *   Die ausgewählten Werte werden nun als `StoryGenerationData`-Objekt an das Backend gesendet (`src/pages/KinderweltKatalogPage.tsx`, `src/services/kinderweltService.ts`).
2.  **Backend-Anpassung für Zielvorgaben:**
    *   Die API-Route (`server/src/routes/kinderweltRoutes.ts`) nimmt die zusätzlichen Parameter entgegen.
    *   Der `openaiService.ts` (`generateStory`-Funktion) wurde angepasst, um `targetReadingTime` zu akzeptieren und alle Zielvorgaben (Alter, Lesezeit, Thema) in den finalen Prompt für OpenAI zu integrieren.
3.  **Verbesserte Bild-Prompts:**
    *   Der System-Prompt in `openaiService.ts` wurde überarbeitet, um die KI anzuweisen, bei Bildbeschreibungen von Tieren explizit die Tierart zu nennen (z.B. "[Bild: Eine glückliche Maus...]"). Dies soll die Genauigkeit der von Leonardo.ai generierten Bilder erhöhen.
4.  **Layout-Anpassung Katalogseite:**
    *   Auf der `KinderweltKatalogPage.tsx` wurde die Liste der Geschichten und die Filter über das Generierungsformular verschoben, um die neuesten Geschichten prominenter zu platzieren.
5.  **Wissen-Sidebar erweitert:**
    *   Die Komponente `src/components/knowledge/KnowledgeSidebar.tsx` wurde erweitert, um die 3 neuesten Kinderwelt-Geschichten unterhalb der neuesten Wissensbeiträge anzuzeigen. Der Datenabruf erfolgt über `fetchStoryCatalog` mit `limit: 3`.
6.  **Redesign Kinderwelt-Detailseite:**
    *   Die Seite `src/pages/KinderweltStoryPage.tsx` wurde optisch überarbeitet (größerer Titel, angepasste Metadaten-Badges, erhöhter Zeilenabstand im Text).
    *   Die zugehörige Sidebar (`src/components/kinderwelt/RelatedStoriesSidebar.tsx`) wurde an das "Card"-Design der Wissens-Sidebar angepasst (Rahmen, Schatten, Padding) und zeigt nun wieder Vorschaubilder an.
7.  **Redesign Kinderwelt-Katalogseite:**
    *   Die Seite `src/pages/KinderweltKatalogPage.tsx` wurde optisch überarbeitet:
        *   Der Hero-Bereich (`KinderweltHero.tsx`) hat einen hellblauen Hintergrund.
        *   Der Filter/Such-Bereich hat nun ein Card-Styling (Rahmen, Schatten, etc.).
        *   Die Story-Karten (`StoryCard.tsx`) zeigen farbige Metadaten-Badges und haben einen Hover-Effekt.
        *   Die vertikalen Abstände zwischen den Sektionen wurden vergrößert.

---

# Aktueller Stand der Entwicklung - Import/Scraper Erkenntnisse

## 1. Adress-Extraktion
- Die Adress-Extraktion erfolgt jetzt ausschließlich über den neuen robusten Extraktor `extractAddress`.
- Dieser nutzt `<br>`-Splits und strukturierte Felder für Straße, Hausnummer, PLZ, Ort, Bezirk und die vollständige Adresse.
- Alte Fallbacks und Regex-Parsing wurden entfernt, um doppelte oder widersprüchliche Logs zu vermeiden.

## 2. Bild-Extraktion
- Die Extraktion von `cover_image_url` prüft mehrere Selektoren.
- Es wird nur noch geloggt, wenn wirklich kein Bild gefunden wurde.
- Doppelte oder widersprüchliche Bild-Logs wurden eliminiert.

## 3. Typdefinitionen
- Die Felder `plaetze_gesamt`, `freie_plaetze`, `betreuungsalter_von`, `betreuungsalter_bis` im Typ `RawKitaDetails` wurden von `number` auf `string` geändert, da Scraper-Ausgaben oft auch „?“ oder leere Strings enthalten.
- Das neue Feld `kita_typ` (z.B. „Krippe und Kindergarten“) wurde ergänzt.

## 4. Typumwandlung
- Bei der Zuweisung von Werten aus `tableData` an die Felder von `RawKitaDetails` werden Werte mit `String(...)` umgewandelt, um Typfehler zu vermeiden.
- Im Mapper `mapKitaData` werden Zahlen aus `RawKitaDetails` explizit in Strings konvertiert, um den Typanforderungen der `Company`-Schnittstelle zu entsprechen.

## 5. Beschreibung
- Die Beschreibung (`description`) wird jetzt als HTML übernommen, damit Formatierungen wie Absätze, Listen, Überschriften etc. im Frontend erhalten bleiben.

## 6. Automatischer Server-Restart
- Das Backend kann jetzt mit `nodemon` und `ts-node` im Watch-Modus entwickelt werden (`npm run dev`).
- Dadurch ist kein manueller Neustart bei Code-Änderungen mehr nötig.

## 7. Logging
- Logs sind jetzt konsistenter.
- Es wird klar geloggt, wenn eine Kita wegen fehlender Pflichtdaten übersprungen wird.
- Es wird geloggt, welche Felder erfolgreich extrahiert wurden.

## 8. Kita-Typ Extraktion
- Der Kita-Typ wird aus dem Element `<h2 class="type">...</h2>` extrahiert.
- Der Text wird so formatiert, dass „ und “ durch „, “ ersetzt wird, um eine kommagetrennte Liste zu erhalten (z.B. „Krippe, Kindergarten“).
- Das Feld `kita_typ` ist in `RawKitaDetails` und im Mapper korrekt definiert und wird geloggt.

---

## Best Practices & Lessons Learned (Import/Scraper)

Die folgenden Punkte aus den jüngsten Verbesserungen sollten als Best Practices für die zukünftige Entwicklung von Scrapern und Importprozessen betrachtet werden, um Konsistenz zu gewährleisten und häufige Fehler zu vermeiden:

1.  **Robuste Extraktion statt Fallbacks:**
    *   Setze auf dedizierte, robuste Extraktoren (wie `extractAddress`) anstelle von komplexen Fallback-Logiken oder unzuverlässigem Regex-Parsing, besonders bei strukturierten Daten wie Adressen.
2.  **Konsistentes & gezieltes Logging:**
    *   Vermeide doppelte oder widersprüchliche Logs (z.B. bei Bild-Extraktion).
    *   Logge Fehler oder das Überspringen von Datensätzen (z.B. wegen fehlender Pflichtfelder) klar und eindeutig.
    *   Logge erfolgreich extrahierte Felder zur besseren Nachvollziehbarkeit.
3.  **Flexible Typdefinitionen für Rohdaten:**
    *   Definiere Typen für Rohdaten (wie `RawKitaDetails`) flexibel genug (z.B. `string` statt `number`), um unerwartete Eingaben (wie "?", leere Strings) vom Scraper abzufangen, ohne Fehler zu werfen. Die Validierung und Konvertierung sollte im Mapper erfolgen.
4.  **Explizite Typumwandlung im Mapper:**
    *   Wandle Datentypen explizit (z.B. mit `String(...)` oder `parseInt(...)`) im Mapping-Schritt um, um die Zieldatentypen (z.B. in der `Company`-Schnittstelle) sicherzustellen und Typfehler zu vermeiden.
5.  **HTML-Formatierung beibehalten:**
    *   Übernehme HTML-Inhalte (z.B. für Beschreibungen) direkt, um Formatierungen (Absätze, Listen etc.) für die Frontend-Darstellung zu erhalten.
6.  **Entwicklungs-Setup mit Watch-Modus:**
    *   Nutze Tools wie `nodemon` und `ts-node` (`npm run dev`), um automatische Server-Neustarts bei Code-Änderungen im Backend zu ermöglichen und die Entwicklungsgeschwindigkeit zu erhöhen.

---

## Lessons Learned (Datenanzeige Kita-Detailseite)

Bei der Überprüfung, warum bestimmte importierte Daten (Träger, Kapazität, Typ etc.) nicht auf der Detailseite angezeigt wurden, wurden folgende Punkte identifiziert und behoben:

1.  **Unvollständige DB-Abfrage:** Die Funktion `fetchCompanyById` (`src/services/company/companyDetailService.ts`) fragte nicht alle benötigten Felder aus der `companies`-Tabelle ab. **Lösung:** Die `select`-Anweisung wurde um die fehlenden Felder erweitert.
2.  **Unvollständiger Frontend-Mapper:** Der Mapper `mapToCompany` (`src/services/company/companyMapper.ts`) berücksichtigte die neu abgefragten Felder nicht und übertrug sie nicht in das `Company`-Objekt für das Frontend. **Lösung:** Der Mapper wurde um die fehlenden Feldzuweisungen ergänzt.
3.  **Fehlende Zuordnung im Backend-Mapper:** Das Feld `type` wurde im Backend-Mapper (`server/src/mappers/kitaDeMapper.ts`) nicht korrekt zugeordnet (war bereits im vorherigen Schritt behoben, trug aber zum ursprünglichen Problem bei).
4.  **Wichtige Erkenntnis:** Die Datenkette von der Datenbank über die Abfrage (`select`), den Frontend-Mapper bis zur Anzeige in der Komponente muss vollständig sein. Fehlende Felder an *irgendeiner* Stelle unterbrechen die Kette.
5.  **Bedingte Anzeige beachten:** Premium-Felder wie `special_pedagogy` werden nur angezeigt, wenn `is_premium` true ist. Dies muss bei der Fehlersuche berücksichtigt werden.

---

## Supabase-Typisierung und Knowledge-Service Änderungen

- Die Tabelle `knowledge_posts` wurde in `src/integrations/supabase/types.ts` vollständig typisiert und steht nun im gesamten Projekt für den Supabase-Client zur Verfügung.
- Die Funktion `fetchRandomKnowledge` in `src/services/knowledgeService.ts` wurde angepasst, um Knowledge-Objekte ohne strenge Typisierung abzurufen, kompatibel mit den Props der `KnowledgeCard`-Komponente.
- Die `KnowledgeCard` auf der Startseite und die Knowledge-Section erhalten jetzt die Felder `id`, `title`, `slug`, `full_path`, `featured_media_url` korrekt aus der Datenbank und übergeben sie an die Komponente.
- Durch die Lockerung der Typisierung im Service und die Ergänzung der Typen in der Supabase-Konfiguration wurden Build-Fehler behoben, sodass die Startseite die Wissensobjekte anzeigen kann.
- Die Typisierung kann bei Bedarf später weiter verfeinert werden.

---

## Admin-Bereich Verbesserungen (April 2025)

**Kita-Liste (`/admin/kitas`):**
- **Erweiterte Spalten:** Die Tabelle in `src/pages/admin/AdminKitas.tsx` wurde um Spalten für "Nr.", "ID" und "Standort" erweitert.
- **Paginierung:** Eine einfache clientseitige Paginierung (10 Einträge pro Seite) wurde hinzugefügt, um die Übersichtlichkeit bei vielen Einträgen zu verbessern. Die Datenabfrage (`fetchCompanies`) wurde angepasst, um `limit` und `offset` zu unterstützen.

**Kita-Import (`/admin/import`):**
- **Bundesland-Import Fix:** Das Problem, dass das `bundesland`-Feld für einige Bundesländer (z.B. Mecklenburg-Vorpommern) leer blieb, wurde behoben.
    - Die Funktion `getBundeslandDbValueFromUrl` in `server/src/services/importService.ts` wurde korrigiert, um den korrekten `dbValue` aus der `GERMAN_STATES`-Konstante anhand des URL-Slugs zu ermitteln.
    - Die `GERMAN_STATES`-Konstanten (`src/lib/constants.ts` und `server/src/config/germanStates.ts`) wurden um die `url`-Eigenschaft erweitert, die die vollständige kita.de-URL für das jeweilige Bundesland enthält.
- **Bundesländer-Auswahl:** Die Dropdown-Liste für Bundesländer in `src/pages/admin/AdminImport.tsx` wird nun direkt aus der `GERMAN_STATES`-Konstante (`src/lib/constants.ts`) befüllt, anstatt einen API-Endpunkt abzufragen. Dies erhöht die Konsistenz.
- **Bezirks-Auswahl (Problem):** Bei Bundesländern mit vielen Bezirken (z.B. Mecklenburg-Vorpommern) ist die aktuelle Checkbox-Liste in `src/pages/admin/AdminImport.tsx` unübersichtlich.
    - **Lösung:** Ein `<Input>`-Feld wurde oberhalb der Bezirks-Checkbox-Liste in `src/pages/admin/AdminImport.tsx` hinzugefügt. Der Wert des Inputs ist an den `bezirkFilter`-State gebunden, und der `onChange`-Handler aktualisiert diesen State. Die `.map()`-Funktion, die die Checkboxen rendert, filtert nun die `bezirke`-Liste basierend auf dem `bezirkFilter` (Groß-/Kleinschreibung wird ignoriert), bevor die Checkboxen angezeigt werden. Die Implementierung erfolgte erfolgreich mittels `write_to_file`.
- **Bezirks-Scraping (Paginierung):** Der Scraper (`server/src/scrapers/kitaDeScraper.ts`) wurde angepasst, um die alphabetische Paginierung auf den Bundeslandseiten (z.B. `/kitas/mecklenburg-vorpommern/c=b`) zu berücksichtigen. Er sammelt nun Bezirke von allen Paginierungsseiten.
- **Fortschrittsanzeige Admin-Import:** Der Backend-Service (`server/src/services/importService.ts`, `server/src/services/importStatusService.ts`) wurde angepasst, um den Fortschritt granularer zu berechnen und zu melden. Das Frontend zeigt nun Zwischenschritte an.
- **Startseiten-Layout:**
    - Das Padding um den Hero-Bereich (`KitaSearchHero`) in `src/pages/Index.tsx` wurde entfernt, um die Höhe zu reduzieren.
    - Die Komponenten `<Features />` und `<Stats />` wurden (wieder) auf der Startseite vor dem Footer platziert.
- **Filter-Problem `/kitas`:** Der Datenbankfehler beim Laden der Bezirke in der Sidebar wurde behoben, indem die Abfrage in `src/services/metaService.ts` korrigiert wurde (Verwendung von `bezirk` statt `district` für die DB-Spalte).

---

## Nächste Schritte / Offene Punkte

- **Finaler Test Kinderwelt-Generierung:** Überprüfen, ob der gesamte Prozess (Text + Bilder) stabil läuft.
- **Refaktorisierung Kita-Import:** Weitere Vereinfachung und Auslagerung von Hilfsfunktionen im Backend-Scraper (`server/src/scrapers/kitaDeScraper.ts` und `utils`).
- **Fehlerbehebung Bild-Uploads:** Im Admin-Bereich.
- **Admin-Funktionen vervollständigen:** Job-CRUD, Auth, Geocoding, Storage-Bereinigung.
- **Tests:** Implementierung von automatisierten Tests.
- **Kinderwelt (Nächste Schritte):**
    - **Phase 2: Filter UI & Logik:** Implementierung der Filter-UI im Katalog (`KinderweltKatalogPage.tsx`) und der zugehörigen Backend-Logik (`GET /api/kinderwelt` in `kinderweltRoutes.ts` und `getStories` in `kinderweltDbService.ts`) zur Filterung nach Alter, Lesezeit und Themen.
    - **SEO-Optimierung:** Structured Data auf Detailseite (`KinderweltStoryPage.tsx`).
    - **Generierungs-Endpunkt absichern:** Admin-Auth für `POST /api/kinderwelt/generate-and-save`.
    - **Bild-Integration (Phase 2+):** Implementierung der Anzeige von Cover-Bildern und der Verarbeitung/Anzeige von Inline-Bildern (basierend auf `[Bild: ...]` Markern).
    - **Weitere Enhancements (Post-MVP):** Audio, PDF, Interaktive Elemente etc.

---

## Kinderwelt Implementierung (April 2025)

- **Ziel:** Schaffung eines neuen Bereichs mit KI-generierten Kindergeschichten.
- **Frontend:**
    - Neue Seiten erstellt: `KinderweltKatalogPage` (`/kinderwelt`), `KinderweltStoryPage` (`/kinderwelt/:slug`).
    - Neue Komponenten erstellt: `KinderweltHero`, `StoryCard`, `StoryGeneratorForm`, `RelatedStoriesSidebar`.
    - Service (`kinderweltService.ts`) für API-Kommunikation (Katalog holen, Story holen, Story generieren/speichern).
    - Typen (`kinderwelt.ts`) definiert.
    - Routing in `App.tsx` hinzugefügt.
    - Navigationslinks in `Navbar.tsx` (Wissen-Dropdown) und `Footer.tsx` integriert.
    - Layout: Seiten rendern `Navbar` und `Footer` individuell. Detailseite nutzt 2-Spalten-Layout mit Sidebar.
    - Markdown-Rendering auf Detailseite mit `react-markdown` und `remark-gfm`.
    - Formular zur Keyword-Eingabe und zum Anstoßen der Generierung via `useMutation`.
    - Automatische Aktualisierung des Katalogs nach Generierung via `queryClient.invalidateQueries`.
    - Platzhalterbild (`/placeholder.svg`) wird in `StoryCard` und `KinderweltStoryPage` angezeigt, wenn kein `cover_image_url` vorhanden ist.
    - "Zurück zur Übersicht"-Link auf Detailseite hinzugefügt.
- **Backend:**
    - Neue Supabase-Tabelle `stories` definiert (`supabase/stories_table.sql`) und RLS-Policies für SELECT (public) und INSERT (service_role) hinzugefügt.
    - Backend-Typen (`kinderwelt.d.ts`) erstellt.
    - DB-Service (`kinderweltDbService.ts`) für CRUD-Operationen auf `stories`-Tabelle implementiert.
    - OpenAI-Service (`openaiService.ts`) erstellt:
        - Nutzt `openai` Paket und `OPENAI_API_KEY` aus `.env`.
        - Angepasster System-Prompt fordert Titel (mit "Titel:"-Präfix) und Markdown-formatierten Text an.
    - API-Router (`kinderweltRoutes.ts`) unter `/api/kinderwelt` erstellt:
        - `GET /`: Katalog abrufen (mit Filtern).
        - `GET /:slug`: Einzelne Story abrufen.
        - `POST /generate-and-save`: Nimmt Prompt entgegen, ruft OpenAI auf, extrahiert Titel, generiert Slug (`slugify`), speichert in DB, gibt neue Story zurück. (Noch ohne Admin-Auth).
    - Router in `server.ts` registriert.
    - Abhängigkeiten installiert: `openai`, `dotenv`, `slugify`, `react-markdown`, `remark-gfm`.
    - `.gitignore` um `.env` erweitert.
- **Status:** Grundfunktionen (Generieren via Frontend, Speichern, Anzeigen Katalog/Detail) implementiert. Layout-Probleme (doppelter Header/Footer) behoben durch Umstellung auf individuelles Layout-Rendering pro Seite. RLS-Problem beim Einfügen behoben. Titel wird automatisch generiert. Markdown wird gerendert.
- **Backend-Erweiterung (Phase 1 - Filter/Bilder-Grundlage):**
    - **DB-Schema (`stories_table.sql`):** Spalte `inline_image_urls` (für Bilder im Text) hinzugefügt/aktiviert. Bestehende Spalten für Alter, Lesezeit, Themen bestätigt.
    - **OpenAI Service (`openaiService.ts`):**
        - System-Prompt überarbeitet, um explizit Metadaten (Titel, Alter, Lesezeit, Themen) und Bildbeschreibungen (`[Bild: ...]`) in strukturiertem Format anzufordern.
        - Funktion `generateStory` angepasst: Akzeptiert optionale Zielvorgaben (Alter, Thema), parst die strukturierte Antwort von OpenAI und gibt ein `GeneratedStoryData`-Objekt zurück.
    - **API-Route (`kinderweltRoutes.ts`):**
        - Route `POST /generate-and-save` angepasst: Verarbeitet das `GeneratedStoryData`-Objekt, parst Metadaten (Alter, Lesezeit) in numerische Werte und speichert alle relevanten Daten (inkl. generierter Themen) über `createStory` in der Datenbank. Akzeptiert optionale `targetAge` und `targetTheme` im Request Body.
        - TypeScript-Fehler ("No overload matches this call") durch Hinzufügen des expliziten Rückgabetyps `Promise<void>` zu den `async`-Routen-Handlern behoben.
    - **Leonardo.ai Integration (Versuch):**
        - Ziel: Automatische Generierung von Cover- und Inline-Bildern für Geschichten.
        - API-Key in `server/.env` gespeichert.
        - Neuer Service `server/src/services/leonardoService.ts` erstellt:
            - Nutzt `axios` und `uuid`.
            - Funktion `generateAndUploadImage` implementiert, um Bilder via Leonardo API (Flux Speed Modell, 591x888) zu generieren, herunterzuladen und in Supabase Storage (`story-images` Bucket) hochzuladen. Gibt öffentliche Supabase URL zurück.
            - Polling-Mechanismus implementiert, um auf Abschluss des Leonardo-Jobs zu warten.
        - Typdefinition `CreateStoryPayload` in `server/src/types/kinderwelt.d.ts` um `inline_image_urls` erweitert.
        - Backend-Route `POST /generate-and-save` in `server/src/routes/kinderweltRoutes.ts` angepasst:
            - Ruft `generateAndUploadImage` für Cover- und Inline-Bilder auf.
            - Fügt zurückgegebene Bild-URLs zum DB-Payload hinzu.
            - Verbessertes Logging hinzugefügt, um Fehler besser nachverfolgen zu können.
        - Frontend-Seite `src/pages/KinderweltStoryPage.tsx` angepasst:
            - Zeigt `cover_image_url` an.
            - Ersetzt `[Bild: ...]`-Marker im Markdown durch `<img>`-Tags mit URLs aus `inline_image_urls`.
        - Frontend-Komponente `src/components/kinderwelt/StoryCard.tsx` überprüft (zeigt Cover-Bild korrekt an).
- **Aktuelles Problem:** Bei der Generierung tritt ein nicht näher spezifizierter "interner Fehler" auf. Im Backend-Log erscheinen trotz verbessertem Logging keine detaillierten Fehlermeldungen. Nächster Schritt ist die Fehlersuche.

# Aktueller Stand der Entwicklung - Import/Scraper Erkenntnisse

## 1. Adress-Extraktion
- Die Adress-Extraktion erfolgt jetzt ausschließlich über den neuen robusten Extraktor `extractAddress`.
- Dieser nutzt `<br>`-Splits und strukturierte Felder für Straße, Hausnummer, PLZ, Ort, Bezirk und die vollständige Adresse.
- Alte Fallbacks und Regex-Parsing wurden entfernt, um doppelte oder widersprüchliche Logs zu vermeiden.

## 2. Bild-Extraktion
- Die Extraktion von `cover_image_url` prüft mehrere Selektoren.
- Es wird nur noch geloggt, wenn wirklich kein Bild gefunden wurde.
- Doppelte oder widersprüchliche Bild-Logs wurden eliminiert.

## 3. Typdefinitionen
- Die Felder `plaetze_gesamt`, `freie_plaetze`, `betreuungsalter_von`, `betreuungsalter_bis` im Typ `RawKitaDetails` wurden von `number` auf `string` geändert, da Scraper-Ausgaben oft auch „?“ oder leere Strings enthalten.
- Das neue Feld `kita_typ` (z.B. „Krippe und Kindergarten“) wurde ergänzt.

## 4. Typumwandlung
- Bei der Zuweisung von Werten aus `tableData` an die Felder von `RawKitaDetails` werden Werte mit `String(...)` umgewandelt, um Typfehler zu vermeiden.
- Im Mapper `mapKitaData` werden Zahlen aus `RawKitaDetails` explizit in Strings konvertiert, um den Typanforderungen der `Company`-Schnittstelle zu entsprechen.

## 5. Beschreibung
- Die Beschreibung (`description`) wird jetzt als HTML übernommen, damit Formatierungen wie Absätze, Listen, Überschriften etc. im Frontend erhalten bleiben.

## 6. Automatischer Server-Restart
- Das Backend kann jetzt mit `nodemon` und `ts-node` im Watch-Modus entwickelt werden (`npm run dev`).
- Dadurch ist kein manueller Neustart bei Code-Änderungen mehr nötig.

## 7. Logging
- Logs sind jetzt konsistenter.
- Es wird klar geloggt, wenn eine Kita wegen fehlender Pflichtdaten übersprungen wird.
- Es wird geloggt, welche Felder erfolgreich extrahiert wurden.

## 8. Kita-Typ Extraktion
- Der Kita-Typ wird aus dem Element `<h2 class="type">...</h2>` extrahiert.
- Der Text wird so formatiert, dass „ und “ durch „, “ ersetzt wird, um eine kommagetrennte Liste zu erhalten (z.B. „Krippe, Kindergarten“).
- Das Feld `kita_typ` ist in `RawKitaDetails` und im Mapper korrekt definiert und wird geloggt.

---

## Best Practices & Lessons Learned (Import/Scraper)

Die folgenden Punkte aus den jüngsten Verbesserungen sollten als Best Practices für die zukünftige Entwicklung von Scrapern und Importprozessen betrachtet werden, um Konsistenz zu gewährleisten und häufige Fehler zu vermeiden:

1.  **Robuste Extraktion statt Fallbacks:**
    *   Setze auf dedizierte, robuste Extraktoren (wie `extractAddress`) anstelle von komplexen Fallback-Logiken oder unzuverlässigem Regex-Parsing, besonders bei strukturierten Daten wie Adressen.
2.  **Konsistentes & gezieltes Logging:**
    *   Vermeide doppelte oder widersprüchliche Logs (z.B. bei Bild-Extraktion).
    *   Logge Fehler oder das Überspringen von Datensätzen (z.B. wegen fehlender Pflichtfelder) klar und eindeutig.
    *   Logge erfolgreich extrahierte Felder zur besseren Nachvollziehbarkeit.
3.  **Flexible Typdefinitionen für Rohdaten:**
    *   Definiere Typen für Rohdaten (wie `RawKitaDetails`) flexibel genug (z.B. `string` statt `number`), um unerwartete Eingaben (wie "?", leere Strings) vom Scraper abzufangen, ohne Fehler zu werfen. Die Validierung und Konvertierung sollte im Mapper erfolgen.
4.  **Explizite Typumwandlung im Mapper:**
    *   Wandle Datentypen explizit (z.B. mit `String(...)` oder `parseInt(...)`) im Mapping-Schritt um, um die Zieldatentypen (z.B. in der `Company`-Schnittstelle) sicherzustellen und Typfehler zu vermeiden.
5.  **HTML-Formatierung beibehalten:**
    *   Übernehme HTML-Inhalte (z.B. für Beschreibungen) direkt, um Formatierungen (Absätze, Listen etc.) für die Frontend-Darstellung zu erhalten.
6.  **Entwicklungs-Setup mit Watch-Modus:**
    *   Nutze Tools wie `nodemon` und `ts-node` (`npm run dev`), um automatische Server-Neustarts bei Code-Änderungen im Backend zu ermöglichen und die Entwicklungsgeschwindigkeit zu erhöhen.

---

## Lessons Learned (Datenanzeige Kita-Detailseite)

Bei der Überprüfung, warum bestimmte importierte Daten (Träger, Kapazität, Typ etc.) nicht auf der Detailseite angezeigt wurden, wurden folgende Punkte identifiziert und behoben:

1.  **Unvollständige DB-Abfrage:** Die Funktion `fetchCompanyById` (`src/services/company/companyDetailService.ts`) fragte nicht alle benötigten Felder aus der `companies`-Tabelle ab. **Lösung:** Die `select`-Anweisung wurde um die fehlenden Felder erweitert.
2.  **Unvollständiger Frontend-Mapper:** Der Mapper `mapToCompany` (`src/services/company/companyMapper.ts`) berücksichtigte die neu abgefragten Felder nicht und übertrug sie nicht in das `Company`-Objekt für das Frontend. **Lösung:** Der Mapper wurde um die fehlenden Feldzuweisungen ergänzt.
3.  **Fehlende Zuordnung im Backend-Mapper:** Das Feld `type` wurde im Backend-Mapper (`server/src/mappers/kitaDeMapper.ts`) nicht korrekt zugeordnet (war bereits im vorherigen Schritt behoben, trug aber zum ursprünglichen Problem bei).
4.  **Wichtige Erkenntnis:** Die Datenkette von der Datenbank über die Abfrage (`select`), den Frontend-Mapper bis zur Anzeige in der Komponente muss vollständig sein. Fehlende Felder an *irgendeiner* Stelle unterbrechen die Kette.
5.  **Bedingte Anzeige beachten:** Premium-Felder wie `special_pedagogy` werden nur angezeigt, wenn `is_premium` true ist. Dies muss bei der Fehlersuche berücksichtigt werden.

---

## Supabase-Typisierung und Knowledge-Service Änderungen

- Die Tabelle `knowledge_posts` wurde in `src/integrations/supabase/types.ts` vollständig typisiert und steht nun im gesamten Projekt für den Supabase-Client zur Verfügung.
- Die Funktion `fetchRandomKnowledge` in `src/services/knowledgeService.ts` wurde angepasst, um Knowledge-Objekte ohne strenge Typisierung abzurufen, kompatibel mit den Props der `KnowledgeCard`-Komponente.
- Die `KnowledgeCard` auf der Startseite und die Knowledge-Section erhalten jetzt die Felder `id`, `title`, `slug`, `teaser`, `image_url` korrekt aus der Datenbank und übergeben sie an die Komponente.
- Durch die Lockerung der Typisierung im Service und die Ergänzung der Typen in der Supabase-Konfiguration wurden Build-Fehler behoben, sodass die Startseite die Wissensobjekte anzeigen kann.
- Die Typisierung kann bei Bedarf später weiter verfeinert werden.
