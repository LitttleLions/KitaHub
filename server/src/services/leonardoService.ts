// server/src/services/leonardoService.ts
import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from '../supabaseServiceRoleClient.js'; // Import geändert
import { v4 as uuidv4 } from 'uuid'; // Für eindeutige Dateinamen

dotenv.config();

const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
const LEONARDO_API_URL = 'https://cloud.leonardo.ai/api/rest/v1';

// --- Leonardo.ai API Typen (vereinfacht, basierend auf Doku) ---
interface LeonardoGenerationRequest {
  prompt: string;
  modelId?: string; // z.B. Phoenix oder Flux ID
  num_images?: number;
  width?: number;
  height?: number;
  styleUUID?: string; // z.B. Illustration
  alchemy?: boolean; // Quality Mode
  contrast?: number;
  // Weitere Parameter nach Bedarf
}

interface LeonardoGenerationResponse {
  sdGenerationJob: {
    generationId: string;
    // Weitere Felder, falls benötigt
  };
}

interface LeonardoImage {
    id: string;
    url: string; // URL des generierten Bildes bei Leonardo
    // Weitere Felder, falls benötigt (z.B. nsfw status)
}

interface LeonardoJobStatusResponse {
    generations_by_pk: {
        generated_images: LeonardoImage[];
        status: 'PENDING' | 'COMPLETE' | 'FAILED';
        // Weitere Felder, falls benötigt
    } | null;
}


// --- Service Funktion ---

/**
 * Generiert ein Bild mit Leonardo.ai basierend auf einem Prompt,
 * lädt es herunter und lädt es zu Supabase Storage hoch.
 * @param prompt - Die Beschreibung für das zu generierende Bild.
 * @param style - Optionaler Stil (z.B. 'Illustration', 'Sketch (Color)').
 * @returns Die öffentliche URL des hochgeladenen Bildes in Supabase Storage.
 * @throws Wirft Fehler bei API-Problemen oder Upload-Fehlern.
 */
