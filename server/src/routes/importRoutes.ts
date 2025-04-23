import express, { Request, Response, Router } from 'express';
import { importKnowledgePosts } from '../services/knowledgeImportService.js';
import { initializeJobStatus, updateJobStatus } from '../services/importStatusService.js'; // Import status service functions
import { v4 as uuidv4 } from 'uuid'; // Import uuid

const router: Router = express.Router();

// POST /api/import/knowledge - Startet den Wissensimport mit Paginierungsoptionen
router.post('/knowledge', async (req: Request, res: Response): Promise<void> => {
    const {
        limit = 20,
        page = 1,
        totalPagesToFetch = 1,
        dryRun = true
    } = req.body;

    console.log(`[API Import Knowledge] Received request: limit=${limit}, page=${page}, totalPages=${totalPagesToFetch}, dryRun=${dryRun}`);
    const jobId = uuidv4(); // Generate a unique job ID
    const jobType = 'knowledge-import'; // Define job type

    try {
        // Initialize job status
        initializeJobStatus(jobId); // Use initializeJobStatus instead of createJobEntry
        console.log(`[API Import Knowledge] Initialized job status with ID: ${jobId}`);
        // Optionally add initial parameters to logs if needed
        // addLog(jobId, `Job parameters: ${JSON.stringify({ limit, page, totalPagesToFetch, dryRun })}`);

        // Start the import process asynchronously (don't await here)
        importKnowledgePosts(jobId, { // Pass options object
            limit: parseInt(String(limit), 10),
            page: parseInt(String(page), 10),
            totalPagesToFetch: parseInt(String(totalPagesToFetch), 10),
            dryRun: Boolean(dryRun)
        }).then(result => {
            // This block runs after importKnowledgePosts finishes (successfully or with null)
            // Note: The result handling might need adjustment based on the new return types
            if (dryRun && Array.isArray(result)) {
                const message = `Dry run successful. Processed ${result.length} posts.`;
                console.log(`[API Import Knowledge] Job ${jobId}: ${message}`);
                // Final status update handled within importKnowledgePosts for dry run
            } else if (typeof result === 'number') {
                 const message = `Import successful. Upserted ${result} posts.`;
                 console.log(`[API Import Knowledge] Job ${jobId}: ${message}`);
                 // Final status update handled within importKnowledgePosts for success
            } else {
                 // This case might occur if importKnowledgePosts returns null on error
                 console.error(`[API Import Knowledge] Job ${jobId}: Import finished with unexpected result or error.`);
                 // Final status update handled within importKnowledgePosts for failure
            }
        }).catch(error => {
            // This catches errors thrown *synchronously* by importKnowledgePosts
            // or re-thrown errors from within its async operations.
            const message = `Error during knowledge import execution for job ${jobId}: ${error.message}`;
            console.error(`[API Import Knowledge] ${message}`, error);
            updateJobStatus(jobId, 'failed', `Import fehlgeschlagen: ${error.message}`);
        });

        // Respond immediately to the client that the job has started
        res.status(202).json({ // 202 Accepted indicates the request is accepted for processing
            message: `Knowledge import job started successfully.`,
            jobId: jobId,
            jobType: jobType,
            statusUrl: `/api/import/status/${jobId}` // URL to check job status
        });

    } catch (error: any) {
        // This catches errors during job creation or synchronous errors before the async process starts
        const message = `Failed to start knowledge import job: ${error.message}`;
        console.error(`[API Import Knowledge] ${message}`, error);
        // Attempt to update status if jobId was generated, otherwise just respond
        if (jobId) {
            updateJobStatus(jobId, 'failed', message);
        }
        res.status(500).json({ message: message });
    }
});

// GET /api/import/status/:jobId - Endpoint to check job status (Example)
// You would need to implement getJobStatus in importStatusService.js
// router.get('/status/:jobId', async (req: Request, res: Response) => {
//     const { jobId } = req.params;
//     try {
//         const status = await getJobStatus(jobId); // Implement this function
//         if (!status) {
//             return res.status(404).json({ message: 'Job not found.' });
//         }
//         res.status(200).json(status);
//     } catch (error: any) {
//         res.status(500).json({ message: `Error fetching job status: ${error.message}` });
//     }
// });

// GET /api/import/knowledge/search - Sucht nach Wissensbeiträgen auf WordPress
router.get('/knowledge/search', async (req: Request, res: Response): Promise<void> => {
    const searchTerm = req.query.term as string;
    console.log(`[API Search Knowledge] Received search request for term: "${searchTerm}"`);

    if (!searchTerm) {
        res.status(400).json({ message: 'Missing search term query parameter "term".' });
        return;
    }

    try {
        // Dynamischer Import, um die Funktion nur bei Bedarf zu laden (optional)
        const { searchWordPressKnowledgePosts } = await import('../services/knowledgeImportService.js');
        const results = await searchWordPressKnowledgePosts(searchTerm);
        console.log(`[API Search Knowledge] Found ${results.length} results for term "${searchTerm}".`);
        res.status(200).json(results);
    } catch (error: any) {
        const message = `Error searching knowledge posts: ${error.message}`;
        console.error(`[API Search Knowledge] ${message}`, error);
        res.status(500).json({ message: message });
    }
});

