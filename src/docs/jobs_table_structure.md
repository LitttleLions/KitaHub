# Documentation: `public.jobs` Table Structure and Usage

This document clarifies the structure and intended usage of columns within the `public.jobs` table, based on analysis of the frontend code (`src/pages/JobBoard.tsx`, `src/pages/JobDetail.tsx`, and their sub-components).

## Overview

The `jobs` table stores information about job postings, primarily those offered by Kitas listed in the `companies` table.

## Key Fields and Usage:

*   **`id` (uuid):** Primary Key. Used for linking and unique identification.
*   **`title` (text):** The job title. Displayed prominently on cards and detail pages.
*   **`company_id` (uuid):** Foreign Key linking to the `companies` table. Used to fetch and display associated company/Kita information (name, logo, contact details, etc.).
*   **`location` (text):** The location of the job. Displayed on cards and detail pages. Used for filtering.
*   **`type` (text):** The type of employment (e.g., "Vollzeit", "Teilzeit"). Displayed on cards and detail pages. Used for filtering. Defaults to "Vollzeit" on the card if null.
*   **`salary` (text):** Salary information. Displayed on the job card if available.
*   **`posted_date` (timestamptz):** Date the job was posted. Displayed as a relative time (e.g., "vor 2 Tagen") on cards and detail pages.
*   **`employment_start` (text):** Intended start date for the position. (Note: Not explicitly found in the analyzed detail view code, but likely intended for display).
*   **`experience` (text):** Required experience level. Displayed in the highlights section of the detail page.
*   **`education` (text):** Required education level. Displayed in the highlights section of the detail page.
*   **`description` (text):** Detailed job description. Displayed as HTML on the detail page. Likely searched by keyword filters.
*   **`requirements` (jsonb):** Expected structure: **`Array<string>`**. Stores a list of job requirements. Displayed as a bulleted list on the detail page.
*   **`benefits` (jsonb):** Expected structure: **`Array<string>`**. Stores a list of benefits offered with the job. Displayed as a bulleted list on the detail page.
*   **`kita_image_url` (text):** URL for an image associated with the job/Kita. Displayed on the job card.
*   **`featured` (boolean):** Flag to indicate if the job is featured. Used for special styling/prioritization on job cards.
*   **`clickable` (boolean):** Used internally by the `JobCard` component (e.g., to control favorite icon visibility).
*   **`created_at` (timestamptz):** Timestamp of creation. Not directly displayed.
*   **`updated_at` (timestamptz):** Timestamp of last update. Not directly displayed.
*   **`expired_at` (timestamptz):** Timestamp when the job posting expires. Not directly displayed but likely used for filtering/cleanup logic.

This documentation should help ensure consistency when adding or querying job data.
