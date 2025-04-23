// server/src/services/openaiService.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Lade Umgebungsvariablen (insbesondere OPENAI_API_KEY)
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Definiere den System-Prompt als Konstante
// Erweitert um Anweisungen für Metadaten und Bildbeschreibungen
const SYSTEM_PROMPT = `Du bist ein fröhlicher und kreativer Geschichtenerzähler für Kinder.
Deine Aufgabe ist es, eine ausführliche, bewegende und schöne Geschichte basierend auf den vom Benutzer gegebenen Themen oder Keywords zu erzählen. Füge einen Hauch Magie, etwas Herz und viel Gefühl hinzu. 😊
Die Geschichte sollte eine angemessene Länge haben (ca. 500-1000 Wörter).

**Formatierungsregeln (SEHR WICHTIG!):**
1.  Beginne deine Antwort IMMER mit den folgenden vier Zeilen, genau in diesem Format:
    Titel: [Hier der kreative Titel der Geschichte]
    Alter: [Altersangabe, z.B. 3-5 Jahre]
    Lesezeit: [Geschätzte Lesezeit, z.B. 5 Minuten]
    Themen: [Thema1, Thema2, Thema3]
2.  Nach diesen vier Zeilen folgt eine Leerzeile.
3.  Danach beginnt der eigentliche Text der Geschichte im Markdown-Format.
4.  Strukturiere den Text mit Absätzen für gute Lesbarkeit.
5.  Füge optional ein oder zwei passende Zwischenüberschriften (mit '##') ein.
6.  Streue sparsam passende Emojis ein, um die Geschichte aufzulockern.
7.  **Bilder:** Füge an 2-3 passenden Stellen im Text Bildbeschreibungen im Format "[Bild: Eine kurze, prägnante Beschreibung des gewünschten Bildes]" ein. **Wichtig:** Wenn ein Tier die Hauptfigur im Bild ist, nenne explizit die Tierart (z.B. "[Bild: Eine glückliche Maus namens Pieps...]" statt nur "[Bild: Pieps...]"). Diese Marker helfen uns später, Bilder einzufügen.

**Beispiel für den Anfang deiner Antwort:**
Titel: Der mutige kleine Stern
Alter: 4-6 Jahre
Lesezeit: 7 Minuten
Themen: Mut, Sterne, Nacht, Freundschaft

Es war einmal ein kleiner Stern namens Funkel...
[Bild: Ein kleiner, lächelnder Stern am Nachthimmel]
... er lebte hoch oben im Himmel...`;

/**
 * Struktur für die von OpenAI generierten und geparsten Story-Daten.
 */
export interface GeneratedStoryData {
  title: string;
  ageRecommendation: string; // z.B. "3-5 Jahre"
  readingTime: string; // z.B. "5 Minuten"
  themes: string[]; // Array von Themen
  storyMarkdown: string; // Der reine Markdown-Text der Geschichte
  imageDescriptions: string[]; // Array der extrahierten Bildbeschreibungen
}

/**
 * Generiert eine Kindergeschichte basierend auf gegebenen Themen/Keywords und optionalen Zielvorgaben.
 * @param userPrompt - Die Themen oder Keywords, die in der Geschichte vorkommen sollen.
 * @param targetAge - Optionale Ziel-Altersgruppe (wird dem User-Prompt hinzugefügt).
 * @param targetReadingTime - Optionale Ziel-Lesezeit (wird dem User-Prompt hinzugefügt).
 * @param targetTheme - Optionales Ziel-Thema (wird dem User-Prompt hinzugefügt).
 * @returns Ein Promise, das zu einem GeneratedStoryData Objekt auflöst.
 * @throws Wirft einen Fehler, wenn die Generierung fehlschlägt oder der API-Key fehlt.
 */
