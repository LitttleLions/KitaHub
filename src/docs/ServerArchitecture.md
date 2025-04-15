# Server- & Entwicklungsarchitektur – kita.de Plattform

*Stand: April 2025, aktualisiert nach vollständiger Docker-Migration*

---

## Übersicht

Diese Datei beschreibt die **aktuelle technische Architektur**, das **Setup der Entwicklungsumgebung**, die **Docker-Konfiguration** sowie die **Steuerung und Überwachung** der Backend- und Frontend-Server der kita.de Plattform.

---

## 1. Komponenten

| Komponente                   | Port   | Startart                          | Steuerung            | Hot Reload     |
|------------------------------|--------|----------------------------------|----------------------|----------------|
| **Frontend (React + Vite)**  | 8080   | Docker-Container (`docker-compose`) | `docker-compose`     | Ja (Vite)      |
| **Backend (Import-Service)** | 3001   | Docker-Container (`docker-compose`) | `docker-compose`     | Ja (nodemon)   |

Beide Services werden **vollständig containerisiert** betrieben und über **docker-compose** gemeinsam verwaltet.

---

## 2. Frontend (React + Vite)

- **Technologie:** React, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **Start im Container:** `npm run dev` (Vite-Entwicklungsserver)
- **Port:** 8080 (exposed)
- **Volumes:**
  - Quellcode wird eingebunden (`.:/app`)
  - `node_modules` als separates Volume
- **Hot Reload:** durch Vite + Volume-Mounting
- **Healthcheck:** prüft `http://localhost:8080`
- **Build:** `npm run build` erzeugt statische Dateien
- **API-Kommunikation:** direkt zu Backend auf Port 3001

---

## 3. Backend (Import-Service)

- **Technologie:** Node.js, Express, TypeScript, axios, cheerio
- **Start im Container:** `npm run dev` (mit `nodemon`)
- **Port:** 3001 (exposed)
- **Volumes:**
  - Quellcode wird eingebunden (`./server:/app`)
- **Funktion:** 
  - Scraping von kita.de
  - API-Endpunkte:
    - `GET /api/import/bundeslaender`
    - `GET /api/import/bezirke?bundeslandUrl=...`
    - `POST /api/import/start`
    - `GET /api/import/status/:jobId`
    - `GET /api/import/results/:jobId`
- **Statusverwaltung:** Im Arbeitsspeicher (`importStatusService`)
- **Speicherung:** Supabase-Anbindung geplant, noch nicht aktiv
- **Hot Reload:** Via `nodemon` bei Quellcodeänderung
- **Healthcheck:** prüft `http://localhost:3001`

---

## 4. Docker-Setup

### docker-compose.yml (aktuell)

```yaml
version: '3.8'

networks:
  kita-net:
    driver: bridge

services:
  app:
    build: .
    ports:
      - "8080:8080"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    restart: unless-stopped
    init: true
    networks:
      - kita-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  import-service:
    build:
      context: ./server
    ports:
      - "3001:3001"
    volumes:
      - ./server:/app
    command: npm run dev
    restart: unless-stopped
    networks:
      - kita-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

- **Beide Services sind Container**
- **Gemeinsames Netzwerk `kita-net`**
- **Beide haben Healthchecks**
- **Hot Reload durch Volume-Mounts**
- **Können gemeinsam oder einzeln via `docker-compose` gesteuert werden**

---

## 5. Start- und Steuerungsskripte

- **Start beider Container:**  
  `docker-compose up --build`

- **Stoppen beider Container:**  
  `docker-compose down`

- **Nur Frontend oder Backend starten:**  
  `docker-compose up app` oder `docker-compose up import-service`

- **Logs ansehen:**  
  `docker-compose logs -f`

- **Manuelle Steuerung innerhalb der Container ist nicht nötig.**

---

## 6. Netzwerk & Kommunikation

- **Frontend** spricht via HTTP direkt mit **Backend** (`import-service:3001` im Container-Netzwerk oder `localhost:3001` vom Host)
- **Kein API-Gateway oder Reverse Proxy** konfiguriert
- **In Produktion** ist ein Reverse Proxy (z.B. nginx) empfohlen

---

## 7. Healthchecks & Neustart

- **Beide Container** haben Healthchecks
- **Automatischer Restart** (`unless-stopped`)
- **Status kann via `docker ps` und `docker inspect` geprüft werden**

---

## 8. Hot Reload & Entwicklung

- **Frontend:**
  - Volume-Mounting + Vite → Live-Reload
- **Backend:**
  - Volume-Mounting + `nodemon` → automatischer Restart bei Codeänderung

---

## 9. Verbesserungsmöglichkeiten

- Reverse Proxy für API-Routing und SSL
- Automatisierte Tests in den Containern
- Persistente Datenbank-Container (Supabase, Postgres) ergänzen
- Monitoring & Logging erweitern

---

## 10. Diagramm (aktualisiert)

```mermaid
flowchart LR
    subgraph Docker-Container
        FE[React Frontend (Vite)]
        BE[Import-Service (Express)]
        FE -- Port 8080 --> Browser
        FE -- HTTP --> BE
    end

    Browser --> FE
```

---

## 11. Zusammenfassung

- **Frontend und Backend laufen beide containerisiert**
- **Beide werden über `docker-compose` gesteuert**
- **Kommunikation erfolgt direkt im Docker-Netzwerk**
- **Hot Reload für beide vorhanden**
- **Healthchecks für beide aktiv**
- **Entwicklung und Betrieb sind dadurch vereinfacht**

---

*Diese Datei wurde im April 2025 an die neue Container-Architektur angepasst.*
