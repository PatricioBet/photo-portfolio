import { Injectable, UnauthorizedException } from "@nestjs/common";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
  WebAuthnCredential,
} from "@simplewebauthn/server";
import { createDbClient, schema } from "../../db/client";
import { eq } from "drizzle-orm";
import { JwtService } from "@nestjs/jwt";

const RP_ID = process.env.RP_ID || "photo.patriciobet.dev";
const ORIGIN = process.env.WEB_URL || "https://photo.patriciobet.dev";
const ADMIN_ORIGIN = process.env.ADMIN_URL || "https://admin-photo.patriciobet.dev";

@Injectable()
export class AuthService {
  private readonly db = createDbClient(
    process.env.POSTGRES_URL ||
      "postgresql://patriciobet:patriciobet@localhost:5432/photo"
  );

  constructor(private readonly jwtService: JwtService) {}

  async initializePasskeyRegistration(email: string): Promise<{
    challenge: string;
    rp: { id: string; name: string };
    user: { id: string; name: string; displayName: string };
    timeout: number;
    attestation: string;
  }> {
    const user = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);

    if (user.length === 0) {
      throw new UnauthorizedException("User not found");
    }

    if (user[0].passkeyHandle) {
      throw new UnauthorizedException("Passkey already registered");
    }

    const options = await generateRegistrationOptions({
      rpID: RP_ID,
      rpName: "Photo Portfolio",
      userID: Buffer.from(user[0].id, "hex"),
      userName: email,
      userDisplayName: email,
      timeout: 60000,
      attestationType: "direct",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        requireResidentKey: true,
        userVerification: "preferred",
      },
    });

    return {
      challenge: options.challenge,
      rp: { id: options.rp.id, name: options.rp.name },
      user: options.user,
      timeout: options.timeout,
      attestation: options.attestation,
    };
  }

  async completePasskeyRegistration(
    email: string,
    response: any
  ): Promise<{ message: string }> {
    const user = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);

    if (user.length === 0) {
      throw new UnauthorizedException("User not found");
    }

    const verification: VerifiedRegistrationResponse =
      await verifyRegistrationResponse({
        response,
        expectedChallenge: "",
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
      });

    if (!verification.verified) {
      throw new UnauthorizedException("Passkey verification failed");
    }

    const regInfo = verification.registrationInfo;
    const credential = regInfo?.credential;

    await this.db
      .update(schema.user)
      .set({
        passkeyHandle: credential?.id ?? "",
        passkeyPublicKey: Buffer.from(credential?.publicKey ?? new Uint8Array()).toString("base64"),
        passkeyCounter: regInfo?.credential?.counter ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.user.email, email));

    return { message: "Passkey registered successfully" };
  }

  async getPasskeyChallenge(email: string): Promise<{
    challenge: string;
    timeout: number;
  }> {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      timeout: 60000,
      allowCredentials: [],
      userVerification: "preferred",
    });

    return {
      challenge: options.challenge,
      timeout: options.timeout,
    };
  }

  async signInWithPasskey(
    email: string,
    response: any
  ): Promise<{ token: string; expiresIn: string }> {
    const user = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);

    if (user.length === 0 || !user[0].passkeyHandle) {
      throw new UnauthorizedException("User not found or no passkey registered");
    }

    const credential: WebAuthnCredential = {
      id: user[0].passkeyHandle,
      publicKey: Buffer.from(user[0].passkeyPublicKey || "", "base64"),
      counter: user[0].passkeyCounter ?? 0,
    };

    const verification: VerifiedAuthenticationResponse =
      await verifyAuthenticationResponse({
        response,
        expectedChallenge: "",
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        credential,
      });

    if (!verification.verified) {
      throw new UnauthorizedException("Authentication failed");
    }

    const authInfo = verification.authenticationInfo;

    await this.db
      .update(schema.user)
      .set({
        passkeyCounter: authInfo?.newCounter ?? user[0].passkeyCounter ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(schema.user.email, email));

    const token = this.jwtService.sign(
      { sub: user[0].id, email: user[0].email, role: user[0].role },
      { expiresIn: "12h" }
    );

    return { token, expiresIn: "12h" };
  }

  async createSessionFromAccess(email: string): Promise<{
    token: string;
    expiresIn: string;
  }> {
    let user = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email))
      .limit(1);

    if (user.length === 0) {
      user = await this.db
        .insert(schema.user)
        .values({ email, role: "admin" })
        .returning();
    }

    const token = this.jwtService.sign(
      { sub: user[0].id, email: user[0].email, role: user[0].role },
      { expiresIn: "12h" }
    );

    return { token, expiresIn: "12h" };
  }

  async revokeSession(): Promise<{ message: string }> {
    return { message: "Session revoked" };
  }

  generateRecoveryCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomUUID().slice(0, 8).toUpperCase());
    }
    return codes;
  }

  validateRecoveryCode(provided: string, stored: string[]): boolean {
    const index = stored.findIndex((c) => c === provided.toUpperCase());
    if (index === -1) return false;
    stored.splice(index, 1);
    return true;
  }
}
