/**
 * Background job types.
 */
export enum JobType {
  PROCESS_PHOTO = 'process-photo',
  PROCESS_VIDEO = 'process-video',
  GENERATE_VARIANTS = 'generate-variants',
  GENERATE_SITEMAP = 'generate-sitemap',
  SEND_CONTACT_EMAIL = 'send-contact-email',
}

/**
 * Job processing status.
 */
export enum JobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  INTERRUPTED = 'interrupted',
}

/**
 * Background job entity.
 */
export interface JobRecord {
  id: string;
  type: JobType;
  status: JobStatus;
  payload: Record<string, unknown> | null;
  result: Record<string, unknown> | null;
  error: string | null;
  progress: number;
  created_at: Date;
  updated_at: Date;
  started_at: Date | null;
  finished_at: Date | null;
}

/**
 * Job payload for media processing.
 */
export interface MediaJobPayload {
  mediaId: string;
  type: JobType;
}
