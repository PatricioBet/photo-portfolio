import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

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
    const progress = job.progress ?? 0;
    const failedReason = job.failedReason;

    return { id: String(job.id), state, progress: Number(progress), failedReason };
  }

  async getQueueLength(queueName: "media-processing" | "default"): Promise<number> {
    const queue = queueName === "media-processing" ? this.mediaQueue : this.defaultQueue;
    const active = await queue.getActiveCount();
    const waiting = await queue.getWaitingCount();
    const delayed = await queue.getDelayedCount();
    return active + waiting + delayed;
  }
}
