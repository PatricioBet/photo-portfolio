import { Worker } from "bullmq";
import { createLogger } from "./logger.js";
import { processPhotoJob, processVideoJob } from "./processors.js";
import { createHealthServer } from "./health.js";

const logger = createLogger("media-worker");

const redisConnection = {
  host: process.env.REDIS_HOST ?? "localhost",
  port: Number(process.env.REDIS_PORT) ?? 6379,
  password: process.env.REDIS_PASSWORD ?? undefined,
};

// ── Main entry ────────────────────────────────────────────────
async function main() {
  const concurrencyPhoto = parseInt(process.env.WORKER_CONCURRENCY_PHOTO || "4", 10);
  const concurrencyVideo = parseInt(process.env.WORKER_CONCURRENCY_VIDEO || "1", 10);

  logger.info("Starting media worker...");
  logger.info(`Photo concurrency: ${concurrencyPhoto}`);
  logger.info(`Video concurrency: ${concurrencyVideo}`);

  // Create workers — one per job type for isolation
  const photoWorker = new Worker(
    "media-processing",
    processPhotoJob,
    {
      connection: redisConnection,
      concurrency: concurrencyPhoto,
      lockDuration: 60_000,
      maxStalledCount: 3,
      limiter: {
        max: concurrencyPhoto,
        duration: 1000,
      },
    }
  );

  const videoWorker = new Worker(
    "media-processing",
    processVideoJob,
    {
      connection: redisConnection,
      concurrency: concurrencyVideo,
      lockDuration: 1_800_000,
      maxStalledCount: 2,
    }
  );

  // Health check server
  const healthServer = await createHealthServer();
  await healthServer.start();

  // Event listeners
  for (const worker of [photoWorker, videoWorker]) {
    worker.on("error", (err) => {
      logger.error(`Worker error: ${err.message}`);
    });

    worker.on("completed", (job) => {
      logger.info(
        `Job ${job.id} (${job.name}) completed in ${
          job.processedOn ? job.finishedOn! - job.processedOn! : 0
        }ms`
      );
    });

    worker.on("failed", (job, err) => {
      logger.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
    });
  }

  logger.info('Media worker started and ready.')

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`)

    // Stop accepting new jobs
    await photoWorker.pause();
    await videoWorker.pause();

    // Wait for current jobs to finish (with timeout)
    const timeout = 120_000; // 2 minutes max
    await Promise.race([
      Promise.all([photoWorker.close(), videoWorker.close()]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Shutdown timeout")), timeout)
      ),
    ]).catch((err) => {
      logger.error(`Shutdown error: ${err.message}`);
    });

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
