# Specification: Image Usage in Kita Jobs Hub

This document outlines how images are utilized within the Kita Jobs Hub application, covering both database-driven images for Kitas/Companies and static images used for general website elements. This is based on code analysis performed on [Date of Analysis - e.g., 2025-04-01].

**1. Database-Driven Images (Kitas/Companies)**

These images are associated with specific Kita/Company entities stored in the `public.companies` table and fetched from the database via the application's backend services.

*   **Fields Used (in `public.companies` table & `src/types/company.ts`):**
    *   `logo_url` (string): Stores the URL for the Kita's primary logo or avatar.
        *   **Usage:** Displayed in smaller contexts like listing cards (`KitaCard`, `JobCard`, `FeaturedKitaCard`), profile headers (`CompanyProfile`, `KitaDetailHeader`), and job details (`JobDetail`). Often rendered via the `<CompanyAvatar>` component (`src/components/ui/company-avatar.tsx`), which handles missing URLs with a placeholder.
    *   `cover_image_url` (string): Stores the URL for a larger, representative cover image for the Kita.
        *   **Usage:** Displayed prominently on listing cards (`KitaCard`, `FeaturedKitaCard`), profile headers (`CompanyProfile`, `KitaDetailHeader`). Typically rendered using a standard `<img>` tag.
    *   `gallery` (Array<string>): Stores an array of image URLs for a detailed gallery view.
        *   **Usage:** Displayed in a dedicated "Galerie" tab on detail pages (`KitaDetail`, `CompanyProfile`) using the `KitaGalleryTab` component (`src/components/kitas/detail/KitaGalleryTab.tsx`). If the `gallery` array is empty or missing, a set of placeholder images (`randomGallery` defined in the respective page components) is used as a fallback.

*   **Data Source:** URLs stored in the `public.companies` table in the Supabase database.

**2. Static Website Images**

These images are part of the website's design and content, not tied to specific database entities.

*   **Usage:** Used for general website elements like the homepage hero section (`src/components/home/Hero.tsx`), potentially guide pages, background elements, and other static content areas.
*   **Referencing:** Images are referenced directly in the code (e.g., within `<img>` tags or potentially CSS `background-image` properties) using absolute paths from the web root, which correspond to files within the `public` directory.
    *   Example Found: `<img src="/lovable-uploads/DSC02648.jpg" ... />` in `src/components/home/Hero.tsx`.
*   **Storage:** Image files are located within the project's `public/` directory. Observed subdirectories include:
    *   `public/images/kitas/`
    *   `public/lovable-uploads/`
    *   `public/` (root, e.g., `favicon.ico`, `placeholder.svg`)

**3. Identified Inconsistencies & Observations**

*   **Documentation Mismatch:** The `src/docs/companies_table_structure.md` file should be updated to include the `logo_url` and `cover_image_url` fields, as they are actively used and defined in `src/types/company.ts`.
*   **Placeholder Handling:**
    *   `logo_url`: Handled by the `<CompanyAvatar>` component.
    *   `gallery`: Handled by fallback to `randomGallery` array in page components (`KitaDetail.tsx`, `CompanyProfile.tsx`).
    *   `cover_image_url`: No explicit placeholder handling was observed in the searched components (`KitaCard.tsx`, `FeaturedKitaCard.tsx`, `CompanyProfile.tsx`, `KitaDetailHeader.tsx`). This could lead to broken image icons if the URL is missing or invalid. Consistent placeholder logic should be considered.
*   **Static Image Path Clarity:** The purpose and distinction between `/public/images/kitas/` and `/public/lovable-uploads/` are unclear. Establishing clear conventions for organizing static assets (e.g., theme images vs. content images) is recommended.
*   **Static Image Referencing Scope:** The analysis primarily focused on `.tsx` files. Static images might also be referenced in CSS/SCSS files, which would require a separate search.

**Recommendations:**

1.  Update `src/docs/companies_table_structure.md` to include `logo_url` and `cover_image_url`.
2.  Implement or verify consistent placeholder image handling for `cover_image_url`.
3.  Clarify the intended use of `public/images/kitas/` vs. `public/lovable-uploads/` and document the convention.
4.  Consider a broader search (including CSS files) if a complete inventory of static image usage is required.
