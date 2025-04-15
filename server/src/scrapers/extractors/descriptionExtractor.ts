import * as cheerio from 'cheerio';
import { addLog, LogLevel } from '../../services/importStatusService.js'; // Import LogLevel

export interface DescriptionInfo {
  description?: string;
  oeffnungszeiten?: string;
  paedagogisches_konzept?: string; // Konzept wird oft im Beschreibungstext oder in der Tabelle gefunden
}

/**
 * Extrahiert Beschreibung, Öffnungszeiten und ggf. das pädagogische Konzept aus dem HTML.
 * @param $ Cheerio-Instanz der Kita-Detailseite
 * @param sourceUrl URL der Kita-Seite (für Logging)
 * @param jobId Import-Job-ID (für Logging)
 */
export function extractDescriptionAndHours(
  $: cheerio.CheerioAPI,
  sourceUrl: string,
  jobId: string
): DescriptionInfo {
  const descriptionInfo: DescriptionInfo = {};

  // --- Opening Hours ---
  try {
    const hoursHeading = $('h2, h3').filter((_, element) => $(element).text().trim().toLowerCase().includes('öffnungszeiten')).first();
    if (hoursHeading.length > 0) {
      const nextElement = hoursHeading.next('p, div, ul').first();
      if (nextElement.length > 0) {
        descriptionInfo.oeffnungszeiten = nextElement.text().trim().replace(/\s+/g, ' ');
        addLog(jobId, `Opening hours found: ${descriptionInfo.oeffnungszeiten}`, LogLevel.INFO);
      } else {
        addLog(jobId, `Found 'Öffnungszeiten' heading but no suitable next element in ${sourceUrl}`, LogLevel.WARN);
      }
    } else {
      addLog(jobId, `Could not find 'Öffnungszeiten' heading in ${sourceUrl}`, LogLevel.INFO); // Info level, as it might not exist
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting opening hours: ${message}`, LogLevel.WARN);
  }

  // --- Description & Konzept ---
  try {
    let descriptionText = '';
    // Prioritize specific description/concept sections
    const descSelectors = [
      '#beschreibung', '.beschreibung', '[itemprop="description"]',
      '#konzept', '.konzept', '#paedagogisches-konzept', '.paedagogisches-konzept',
      '#ueber-uns', '.ueber-uns', '#about', '.about'
    ];
    let descContainer = $(descSelectors.join(', ')).first();
    let foundInSpecificContainer = false;

    if (descContainer.length > 0) {
      // NEU: Übernehme das HTML der Beschreibung, nicht nur den Text
      descriptionText = descContainer.html()?.trim() || '';
      if (descriptionText) {
        addLog(jobId, `Description/Concept found in specific container (HTML übernommen): ${descContainer.attr('id') || '.' + descContainer.attr('class')}`, LogLevel.INFO);
        foundInSpecificContainer = true;
        // Check if the container specifically mentions 'Konzept'
        const containerId = descContainer.attr('id')?.toLowerCase() || '';
        const containerClass = descContainer.attr('class')?.toLowerCase() || '';
        if (containerId.includes('konzept') || containerClass.includes('konzept')) {
          // Konzept ggf. als reinen Text extrahieren
          descriptionInfo.paedagogisches_konzept = descContainer.text().replace(/\s+/g, ' ').trim();
          // Avoid setting description if it's clearly just the concept
          if (!containerId.includes('beschreibung') && !containerClass.includes('beschreibung')) {
            descriptionText = '';
          }
        }
      }
    }

    // Fallback: Look for headings and grab subsequent paragraphs if not found above or if description is still empty
    if (!foundInSpecificContainer || !descriptionText) {
      const infoHeading = $('h2:contains("Informationen"), h2:contains("Beschreibung"), h2:contains("Konzept")').first();
      if (infoHeading.length > 0) {
        const headingTextLower = infoHeading.text().toLowerCase();
        const subsequentParagraphs = infoHeading.nextAll('p').map((_, p) => $(p).text().trim()).get().filter(t => t.length > 20).join('\n\n');

        if (subsequentParagraphs) {
            addLog(jobId, `Description/Concept found after heading: ${infoHeading.text()}`, LogLevel.INFO);
            if (headingTextLower.includes('konzept') && !descriptionInfo.paedagogisches_konzept) {
                descriptionInfo.paedagogisches_konzept = subsequentParagraphs.replace(/\s+/g, ' ').trim();
                // Only set description if heading wasn't *just* konzept
                if (!headingTextLower.includes('beschreibung')) {
                    descriptionText = ''; // Clear potential description if heading was concept
                } else {
                    descriptionText = subsequentParagraphs; // Keep it as description too
                }
            } else {
                 descriptionText = subsequentParagraphs; // Assume it's the main description
            }
        }
      }
    }

    // Last resort: Grab first few long paragraphs from main content area if still no description
    if (!descriptionText && !descriptionInfo.paedagogisches_konzept) {
      descriptionText = $('main p, article p').map((_, p) => $(p).text().trim()).get().filter(t => t.length > 50).slice(0, 3).join('\n\n');
      if (descriptionText) {
        addLog(jobId, `Description found using main content paragraph fallback.`, LogLevel.INFO);
      }
    }

    // Spezialfall: Beschreibung aus <div id="profile_text"> extrahieren
    if (!descriptionInfo.description) {
      const profileText = $('#profile_text');
      if (profileText.length > 0) {
        const paragraphs = profileText.find('p').map((_, p) => $(p).text().trim()).get().filter(t => t.length > 20);
        if (paragraphs.length > 0) {
          descriptionInfo.description = paragraphs.join('\n\n').replace(/\s+/g, ' ').trim();
          addLog(jobId, `Description extracted from #profile_text`, LogLevel.INFO);
        }
      }
    }

    // Assign cleaned description if found and not already assigned as concept
    if (descriptionText) {
      descriptionInfo.description = descriptionText.replace(/\s+/g, ' ').trim();
    }

    if (!descriptionInfo.description && !descriptionInfo.paedagogisches_konzept) {
      addLog(jobId, `Could not extract description or concept from ${sourceUrl}`, LogLevel.INFO);
    } else if (!descriptionInfo.description) {
        addLog(jobId, `Could not extract main description from ${sourceUrl}`, LogLevel.INFO);
    } else if (!descriptionInfo.paedagogisches_konzept) {
        addLog(jobId, `Could not extract pädagogisches Konzept from ${sourceUrl}`, LogLevel.INFO);
    }

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting description/concept: ${message}`, LogLevel.WARN);
  }

  return descriptionInfo;
}
