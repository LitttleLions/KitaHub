
# Technische Architektur - kita.de Plattform

## Überblick

Die kita.de Plattform ist als moderne, responsive Webanwendung mit einer klaren Trennung zwischen Frontend und Backend implementiert. Die Architektur folgt einem modularen Ansatz, der einfache Erweiterungen und Wartung ermöglicht.

## Technologie-Stack

### Frontend
- **Framework**: React mit TypeScript
- **Routing**: React Router DOM für clientseitiges Routing
- **Styling**: Tailwind CSS für responsive, utility-first Design
- **UI-Komponenten**: Shadcn UI (auf Radix UI basierend) für zugängliche Komponenten
- **Statusmanagement**: React Query für serverseitigen Zustand und Caching
- **Animationen**: Framer Motion für flüssige UI-Übergänge

### Backend
- **Datenbank**: PostgreSQL (über Supabase)
- **API**: RESTful API über Supabase
- **Authentifizierung**: Supabase Auth
- **Dateispeicher**: Supabase Storage
- **Serverless Functions**: Supabase Edge Functions (falls benötigt)

## Datenbankmodell

### Hauptentitäten

1. **Companies (Kitas)**
   - Grundlegende Informationen: Name, Standort, Kontakt
   - Medien: Logo, Titelbild, Galerie
   - Beschreibungen: Pädagogisches Konzept, Merkmale
   - Premium-Features: Video, Spezialkonzepte, Zertifizierungen, Auszeichnungen
   - Bewertungen: Durchschnittsbewertung, Anzahl Bewertungen

2. **Jobs**
   - Stelleninformationen: Titel, Beschreibung, Anforderungen
   - Verknüpfung mit Kitas: Referenz auf Company-ID
   - Zeitliche Einstellungen: Veröffentlichungsdatum, Ablaufdatum
   - Features: Hervorhebung, Vorteile

## Architekturkomponenten

### Services-Layer

Der Services-Layer kapselt die Kommunikation mit dem Backend und stellt eine saubere API für die Komponenten bereit:

1. **Company Services**
   - `companyListService.ts`: Holt Listen von Kitas mit Filteroptionen
   - `companyDetailService.ts`: Ruft detaillierte Informationen zu einer Kita ab
   - `companyMapper.ts`: Wandelt Datenbankeinträge in Frontend-Typen um

2. **Job Services**
   - `jobService.ts`: Verwaltet Job-bezogene Funktionen (Abrufen, Filtern)

### Komponenten-Hierarchie

Die Anwendung ist in logische Komponentenbereiche unterteilt:

1. **Layout-Komponenten**
   - Navbar, Footer, Container-Layouts

2. **Seitenkomponenten**
   - Kitas.tsx: Suchseite für Kindertagesstätten
   - KitaDetail.tsx: Detailseite für eine Kindertagesstätte
   - JobBoard.tsx: Suchseite für Jobs
   - JobDetail.tsx: Detailseite für einen Job

3. **Feature-Komponenten**
   - KitaSearchForm: Suchformular für Kitas
   - KitaCard: Kartenansicht einer Kita in der Listenansicht
   - KitaPremiumSection: Premium-Inhalte für Kitas

## Datenfluss

1. **Kita-Suche**
   - Benutzer gibt Suchkriterien ein (Ort, Name)
   - SuchService ruft gefilterte Daten von der API ab
   - Suchergebnisse werden in der UI angezeigt und gecached

2. **Premium-Features**
   - Premium-Status wird in der Datenbank gespeichert
   - Premium-Kitas werden in Suchergebnissen priorisiert
   - Premium-Features werden auf Detailseiten angezeigt

## Leistungsoptimierungen

- **Lazy Loading**: Komponenten werden nur bei Bedarf geladen
- **Bildoptimierung**: Responsive Bilder, Platzhalter während des Ladens
- **Caching**: React Query für Datencaching und Wiederverwendung
- **Pagination**: Schrittweises Laden von Daten für bessere Performance

## Erweiterungspunkte

Die Architektur ist so gestaltet, dass sie einfach um diese Funktionen erweitert werden kann:

1. **Authentifizierung**: Für Kita-Träger und Jobsuchende
2. **E-Learning-Bereich**: Für pädagogische Weiterbildung
3. **Premium-Konten**: Bezahlte Funktionen für Kita-Träger
4. **Matching-Algorithmus**: KI-gestützte Empfehlungen für Eltern

## Monitoring und Fehlerbehandlung

- Fehler werden in der UI benutzerfreundlich dargestellt
- Backend-Fehler werden geloggt und vor dem Benutzer versteckt
- Toast-Benachrichtigungen für wichtige Statusinformationen

## Responsive Design

Die Anwendung nutzt einen Mobile-First-Ansatz mit responsivem Design für alle Bildschirmgrößen:
- Mobile: Optimierte Navigation und gestapelte Layouts
- Tablet: Zweispaltige Layouts für bessere Informationsdichte
- Desktop: Mehrspaltige Layouts mit umfangreichen Filteroptionen
