import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { MediaService } from "./media.service";
import { CreateMediaDto, UpdateMediaDto, ListMediaDto } from "./dto/media.dto";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { AccessJwtGuard } from "../auth/guards/access-jwt.guard";
import { createDbClient, schema } from "../../db/client";
import { eq, sql, asc, desc, like, and, or, isNull } from "drizzle-orm";
import { nanoid } from "nanoid";

@Controller("media")
@UseGuards(AccessJwtGuard)
export class MediaController {
  private readonly db = createDbClient(
    process.env.POSTGRES_URL ||
      "postgresql://patriciobet:patriciobet@localhost:5432/photo"
  );

  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async list(@Query() query: ListMediaDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 36));
    const offset = (page - 1) * limit;
    const status = query.status === "published" ? "published" : undefined;
    const type = query.type === "photo" || query.type === "video" ? query.type : undefined;

    const whereConditions = [];
    if (status) whereConditions.push(eq(schema.media.status, status));
    if (type) whereConditions.push(eq(schema.media.type, type));
    if (query.collectionId) whereConditions.push(eq(schema.media.collectionId, query.collectionId));
    if (query.search) {
      whereConditions.push(
        or(
          like(schema.media.titleEs, `%${query.search}%`),
          like(schema.media.descriptionEs, `%${query.search}%`),
          like(schema.media.titleEn, `%${query.search}%`),
          like(schema.media.descriptionEn, `%${query.search}%`)
        )
      );
    }

    const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const [items, total] = await Promise.all([
      this.db
        .select({
          id: schema.media.id,
          slug: schema.media.slug,
          type: schema.media.type,
          status: schema.media.status,
          titleEs: schema.media.titleEs,
          titleEn: schema.media.titleEn,
          descriptionEs: schema.media.descriptionEs,
          descriptionEn: schema.media.descriptionEn,
          collectionId: schema.media.collectionId,
          width: schema.media.width,
          height: schema.media.height,
          duration: schema.media.duration,
          isDemo: schema.media.isDemo,
          publishedAt: schema.media.publishedAt,
          createdAt: schema.media.createdAt,
        })
        .from(schema.media)
        .where(where)
        .orderBy(
          query.sortBy === "publishedAt"
            ? desc(schema.media.publishedAt ?? sql`'1970-01-01'::timestamp`)
            : desc(schema.media.createdAt)
        )
        .limit(limit)
        .offset(offset),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(schema.media)
        .where(where),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateMediaDto) {
    const id = nanoid(10);
    const slug = dto.slug ?? `media-${id}`;

    const existing = await this.db
      .select({ id: schema.media.id })
      .from(schema.media)
      .where(eq(schema.media.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException(`Slug "${slug}" already exists`);
    }

    const [media] = await this.db
      .insert(schema.media)
      .values({
        id,
        slug,
        type: dto.type,
        titleEs: dto.titleEs ?? "",
        titleEn: dto.titleEn ?? "",
        descriptionEs: dto.descriptionEs ?? "",
        descriptionEn: dto.descriptionEn ?? "",
        collectionId: dto.collectionId ?? null,
      })
      .returning();

    return media;
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    const [media] = await this.db
      .select()
      .from(schema.media)
      .where(eq(schema.media.id, id))
      .limit(1);

    if (!media) {
      throw new NotFoundException(`Media not found: ${id}`);
    }

    const variants = await this.db
      .select()
      .from(schema.mediaVariant)
      .where(eq(schema.mediaVariant.mediaId, id));

    const tags = await this.db
      .select({
        id: schema.tag.id,
        slug: schema.tag.slug,
        nameEs: schema.tag.nameEs,
        nameEn: schema.tag.nameEn,
      })
      .from(schema.mediaTag)
      .innerJoin(schema.tag, eq(schema.mediaTag.tagId, schema.tag.id))
      .where(eq(schema.mediaTag.mediaId, id));

    return {
      ...media,
      variants,
      tags,
    };
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() dto: UpdateMediaDto) {
    const existing = await this.db
      .select({ id: schema.media.id })
      .from(schema.media)
      .where(eq(schema.media.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundException(`Media not found: ${id}`);
    }

    const updateData: any = { updatedAt: new Date() };
    if (dto.titleEs !== undefined) updateData.titleEs = dto.titleEs;
    if (dto.titleEn !== undefined) updateData.titleEn = dto.titleEn;
    if (dto.descriptionEs !== undefined) updateData.descriptionEs = dto.descriptionEs;
    if (dto.descriptionEn !== undefined) updateData.descriptionEn = dto.descriptionEn;
    if (dto.collectionId !== undefined) updateData.collectionId = dto.collectionId;
    if (dto.focalPointX !== undefined) updateData.focalPointX = dto.focalPointX;
    if (dto.focalPointY !== undefined) updateData.focalPointY = dto.focalPointY;
    if (dto.tags !== undefined) {
      await this.db
        .delete(schema.mediaTag)
        .where(eq(schema.mediaTag.mediaId, id));
      if (dto.tags.length > 0) {
        await this.db.insert(schema.mediaTag).values(
          dto.tags.map((tagId: string) => ({ mediaId: id, tagId }))
        );
      }
    }

    const [updated] = await this.db
      .update(schema.media)
      .set(updateData)
      .where(eq(schema.media.id, id))
      .returning();

    return updated;
  }

  @Post(":id/publish")
  @UseGuards(JwtAuthGuard)
  async publish(@Param("id") id: string) {
    const [updated] = await this.db
      .update(schema.media)
      .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.media.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Media not found: ${id}`);
    }

    return updated;
  }

  @Post(":id/unpublish")
  @UseGuards(JwtAuthGuard)
  async unpublish(@Param("id") id: string) {
    const [updated] = await this.db
      .update(schema.media)
      .set({ status: "archived", publishedAt: null, updatedAt: new Date() })
      .where(eq(schema.media.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Media not found: ${id}`);
    }

    return updated;
  }

  @Post(":id/trash")
  @UseGuards(JwtAuthGuard)
  async trash(@Param("id") id: string) {
    const [updated] = await this.db
      .update(schema.media)
      .set({
        status: "trashed",
        trashedAt: new Date(),
        publishedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.media.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Media not found: ${id}`);
    }

    return updated;
  }

  @Post(":id/restore")
  @UseGuards(JwtAuthGuard)
  async restore(@Param("id") id: string) {
    const [updated] = await this.db
      .update(schema.media)
      .set({
        status: "draft",
        trashedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.media.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Media not found: ${id}`);
    }

    return updated;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    const [deleted] = await this.db
      .delete(schema.media)
      .where(eq(schema.media.id, id))
      .returning({ id: schema.media.id });

    if (!deleted) {
      throw new NotFoundException(`Media not found: ${id}`);
    }

    await this.db
      .delete(schema.mediaVariant)
      .where(eq(schema.mediaVariant.mediaId, id));

    await this.db
      .delete(schema.mediaTag)
      .where(eq(schema.mediaTag.mediaId, id));

    return { message: "Media permanently deleted" };
  }
}
