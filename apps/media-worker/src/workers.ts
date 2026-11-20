import { Worker } from "bullmq";
import { createQueue } from "./queue.js";
import { processPhotoJob, processVideoJob } from "./processors.js";
import { createLogger } from "./logger.js";

const logger = createLogger("media-worker");

export async function startWorkers() {
  const photoQueue = createQueue("media-processing");

  const photoWorker = new Worker(
    "media-processing",
    processPhotoJob,
    {
      connection: {
        host: process.env.REDIS_HOST ?? "localhost",
        port: Number(process.env.REDIS_PORT) ?? 6379,
        password: process.env.REDIS_PASSWORD ?? undefined,
      },
      concurrency: Number(process.env.WORKER_CONCURRENCY_PHOTO) ?? 4,
      limiter: {
        max: Number(process.env.WORKER_CONCURRENCY_PHOTO) ?? 4,
        duration: 1000,
      },
    }
  );

  const videoWorker = new Worker(
    "media-processing",
    processVideoJob,
    {
      connection: {
        host: process.env.REDIS_HOST ?? "localhost",
        port: Number(process.env.REDIS_PORT) ?? 6379,
        password: process.env.REDIS_PASSWORD ?? undefined,
      },
      concurrency: Number(process.env.WORKER_CONCURRENCY_VIDEO) ?? 1,
      limiter: {
        max: Number(process.env.WORKER_CONCURRENCY_VIDEO) ?? 1,
        duration: 10000,
      },
    }
  );

  photoWorker.on("error", (err) => {
    logger.error({ err }, "Photo worker error");
  });

  videoWorker.on("error", (err) => {
    logger.error({ err }, "Video worker error");
  });

  photoWorker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "Photo processing completed");
  });

  videoWorker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "Video processing completed");
  });

  logger.info("Workers started");

  return { photoWorker, videoWorker, photoQueue };
}
