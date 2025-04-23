// server/src/routes/kinderweltRoutes.ts
import express from 'express'; // Request, Response, NextFunction entfernt, da Typen inferiert werden
import { getStories, getStoryBySlug, createStory } from '../services/kinderweltDbService.js';
import { generateStory } from '../services/openaiService.js';
import { generateAndUploadImage } from '../services/leonardoService.js'; // Leonardo Service importieren
import { StoryApiFilters, CreateStoryPayload } from '../types/kinderwelt.js';
import slugifyModule from 'slugify';

// Korrekte Verwendung für ES Modules mit Default-Export
const slugify = slugifyModule.default || slugifyModule; 

const router = express.Router();

// --- Öffentliche Routen ---

// GET /api/kinderwelt - Katalog abrufen (mit Filtern)
// Füge expliziten Rückgabetyp Promise<void> hinzu
router.get('/', async (req, res, next): Promise<void> => {
  try {
    // Extrahiere und validiere Filter aus Query-Parametern
    // Explizite Typisierung für filters ist weiterhin sinnvoll
    const filters: StoryApiFilters = {
      theme: req.query.theme as string | undefined,
      age: req.query.age as string | undefined,
      readingTime: req.query.readingTime as string | undefined,
      limit: req.query.limit as string | undefined,
      offset: req.query.offset as string | undefined,
    };
    const stories = await getStories(filters);
    res.json(stories);
  } catch (error) {
    next(error); // Fehler an die zentrale Fehlerbehandlung weiterleiten
  }
});

// GET /api/kinderwelt/:slug - Einzelne Geschichte abrufen
// Füge expliziten Rückgabetyp Promise<void> hinzu
router.get('/:slug', async (req, res, next): Promise<void> => {
  try {
    const slug = req.params.slug;
    if (!slug) {
       res.status(400).json({ message: 'Slug fehlt in der Anfrage.' });
       return; // Frühzeitiger Ausstieg
    }
    const story = await getStoryBySlug(slug);
    if (!story) {
       res.status(404).json({ message: 'Geschichte nicht gefunden.' });
       return; // Frühzeitiger Ausstieg
    }
    res.json(story);
  } catch (error) {
    next(error);
  }
});


// --- Interne/Admin Routen (Beispiel, ggf. mit Authentifizierung schützen!) ---

