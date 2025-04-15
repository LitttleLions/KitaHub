// Simple in-memory store for import job status, progress, logs, and results.
// NOTE: This is NOT persistent. Data will be lost on server restart.
// For production, consider using a database table.

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
    timestamp: number;
    message: string;
    level: LogLevel;
}

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface ImportJobState {
    status: JobStatus;
    progress: number; // Percentage 0-100
    logs: LogEntry[];
    results?: any[]; // Stores results for dry runs // TODO: Use KitaMappedData[] type
    isDryRun: boolean;
    error?: string; // Stores error message if status is 'failed'
    startTime: number;
    endTime?: number;
}

// In-memory store
const jobStore: Map<string, ImportJobState> = new Map();

/**
 * Initializes a new job in the store.
 */
export function initializeJob(jobId: string, isDryRun: boolean): void {
    if (jobStore.has(jobId)) {
        console.warn(`Job ${jobId} already exists. Overwriting.`);
    }
    jobStore.set(jobId, {
        status: 'pending',
        progress: 0,
        logs: [{ timestamp: Date.now(), message: `Job ${jobId} initialized. Dry run: ${isDryRun}`, level: 'info' }],
        results: isDryRun ? [] : undefined,
        isDryRun: isDryRun,
        startTime: Date.now(),
    });
    console.log(`Initialized job ${jobId}`);
}

/**
 * Updates the status of a job.
 */
export function updateJobStatus(jobId: string, status: JobStatus, error?: string): void {
    const job = jobStore.get(jobId);
    if (job) {
        job.status = status;
        if (status === 'completed' || status === 'failed') {
            job.endTime = Date.now();
        }
        if (error) {
            job.error = error;
            addLog(jobId, `Job failed: ${error}`, 'error');
        } else {
             addLog(jobId, `Job status changed to: ${status}`, 'info');
        }
        console.log(`Updated status for job ${jobId} to ${status}`);
    } else {
        console.warn(`Attempted to update status for non-existent job ${jobId}`);
    }
}

/**
 * Updates the progress of a job.
 */
export function updateJobProgress(jobId: string, progress: number): void {
    const job = jobStore.get(jobId);
    if (job) {
        job.progress = Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100
    } else {
        console.warn(`Attempted to update progress for non-existent job ${jobId}`);
    }
}

/**
 * Adds a log entry to a job.
 */
export function addLog(jobId: string, message: string, level: LogLevel = 'info'): void {
    const job = jobStore.get(jobId);
    if (job) {
        job.logs.push({ timestamp: Date.now(), message, level });
        // Optional: Limit log size to prevent memory issues
        if (job.logs.length > 1000) { // Example limit
            job.logs.shift(); // Remove oldest log
        }
    } else {
        console.warn(`Attempted to add log for non-existent job ${jobId}`);
    }
}

/**
 * Adds collected data to a dry run job's results.
 */
export function addResult(jobId: string, resultData: any): void { // TODO: Use KitaMappedData type
    const job = jobStore.get(jobId);
    if (job && job.isDryRun && job.results) {
        job.results.push(resultData);
    } else if (job && !job.isDryRun) {
         console.warn(`Attempted to add result to non-dry-run job ${jobId}`);
    } else {
        console.warn(`Attempted to add result for non-existent job ${jobId}`);
    }
}

/**
 * Retrieves the current state of a job.
 */
export function getJobState(jobId: string): ImportJobState | undefined {
    return jobStore.get(jobId);
}

/**
 * Retrieves only the results of a completed dry run job.
 */
export function getJobResults(jobId: string): any[] | undefined { // TODO: Use KitaMappedData[] type
    const job = jobStore.get(jobId);
    if (job && job.isDryRun && job.status === 'completed') {
        return job.results;
    }
    return undefined; // Return undefined if not found, not a dry run, or not completed
}

// Optional: Add cleanup logic for old jobs if needed
// function cleanupOldJobs() { ... }
// setInterval(cleanupOldJobs, 60 * 60 * 1000); // Run every hour
