import * as cheerio from 'cheerio';
import { addLog, LogLevel } from '../../services/importStatusService.js';

export interface TableData {
  traeger?: string;
  traegertyp?: string;
  dachverband?: string;
  plaetze_gesamt?: number; // Changed to number
  freie_plaetze?: number; // Changed to number
  betreuungszeit?: string;
  betreuungsalter_von?: number; // Changed to number
  betreuungsalter_bis?: number; // Changed to number
  paedagogisches_konzept?: string;
}

export function extractTableData(
  $: cheerio.CheerioAPI,
  sourceUrl: string,
  jobId: string
): TableData {
  const data: TableData = {};

  try {
    const infoTable = $('table.infos, table').first();
    if (infoTable.length > 0) {
      infoTable.find('tr').each((_, rowElement) => {
        const cells = $(rowElement).find('th, td');
        if (cells.length >= 2) {
          const header = $(cells[0]).text().trim().replace(':', '');
          const value = $(cells[1]).text().trim();
          const lowerHeader = header.toLowerCase();
          const parseNumber = (str: string): number | undefined => {
            const num = parseInt(str.replace(/\D/g, ''), 10); // Remove non-digits and parse
            return isNaN(num) ? undefined : num;
          };

          if (header === "Träger") {
            data.traeger = value;
          } else if (lowerHeader.includes("trägertyp")) {
            data.traegertyp = value;
          } else if (lowerHeader.includes("dachverb")) {
            data.dachverband = value;
          } else if (lowerHeader.includes("plätze") && lowerHeader.includes("freie")) {
            const match = value.match(/(\d+)\s*\/\s*(\?|\d+)/);
            if (match) {
              data.plaetze_gesamt = parseNumber(match[1]);
              // Only parse freie_plaetze if it's a number, otherwise leave undefined
              if (match[2] !== '?') {
                data.freie_plaetze = parseNumber(match[2]);
              }
            } else {
              // Try parsing the whole value if format is unexpected
              data.plaetze_gesamt = parseNumber(value);
              addLog(jobId, `Could not parse Plätze format: ${value}. Attempted to parse as single number.`, LogLevel.WARN);
            }
          } else if (lowerHeader.includes("betreuungszeit")) {
            data.betreuungszeit = value;
          } else if (lowerHeader.includes("aufnahmealter")) {
            data.betreuungsalter_von = parseNumber(value);
          } else if (lowerHeader.includes("betreuungsalter") && !lowerHeader.includes("aufnahme")) {
             // Assuming this refers to the upper age limit
            data.betreuungsalter_bis = parseNumber(value);
          } else if (lowerHeader.includes("pädagogisches konzept")) {
            data.paedagogisches_konzept = value;
          }
        }
      });
      addLog(jobId, `Extracted table data: ${JSON.stringify(data)}`, LogLevel.INFO);
    } else {
      addLog(jobId, "Info table not found", LogLevel.WARN);
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting table data: ${message}`, LogLevel.WARN);
  }

  return data;
}
