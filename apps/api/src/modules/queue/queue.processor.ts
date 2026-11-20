import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { createDbClient, schema } from "@photo-portfolio/db";
import { eq } from "drizzle-orm";

@Processor("media-processing")
export class QueueProcessor {
  private readonly db = createDbClient(
    process.env.POSTGRES_URL ||
      "postgresql://patriciobet:patriciobet@localhost:5432/photo"
  );

  @Process("process-photo")
  async processPhoto(job: Job) {
    const { mediaId, filePath } = job.data;
    job.updateProgress(10);

    // In production: use Sharp to process image
    // 1. Validate format (reject polyglots)
    // 2. Extract EXIF metadata (remove GPS)
    // 3. Generate variants: AVIF, WebP, JPEG at multiple sizes
    // 4. Save variants to local storage
    // 5. Store variants in DB

    job.updateProgress(100);

    await this.db
      .update(schema.media)
      .set({ updatedAt: new Date() })
      .where(eq(schema.media.id, mediaId));
  }

  @Process("process-video")
  async processVideo(job: Job) {
    const { mediaId, filePath } = job.data;
    job.updateProgress(10);

    // In production: use FFmpeg to process video
    // 1. Validate with ffprobe (no network access)
    // 2. Transcode to 1080p, 720p, 480p
    // 3. Generate poster image
    // 4. Generate HLS if > 3 minutes
    // 5. Save to local storage

    job.updateProgress(100);

    await this.db
      .update(schema.media)
      .set({ updatedAt: new Date() })
      .where(eq(schema.media.id, mediaId));
  }

  @Process("generate-sitemap")
  async generateSitemap(job: Job) {
    // Regenerate sitemap.xml from published media
    job.updateProgress(100);
  }
}
