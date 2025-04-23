# Projektbrief – kita.de Plattform

**Version:** 1.0  
**Stand:** April 2025

---

## Zielsetzung

kita.de ist eine der größten Kita-Suchplattformen Deutschlands. Ziel ist es, ein zentrales, modernes Portal für frühkindliche Bildung, Betreuung und Familienorganisation zu bieten – mit Suchfunktion, Content, digitalen Services und Monetarisierung.

---

## Kernfunktionen

- **Kita-Suche:** Filterbare Suche, Kartenansicht, Premium-Hervorhebung
- **Kita-Detailseiten:** Profile mit Galerie, Video, Konzept, Kontakt, Premium-Features
- **Jobbörse:** Für Träger & Bewerber, Inserate, Pakete, Bezahlung
- **E-Learning:** Kurse für Fachkräfte & Eltern, Fortschritt, Zertifikate, Bezahlung
- **KI-Matching:** Eltern erhalten passende Kitas durch interaktives Formular & Algorithmus
- **Kinderwelt:** Bereich mit generierten Kindergeschichten (via OpenAI) zum Vorlesen und Entdecken, zur Nutzerbindung und SEO-Optimierung.
- **Admin-Bereich:** Verwaltung von Kitas, Jobs, Datenimport, Uploads, Status-Tracking

---

## Technologiestack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Express (Import-Service)
- **Datenbank:** Supabase (Postgres)
- **Containerisierung:** Docker, docker-compose
- **CMS:** Eigene Speicherung in der Datenbank vcon supabase der Komponenten (für Content)
- **Tracking:** DSGVO-konformes GA4

---

## Architektur

- Containerisierte Entwicklung (Frontend & Backend)
- Kommunikation via gemeinsames Docker-Netzwerk
- Hot Reload & Healthchecks aktiv
- API-Endpunkte für Import, Suche, Matching, Admin

---

## Monetarisierung

- Premium-Profile für Kitas
- Bezahlte Jobanzeigen (Pakete, Flatrate)
- Kursverkauf & Abos
- Affiliate-Links & Werbung

---

## Status (April 2025)

- Kernmodule implementiert
- Admin-Bereich in Arbeit (CRUD, Auth, Geocoding, Storage-Bereinigung offen)
- Supabase-Integration für Import-Service noch ausstehend
- Verbesserungen & Konsolidierung geplant
