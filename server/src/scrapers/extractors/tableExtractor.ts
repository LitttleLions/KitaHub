import * as cheerio from 'cheerio';
import { addLog, LogLevel } from '../../services/importStatusService.js';

export interface TableData {
  traeger?: string;
  traegertyp?: string;
  dachverband?: string;
  plaetze_gesamt?: string;
  freie_plaetze?: string;
  betreuungszeit?: string;
  betreuungsalter_von?: string;
  betreuungsalter_bis?: string;
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
          if (header === "Träger") {
            data.traeger = value;
          } else if (lowerHeader.includes("trägertyp")) {
            data.traegertyp = value;
          } else if (lowerHeader.includes("dachverb")) {
            data.dachverband = value;
          } else if (lowerHeader.includes("plätze") && lowerHeader.includes("freie")) {
            const match = value.match(/(\d+)\s*\/\s*(\?|\d+)/);
            if (match) {
              data.plaetze_gesamt = match[1];
              data.freie_plaetze = match[2];
            } else {
              data.plaetze_gesamt = value;
              data.freie_plaetze = "?";
              addLog(jobId, `Could not parse Plätze format: ${value}`, LogLevel.WARN);
            }
          } else if (lowerHeader.includes("betreuungszeit")) {
            data.betreuungszeit = value;
          } else if (lowerHeader.includes("aufnahmealter")) {
            data.betreuungsalter_von = value.replace(/ab\s*/i, '').trim();
          } else if (lowerHeader.includes("betreuungsalter") && !lowerHeader.includes("aufnahme")) {
            data.betreuungsalter_bis = value.replace(/bis\s*/i, '').trim();
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