// POST /api/import/knowledge/specific - Startet den Import spezifischer Wissensbeiträge
router.post('/knowledge/specific', async (req: Request, res: Response): Promise<void> => {
    // Explicitly read dryRun from body, default to true if not provided or invalid
    const { postIds, dryRun: reqDryRun } = req.body;
    const dryRun = typeof reqDryRun === 'boolean' ? reqDryRun : true; // Ensure boolean, default true

    console.log(`[API Import Specific Knowledge] Received request: postIds=${postIds?.join(',')}, dryRun=${dryRun}`); // Log the actual used dryRun value

    if (!Array.isArray(postIds) || postIds.length === 0) {
        res.status(400).json({ message: 'Missing or invalid "postIds" array in request body.' });
        return;
    }

    // Validate IDs are numbers (basic check)
    if (!postIds.every(id => typeof id === 'number')) {
         res.status(400).json({ message: 'Invalid "postIds" array: all IDs must be numbers.' });
         return;
    }


    const jobId = uuidv4(); // Generate a unique job ID
    const jobType = 'knowledge-import-specific'; // Define job type

    try {
        // Initialize job status
        initializeJobStatus(jobId);
        console.log(`[API Import Specific Knowledge] Initialized job status with ID: ${jobId}`);

        // Start the import process asynchronously
        importKnowledgePosts(jobId, { // Pass options object with postIds and CORRECT dryRun value
            postIds: postIds,
            dryRun: dryRun // Use the validated dryRun value
        }).then(result => {
            // Handle result logging similar to the mass import endpoint
             if (dryRun && Array.isArray(result)) { // Check the actual dryRun value used
                console.log(`[API Import Specific Knowledge] Job ${jobId}: Dry run successful. Processed ${result.length} posts.`);
            } else if (typeof result === 'number') {
                 console.log(`[API Import Specific Knowledge] Job ${jobId}: Import successful. Upserted ${result} posts.`);
            } else {
                 console.error(`[API Import Specific Knowledge] Job ${jobId}: Import finished with unexpected result or error.`);
            }
        }).catch(error => {
            const message = `Error during specific knowledge import execution for job ${jobId}: ${error.message}`;
            console.error(`[API Import Specific Knowledge] ${message}`, error);
            updateJobStatus(jobId, 'failed', `Import fehlgeschlagen: ${error.message}`);
        });

        // Respond immediately
        res.status(202).json({
            message: `Specific knowledge import job started successfully for ${postIds.length} posts.`,
            jobId: jobId,
            jobType: jobType,
            statusUrl: `/api/import/status/${jobId}`
        });

    } catch (error: any) {
        const message = `Failed to start specific knowledge import job: ${error.message}`;
        console.error(`[API Import Specific Knowledge] ${message}`, error);
        if (jobId) {
            updateJobStatus(jobId, 'failed', message);
        }
        res.status(500).json({ message: message });
    }
});


export default router;

/* Original synchronous implementation (for reference):
router.post('/knowledge', async (req: Request, res: Response): Promise<void> => {
    // ... (parameter extraction) ...
    try {
        const result = await importKnowledgePosts(
            // ... parameters ...
        );
        if (dryRun && Array.isArray(result)) {
            res.status(200).json({
                message: `Dry run successful. Processed ${result.length} posts.`,
                processedPosts: result.length,
                dryRun: true,
                // Optionally return a small preview for dry run
                preview: result.slice(0, 5).map(p => ({ id: p.id, title: p.title }))
            });
        } else if (typeof result === 'number') {
            console.log(`[API Import Knowledge] Import successful. Upserted ${result} posts.`);
            // TODO: Set final status via importStatusService
            res.status(200).json({
                message: `Import successful. Upserted ${result} posts.`,
                upsertedPosts: result,
                dryRun: false
            });
        } else {
             console.error('[API Import Knowledge] Unexpected result type from importKnowledgePosts.');
             // TODO: Set error status via importStatusService
             res.status(500).json({ message: 'Internal server error: Unexpected result type.' });
        }
    } catch (error: any) {
        console.error(`[API Import Knowledge] Error during knowledge import: ${error.message}`, error);
        // TODO: Set error status via importStatusService
        res.status(500).json({ message: `Error during knowledge import: ${error.message}` });
    }
});
*/
