import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { QueueService } from "./queue.service";

@Controller("queue")
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get("jobs/:jobId")
  async getJobStatus(@Param("jobId") jobId: string) {
    return this.queueService.getJobStatus(jobId);
  }

  @Get("length/:queueName")
  async getQueueLength(
    @Param("queueName") queueName: "media-processing" | "default"
  ) {
    const count = await this.queueService.getQueueLength(queueName);
    return { queue: queueName, count };
  }
}
