// Basic in-memory store for job statuses and logs
interface JobStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  progress?: number; // Added progress field
}

interface LogEntry {
  timestamp: string;
  level: LogLevelValue;
  message: string;
}

let jobStatuses: { [key: string]: JobStatus } = {};
let jobLogs: { [key: string]: LogEntry[] } = {};

// Define and export log levels enum
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

// Type for the values of the enum
type LogLevelValue = `${LogLevel}`;

/**
 * Adds a log entry for a specific job.
 * @param jobId - The ID of the job.
 * @param message - The log message.
 * @param level - The log level.
 */
export function addLog(jobId: string, message: string, level: LogLevelValue = LogLevel.INFO): void {
  if (!jobLogs[jobId]) {
    jobLogs[jobId] = [];
  }
  const timestamp = new Date().toISOString();
  // Map 'debug' logs to 'info' for now if 'debug' level isn't explicitly handled elsewhere
  const effectiveLevel = level === LogLevel.DEBUG ? LogLevel.INFO : level;
  jobLogs[jobId].push({ timestamp, level: effectiveLevel, message });
  console.log(`[${jobId}] [${effectiveLevel.toUpperCase()}] ${message}`); // Also log to console
}

/**
 * Updates the status of a specific job.
 * @param jobId - The ID of the job.
 * @param status - The new status.
 * @param messageOrProgress - An optional message (string) or progress (number). If number, it updates progress. If string, it updates message.
 * @param progressValue - An optional progress value (number), used if the third param is a message.
 */
export function updateJobStatus(
    jobId: string,
    status: JobStatus['status'],
    messageOrProgress?: string | number,
    progressValue?: number
): void {
    if (!jobStatuses[jobId]) {
        // Initialize with default progress 0 if not existing
        jobStatuses[jobId] = { status: 'pending', message: '', progress: 0 };
    }

    let message = '';
    let progress: number | undefined = undefined;

    // Determine if message or progress was passed in the third argument
    if (typeof messageOrProgress === 'string') {
        message = messageOrProgress;
        progress = progressValue; // Use the fourth argument for progress if the third was a message
    } else if (typeof messageOrProgress === 'number') {
        progress = messageOrProgress;
        // message remains empty or keeps its previous value (handled below)
    } else {
         // If third arg is undefined, check fourth arg for progress
         progress = progressValue;
    }


    jobStatuses[jobId].status = status;
    // Update message only if a new non-empty message is provided
    jobStatuses[jobId].message = message || jobStatuses[jobId].message;
    // Update progress only if a valid number is provided
    if (typeof progress === 'number' && !isNaN(progress)) {
        jobStatuses[jobId].progress = Math.max(0, Math.min(100, progress)); // Clamp progress 0-100
    }

    // Construct log message
    let logMessage = `Job status updated to ${status}`;
    if (message) {
        logMessage += `: ${message}`;
    }
    if (typeof jobStatuses[jobId].progress === 'number') {
         logMessage += ` (Progress: ${jobStatuses[jobId].progress}%)`;
    }
    addLog(jobId, logMessage);
}


/**
 * Retrieves the status and logs for a specific job.
 * @param jobId - The ID of the job.
 * @returns The job status object including progress, or null if not found.
 */
export function getJobStatus(jobId: string): (JobStatus & { logs: LogEntry[] }) | null {
    // Ensure progress is included in the returned object, defaulting to 0 if undefined
    if (jobStatuses[jobId]) {
        const status = jobStatuses[jobId];
        return {
            ...status,
            progress: typeof status.progress === 'number' ? status.progress : 0, // Default progress to 0
            logs: jobLogs[jobId] || []
        };
    }
    return null;
}


/**
 * Initializes or resets the status and progress for a job.
 * @param jobId - The ID of the job.
 */
export function initializeJobStatus(jobId: string): void {
    jobStatuses[jobId] = { status: 'pending', message: 'Job initialized', progress: 0 }; // Initialize progress to 0
    jobLogs[jobId] = []; // Reset logs as well
    addLog(jobId, 'Job status initialized (Progress: 0%).');
}

// Optional: Function to clear old jobs (implement based on requirements)
export function clearJobStatus(jobId: string): void {
    delete jobStatuses[jobId];
    delete jobLogs[jobId];
    console.log(`Cleared status and logs for job ${jobId}`);
}
