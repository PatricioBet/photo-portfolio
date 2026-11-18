export type MediaType = "photo" | "video";
export type MediaStatus = "draft" | "published" | "archived" | "trashed";
export type JobStatus =
  | "queued"
  | "processing"
  | "ready"
  | "failed"
  | "interrupted";
export type BuildStatus = "queued" | "building" | "published" | "failed";
export type BackupStatus = "ok" | "failed" | "pending";

export interface MediaItem {
  id: string;
  type: MediaType;
  status: MediaStatus;
  originalFilename: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isDemo: boolean;
  focalPointX: number | null;
  focalPointY: number | null;
  metadata: MediaMetadata;
  variants: MediaVariant[];
  jobStatus: JobStatus;
  thumbnailUrl: string | null;
}

export interface MediaMetadata {
  es: MediaTranslation;
  en: MediaTranslation | null;
  captureDate: string | null;
  collectionId: string | null;
  tags: string[];
  license: string | null;
  credit: string | null;
  location: string | null;
  isFeatured: boolean;
  manualOrder: number | null;
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: string | null;
}

export interface MediaTranslation {
  title: string;
  alt: string;
  description: string;
  slug: string;
}

export interface MediaVariant {
  id: string;
  type: string;
  width: number;
  height: number;
  url: string;
  size: number;
}

export interface MediaUploadItem {
  id: string;
  file: File;
  status: MediaUploadStatus;
  progress: number;
  error: string | null;
  mediaId: string | null;
}

export type MediaUploadStatus =
  | "selected"
  | "uploading"
  | "paused"
  | "queued"
  | "processing"
  | "ready"
  | "failed"
  | "duplicate";

export interface MediaCreatePayload {
  type: MediaType;
  originalFilename: string;
  fileSize: number;
}

export interface MediaUpdatePayload {
  version: number;
  metadata: Partial<MediaMetadata>;
}

export interface MediaListResponse {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MediaFilters {
  type?: MediaType;
  status?: MediaStatus;
  collectionId?: string | null;
  tag?: string | null;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface Collection {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  coverId: string | null;
  elementCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionCreatePayload {
  name: string;
  nameEn?: string;
  slug: string;
  coverId?: string;
  order?: number;
}

export interface CollectionUpdatePayload {
  version: number;
  name?: string;
  nameEn?: string;
  slug?: string;
  coverId?: string;
  order?: number;
}

export interface Tag {
  name: string;
  mediaCount: number;
}

export interface Job {
  id: string;
  type: string;
  status: JobStatus;
  mediaId: string | null;
  createdAt: string;
  updatedAt: string;
  error: string | null;
  traceId: string;
}

export interface JobListResponse {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Build {
  id: string;
  number: number;
  status: BuildStatus;
  createdAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  releaseId: string | null;
  error: string | null;
  traceId: string;
  changesCount: number;
}

export interface Release {
  id: string;
  buildId: string;
  number: number;
  createdAt: string;
  isActive: boolean;
  error: string | null;
}

export interface DashboardStats {
  photosPublished: number;
  videosPublished: number;
  drafts: number;
  trashed: number;
  jobsQueued: number;
  jobsProcessing: number;
  jobsFailed: number;
  lastBuild: Build | null;
  lastBackup: BackupInfo | null;
  diskUsageLocal: number;
  diskUsageR2: number;
  diskLimitLocal: number;
  diskLimitR2: number;
}

export interface BackupInfo {
  lastRun: string;
  size: number;
  status: BackupStatus;
  nextRun: string;
  retention: string;
  offsite: string;
  lastVerification: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  object: string | null;
  objectId: string | null;
  actor: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export interface AuditListResponse {
  items: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuditFilters {
  action?: string;
  objectId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface PasskeyInfo {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt: string | null;
  device: string;
}

export interface SessionInfo {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AuthSession {
  userId: string;
  displayName: string;
  expiresAt: string;
}

export interface ApiError {
  message: string;
  traceId: string;
  code: string;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
