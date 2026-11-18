import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AccessJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers["x-access-token"] ?? request.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedException("Missing Access token");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "photo-portfolio-jwt-secret-change-me",
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid Access token");
    }
  }
}
