// Basic in-memory store for job statuses and logs
interface JobStatus {
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
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
 * @param message - An optional message associated with the status update.
 */
export function updateJobStatus(jobId: string, status: JobStatus['status'], message: string = ''): void {
  if (!jobStatuses[jobId]) {
    jobStatuses[jobId] = { status: 'pending', message: '' };
  }
  jobStatuses[jobId].status = status;
  jobStatuses[jobId].message = message || jobStatuses[jobId].message; // Keep old message if new one is empty
  addLog(jobId, `Job status updated to ${status}${message ? ': ' + message : ''}`);
}

/**
 * Retrieves the status and logs for a specific job.
 * @param jobId - The ID of the job.
 * @returns The job status object or null if not found.
 */
export function getJobStatus(jobId: string): (JobStatus & { logs: LogEntry[] }) | null {
  return jobStatuses[jobId] ? { ...jobStatuses[jobId], logs: jobLogs[jobId] || [] } : null;
}

/**
 * Initializes or resets the status for a job.
 * @param jobId - The ID of the job.
 */
export function initializeJobStatus(jobId: string): void {
    jobStatuses[jobId] = { status: 'pending', message: 'Job initialized' };
    jobLogs[jobId] = []; // Reset logs as well
    addLog(jobId, 'Job status initialized.');
}

// Optional: Function to clear old jobs (implement based on requirements)
export function clearJobStatus(jobId: string): void {
    delete jobStatuses[jobId];
    delete jobLogs[jobId];
    console.log(`Cleared status and logs for job ${jobId}`);
}
