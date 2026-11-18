import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { QueueController } from "./queue.controller";
import { QueueService } from "./queue.service";
import { QueueProcessor } from "./queue.processor";

@Module({
  imports: [
    BullModule.registerQueue({ name: "media-processing" }),
    BullModule.registerQueue({ name: "default" }),
  ],
  controllers: [QueueController],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService],
})
export class QueueModule {}
