import * as cheerio from 'cheerio';
import { addLog, LogLevel } from '../../services/importStatusService.js';

export interface GalleryInfo {
  gallery?: string[];
  video_url?: string;
}

/**
 * Extrahiert Galerie-Bilder und Video-URL aus dem HTML.
 * @param $ Cheerio-Instanz der Kita-Detailseite
 * @param sourceUrl URL der Kita-Seite (für Logging)
 * @param jobId Import-Job-ID (für Logging)
 */
export function extractGallery(
  $: cheerio.CheerioAPI,
  sourceUrl: string,
  jobId: string
): GalleryInfo {
  const galleryInfo: GalleryInfo = {};

  // --- Gallery Images ---
  try {
    const galleryUrls: string[] = [];
    $('.gallery a, .image-gallery a, #gallery a').each((_, element) => {
      const href = $(element).attr('href');
      const img = $(element).find('img');
      if (href && img.length > 0) {
        try {
          const imageUrl = new URL(href, sourceUrl).toString();
          if (/\.(jpg|jpeg|png|gif|webp)$/i.test(imageUrl)) {
            galleryUrls.push(imageUrl);
          } else {
            const imgSrc = img.attr('src');
            if (imgSrc) {
              galleryUrls.push(new URL(imgSrc, sourceUrl).toString());
            }
          }
        } catch (urlError) {
          addLog(jobId, `Invalid URL found in gallery: ${href}`, LogLevel.WARN);
        }
      } else if (!href && img.length > 0) {
        const imgSrc = img.attr('src');
        if (imgSrc) {
          try {
            galleryUrls.push(new URL(imgSrc, sourceUrl).toString());
          } catch (urlError) {
            addLog(jobId, `Invalid image src found in gallery: ${imgSrc}`, LogLevel.WARN);
          }
        }
      }
    });
    if (galleryUrls.length > 0) {
      galleryInfo.gallery = [...new Set(galleryUrls)];
      addLog(jobId, `Extracted ${galleryInfo.gallery.length} gallery images.`, LogLevel.INFO);
    } else {
      addLog(jobId, `Could not extract gallery images from ${sourceUrl}`, LogLevel.INFO);
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting gallery: ${message}`, LogLevel.WARN);
  }

  // --- Video URL ---
  try {
    const videoIframe = $('iframe[src*="youtube.com/embed"], iframe[src*="vimeo.com/video"]').first();
    if (videoIframe.length > 0) {
      galleryInfo.video_url = videoIframe.attr('src') || undefined;
      addLog(jobId, `Extracted video URL: ${galleryInfo.video_url}`, LogLevel.INFO);
    } else {
      addLog(jobId, `Could not extract video URL from ${sourceUrl}`, LogLevel.INFO);
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    addLog(jobId, `Error extracting video URL: ${message}`, LogLevel.WARN);
  }

  return galleryInfo;
}
