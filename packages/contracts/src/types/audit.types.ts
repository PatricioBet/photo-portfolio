/**
 * Audit log entry.
 */
export interface AuditLogRecord {
  id: string;
  user_id: string | null;
  action: string;
  resource: string;
  resource_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}
