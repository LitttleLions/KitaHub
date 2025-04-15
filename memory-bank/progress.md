# Progress – kita.de Plattform

**Version:** 1.2
**Stand:** 14. April 2025

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

---

## Was fehlt noch? / Aktuelle Probleme

- **Refaktorisierung & Stabilisierung Kita-Import (Priorität 1 - In Arbeit):**
  - **Problem:** Der Scraper (`kitaDeScraper.ts`) war ursprünglich monolithisch und die Extraktion vieler Felder nicht robust genug.
  - **Lösung:** Scraper wurde vollständig in logische Extraktor-Module aufgeteilt, alle relevanten Felder werden stabil extrahiert und in Supabase gespeichert.
  - **Nächste Schritte (Neuer Task):**
    1. Hilfsfunktionen auslagern (`utils/cheerioUtils.ts`).
    2. Hauptfunktion `extractDetailsFromHtml` weiter vereinfachen.
    3. Tests für Extraktoren implementieren.
    4. Umfassenden Testlauf durchführen.
    5. Optional: DB-Schema erweitern und Mapper anpassen.

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
- **Kita-Import:** Ursprünglich direkter Import, jetzt über asynchronen Job mit Status-Tracking und detailliertem Logging. Fokus lag zunächst auf Fehlerbehebung (Typfehler, Build), jetzt auf Refaktorisierung und Stabilisierung des Scraping-Teils durch Aufteilung in Extraktor-Module.
