import { BullModule } from "@nestjs/bull";
import { queueConfig } from "../config/app.config";

export const mediaProcessingQueue = BullModule.registerQueue({
  name: "media-processing",
  ...queueConfig,
});
