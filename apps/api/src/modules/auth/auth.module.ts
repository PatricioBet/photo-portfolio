import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bull";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MediaModule } from "../media/media.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "photo-portfolio-jwt-secret-change-me",
      signOptions: { expiresIn: "12h" },
    }),
    BullModule.registerQueue({ name: "default" }),
    MediaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
