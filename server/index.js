import express from 'express';
import cors from 'cors';
import cluster from 'node:cluster';
import os from 'os';
import apiRoutes from './routes/api.js';
import { rateLimiter } from './middleware/rateLimiter.js';

const PORT = process.env.PORT || 5000;
const isClusterMode = process.argv.includes('--cluster');
const numCPUs = Math.min(4, os.cpus().length); // balance across up to 4 cores

// MULTI-SERVER CLUSTERING & LOAD BALANCING
if (isClusterMode && cluster.isPrimary) {
  console.log(`================================================================`);
  console.log(`🚀 MASTER CLUSTER PROCESS [PID: ${process.pid}] INITIALIZED`);
  console.log(`⚡ Spawning ${numCPUs} Worker Server Instances across CPU Cores...`);
  console.log(`================================================================`);

  // Fork worker servers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Auto-healing: If a worker process crashes, spawn a replacement instantly
  cluster.on('exit', (worker, code, signal) => {
    console.warn(`⚠️ Worker Server [PID: ${worker.process.pid}] died. Auto-scaling replacement worker...`);
    cluster.fork();
  });

} else {
  // WORKER SERVER INSTANCE (Handles HTTP Requests)
  const app = express();

  // 1. Cross-Origin Resource Sharing (CORS)
  app.use(cors({ origin: '*' }));

  // 2. JSON Body Parser
  app.use(express.json());

  // 3. RATE LIMITING MIDDLEWARE (Max 100 requests / min per IP)
  app.use(rateLimiter(100, 60000));

  // 4. API Endpoints
  app.use('/api', apiRoutes);

  // Health check endpoint for Load Balancers (AWS ALB / NGINX)
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'AstroPulse-Telemetry-API',
      workerPid: process.pid,
      timestamp: new Date().toISOString()
    });
  });

  app.listen(PORT, () => {
    console.log(`✅ [Worker PID: ${process.pid}] AstroPulse High-Scale Server active on port ${PORT}`);
  });
}
