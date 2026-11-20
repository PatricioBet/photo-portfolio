import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@Injectable()
export class MediaService {
  constructor(@InjectQueue("media-processing") private readonly queue: Queue) {}

  async enqueuePhotoProcessing(mediaId: string, filePath: string): Promise<string> {
    const job = await this.queue.add("process-photo", { mediaId, filePath }, {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    });
    return String(job.id);
  }

  async enqueueVideoProcessing(mediaId: string, filePath: string): Promise<string> {
    const job = await this.queue.add("process-video", { mediaId, filePath }, {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
    });
    return String(job.id);
  }

  async enqueueSitemapGeneration(): Promise<string> {
    const job = await this.queue.add("generate-sitemap", {}, {
      attempts: 2,
      backoff: { type: "fixed", delay: 3000 },
    });
    return String(job.id);
  }
}
