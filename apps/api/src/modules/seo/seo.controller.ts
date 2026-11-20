import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { SeoService } from "./seo.service";
import { AccessJwtGuard } from "../auth/guards/access-jwt.guard";
import { createDbClient, schema } from "@photo-portfolio/db";
import { eq, and, sql } from "drizzle-orm";

@Controller()
export class SeoController {
  private readonly db = createDbClient(
    process.env.POSTGRES_URL || "postgresql://patriciobet:patriciobet@localhost:5432/photo"
  );

  constructor(private readonly service: SeoService) {}

  @Get("rss.xml")
  async rss(): Promise<string> {
    const published = await this.db
      .select({
        id: schema.media.id,
        slug: schema.media.slug,
        type: schema.media.type,
        titleEs: schema.media.titleEs,
        descriptionEs: schema.media.descriptionEs,
        publishedAt: schema.media.publishedAt,
      })
      .from(schema.media)
      .where(eq(schema.media.status, "published"))
      .orderBy(sql`${schema.media.publishedAt} DESC`)
      .limit(50);

    const items = published
      .map((m) => {
        const url = `https://photo.patriciobet.dev/${m.type === "video" ? "videos" : "fotos"}/${m.slug}/`;
        const date = m.publishedAt?.toISOString() ?? new Date().toISOString();
        return `
  <item>
    <title><![CDATA[${m.titleEs}]]></title>
    <link>${url}</link>
    <description><![CDATA[${m.descriptionEs}]]></description>
    <pubDate>${new Date(date).toUTCString()}</pubDate>
    <guid>${url}</guid>
  </item>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Patricio Betancourt — Portfolio</title>
    <link>https://photo.patriciobet.dev</link>
    <description>Fotografía y video portfolio</description>
    <atom:link href="https://photo.patriciobet.dev/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
  }

  @Get("sitemap.xml")
  async sitemap(): Promise<string> {
    const published = await this.db
      .select({
        slug: schema.media.slug,
        type: schema.media.type,
        publishedAt: schema.media.publishedAt,
        updatedAt: schema.media.updatedAt,
      })
      .from(schema.media)
      .where(eq(schema.media.status, "published"));

    const items = published
      .map((m) => {
        const path = m.type === "video" ? "videos" : "fotos";
        const date = m.publishedAt?.toISOString() ?? m.updatedAt.toISOString();
        return `
  <url>
    <loc>https://photo.patriciobet.dev/${path}/${m.slug}/</loc>
    <lastmod>${new Date(date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
  }

  @Get("search")
  @UseGuards(AccessJwtGuard)
  async search(@Query("q") query: string) {
    if (!query || query.length < 2) {
      return { items: [], total: 0 };
    }

    const results = await this.db
      .select({
        id: schema.media.id,
        slug: schema.media.slug,
        type: schema.media.type,
        titleEs: schema.media.titleEs,
        titleEn: schema.media.titleEn,
        descriptionEs: schema.media.descriptionEs,
        descriptionEn: schema.media.descriptionEn,
        status: schema.media.status,
      })
      .from(schema.media)
      .where(
        and(
          eq(schema.media.status, "published"),
          sql`${schema.media.titleEs} ILIKE ${`%${query}%`}`
        )
      )
      .limit(20);

    return { items: results, total: results.length };
  }
}
