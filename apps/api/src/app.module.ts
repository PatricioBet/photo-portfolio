import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { MediaModule } from "./modules/media/media.module";
import { CollectionsModule } from "./modules/collections/collections.module";
import { TagsModule } from "./modules/tags/tags.module";
import { SeoModule } from "./modules/seo/seo.module";
import { ContactModule } from "./modules/contact/contact.module";
import { AuditModule } from "./modules/audit/audit.module";
// Temporarily disabled: QueueModule has BullMQ v5 compatibility issues with @nestjs/bullmq@10
// The media-worker container handles queue processing independently.
// import { QueueModule } from "./modules/queue/queue.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    AuthModule,
    MediaModule,
    CollectionsModule,
    TagsModule,
    SeoModule,
    ContactModule,
    AuditModule,
    // QueueModule, // Disabled: BullMQ v5 + @nestjs/bullmq@10 incompatibility
    HealthModule,
  ],
})
export default class AppModule {}
