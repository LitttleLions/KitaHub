# System Patterns – kita.de Plattform

**Version:** 1.0  
**Stand:** April 2025

---

## Architekturübersicht

- **Frontend:** React + TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend:** Node.js + Express (Import-Service)
- **Datenbank:** Supabase (Postgres)
- **Containerisierung:** Docker, docker-compose
- **Kommunikation:** HTTP im Docker-Netzwerk, REST-APIs

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
- **Containerisierung:**
  - Frontend & Backend als separate Docker-Container
  - Gemeinsames Netzwerk, Hot Reload, Healthchecks
  - **Wichtiges Pattern:** Die Ports in Dockerfile (EXPOSE), docker-compose (ports) und im Node/Express-Server müssen exakt übereinstimmen (z.B. 3002). Healthchecks und API-Endpoints müssen auf den gleichen Port zeigen. Abweichungen führen dazu, dass der Service von außen nicht erreichbar ist oder Healthchecks fehlschlagen. (Wiederkehrender Stolperstein!)
- **Admin-Bereich:**
  - Dediziertes Layout, Sidebar-Navigation
  - Formulare mit react-hook-form + zod
  - Upload-Komponenten für Bilder
  - Wiederverwendbare Komponenten für Listen, Tags, Dialoge

---

## Komponentenbeziehungen

- **Kita-Suche** nutzt **KitaCard**, Filter-Komponenten, Karten-Komponenten
- **Kita-Detail** nutzt Tabs: Über uns, Jobs, Galerie, Premium
- **Jobbörse** nutzt JobCard, Filter, Detailansicht
- **Matching** nutzt Formular, Ergebnisliste, Favoriten
- **E-Learning** nutzt Kurslisten, Detail, Fortschritt, Zertifikate
- **Admin** nutzt Tabellen, Formulare, Uploads, Statusanzeigen
- **Import-Service** wird vom Admin-Bereich angesteuert

---

## Kritische Implementierungspfade

- **Import-Flow:** Admin → Backend-API → Scraper → Status/Logs → Ergebnis
- **Kita-Suche:** Filter → API → Ergebnisliste → Detail
- **Job-Flow:** Job-Formular → API → Jobliste → Detail
- **Matching:** Formular → Algorithmus → Ergebnisliste
- **E-Learning:** Kurskauf → Fortschritt → Zertifikat
