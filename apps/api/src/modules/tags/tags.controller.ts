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
import { TagsService } from "./tags.service";
import { AccessJwtGuard } from "../auth/guards/access-jwt.guard";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { createDbClient, schema } from "../../db/client";
import { eq, asc } from "drizzle-orm";
import { nanoid } from "nanoid";

@Controller("tags")
@UseGuards(AccessJwtGuard)
export class TagsController {
  private readonly db = createDbClient(
    process.env.POSTGRES_URL || "postgresql://patriciobet:patriciobet@localhost:5432/photo"
  );

  constructor(private readonly service: TagsService) {}

  @Get()
  async list() {
    return this.db
      .select({
        id: schema.tag.id,
        slug: schema.tag.slug,
        nameEs: schema.tag.nameEs,
        nameEn: schema.tag.nameEn,
      })
      .from(schema.tag)
      .orderBy(asc(schema.tag.nameEs));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: { slug: string; nameEs: string; nameEn: string }) {
    const id = nanoid(10);
    const [tag] = await this.db
      .insert(schema.tag)
      .values({
        id,
        slug: dto.slug,
        nameEs: dto.nameEs,
        nameEn: dto.nameEn,
      })
      .returning();
    return tag;
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(@Param("id") id: string, @Body() dto: any) {
    const existing = await this.db
      .select({ id: schema.tag.id })
      .from(schema.tag)
      .where(eq(schema.tag.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundException("Tag not found");
    }

    const updateData: any = {};
    if (dto.nameEs !== undefined) updateData.nameEs = dto.nameEs;
    if (dto.nameEn !== undefined) updateData.nameEn = dto.nameEn;
    if (dto.slug !== undefined) updateData.slug = dto.slug;

    const [updated] = await this.db
      .update(schema.tag)
      .set(updateData)
      .where(eq(schema.tag.id, id))
      .returning();

    return updated;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("id") id: string) {
    const [deleted] = await this.db
      .delete(schema.tag)
      .where(eq(schema.tag.id, id))
      .returning({ id: schema.tag.id });

    if (!deleted) {
      throw new NotFoundException("Tag not found");
    }

    await this.db.delete(schema.mediaTag).where(eq(schema.mediaTag.tagId, id));

    return { message: "Tag deleted" };
  }
}
