import {
  Controller,
  Post,
  Body,
  Delete,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  InitializePasskeyDto,
  CompletePasskeyDto,
  SignPasskeyDto,
} from "./dto/passkey.dto";
import { AccessJwtGuard } from "./guards/access-jwt.guard";
import { PasskeyGuard } from "./guards/passkey.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("passkey/initialize")
  async initializePasskey(
    @Body() dto: InitializePasskeyDto
  ): Promise<{ challenge: string; rp: { id: string; name: string }; user: { id: string; name: string; displayName: string }; timeout: number; attestation: string }> {
    return this.authService.initializePasskeyRegistration(dto.email);
  }

  @Post("passkey/challenge")
  async getChallenge(@Body() dto: SignPasskeyDto): Promise<{ challenge: string; timeout: number }> {
    return this.authService.getPasskeyChallenge(dto.email);
  }

  @Post("passkey/complete")
  @HttpCode(HttpStatus.OK)
  async completePasskey(
    @Body() dto: CompletePasskeyDto,
    @Headers("x-access-token") accessToken?: string
  ): Promise<{ message: string }> {
    return this.authService.completePasskeyRegistration(dto.email, dto.response);
  }

  @Post("passkey/sign")
  @UseGuards(PasskeyGuard)
  async signPasskey(
    @Body() dto: SignPasskeyDto,
    @Headers("x-access-token") accessToken?: string
  ): Promise<{ token: string; expiresIn: string }> {
    return this.authService.signInWithPasskey(dto.email, dto.response);
  }

  @Post("session")
  @UseGuards(AccessJwtGuard)
  @HttpCode(HttpStatus.OK)
  async createSession(
    @Headers("x-auth-request-email") email: string
  ): Promise<{ token: string; expiresIn: "12h" }> {
    return this.authService.createSessionFromAccess(email);
  }

  @Delete("session")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async revokeSession(): Promise<{ message: string }> {
    return this.authService.revokeSession();
  }
}
