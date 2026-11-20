import { Queue } from "bullmq";
import { workerConfig } from "./config.js";

const redisOpts = {
  host: workerConfig.redis.host,
  port: workerConfig.redis.port,
  password: workerConfig.redis.password || undefined,
};

export function createQueue(name: string): Queue {
  return new Queue(name, {
    connection: redisOpts,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential" as const,
        delay: 2000,
      },
    },
  });
}
