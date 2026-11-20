import { createDbClient } from "@photo-portfolio/db";
import type { Server } from "node:http";
import { workerConfig } from "./config.js";

export function getDbClient() {
  return createDbClient(workerConfig.postgres.url);
}

async function checkDb() {
  try {
    const db = getDbClient();
    await db.$client.query("SELECT 1");
    await db.$client.end();
    return true;
  } catch {
    return false;
  }
}

async function checkRedis() {
  try {
    const { createQueue } = await import("./queue.js");
    const queue = createQueue("health-check");
    await queue.getJobCounts("active", "completed", "waiting", "failed");
    await queue.close();
    return true;
  } catch {
    return false;
  }
}

export async function checkHealth(): Promise<{
  status: "ok" | "error";
  db: boolean;
  redis: boolean;
}> {
  const result: { status: "ok" | "error"; db: boolean; redis: boolean } = {
    status: "ok",
    db: false,
    redis: false,
  };

  result.db = await checkDb();
  if (!result.db) {
    result.status = "error";
  }

  result.redis = await checkRedis();
  if (!result.redis) {
    result.status = "error";
  }

  return result;
}

export async function createHealthServer() {
  const http = await import("node:http");

  let server: Server | null = null;

  const start = (): Promise<void> =>
    new Promise<void>((resolve) => {
      server = http.createServer(async (_req, res) => {
        const health = await checkHealth();
        const status = health.status === "ok" ? 200 : 503;
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(health));
      });
      server.listen(9000, () => resolve());
    });

  const stop = (): Promise<void> =>
    new Promise<void>((resolve) => {
      if (server) {
        server.close(() => resolve());
      } else {
        resolve();
      }
    });

  return { start, stop };
}
