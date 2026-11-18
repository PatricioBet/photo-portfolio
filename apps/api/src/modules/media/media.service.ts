import { Injectable } from "@nestjs/common";
import { BullQueue } from "@nestjs/bull";

@Injectable()
export class MediaService {
  constructor(private readonly queue: BullQueue) {}

  async enqueuePhotoProcessing(mediaId: string, filePath: string): Promise<string> {
    const job = await this.queue.add("process-photo", { mediaId, filePath }, {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    });
    return job.id;
  }

  async enqueueVideoProcessing(mediaId: string, filePath: string): Promise<string> {
    const job = await this.queue.add("process-video", { mediaId, filePath }, {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
    });
    return job.id;
  }

  async enqueueSitemapGeneration(): Promise<string> {
    const job = await this.queue.add("generate-sitemap", {}, {
      attempts: 2,
      backoff: { type: "fixed", delay: 3000 },
    });
    return job.id;
  }
}
