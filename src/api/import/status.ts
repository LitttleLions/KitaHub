import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getJobStatus } from '../../../server/src/services/importStatusService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { jobId } = req.query;

    if (typeof jobId !== 'string' || !jobId) {
      return res.status(400).json({ message: 'Missing or invalid jobId parameter' });
    }

    const jobStatus = getJobStatus(jobId);

    if (!jobStatus) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      jobId,
      status: jobStatus.status,
      message: jobStatus.message,
      logs: jobStatus.logs
    });

  } catch (error) {
    console.error("API Error getting job status:", error);
    res.status(500).json({ message: 'Failed to get job status' });
  }
}