export const generateStory = async (
  userPrompt: string,
  targetAge?: string, // Typen könnten hier spezifischer sein (AgeRange), aber string ist flexibler für die API
  targetReadingTime?: string, // Typen könnten hier spezifischer sein (ReadingTimeRange)
  targetTheme?: string
): Promise<GeneratedStoryData> => {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API Key is not configured.');
    throw new Error('OpenAI API Key ist nicht konfiguriert.');
  }

  try {
    // Füge optionale Zielvorgaben zum User-Prompt hinzu
    let finalUserPrompt = userPrompt;
    if (targetAge) {
      finalUserPrompt += ` (Zielalter: ${targetAge})`;
    }
    if (targetReadingTime) {
      finalUserPrompt += ` (Ziel-Lesezeit: ${targetReadingTime})`;
    }
    if (targetTheme) {
      finalUserPrompt += ` (Gewünschtes Thema: ${targetTheme})`;
    }
    console.log(`[generateStory] Finaler User-Prompt für OpenAI: "${finalUserPrompt}"`); // Log des finalen Prompts

    // Verwende die Chat Completions API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Oder ein anderes geeignetes Modell
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: finalUserPrompt, // Der angepasste Prompt
        },
      ],
      temperature: 0.8, // Etwas Kreativität erlauben
      max_tokens: 1500, // Erhöht, um längere Geschichten zu ermöglichen
      top_p: 1,
    });

    // Extrahiere den generierten Text
    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('Kein Inhalt von OpenAI erhalten.');
    }

    // Parse den rawContent, um die strukturierten Daten zu extrahieren
    const lines = rawContent.trim().split('\n');
    const generatedData: Partial<GeneratedStoryData> = {
        themes: [],
        imageDescriptions: [],
    };
    let storyStartIndex = -1;

    // Extrahiere Metadaten
    if (lines[0]?.startsWith('Titel: ')) {
        generatedData.title = lines[0].substring(7).trim();
    }
    if (lines[1]?.startsWith('Alter: ')) {
        generatedData.ageRecommendation = lines[1].substring(7).trim();
    }
    if (lines[2]?.startsWith('Lesezeit: ')) {
        generatedData.readingTime = lines[2].substring(10).trim();
    }
    if (lines[3]?.startsWith('Themen: ')) {
        generatedData.themes = lines[3].substring(8).split(',').map(theme => theme.trim()).filter(Boolean);
    }

    // Finde den Start der eigentlichen Geschichte (nach der ersten Leerzeile nach den Metadaten)
    for (let i = 4; i < lines.length; i++) {
        if (lines[i].trim() === '') {
            storyStartIndex = i + 1;
            break;
        }
    }

    if (storyStartIndex === -1 || !generatedData.title || !generatedData.ageRecommendation || !generatedData.readingTime) {
        console.error("Konnte Metadaten nicht korrekt aus OpenAI-Antwort extrahieren:", rawContent);
        throw new Error('Ungültiges Format der OpenAI-Antwort.');
    }

    // Extrahiere den Markdown-Text und Bildbeschreibungen
    const storyMarkdownRaw = lines.slice(storyStartIndex).join('\n');
    const imageDescriptions: string[] = [];
    const imageRegex = /\[Bild: (.*?)\]/g;
    let match;
    while ((match = imageRegex.exec(storyMarkdownRaw)) !== null) {
        imageDescriptions.push(match[1]);
    }
    // Optional: Entferne die Marker aus dem finalen Text, oder behalte sie, je nach Anforderung
    // generatedData.storyMarkdown = storyMarkdownRaw.replace(imageRegex, '').trim();
    generatedData.storyMarkdown = storyMarkdownRaw.trim(); // Behalte Marker vorerst
    generatedData.imageDescriptions = imageDescriptions;


    console.log(`Story generated for prompt: "${finalUserPrompt}"`);

    // Stelle sicher, dass alle benötigten Felder vorhanden sind, bevor zurückgegeben wird
    if (!generatedData.title || !generatedData.ageRecommendation || !generatedData.readingTime || !generatedData.storyMarkdown) {
         throw new Error('Fehler beim Parsen der OpenAI-Antwort: Nicht alle Felder gefunden.');
    }


    return generatedData as GeneratedStoryData; // Type assertion, da wir die Pflichtfelder geprüft haben

  } catch (error) {
    console.error(`Error generating story with OpenAI for prompt "${userPrompt}":`, error);
    // Typüberprüfung für den Fehler
    if (error instanceof OpenAI.APIError) {
      // Spezifische Behandlung für OpenAI API-Fehler
      throw new Error(`OpenAI API Fehler: ${error.status} ${error.name} - ${error.message}`);
    } else if (error instanceof Error) {
      // Allgemeine Fehlerbehandlung
      throw new Error(`Fehler bei der Generierung der Geschichte: ${error.message}`);
    } else {
      // Fallback für unbekannte Fehlertypen
      throw new Error('Ein unbekannter Fehler ist bei der Generierung der Geschichte aufgetreten.');
    }
  }
};
