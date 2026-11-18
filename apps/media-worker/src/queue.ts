import Bull from "bull";
import { workerConfig } from "./config";

export function createQueue(name: string): Bull.Queue {
  return new Bull(name, {
    redis: {
      host: workerConfig.redis.host,
      port: workerConfig.redis.port,
      password: workerConfig.redis.password,
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    },
  });
}
