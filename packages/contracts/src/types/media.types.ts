/**
 * Media type and status enums.
 */
export enum MediaType {
  PHOTO = 'photo',
  VIDEO = 'video',
}

export enum MediaStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  TRASHED = 'trashed',
}

/**
 * Image format variants.
 */
export enum VariantFormat {
  AVIF = 'avif',
  WEBP = 'webp',
  JPEG = 'jpeg',
  ORIGINAL = 'original',
}

/**
 * Full media entity as stored in the database.
 */
export interface MediaRecord {
  id: string;
  slug: string;
  type: MediaType;
  status: MediaStatus;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  collection_id: string | null;
  focal_point_x: number | null;
  focal_point_y: number | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  original_hash: string | null;
  is_demo: boolean;
  is_demo_source: boolean;
  demo_manifest_ref: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  trashed_at: Date | null;
}

/**
 * Media with variants attached.
 */
export interface MediaWithVariants extends MediaRecord {
  variants: MediaVariantRecord[];
}

/**
 * Media variant record.
 */
export interface MediaVariantRecord {
  id: string;
  media_id: string;
  format: VariantFormat;
  width: number | null;
  height: number | null;
  url: string;
  size: number;
  quality: number;
  created_at: Date;
}

/**
 * Paginated media list response.
 */
export interface MediaListResponse {
  items: MediaRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Query parameters for media listing.
 */
export interface MediaQueryParams {
  page?: number;
  pageSize?: number;
  type?: MediaType;
  status?: MediaStatus;
  collectionId?: string;
  tagId?: string;
  search?: string;
  sortBy?: 'created_at' | 'published_at' | 'title_es';
  sortOrder?: 'asc' | 'desc';
}
