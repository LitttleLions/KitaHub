import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import services mit .js Erweiterungen
import { runImportProcess } from './services/importService.js';
import { updateJobStatus, addLog, getJobStatus } from './services/importStatusService.js';
import { getBundeslandUrlsAndNames, getBezirkUrlsAndNames } from './scrapers/kitaDeScraper.js';
import { fetchKnowledgePreview, importKnowledgePosts } from './services/knowledgeImportService.js';

const app = express();
const port = process.env.BACKEND_PORT || 3000; 

// --- Middleware ---
// Enable CORS for requests from the frontend (adjust origin in production)
app.use(cors({ origin: 'http://localhost:8080' })); // Allow requests from Vite dev server
app.use(express.json()); // Parse JSON request bodies

// Basic logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- API Routes ---

// GET /api/import/knowledge/preview
app.get('/api/import/knowledge/preview', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const preview = await fetchKnowledgePreview();
        res.status(200).json(preview);
    } catch (error) {
        console.error('Error fetching knowledge preview:', error);
        next(error);
    }
});

// POST /api/import/knowledge/start
app.post('/api/import/knowledge/start', async (req: Request, res: Response, next: NextFunction) => {
    console.log('Received POST /api/import/knowledge/start');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    try {
        const { limit = 20, offset = 0, dryRun = true } = req.body ?? {}; 
        const result = await importKnowledgePosts(limit, dryRun); 
        
        if (dryRun && result && Array.isArray(result)) {
            res.status(200).json({ 
                message: `Knowledge import dry run completed. Anzahl gelesener Beiträge: ${result.length}`,
                dryRun, 
                limit,
                preview: result, 
                count: result.length 
            });
        } else if (!dryRun && typeof result === 'number') {
            res.status(200).json({ 
                message: `Knowledge import completed. Anzahl importierter Beiträge: ${result}`,
                dryRun, 
                limit,
                count: result 
            });
        } else {
            res.status(200).json({ 
                message: `Knowledge import completed`,
                dryRun, 
                limit,
                count: 0 
            });
        }
    } catch (error) {
        console.error('Error importing knowledge posts:', error);
        next(error);
    }
});

// POST /api/import/start
app.post('/api/import/start', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        const { dryRun, bezirke, kitaLimitPerBezirk } = req.body as {
            dryRun: boolean;
            bezirke: { name: string, url: string }[];
            kitaLimitPerBezirk: number
        };

        if (typeof dryRun !== 'boolean' ||
            !Array.isArray(bezirke) ||
            bezirke.length === 0 ||
            !bezirke.every(b => typeof b === 'object' && typeof b.name === 'string' && typeof b.url === 'string') ||
            typeof kitaLimitPerBezirk !== 'number' ||
            kitaLimitPerBezirk <= 0) {
            res.status(400).json({ message: 'Invalid request body: dryRun (boolean), bezirke (array of {name: string, url: string}), and kitaLimitPerBezirk (number > 0) are required.' });
            return;
        }

        const jobId = `import_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        console.log(`API: Starting import job ${jobId}`, { dryRun, bezirke: bezirke.map(b => b.name).slice(0, 5).join(', '), kitaLimitPerBezirk });

        updateJobStatus(jobId, 'pending');

        res.status(202).json({ jobId });

        runImportProcess(jobId, dryRun, bezirke, kitaLimitPerBezirk).catch((error: unknown) => {
            console.error(`[${jobId}] runImportProcess promise rejected:`, error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            updateJobStatus(jobId, 'failed', errorMessage);
        });
    })().catch(next);
});

// GET /api/import/status/:jobId
app.get('/api/import/status/:jobId', async (req: Request<{ jobId: string }>, res: Response, next: NextFunction) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            res.status(400).json({ message: 'Missing jobId parameter' });
            return;
        }

        console.log(`API: Getting status for job ${jobId}`);
        const state = getJobStatus(jobId);

        if (!state) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        res.status(200).json({
            status: state.status,
            message: state.message,
            logs: state.logs
        });

    } catch (error) {
        next(error);
    }
});

// GET /api/import/bundeslaender
app.get('/api/import/bundeslaender', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('API: Getting Bundeslaender list...');
        const tempJobId = `meta_${Date.now()}`;
        const bundeslaender = await getBundeslandUrlsAndNames(tempJobId);
        console.log(`API: Returning ${bundeslaender.length} Bundeslaender.`);
        res.status(200).json(bundeslaender);
    } catch (error) {
        next(error);
    }
});

// GET /api/import/bezirke
app.get('/api/import/bezirke', async (req: Request, res: Response, next: NextFunction) => {
    console.log('=== /api/import/bezirke API call started ===');
    const tempJobId = `bezirke_${Date.now()}`;
    try {
        const bundeslandUrl = req.query.bundeslandUrl as string;
        console.log(`[${tempJobId}] Received request for Bezirke. Query params:`, req.query);

        if (!bundeslandUrl || typeof bundeslandUrl !== 'string') {
            console.log(`[${tempJobId}] Invalid or missing bundeslandUrl.`);
            res.status(400).json({ message: 'Missing or invalid bundeslandUrl query parameter' });
            return;
        }
        console.log(`[${tempJobId}] Valid bundeslandUrl received: ${bundeslandUrl}`);

        console.log(`[${tempJobId}] Calling getBezirkUrlsAndNames...`);
        const bezirke = await getBezirkUrlsAndNames(tempJobId, bundeslandUrl);
        console.log(`[${tempJobId}] getBezirkUrlsAndNames returned ${bezirke.length} Bezirke.`);

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        console.log(`[${tempJobId}] Sending response with ${bezirke.length} Bezirke.`);
        res.status(200).json(bezirke);

    } catch (error) {
        console.error(`[${tempJobId}] Error in /api/import/bezirke handler:`, error);
        next(error);
    } finally {
        console.log(`[${tempJobId}] === /api/import/bezirke API call completed ===`);
    }
});

// Central Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled API error:", err.stack || err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// Healthcheck Endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

// Start Server
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Backend server listening at http://0.0.0.0:${port}`);
});