export const generateAndUploadImage = async (prompt: string, style: string = 'Illustration'): Promise<string> => {
  if (!LEONARDO_API_KEY) {
    throw new Error('Leonardo API Key ist nicht konfiguriert.');
  }

  // 1. Modell und Stil auswählen (Jetzt: Flux Speed mit Illustration)
  // TODO: Modell-IDs und Style-UUIDs ggf. konfigurierbar machen
  const modelId = '1dd50843-d653-4516-a8e3-f0238ee453ff'; // Flux Speed ID
  const styleMap: { [key: string]: string } = {
      'Illustration': '645e4195-f63d-4715-a3f2-3fb1e6eb8c70',
      'Sketch (Color)': '093accc3-7633-4ffd-82da-d34000dfc0d6',
      'Watercolor': '1db308ce-c7ad-4d10-96fd-592fa6b75cc4', // Beispiel hinzugefügt
      // Weitere Stile nach Bedarf hinzufügen
  };
  const styleUUID = styleMap[style] || styleMap['Illustration']; // Fallback auf Illustration

  try {
    // 2. Bildgenerierungs-Job bei Leonardo starten
    console.log(`Starte Leonardo Bildgenerierung für Prompt: "${prompt}"`);
    const generationPayload: LeonardoGenerationRequest = {
      prompt: `Kinderbuch-Illustration im ${style}-Stil: ${prompt}`, // Prompt anpassen für besseren Stil
      modelId: modelId,
      num_images: 1, // Nur ein Bild generieren
      width: 1024,  // Geändert auf Standardgröße
      height: 1024, // Geändert auf Standardgröße
      styleUUID: styleUUID,
      // alchemy: true, // Entfernt, da nicht explizit für Flux Speed erwähnt
      contrast: 3.5, // Beibehalten gemäß Flux Beispiel
    };

    const generationResponse = await axios.post<LeonardoGenerationResponse>(
      `${LEONARDO_API_URL}/generations`,
      generationPayload,
      { headers: { 'Authorization': `Bearer ${LEONARDO_API_KEY}`, 'Content-Type': 'application/json' } }
    );

    const generationId = generationResponse.data?.sdGenerationJob?.generationId;
    if (!generationId) {
      throw new Error('Konnte keine generationId von Leonardo erhalten.');
    }
    console.log(`Leonardo Job gestartet, ID: ${generationId}`);

    // 3. Status des Jobs pollen, bis er abgeschlossen ist
    let imageUrl = '';
    let attempts = 0;
    const maxAttempts = 15; // Max Versuche (z.B. 15 * 5s = 75s)
    const pollInterval = 5000; // 5 Sekunden

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, pollInterval)); // Wartezeit
      attempts++;
      console.log(`Prüfe Status für Job ${generationId} (Versuch ${attempts}/${maxAttempts})...`);

      const statusResponse = await axios.get<LeonardoJobStatusResponse>(
        `${LEONARDO_API_URL}/generations/${generationId}`,
        { headers: { 'Authorization': `Bearer ${LEONARDO_API_KEY}` } }
      );

      const jobDetails = statusResponse.data?.generations_by_pk;

      if (jobDetails?.status === 'COMPLETE') {
        if (jobDetails.generated_images && jobDetails.generated_images.length > 0) {
          imageUrl = jobDetails.generated_images[0].url;
          console.log(`Bild erfolgreich generiert: ${imageUrl}`);
          break; // Job erfolgreich abgeschlossen
        } else {
          throw new Error('Leonardo Job abgeschlossen, aber keine Bilder gefunden.');
        }
      } else if (jobDetails?.status === 'FAILED') {
        throw new Error(`Leonardo Job ${generationId} fehlgeschlagen.`);
      }
      // Wenn PENDING, weiter pollen
    }

    if (!imageUrl) {
      throw new Error(`Leonardo Job ${generationId} hat nach ${attempts} Versuchen kein Ergebnis geliefert.`);
    }

    // 4. Bild von der Leonardo URL herunterladen
    console.log(`Lade Bild herunter von: ${imageUrl}`);
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageData = Buffer.from(imageResponse.data, 'binary');
    const fileExt = 'png'; // Annahme: Leonardo liefert PNG, oder Content-Type prüfen
    const fileName = `kinderwelt/${uuidv4()}.${fileExt}`;

    // 5. Bild in Supabase Storage hochladen
    console.log(`Lade Bild hoch zu Supabase Storage als: ${fileName}`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('story-images') // Name des Buckets (muss in Supabase existieren!)
      .upload(fileName, imageData, {
        cacheControl: '3600',
        upsert: false, // Nicht überschreiben, falls UUID kollidiert (unwahrscheinlich)
        contentType: `image/${fileExt}`,
      });

    if (uploadError) {
      console.error('Supabase Upload Fehler:', uploadError);
      throw new Error(`Fehler beim Hochladen des Bildes zu Supabase: ${uploadError.message}`);
    }
    if (!uploadData?.path) {
        throw new Error('Kein Pfad nach Supabase Upload erhalten.');
    }

    // 6. Öffentliche URL des Bildes aus Supabase abrufen
    const { data: publicUrlData } = supabase.storage
      .from('story-images')
      .getPublicUrl(uploadData.path);

    if (!publicUrlData?.publicUrl) {
        throw new Error('Konnte keine öffentliche URL für das Supabase Bild erhalten.');
    }

    console.log(`Bild erfolgreich hochgeladen: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;

  } catch (error) {
    console.error('Fehler in generateAndUploadImage:', error instanceof Error ? error.message : error);
    if (axios.isAxiosError(error) && error.response) {
        console.error('Leonardo API Fehler Details:', error.response.data);
        throw new Error(`Leonardo API Fehler: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`Fehler bei der Bildgenerierung oder dem Upload: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
};
