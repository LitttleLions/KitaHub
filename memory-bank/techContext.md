# Tech Context – kita.de Plattform

**Version:** 1.0  
**Stand:** April 2025

---

## Technologien

- **Frontend:**
  - React + TypeScript
  - Vite (Dev-Server & Build)
  - Tailwind CSS
  - Shadcn UI Komponenten
  - React Router
  - React Query
  - React Context
- **Backend:**
  - Node.js + Express (Import-Service)
  - axios, cheerio (Scraping)
  - **Datenverarbeitung (Import):**
    - Flexible Typdefinitionen für Rohdaten (z.B. `string` statt `number` in `RawKitaDetails`) zur Abfederung von Scraper-Inkonsistenzen.
    - Explizite Typumwandlung (z.B. `String(...)`) im Mapper zur Sicherstellung der Zieltypen.
- **Datenbank:**
  - Supabase (Postgres)
    - **Clients:**
      - **Frontend:** `src/integrations/supabase/client.ts` (nutzt `SUPABASE_ANON_KEY`)
      - **Backend (Service Role):** `server/src/supabaseServiceRoleClient.ts` (nutzt `SUPABASE_SERVICE_ROLE_KEY`)
    - **Tabellen:** `companies`, `jobs`, `users`, `courses`, `knowledge_posts`, `stories`
    - **Erweiterte Typisierung:** Die Tabellen `knowledge_posts` und `stories` wurden in `src/integrations/supabase/types.ts` bzw. `server/src/types/kinderwelt.d.ts` typisiert.
- **Containerisierung:**
  - Docker, docker-compose (derzeit deaktiviert, siehe `progress.md`)
- **Tracking:**
  - Google Analytics 4 (DSGVO-konform)

---

## Entwicklungs-Setup

- **Containerisiert:** Frontend & Backend laufen in Docker-Containern (siehe `progress.md` für aktuellen Status bzgl. lokaler Entwicklung).
- **Hot Reload:** Vite (Frontend), `nodemon` + `ts-node` (Backend via `npm run dev`).
- **Volumes:** Quellcode gemountet für Live-Reload (relevant bei Docker-Nutzung).
- **Healthchecks:** für beide Container aktiv
- **Start (Docker):** `docker-compose up --build`
- **API-Kommunikation (Docker):** HTTP im Docker-Netzwerk
- **Aktuelles Setup (Lokal):** Frontend und Backend werden lokal ausgeführt.
  - **Backend Start:** `cd server && npm run dev` (nutzt `tsx watch --env-file .env src/server.ts` für Hot-Reload und Laden der `.env`-Datei).
  - **Frontend Start:** `npm run dev` (im Hauptverzeichnis).
- **Wichtig bei lokalem Setup:** TypeScript-Pfad-Aliase (definiert in `tsconfig.json`, z.B. `@/services`) funktionieren **nicht** direkt in der Node.js-Runtime. Daher müssen im Quellcode **relative Pfade** für lokale Modulimporte verwendet werden, damit der kompilierte JavaScript-Code ausgeführt werden kann. Tools wie `module-alias` wurden entfernt.

---

## Technische Constraints

- **Supabase:** Noch keine vollständige Integration im Import-Service
- **Geocoding:** Noch nicht automatisiert
- **Auth:** Admin-Bereich noch ohne Authentifizierung
- **Storage:** Bereinigung bei Löschungen noch offen
- **Reverse Proxy:** In Produktion empfohlen, aktuell nicht konfiguriert

---

## Tooling & Libraries

- **Formulare:** react-hook-form, zod
- **Uploads:** Supabase Storage, eigene Upload-Komponenten
- **Markdown Rendering (Frontend):** `react-markdown`, `remark-gfm`
- **Slug Generation (Backend):** `slugify`
- **AI Content Generation (Backend):** `openai`
- **AI Image Generation (Backend):** `axios` (für Leonardo.ai API)
- **Environment Variables (Backend):** Laden via `tsx --env-file .env` im `dev`-Skript (`server/package.json`).
- **Testing:** (noch nicht spezifiziert)
- **Build:** Vite, Docker
- **Deployment:** (nicht spezifiziert, empfohlen: Reverse Proxy + SSL)
