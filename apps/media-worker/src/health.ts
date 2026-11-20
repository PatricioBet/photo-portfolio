import { createClient } from "pg";
import { createDbClient } from "@photo-portfolio/db";
import { workerConfig } from "./config";

export function getDbClient() {
  return createDbClient(workerConfig.postgres.url);
}

export async function checkHealth(): Promise<{
  status: "ok" | "error";
  db: boolean;
  redis: boolean;
}> {
  const result = { status: "ok" as const, db: false, redis: false };

  try {
    const db = getDbClient();
    await db.$client.query("SELECT 1");
    result.db = true;
    await db.$client.end();
  } catch {
    result.status = "error";
  }

  // Redis check
  try {
    const { createQueue } = await import("./queue");
    const queue = createQueue("health-check");
    await queue.getJobCount("active");
    await queue.close();
    result.redis = true;
  } catch {
    result.status = "error";
  }

  return result;
}
