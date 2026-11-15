// Asynchronous Message Queue & Background Worker
// Decouples slow, heavy background jobs (e.g. PDF generation, ML batch processing) from synchronous HTTP threads

class AsyncJobQueue {
  constructor() {
    this.jobs = new Map();
    this.queue = [];
    this.isProcessing = false;
  }

  /**
   * Enqueue a new background task (Producer)
   * @param {string} type 
   * @param {any} payload 
   * @returns {string} jobId
   */
  enqueue(type, payload) {
    const jobId = `JOB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const jobRecord = {
      id: jobId,
      type,
      payload,
      status: 'QUEUED', // QUEUED | PROCESSING | COMPLETED | FAILED
      createdAt: new Date().toISOString(),
      completedAt: null,
      result: null
    };

    this.jobs.set(jobId, jobRecord);
    this.queue.push(jobId);

    // Kick off worker processing asynchronously
    this.processNext();
    return jobId;
  }

  /**
   * Worker Loop (Consumer)
   */
  async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const jobId = this.queue.shift();
    const job = this.jobs.get(jobId);

    if (job) {
      job.status = 'PROCESSING';

      try {
        // Execute background task
        const result = await this.executeJob(job.type, job.payload);
        job.status = 'COMPLETED';
        job.completedAt = new Date().toISOString();
        job.result = result;
      } catch (err) {
        job.status = 'FAILED';
        job.error = err.message;
      }
    }

    this.isProcessing = false;
    // Process next item in queue
    if (this.queue.length > 0) {
      setTimeout(() => this.processNext(), 100);
    }
  }

  /**
   * Worker task execution logic
   */
  async executeJob(type, payload) {
    switch (type) {
      case 'GENERATE_MISSION_PDF':
        // Simulating heavy PDF compilation & crypto signature (takes 2 seconds in background)
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
          reportUrl: `/reports/NASA_MISSION_${payload.crewId}.pdf`,
          fileSizeBytes: 245890,
          hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
        };

      case 'BATCH_TELEMETRY_INGEST':
        // Process 10,000 physiological telemetry data points
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
          recordsIngested: payload.samplesCount || 500,
          anomaliesDetectedCount: 1,
          leadStatus: 'SYNCED_WITH_EARTH_BUFFER'
        };

      case 'SOLAR_STORM_BROADCAST':
        // Distribute emergency SPE alerts across habitat modules
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
          modulesAlerted: ['AIRLOCK-A', 'CREW-QUARTERS', 'COMMAND-MODULE', 'GREENHOUSE'],
          radiationShelterWaterWallsDeployed: true
        };

      default:
        return { status: 'OK' };
    }
  }

  /**
   * Query status of a background job
   * @param {string} jobId 
   */
  getStatus(jobId) {
    return this.jobs.get(jobId) || null;
  }

  /**
   * Queue statistics
   */
  getStats() {
    return {
      pendingJobs: this.queue.length,
      totalJobsTracked: this.jobs.size,
      isWorkerActive: this.isProcessing
    };
  }
}

export const jobQueue = new AsyncJobQueue();
