import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { AccessJwtGuard } from "../auth/guards/access-jwt.guard";
import { createDbClient, schema } from "../../db/client";
import { desc, like, gte } from "drizzle-orm";

@Controller("audit")
@UseGuards(AccessJwtGuard)
export class AuditController {
  private readonly db = createDbClient(
    process.env.POSTGRES_URL || "postgresql://patriciobet:patriciobet@localhost:5432/photo"
  );

  constructor(private readonly service: AuditService) {}

  @Get()
  async list(
    @Query("action") action?: string,
    @Query("resource") resource?: string,
    @Query("since") since?: string,
    @Query("page") pageParam?: string,
    @Query("limit") limitParam?: string
  ) {
    const page = Math.max(1, parseInt(pageParam ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(limitParam ?? "50", 10)));
    const offset = (page - 1) * limit;

    const whereConditions: any[] = [];
    if (action) whereConditions.push(like(schema.auditLog.action, `%${action}%`));
    if (resource) whereConditions.push(eq(schema.auditLog.resource, resource));
    if (since) whereConditions.push(gte(schema.auditLog.createdAt, new Date(since)));

    const items = await this.db
      .select({
        id: schema.auditLog.id,
        userId: schema.auditLog.userId,
        action: schema.auditLog.action,
        resource: schema.auditLog.resource,
        resourceId: schema.auditLog.resourceId,
        metadata: schema.auditLog.metadata,
        createdAt: schema.auditLog.createdAt,
      })
      .from(schema.auditLog)
      .where(whereConditions.length > 0 ? { and: whereConditions } : undefined)
      .orderBy(desc(schema.auditLog.createdAt))
      .limit(limit)
      .offset(offset);

    return { items, pagination: { page, limit } };
  }
}
