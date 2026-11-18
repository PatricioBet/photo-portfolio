import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";

@Module({
  imports: [
    BullModule.registerQueue({ name: "media-processing" }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
