// ── Auth ──────────────────────────────────────────────────────────

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: string;
}

export interface ApiError {
  message: string;
  code: string;
  traceId: string;
  status?: number;
}

export interface PasskeyInfo {
  id: string;
  name: string;
  device: string;
  createdAt: string;
  lastUsedAt: string | null;
  credentialId: string;
}

export interface SessionInfo {
  id: string;
  userAgent: string;
  ipAddress: string;
  device: string;
  location: string;
  lastActive: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

// ── Media ─────────────────────────────────────────────────────────

export enum MediaStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  TRASHED = "trashed",
}

export enum MediaUploadStatus {
  PENDING = "pending",
  UPLOADING = "uploading",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  SELECTED = "selected",
}

export interface MediaUploadItem {
  id: string;
  file: File;
  status: MediaUploadStatus;
  progress: number;
  error: string | null;
  mediaId: string | null;
}

export interface MediaMetadata {
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  tags: string[];
  license: string | null;
  focalPointX: number | null;
  focalPointY: number | null;
}

export interface MediaItem {
  id: string;
  slug: string;
  type: "photo" | "video";
  status: MediaStatus;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  thumbnailUrl: string | null;
  originalUrl: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  fileSize: number | null;
  collectionId: string | null;
  tags: string[];
  license: string | null;
  focalPointX: number | null;
  focalPointY: number | null;
  isDemo: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  trashedAt: string | null;
}

export interface MediaUpdatePayload {
  version?: number;
  metadata?: Record<string, unknown>;
  title_es?: string;
  title_en?: string;
  description_es?: string;
  description_en?: string;
  tags?: string[];
  license?: string | null;
  collectionId?: string | null;
  focalPointX?: number | null;
  focalPointY?: number | null;
  isDemo?: boolean;
}

export interface MediaCreatePayload {
  type: "photo" | "video";
  originalFilename: string;
  fileSize: number;
  title_es?: string;
  title_en?: string;
  description_es?: string;
  description_en?: string;
  tags?: string[];
  license?: string | null;
}

export interface MediaFilters {
  status?: MediaStatus;
  type?: "photo" | "video";
  collectionId?: string;
  tagId?: string;
  tag?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Collections ───────────────────────────────────────────────────

export interface Collection {
  id: string;
  slug: string;
  name: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  coverId: string | null;
  sortOrder: number;
  mediaCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionCreatePayload {
  name: string;
  slug?: string;
  title_es?: string;
  title_en?: string;
  description_es?: string;
  description_en?: string;
}

export interface CollectionUpdatePayload {
  name?: string;
  slug?: string;
  title_es?: string;
  title_en?: string;
  description_es?: string;
  description_en?: string;
  coverId?: string | null;
  sortOrder?: number;
}

// ── Tags ──────────────────────────────────────────────────────────

export interface Tag {
  id: string;
  slug: string;
  name: string;
  name_es: string;
  name_en: string;
  mediaCount: number;
  createdAt: string;
}

// ── Jobs / Builds / Releases ──────────────────────────────────────

export interface Job {
  id: string;
  type: string;
  status: string;
  mediaId: string | null;
  progress: number;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  items: Job[];
  total: number;
}

export enum BuildStatus {
  PENDING = "pending",
  QUEUED = "queued",
  BUILDING = "building",
  RUNNING = "running",
  PUBLISHED = "published",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface Build {
  id: string;
  status: BuildStatus;
  commit: string;
  branch: string;
  durationMs: number | null;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface Release {
  id: string;
  version: string;
  buildId: string;
  deployedAt: string;
  deployedBy: string;
  status: string;
}

// ── Audit ─────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string;
  action: string;
  object: string | null;
  actor: string | null;
  ip: string | null;
  ua: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditFilters {
  action?: string;
  objectId?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditListResponse {
  items: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Dashboard ─────────────────────────────────────────────────────

export interface DashboardStats {
  totalMedia: number;
  publishedMedia: number;
  draftMedia: number;
  archivedMedia: number;
  trashedMedia: number;
  photosPublished: number;
  videosPublished: number;
  drafts: number;
  jobsFailed: number;
  jobsQueued: number;
  jobsProcessing: number;
  diskUsageLocal: number;
  diskLimitLocal: number;
  diskUsageR2: number;
  diskLimitR2: number;
  lastBuild: string | null;
  lastBackup: BackupStatus | null;
  recentJobs: Job[];
}

export interface BackupStatus {
  lastBackupAt: string | null;
  nextBackupAt: string | null;
  status: "ok" | "warning" | "error";
  size: number;
}
