import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue("media-processing")
    private readonly mediaQueue: Queue,
    @InjectQueue("default")
    private readonly defaultQueue: Queue
  ) {}

  async getJobStatus(jobId: string): Promise<{
    id: string;
    state: string;
    progress: number;
    failedReason?: string;
  }> {
    const job = await this.mediaQueue.getJob(jobId) ?? await this.defaultQueue.getJob(jobId);
    if (!job) {
      return { id: jobId, state: "unknown", progress: 0 };
    }

    const state = await job.getState();
    const progress = job.progress() as number ?? 0;
    const failedReason = job.failedReason;

    return { id: job.id!, state, progress, failedReason };
  }

  async getQueueLength(queueName: "media-processing" | "default"): Promise<number> {
    const queue = queueName === "media-processing" ? this.mediaQueue : this.defaultQueue;
    return queue.getLength();
  }
}
