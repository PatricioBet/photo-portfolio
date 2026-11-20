import { createDbClient as _createDbClient, schema as _schema } from "@photo-portfolio/db";

// Cast schema to bypass drizzle-orm type incompatibilities between workspace packages
export const schema = _schema as any;

export function createDbClient(url: string) {
  return _createDbClient(url) as any;
}

export type DbClient = ReturnType<typeof createDbClient>;
