import { BullModule } from "@nestjs/bullmq";
import { queueConfig } from "../config/app.config";

export const mediaProcessingQueue = BullModule.registerQueue({
  name: "media-processing",
  defaultJobOptions: queueConfig.defaultJobOptions,
});
