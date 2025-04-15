import * as cheerio from 'cheerio';

/**
 * Hilfsfunktion: Extrahiert Text aus einem Cheerio-Element und bereinigt Whitespace.
 */
export function extractCleanText(element: cheerio.Cheerio<any>): string {
  return element.text().replace(/\s+/g, ' ').trim();
}

/**
 * Entfernt überflüssige Whitespaces und trimmt den Text.
 */
export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Hilfsfunktion: Findet ein Element anhand eines Selektors und extrahiert bereinigten Text.
 * Gibt undefined zurück, wenn das Element nicht gefunden wird.
 */
export function findAndExtractText($: cheerio.CheerioAPI, selector: string): string | undefined {
  const el = $(selector).first();
  if (el.length === 0) return undefined;
  return extractCleanText(el);
}

/**
 * Hilfsfunktion: Extrahiert URLs aus img-Elementen anhand eines Selektors.
 * Gibt undefined zurück, wenn kein Bild gefunden wird.
 */
export function extractImageUrl($: cheerio.CheerioAPI, selector: string, baseUrl: string): string | undefined {
  const el = $(selector).first();
  if (el.length === 0) return undefined;
  const src = el.attr('src');
  if (!src) return undefined;
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return undefined;
  }
}

/**
 * Hilfsfunktion: Prüft, ob ein Link-Element eine gültige Kita-URL ist.
 */
export function isValidKitaUrl(href: string, baseUrl: string): boolean {
  if (!href) return false;
  if (href.startsWith(baseUrl) && /\/kita\/\d+/.test(href)) return true;
  if (href.startsWith('/kita/') && /^\/kita\/\d+/.test(href)) return true;
  return false;
}