// POST /api/kinderwelt/generate-and-save - Geschichte generieren und speichern
// ACHTUNG: Dieser Endpunkt sollte durch Admin-Auth geschützt werden!
// Füge expliziten Rückgabetyp Promise<void> hinzu
router.post('/generate-and-save', async (req, res, next): Promise<void> => {
    console.log('--- Start generate-and-save ---'); // Log: Start
    try {
        // Akzeptiere Prompt und optionale Zielvorgaben aus dem Frontend
        const { prompt, targetAge, targetReadingTime, targetTheme, seoDescription, seoKeywords } = req.body;

        if (!prompt) {
             res.status(400).json({ message: 'Prompt ist erforderlich.' });
             return; // Frühzeitiger Ausstieg
        }
        // Logge alle erhaltenen Parameter
        console.log(`[generate-and-save] Request Body erhalten:`, req.body); 

        // 1. Geschichte und Metadaten generieren (übergebe alle Zielvorgaben)
        console.log('[generate-and-save] Rufe generateStory auf...'); // Log: Before OpenAI
        const generatedData = await generateStory(prompt, targetAge, targetReadingTime, targetTheme); // targetReadingTime hinzugefügt
        console.log('[generate-and-save] generateStory erfolgreich. Titel:', generatedData.title); // Log: After OpenAI

        // 2. Slug generieren (basierend auf dem generierten Titel)
        const slug = slugify(generatedData.title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
        console.log(`[generate-and-save] Initialer Slug generiert: ${slug}`); // Log: Slug

        // Slug Eindeutigkeit prüfen und ggf. Suffix hinzufügen
        let finalSlug = slug;
        let counter = 1;
        while (await getStoryBySlug(finalSlug)) {
            console.warn(`[generate-and-save] Slug Kollision für "${finalSlug}". Füge Suffix hinzu.`);
            finalSlug = `${slug}-${Math.random().toString(36).substring(2, 7)}`; // Kurzer Zufallsstring
            counter++;
            if (counter > 5) { // Sicherheitslimit, um Endlosschleife zu vermeiden
                 throw new Error(`Konnte nach ${counter} Versuchen keinen eindeutigen Slug für "${slug}" generieren.`);
            }
        }
        if (finalSlug !== slug) {
            console.log(`[generate-and-save] Finaler eindeutiger Slug: ${finalSlug}`);
        }


        // 3. Metadaten parsen (Alter, Lesezeit)
        let ageMin: number | undefined;
        let ageMax: number | undefined;
        const ageMatch = generatedData.ageRecommendation.match(/(\d+)\s*-\s*(\d+)/);
        const singleAgeMatch = generatedData.ageRecommendation.match(/(\d+)/);
        if (ageMatch) {
            ageMin = parseInt(ageMatch[1], 10);
            ageMax = parseInt(ageMatch[2], 10);
        } else if (singleAgeMatch) {
            ageMin = parseInt(singleAgeMatch[1], 10);
            ageMax = ageMin; // Wenn nur eine Zahl, setze min und max gleich
        }

        let readingTime: number | undefined;
        const timeMatch = generatedData.readingTime.match(/(\d+)/);
        if (timeMatch) {
            readingTime = parseInt(timeMatch[1], 10);
        }

        // 4. Bilder generieren und hochladen (Cover + Inline)
        let coverImageUrl: string | undefined;
        let inlineImageUrls: string[] = [];

        console.log('[generate-and-save] Starte Bildgenerierung...'); // Log: Before Images
        try {
            // Cover-Bild (Prompt aus Titel oder Hauptthema)
            const coverPrompt = `Titelbild für eine Kindergeschichte namens "${generatedData.title}" über ${generatedData.themes?.[0] || 'ein Abenteuer'}`;
            console.log(`[generate-and-save] Generiere Cover-Bild mit Prompt: "${coverPrompt}"`); // Log: Cover Prompt
            coverImageUrl = await generateAndUploadImage(coverPrompt, 'Illustration'); // Oder anderen Stil wählen
            console.log(`[generate-and-save] Cover-Bild generiert: ${coverImageUrl}`); // Log: Cover Success
        } catch (imgError) {
            console.error("[generate-and-save] Fehler beim Generieren/Hochladen des Cover-Bildes:", imgError);
            // Nicht abbrechen, nur loggen und ohne Cover fortfahren
        }

        try {
            // Inline-Bilder (basierend auf [Bild: ...] Markern)
            if (generatedData.imageDescriptions && generatedData.imageDescriptions.length > 0) {
                console.log(`[generate-and-save] Generiere ${generatedData.imageDescriptions.length} Inline-Bilder...`); // Log: Inline Start
                // Führe die Generierung parallel aus, um Zeit zu sparen
                const imagePromises = generatedData.imageDescriptions.map((desc, index) => {
                    console.log(`[generate-and-save] Inline-Bild ${index + 1} Prompt: "${desc}"`); // Log: Inline Prompt
                    return generateAndUploadImage(desc, 'Illustration'); // Oder anderen Stil wählen
                });
                inlineImageUrls = await Promise.all(imagePromises);
                console.log('[generate-and-save] Inline-Bilder erfolgreich generiert:', inlineImageUrls); // Log: Inline Success
            } else {
                 console.log('[generate-and-save] Keine Inline-Bild-Beschreibungen gefunden.'); // Log: No Inline
            }
        } catch (imgError) {
            console.error("[generate-and-save] Fehler beim Generieren/Hochladen von Inline-Bildern:", imgError);
            // Nicht abbrechen, nur loggen und ohne Inline-Bilder fortfahren
        }


        // 5. Payload für DB erstellen (inkl. Bild-URLs und finalem Slug)
        console.log('[generate-and-save] Erstelle DB Payload...'); // Log: Before Payload
        const payload: CreateStoryPayload = {
            title: generatedData.title,
            slug: finalSlug, // Verwende den eindeutigen Slug
            content_text: generatedData.storyMarkdown, // Enthält noch die [Bild: ...] Marker
            themes: generatedData.themes || [],
            target_age_min: ageMin,
            target_age_max: ageMax,
            reading_time_minutes: readingTime,
            cover_image_url: coverImageUrl, // Hinzugefügt
            inline_image_urls: inlineImageUrls, // Hinzugefügt
            seo_description: seoDescription,
            seo_keywords: seoKeywords || [],
            openai_prompt: prompt,
        };
        console.log('[generate-and-save] DB Payload erstellt:', payload); // Log: Payload Content

        // 6. Geschichte in DB speichern
        console.log('[generate-and-save] Rufe createStory auf...'); // Log: Before DB Save
        const newStory = await createStory(payload);
        console.log(`[generate-and-save] Story erfolgreich gespeichert: ${newStory.id}`); // Log: DB Success

        res.status(201).json(newStory);
        console.log('--- Ende generate-and-save (Erfolg) ---'); // Log: End Success

    } catch (error) {
        // Verbessertes Logging im Fehlerfall
        console.error('--- Fehler in generate-and-save Route ---');
        console.error('Fehler Objekt:', error); // Logge das gesamte Fehlerobjekt
        // Stelle sicher, dass der Fehler an den zentralen Handler weitergeleitet wird
        next(error);
    }
});


export default router;
