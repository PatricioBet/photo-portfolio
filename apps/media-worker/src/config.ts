export const workerConfig = {
  redis: {
    host: process.env.REDIS_HOST ?? "localhost",
    port: Number(process.env.REDIS_PORT) ?? 6379,
    password: process.env.REDIS_PASSWORD ?? undefined,
  },
  postgres: {
    url:
      process.env.POSTGRES_URL ??
      "postgresql://photo:photo@localhost:5432/photo",
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID ?? "",
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    bucket: process.env.R2_BUCKET ?? "photo-portfolio",
    region: process.env.R2_REGION ?? "auto",
  },
  concurrency: {
    photo: Number(process.env.WORKER_CONCURRENCY_PHOTO) ?? 4,
    video: Number(process.env.WORKER_CONCURRENCY_VIDEO) ?? 1,
  },
  memoryLimit:
    Number(process.env.WORKER_MEMORY_LIMIT) ?? 2 * 1024 * 1024 * 1024,
  incomingDir: process.env.WORKER_INCOMING_DIR ?? "/tmp/incoming",
  outputDir: process.env.WORKER_OUTPUT_DIR ?? "/tmp/output",
};
