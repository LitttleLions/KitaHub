# Documentation: `public.companies` Table Structure and Usage

This document clarifies the structure and intended usage of columns within the `public.companies` table, particularly focusing on how Kita-specific information is stored, based on analysis of the frontend code (`src/pages/KitaDetail.tsx` and its sub-components).

## Overview

The `companies` table stores information about entities, which in the context of this application primarily represent Kitas (Kindertagesstätten).

## Key Fields for Kita Information:

*   **`name` (text):** The official name of the Kita.
*   **`description` (text):** A general description of the Kita. This field might contain unstructured information, potentially including details like opening hours (`Öffnungszeiten`), as no dedicated field was found for this.
*   **`location` (text):** **DEPRECATED/Legacy:** Originally intended for the full address or city name. Should be migrated to the structured fields below. May still contain the city name if `city` is empty.
*   **`street` (text):** The street name of the Kita's address.
*   **`house_number` (text):** The house number of the Kita's address.
*   **`postal_code` (text):** The postal code (PLZ) of the Kita's address.
*   **`city` (text):** The city where the Kita is located. Should be populated, potentially by migrating data from the legacy `location` field.
*   **`latitude` (numeric):** The geographical latitude of the Kita. Required for map functionality. Should be populated via geocoding.
*   **`longitude` (numeric):** The geographical longitude of the Kita. Required for map functionality. Should be populated via geocoding.
*   **`bundesland` (text):** The German federal state where the Kita is located.
*   **`type` (text):** Represents the type of facility (e.g., "Krippe", "Kindergarten", "Hort"). This likely corresponds to the **`Betreuungsform`** filter used in searches.
*   **`special_pedagogy` (text):** A textual description of any special pedagogical approaches used by the Kita. Displayed in the premium section.
*   **`benefits` (jsonb):** Expected structure: **`Array<string>`**. Stores a list of features or benefits offered by the Kita (e.g., "Spielplatz", "Essensversorgung", "Musikalische Früherziehung"). Used for display in the "About" tab and potentially for filtering. If empty/null, default values are used in the UI.
*   **`gallery` (jsonb):** Expected structure: **`Array<string>`**. Stores a list of image URLs for the Kita's gallery.
*   **`certifications` (jsonb):** Expected structure: **`Array<string>`**. Stores a list of certifications held by the Kita. Displayed in the premium section.
*   **`awards` (jsonb):** Expected structure: **`Array<string>`**. Stores a list of awards received by the Kita. Displayed in the premium section.
*   **`video_url` (text):** URL for an embedded video presentation of the Kita. Displayed in the premium section.
 *   **`is_premium` (boolean):** Flag indicating if the Kita has a premium profile, unlocking display of fields like `video_url`, `special_pedagogy`, `certifications`, and `awards`.
 *   **`sponsor_name` (text, nullable):** Name of the sponsoring organization (Träger). Added for data import.
 *   **`sponsor_type` (text, nullable):** Type of the sponsoring organization (Trägertyp). Added for data import.
 *   **`capacity_total` (text, nullable):** Total number of available spots (Plätze gesamt). Stored as text due to potential non-numeric values (e.g., "?"). Added for data import.
 *   **`capacity_free` (text, nullable):** Number of currently free spots (Freie Plätze). Stored as text. Added for data import.
 *   **`opening_hours_text` (text, nullable):** Textual description of opening hours (Öffnungszeiten). Added for data import.
 *   **`association` (text, nullable):** Associated umbrella organization (Dachverband). Added for data import.
 *   **`min_age` (text, nullable):** Minimum age for admission (Aufnahmealter von). Stored as text. Added for data import.
 *   **`max_age` (text, nullable):** Maximum age for care (Betreuungsalter bis). Stored as text. Added for data import.
 *   **`source_url` (text, unique, nullable):** The original URL from which the data was imported (e.g., from kita.de). Used as a unique identifier for upsert operations during import. Added for data import.


 ## Summary for Filters:

*   **`Betreuungsform`**: Maps to the `type` field.
*   **`Öffnungszeiten`**: No dedicated field. Check `description` or potentially `benefits`.
*   Other features/characteristics: Likely stored within the `benefits` array.

This documentation should help ensure consistency when adding or querying Kita data in the `companies` table.
