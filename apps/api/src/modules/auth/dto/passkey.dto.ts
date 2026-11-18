import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class InitializePasskeyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CompletePasskeyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  credentialId: string;

  @IsString()
  @IsNotEmpty()
  attestationObject: string;

  @IsString()
  @IsOptional()
  clientExtensionResults?: string;
}

export class SignPasskeyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  response?: any;
}

export class CreateSessionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
