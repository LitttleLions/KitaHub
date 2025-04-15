import * as cheerio from 'cheerio';
import { addLog, LogLevel } from '../../services/importStatusService.js';

export interface FeaturesInfo {
  benefits?: string[];
  certifications?: string[];
  awards?: string[];
}

/**
 * Extrahiert Merkmale, Zertifikate und Auszeichnungen aus dem HTML.
 * @param $ Cheerio-Instanz der Kita-Detailseite
 * @param sourceUrl URL der Kita-Seite (für Logging)
 * @param jobId Import-Job-ID (für Logging)
 */
export function extractFeatures(
  $: cheerio.CheerioAPI,
  sourceUrl: string,
  jobId: string
): FeaturesInfo {
  const features: FeaturesInfo = {};

  // Helper zum Extrahieren von Listen
  const extractListItems = (headingText: string | RegExp): string[] | undefined => {
    try {
      const heading = $('h2, h3, strong, b').filter((_, element) => {
        const text = $(element).text().trim();
        return typeof headingText === 'string'
          ? text.toLowerCase().includes(headingText.toLowerCase())
          : headingText.test(text);
      }).first();
      if (heading.length > 0) {
        const list = heading.next('ul, ol').first();
        if (list.length > 0) {
          const items = list.find('li').map((_, liElement) => $(liElement).text().trim()).get().filter((item: string) => item.length > 0);
          if (items.length > 0) return items;
        } else {
          const nextP = heading.next('p').first();
          if (nextP.length > 0) {
            const text = nextP.text();
            const items = text.split(/,|\n|•/).map((s: string) => s.trim()).filter((item: string) => item.length > 1);
            if (items.length > 0) return items;
          }
        }
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      addLog(jobId, `Error extracting list items for ${headingText}: ${message}`, LogLevel.WARN);
    }
    return undefined;
  };

  features.benefits = extractListItems(/merkmale|vorteile|benefits|angebote/i);
  features.certifications = extractListItems(/zertifikate|zertifizierungen|qualit.*siegel/i);
  features.awards = extractListItems(/auszeichnungen|preise|awards/i);

  if (features.benefits) {
    addLog(jobId, `Extracted benefits: ${features.benefits.join(', ')}`, LogLevel.INFO);
  } else {
    addLog(jobId, `Could not extract benefits from ${sourceUrl}`, LogLevel.INFO);
  }
  if (features.certifications) {
    addLog(jobId, `Extracted certifications: ${features.certifications.join(', ')}`, LogLevel.INFO);
  } else {
    addLog(jobId, `Could not extract certifications from ${sourceUrl}`, LogLevel.INFO);
  }
  if (features.awards) {
    addLog(jobId, `Extracted awards: ${features.awards.join(', ')}`, LogLevel.INFO);
  } else {
    addLog(jobId, `Could not extract awards from ${sourceUrl}`, LogLevel.INFO);
  }

  return features;
}
