import { Worker } from 'bullmq'
import { createLogger } from './logger.js'
import { processPhotoJob, processVideoJob, generateVariantsJob } from './processors.js'
import { createHealthServer } from './health.js'
import { IORedisConnection } from './connection.js'

const logger = createLogger('media-worker')

// ── Job handlers ──────────────────────────────────────────────
const jobHandlers: Record<string, (job: Parameters<typeof Worker.prototype.on>[1]) => Promise<void>> = {
  'process-photo': processPhotoJob,
  'process-video': processVideoJob,
  'generate-variants': generateVariantsJob,
}

// ── Main entry ────────────────────────────────────────────────
async function main() {
  const concurrencyPhoto = parseInt(process.env.WORKER_CONCURRENCY_PHOTO || '4', 10)
  const concurrencyVideo = parseInt(process.env.WORKER_CONCURRENCY_VIDEO || '1', 10)

  logger.info('Starting media worker...')
  logger.info(`Photo concurrency: ${concurrencyPhoto}`)
  logger.info(`Video concurrency: ${concurrencyVideo}`)

  // Create connections
  const connection = await IORedisConnection.create()

  // Create workers — one per job type for isolation
  const photoWorker = new Worker('media-queue', jobHandlers['process-photo'], {
    connection,
    concurrency: concurrencyPhoto,
    lockDuration: 60_000, // 60s per image
    maxStalledCount: 3,
    limiter: {
      max: concurrencyPhoto,
      duration: 1000, // per-second rate limit
    },
  })

  const videoWorker = new Worker('media-queue', jobHandlers['process-video'], {
    connection,
    concurrency: concurrencyVideo,
    lockDuration: 1_800_000, // 30min per video
    maxStalledCount: 2,
  })

  const variantsWorker = new Worker('media-queue', jobHandlers['generate-variants'], {
    connection,
    concurrency: 2,
    lockDuration: 120_000,
    maxStalledCount: 3,
  })

  // Health check server
  const healthServer = createHealthServer()
  await healthServer.start()

  // Event listeners
  for (const worker of [photoWorker, videoWorker, variantsWorker]) {
    worker.on('error', (err) => {
      logger.error(`Worker error: ${err.message}`)
    })

    worker.on('completed', (job) => {
      logger.info(`Job ${job.id} (${job.name}) completed in ${job.processedOn ? job.finishedOn! - job.processedOn! : 0}ms`)
    })

    worker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`)
    })
  }

  logger.info('Media worker started and ready.')

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`)

    // Stop accepting new jobs
    await photoWorker.pause()
    await videoWorker.pause()
    await variantsWorker.pause()

    // Wait for current jobs to finish (with timeout)
    const timeout = 120_000 // 2 minutes max
    await Promise.race([
      Promise.all([photoWorker.close(), videoWorker.close(), variantsWorker.close()]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Shutdown timeout')), timeout)),
    ]).catch((err) => {
      logger.error(`Shutdown error: ${err.message}`)
    })

    await healthServer.stop()
    logger.info('Media worker shut down.')
    process.exit(0)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

main().catch((err) => {
  console.error('Failed to start media worker:', err)
  process.exit(1)
})
