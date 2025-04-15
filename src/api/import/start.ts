import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runImportProcess } from '../../../server/src/services/importService.js'; // Pfad anpassen je nach Deployment-Struktur

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { dryRun = true, bezirkUrls = [], kitaLimitPerBezirk = 10000 } = req.body;

    if (!Array.isArray(bezirkUrls) || bezirkUrls.length === 0) {
      return res.status(400).json({ message: 'bezirkUrls array required' });
    }

    const jobId = `import_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    console.log(`API: Starting import job ${jobId}`, { dryRun, bezirkUrls, kitaLimitPerBezirk });

    res.status(202).json({ jobId });

    // Starte Import asynchron (nicht awaiten)
    runImportProcess(jobId, dryRun, bezirkUrls, kitaLimitPerBezirk).catch(error => {
      console.error(`Import job ${jobId} failed:`, error);
    });

  } catch (error) {
    console.error("API Error starting import:", error);
    res.status(500).json({ message: 'Failed to start import process' });
  }
}
