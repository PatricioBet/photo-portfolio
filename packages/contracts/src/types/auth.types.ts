/**
 * User roles in the admin panel.
 */
export enum UserRole {
  ADMIN = 'admin',
}

/**
 * User entity for passkey-based authentication.
 */
export interface UserRecord {
  id: string;
  email: string;
  passkey_handle: string | null;
  passkey_public_key: string | null;
  passkey_counter: number | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

/**
 * Session entity.
 */
export interface SessionRecord {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

/**
 * WebAuthn credential info (server-side).
 */
export interface WebAuthnCredential {
  handle: string;
  publicKey: string;
  counter: number;
}

/**
 * WebAuthn registration challenge response.
 */
export interface WebAuthnRegistrationResponse {
  challenge: string;
  publicKey: Record<string, unknown>;
}

/**
 * WebAuthn authentication challenge response.
 */
export interface WebAuthnAuthenticationResponse {
  challenge: string;
  allowCredentials: Array<{
    id: string;
    type: 'public-key';
  }>;
}

/**
 * JWT payload after passkey auth.
 */
export interface JwtPayload {
  sub: string;
  userId: string;
  sessionId: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Cloudflare Access JWT claims.
 */
export interface AccessJwtClaims {
  sub: string;
  email: string;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
}
