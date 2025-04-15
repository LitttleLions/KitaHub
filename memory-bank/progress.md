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
    - State `bezirkFilter` und Reset-Logik in `src/pages/admin/AdminImport.tsx` hinzugefügt.

---

## Was fehlt noch? / Aktuelle Probleme

- **Bezirks-Filter implementieren (Priorität 1 - Neuer Task):**
    - **Problem:** Bei Bundesländern mit vielen Bezirken ist die Checkbox-Liste in `src/pages/admin/AdminImport.tsx` unübersichtlich.
    - **Kontext:** Der State `bezirkFilter` existiert, aber das UI-Element (Input-Feld) und die Filterlogik für die `.map()`-Funktion fehlen noch. Mehrere Versuche mit `replace_in_file` schlugen fehl.
    - **Nächster Schritt:** Implementierung des Filterfelds und der Filterlogik in `src/pages/admin/AdminImport.tsx` (empfohlen: `write_to_file` verwenden).
- **Refaktorisierung Kita-Import (Priorität 2):**
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
