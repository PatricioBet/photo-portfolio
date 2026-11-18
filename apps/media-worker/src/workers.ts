import { Worker } from "bull";
import { createQueue } from "./queue";
import { processPhotoJob, processVideoJob } from "./processors";
import { logger } from "./logger";

export async function startWorkers() {
  const photoQueue = createQueue("media-processing");

  const photoWorker = new Worker(
    "media-processing",
    processPhotoJob,
    {
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
