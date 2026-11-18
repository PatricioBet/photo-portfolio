import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from "class-validator";

export enum MediaStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  TRASHED = "trashed",
}

export enum MediaType {
  PHOTO = "photo",
  VIDEO = "video",
}

export class CreateMediaDto {
  @IsString()
  slug?: string;

  @IsEnum(MediaType)
  type: MediaType;

  @IsString()
  titleEs?: string;

  @IsString()
  titleEn?: string;

  @IsString()
  descriptionEs?: string;

  @IsString()
  descriptionEn?: string;

  @IsString()
  collectionId?: string;
}

export class UpdateMediaDto {
  @IsString()
  titleEs?: string;

  @IsString()
  titleEn?: string;

  @IsString()
  descriptionEs?: string;

  @IsString()
  descriptionEn?: string;

  @IsString()
  collectionId?: string;

  @IsOptional()
  @IsInt()
  focalPointX?: number;

  @IsOptional()
  @IsInt()
  focalPointY?: number;

  @IsOptional()
  tags?: string[];
}

export class ListMediaDto {
  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @IsOptional()
  @IsEnum(MediaStatus)
  status?: MediaStatus;

  @IsOptional()
  @IsString()
  collectionId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 36;

  @IsOptional()
  @IsString()
  sortBy?: string = "createdAt";
}
