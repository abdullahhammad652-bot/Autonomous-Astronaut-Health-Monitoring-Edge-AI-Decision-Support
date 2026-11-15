import { Router } from 'express';
import { cache } from '../cache/redisCache.js';
import { jobQueue } from '../queue/jobQueue.js';
import os from 'os';

const router = Router();

// Mock initial database
const astronautsDb = {
  'ARTEMIS-04': {
    name: 'Cmdr. Elena Vance',
    crewId: 'ARTEMIS-04',
    habitat: 'Mars Transit Vehicle',
    missionDay: 184,
    healthReadinessScore: 88,
    vitals: { hr: 74, hrv: 42, bp: '122/82', radDoseMsv: 168.4 }
  }
};

/**
 * GET /api/vitals/:crewId
 * Demonstrates Cache-Aside pattern (Redis/In-Memory)
 */
router.get('/vitals/:crewId', (req, res) => {
  const { crewId } = req.params;
  const cacheKey = `crew:vitals:${crewId}`;

  // 1. Check Cache First (<1ms response)
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json({
      source: 'CACHE_HIT (Redis/In-Memory)',
      latency: '< 0.5ms',
      workerPid: process.pid,
      data: cachedData
    });
  }

  // 2. Cache Miss: Query Database & write to Cache with 30s TTL
  const dbRecord = astronautsDb[crewId] || {
    crewId,
    name: 'Astronaut ' + crewId,
    vitals: { hr: 72, hrv: 55, bp: '120/80', radDoseMsv: 45.0 }
  };

  cache.set(cacheKey, dbRecord, 30); // 30 seconds TTL

  return res.json({
    source: 'DATABASE_QUERY (Cache Miss)',
    latency: '15ms',
    workerPid: process.pid,
    data: dbRecord
  });
});

/**
 * POST /api/jobs/export-report
 * Demonstrates Message Queue + Background Worker (Asynchronous 202 Accepted)
 */
router.post('/jobs/export-report', (req, res) => {
  const { crewId = 'ARTEMIS-04' } = req.body;

  // Enqueue job onto the background queue
  const jobId = jobQueue.enqueue('GENERATE_MISSION_PDF', { crewId });

  // Return HTTP 202 Accepted immediately without blocking user
  res.status(202).json({
    status: 202,
    message: 'Report compilation job accepted and dispatched to background worker.',
    jobId,
    statusCheckUrl: `/api/jobs/status/${jobId}`
  });
});

/**
 * GET /api/jobs/status/:jobId
 * Check status of a background job
 */
router.get('/jobs/status/:jobId', (req, res) => {
  const job = jobQueue.getStatus(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({ job, workerPid: process.pid });
});

/**
 * GET /api/cluster/status
 * Demonstrates Multi-Server Cluster & Load Balancing details
 */
router.get('/cluster/status', (req, res) => {
  res.json({
    activeWorkerProcessId: process.pid,
    cpuCoresAvailable: os.cpus().length,
    systemUptimeHours: (os.uptime() / 3600).toFixed(2),
    freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
    totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
    cacheStats: cache.getStats(),
    queueStats: jobQueue.getStats()
  });
});

export default router;
