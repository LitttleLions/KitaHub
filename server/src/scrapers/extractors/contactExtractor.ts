import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import { addLog } from '../../services/importStatusService.js';
import { extractCleanText } from '../utils/cheerioUtils.js';

/**
 * Extrahiert Kontaktinformationen (Telefon, Fax, E-Mail und Website) aus dem HTML.
 * @param $ Cheerio-Instanz der Kita-Detailseite
 * @param sourceUrl URL der Kita-Seite (für Logging und Domain-Check)
 * @param jobId Import-Job-ID (für Logging)
 */
export interface ContactInfo {
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
}

export function extractContact(
  $: cheerio.CheerioAPI,
  sourceUrl: string,
  jobId: string
): ContactInfo {
  const contactInfo: ContactInfo = {};

  // --- Kitaname extrahieren und loggen ---
  const kitaName = $('h1 a').text().trim() || $('h1').text().trim();
  if (kitaName) {
    addLog(jobId, `[EXTRACT] Kita-Name: ${kitaName}`, 'info');
  } else {
    addLog(jobId, `[EXTRACT] Kein Kita-Name gefunden!`, 'warn');
  }

  // --- Adresse extrahieren und loggen (mit <br>-Split) ---
  const addressHtml = $('p.address').html();
  if (addressHtml) {
    const addressLines = addressHtml.split(/<br\s*\/?\s*>/i).map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
    addLog(jobId, `[EXTRACT] Adresse (Zeilen): ${addressLines.join(' | ')}`, 'info');
    // Optional: Zeilen gezielt zuordnen
    if (addressLines.length >= 2) {
      addLog(jobId, `[EXTRACT] Straße: ${addressLines[0]}`, 'info');
      addLog(jobId, `[EXTRACT] PLZ/Ort: ${addressLines[1]}`, 'info');
      if (addressLines[2]) addLog(jobId, `[EXTRACT] Bezirk: ${addressLines[2]}`, 'info');
    }
  } else {
    addLog(jobId, `[EXTRACT] Keine Adresse gefunden!`, 'warn');
  }

  // --- Kontakt-Container finden (wie im Original) ---
  const potentialContainers = $('div.details, .kontakt, .contact, #kontakt, #contact, address, .adresse, #adresse, .sidebar, aside, .footer, footer');
  let contactContainer = potentialContainers.first() as cheerio.Cheerio<Element>;
  if (contactContainer.length === 0) {
    contactContainer = $('h1').first().closest('div, section, article') as cheerio.Cheerio<Element>;
    if (
      contactContainer.length === 0 ||
      (contactContainer.prop('tagName')?.toLowerCase?.() === 'body')
    ) {
      contactContainer = $('main, #main, .main-content, article').first() as cheerio.Cheerio<Element>;
    }
    if (contactContainer.length === 0) {
      contactContainer = $('body') as cheerio.Cheerio<Element>;
      addLog(jobId, `No specific contact container found, using body as fallback.`, 'warn');
    } else {
      addLog(
        jobId,
        `Using fallback container: ${contactContainer.prop('tagName')}.${contactContainer.attr('class') || ''}${contactContainer.attr('id') ? '#' + contactContainer.attr('id') : ''}`,
        'info'
      );
    }
  } else {
    addLog(
      jobId,
      `Using primary container: ${contactContainer.prop('tagName')}.${contactContainer.attr('class') || ''}${contactContainer.attr('id') ? '#' + contactContainer.attr('id') : ''}`,
      'info'
    );
  }

  // --- Telefon extrahieren ---
  try {
    let phoneFound = false;
    const phoneSelectors = [
      'a[href^="tel:"]',
      '.phone', '.telefon', 'dd.phone', 'dd.telefon',
      '*:contains("Telefon:")', '*:contains("Tel.:")', '*:contains("Tel:")', '*:contains("Fon:")'
    ];
    const phoneRegex = /([\d\s\/-]{6,})/;

    for (const selector of phoneSelectors) {
      const elements = contactContainer.find(selector);
      elements.each((_, el) => {
        const element = $(el);
        let phoneText = '';
        if (element.is('a')) {
          phoneText = element.attr('href')?.replace(/tel:| /g, '') || '';
        } else {
          phoneText = element.text();
          if (phoneText.toLowerCase().includes('telefon') || phoneText.toLowerCase().includes('tel') || phoneText.toLowerCase().includes('fon')) {
            const siblingNode = element.get(0)?.nextSibling;
            let nextSiblingText = siblingNode ? $(siblingNode).text().trim() : '';
            if (!nextSiblingText && element.next().length > 0) {
              nextSiblingText = element.next().text().trim();
            }
            if (nextSiblingText && phoneRegex.test(nextSiblingText)) {
              phoneText = nextSiblingText;
            } else {
              phoneText = extractCleanText(element);
            }
          }
        }
        const phoneMatch = phoneText.match(phoneRegex);
        if (phoneMatch) {
          contactInfo.phone = phoneMatch[0].trim().replace(/[\s\/-]+/g, ' ').replace(/^0/, '+49 ');
          phoneFound = true;
          addLog(jobId, `Phone found: ${contactInfo.phone}`, 'info');
          return false;
        }
      });
      if (phoneFound) break;
    }
    if (!phoneFound) {
      addLog(jobId, `Could not find phone number in ${sourceUrl}`, 'info');
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting phone: ${message}`, 'warn');
  }

  // --- Fax extrahieren und loggen ---
  const faxText = $('p.fax').text().replace(/Fax:/i, '').trim();
  if (faxText) {
    addLog(jobId, `[EXTRACT] Fax: ${faxText}`, 'info');
  } else {
    addLog(jobId, `[EXTRACT] Kein Fax gefunden!`, 'warn');
  }

  try {
    let faxFound = false;
    const faxSelectors = [
      '.fax', 'p.fax', 'dd.fax',
      '*:contains("Fax:")'
    ];
    const faxRegex = /([\d\s\/-]{6,})/;

    for (const selector of faxSelectors) {
      const elements = contactContainer.find(selector);
      elements.each((_, el) => {
        const element = $(el);
        let faxText = element.text();
        if (faxText.toLowerCase().includes('fax')) {
          const siblingNode = element.get(0)?.nextSibling;
          let nextSiblingText = siblingNode ? $(siblingNode).text().trim() : '';
          if (!nextSiblingText && element.next().length > 0) {
            nextSiblingText = element.next().text().trim();
          }
          if (nextSiblingText && faxRegex.test(nextSiblingText)) {
            faxText = nextSiblingText;
          }
        }
        const faxMatch = faxText.match(faxRegex);
        if (faxMatch) {
          contactInfo.fax = faxMatch[0].trim().replace(/[\s\/-]+/g, ' ').replace(/^0/, '+49 ');
          faxFound = true;
          addLog(jobId, `Fax found: ${contactInfo.fax}`, 'info');
          return false;
        }
      });
      if (faxFound) break;
    }
    if (!faxFound) {
      addLog(jobId, `Could not find fax number in ${sourceUrl}`, 'info');
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting fax: ${message}`, 'warn');
  }

  // --- E-Mail extrahieren ---
  try {
    let emailFound = false;
    const emailSelectors = [
      'a[href^="mailto:"]',
      '.email', '.mail', 'dd.email', 'dd.mail',
      '*:contains("E-Mail:")', '*:contains("Mail:")', '*:contains("@")'
    ];
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

    for (const selector of emailSelectors) {
      const elements = contactContainer.find(selector);
      elements.each((_, el) => {
        const element = $(el);
        let potentialEmail = '';
        if (element.is('a')) {
          potentialEmail = element.attr('href')?.replace(/mailto:| /g, '') || element.text();
        } else {
          potentialEmail = element.text();
          if (potentialEmail.toLowerCase().includes('e-mail') || potentialEmail.toLowerCase().includes('mail')) {
            const siblingNode = element.get(0)?.nextSibling;
            let nextSiblingText = siblingNode ? $(siblingNode).text().trim() : '';
            if (!nextSiblingText && element.next().length > 0) {
              nextSiblingText = element.next().text().trim();
            }
            if (nextSiblingText && emailRegex.test(nextSiblingText)) {
              potentialEmail = nextSiblingText;
            } else {
              potentialEmail = extractCleanText(element);
            }
          }
        }
        potentialEmail = potentialEmail.replace(/\[\s*at\s*\]|\(\s*at\s*\)/gi, '@')
                                       .replace(/\[\s*dot\s*\]|\(\s*dot\s*\)/gi, '.')
                                       .replace(/\s+/g, '');
        const emailMatch = potentialEmail.match(emailRegex);
        if (emailMatch) {
          contactInfo.email = emailMatch[0];
          emailFound = true;
          addLog(jobId, `Email found: ${contactInfo.email}`, 'info');
          return false;
        }
      });
      if (emailFound) break;
    }
    if (!emailFound) {
      addLog(jobId, `Could not find email in ${sourceUrl}`, 'info');
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting email: ${message}`, 'warn');
  }

  // --- Website extrahieren ---
  try {
    let websiteFound = false;
    const websiteSelectors = [
      'a[href*="://"]:not([href*="mailto:"]):not([href*="tel:"])',
      '.website a', 'dd.website a',
      '*:contains("Website:")', '*:contains("Internet:")'
    ];
    const ownDomain = new URL(sourceUrl).hostname;

    for (const selector of websiteSelectors) {
      const elements = contactContainer.find(selector);
      elements.each((_, el) => {
        const element = $(el);
        let href = '';
        if (element.is('a')) {
          href = element.attr('href') || '';
        } else {
          const link = element.find('a[href*="://"]').first();
          if (link.length > 0) {
            href = link.attr('href') || '';
          } else {
            const nextLink = element.next('a[href*="://"]').first();
            if (nextLink.length > 0) {
              href = nextLink.attr('href') || '';
            } else {
              const textMatch = element.text().match(/(https?:\/\/[^\s"<>]+)/);
              if (textMatch) href = textMatch[0];
            }
          }
        }
        if (href) {
          try {
            href = href.replace(/[\s,"<>].*/, '').trim();
            if (!href.startsWith('http')) href = 'https://' + href;
            const url = new URL(href);
            if (
              url.hostname &&
              url.hostname.includes('.') &&
              !url.hostname.includes(ownDomain) &&
              !url.hostname.includes('kita.de') &&
              !url.hostname.includes('google') &&
              !url.hostname.includes('facebook')
            ) {
              contactInfo.website = href;
              websiteFound = true;
              addLog(jobId, `Website found: ${contactInfo.website}`, 'info');
              return false;
            }
          } catch (e) {
            addLog(jobId, `Ignoring invalid URL candidate: ${href}`, 'info');
          }
        }
      });
      if (websiteFound) break;
    }
    if (!websiteFound) {
      $('a[href*="://"]:not([href*="mailto:"]):not([href*="tel:"])').each((_, el) => {
        const href = $(el).attr('href');
        if (href) {
          try {
            let cleanHref = href.replace(/[\s,"<>].*/, '').trim();
            if (!cleanHref.startsWith('http')) cleanHref = 'https://' + cleanHref;
            const url = new URL(cleanHref);
            if (
              url.hostname &&
              url.hostname.includes('.') &&
              !url.hostname.includes(ownDomain) &&
              !url.hostname.includes('kita.de') &&
              !url.hostname.includes('google') &&
              !url.hostname.includes('facebook')
            ) {
              const linkText = $(el).text().toLowerCase();
              if (
                linkText.includes('website') ||
                linkText.includes('homepage') ||
                linkText.includes(url.hostname.split('.')[0])
              ) {
                contactInfo.website = cleanHref;
                websiteFound = true;
                addLog(jobId, `Website found using body fallback: ${cleanHref}`, 'info');
                return false;
              }
            }
          } catch (e) {}
        }
      });
    }
    if (!websiteFound) {
      addLog(jobId, `Could not find website link in ${sourceUrl}`, 'info');
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting website: ${message}`, 'warn');
  }

  return contactInfo;
}
