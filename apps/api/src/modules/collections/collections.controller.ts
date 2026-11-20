import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { CollectionsService } from "./collections.service";
import { AccessJwtGuard } from "../auth/guards/access-jwt.guard";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { createDbClient, schema } from "../../db/client";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

@Controller("collections")
@UseGuards(AccessJwtGuard)
export class CollectionsController {
  private readonly db = createDbClient(
    process.env.POSTGRES_URL || "postgresql://patriciobet:patriciobet@localhost:5432/photo"
  );

  constructor(private readonly service: CollectionsService) {}

  @Get()
  async list() {
    return this.db
      .select({
        id: schema.collection.id,
        slug: schema.collection.slug,
        titleEs: schema.collection.titleEs,
        titleEn: schema.collection.titleEn,
        descriptionEs: schema.collection.descriptionEs,
        descriptionEn: schema.collection.descriptionEn,
        coverId: schema.collection.coverId,
        sortOrder: schema.collection.sortOrder,
        createdAt: schema.collection.createdAt,
      })
      .from(schema.collection)
      .orderBy(asc(schema.collection.sortOrder));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: { slug: string; titleEs: string; titleEn: string; descriptionEs: string; descriptionEn: string; sortOrder?: number }) {
    const id = nanoid(10);
    const [collection] = await this.db
      .insert(schema.collection)
      .values({
        id,
        slug: dto.slug,
        titleEs: dto.titleEs,
        titleEn: dto.titleEn,
        descriptionEs: dto.descriptionEs,
        descriptionEn: dto.descriptionEn,
        sortOrder: dto.sortOrder ?? 0,
      })
      .returning();
    return collection;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() dto: any) {
    const existing = await this.db
      .select({ id: schema.collection.id })
      .from(schema.collection)
      .where(eq(schema.collection.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundException("Collection not found");
    }

    const updateData: any = { updatedAt: new Date() };
    if (dto.titleEs !== undefined) updateData.titleEs = dto.titleEs;
    if (dto.titleEn !== undefined) updateData.titleEn = dto.titleEn;
    if (dto.descriptionEs !== undefined) updateData.descriptionEs = dto.descriptionEs;
    if (dto.descriptionEn !== undefined) updateData.descriptionEn = dto.descriptionEn;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;
    if (dto.coverId !== undefined) updateData.coverId = dto.coverId;

    const [updated] = await this.db
      .update(schema.collection)
      .set(updateData)
      .where(eq(schema.collection.id, id))
      .returning();

    return updated;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    const [deleted] = await this.db
      .delete(schema.collection)
      .where(eq(schema.collection.id, id))
      .returning({ id: schema.collection.id });

    if (!deleted) {
      throw new NotFoundException("Collection not found");
    }

    return { message: "Collection deleted" };
  }
}
