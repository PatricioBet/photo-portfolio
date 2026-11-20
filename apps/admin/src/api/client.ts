import type {
  ApiError,
  ApiPaginatedResponse,
  MediaItem,
  MediaUpdatePayload,
  MediaCreatePayload,
  Collection,
  CollectionCreatePayload,
  CollectionUpdatePayload,
  Tag,
  JobListResponse,
  Build,
  Release,
  AuditFilters,
  AuditListResponse,
  DashboardStats,
  PasskeyInfo,
  SessionInfo,
} from "../types";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "/api");

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

function buildUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

async function getAccessToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/session", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || null;
  } catch {
    return null;
  }
}

async function fetchJson<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  // Merge headers from options
  if (options.headers) {
    if (typeof options.headers === "object" && !Array.isArray(options.headers)) {
      const h = options.headers as Record<string, string>;
      Object.assign(headers, h);
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Forward Cloudflare Access JWT from the parent frame
  const accessJwt = window.localStorage.getItem("cf-access-token");
  if (accessJwt) {
    headers["Authorization"] = `Bearer ${accessJwt}`;
  }

  const url = buildUrl(path, options.params);

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    let error: Record<string, unknown> = {};
    try {
      error = await response.json();
    } catch {
      error = { message: response.statusText };
    }
    const err = error as unknown as ApiError;
    const httpError = new Error(err.message || "Request failed") as unknown as ApiError;
    httpError.code = (error.code as string) || "UNKNOWN";
    httpError.traceId = (error.traceId as string) || "";
    httpError.status = response.status;
    throw httpError;
  }

  return response.json();
}

export async function getMediaList(
  filters: Record<string, string> = {}
): Promise<ApiPaginatedResponse<MediaItem>> {
  return fetchJson<ApiPaginatedResponse<MediaItem>>("/api/media", { params: filters });
}

export async function getMedia(id: string): Promise<MediaItem> {
  return fetchJson<MediaItem>(`/api/media/${id}`);
}

export async function updateMedia(
  id: string,
  payload: MediaUpdatePayload
): Promise<MediaItem> {
  return fetchJson<MediaItem>(`/api/media/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteMedia(id: string): Promise<void> {
  await fetchJson(`/api/media/${id}`, { method: "DELETE" });
}

export async function trashMedia(id: string): Promise<void> {
  await fetchJson(`/api/media/${id}/trash`, { method: "POST" });
}

export async function restoreMedia(id: string): Promise<void> {
  await fetchJson(`/api/media/${id}/restore`, { method: "POST" });
}

export async function purgeMedia(id: string): Promise<void> {
  await fetchJson(`/api/media/${id}/purge`, { method: "POST" });
}

export async function bulkUpdateMedia(
  ids: string[],
  updates: Record<string, unknown>
): Promise<void> {
  await fetchJson("/api/media/bulk", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, updates }),
  });
}

export async function reprocessMedia(id: string): Promise<void> {
  await fetchJson(`/api/media/${id}/reprocess`, { method: "POST" });
}

export async function publishMedia(id: string): Promise<void> {
  await fetchJson(`/api/media/${id}/publish`, { method: "POST" });
}

export async function getSignedUploadUrl(
  payload: MediaCreatePayload
): Promise<{ url: string; mediaId: string; uploadUrl: string }> {
  return fetchJson<{ url: string; mediaId: string; uploadUrl: string }>(
    "/api/media/upload-url",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

export async function uploadToR2(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

export async function getCollections(): Promise<Collection[]> {
  return fetchJson<Collection[]>("/api/collections");
}

export async function createCollection(
  payload: CollectionCreatePayload
): Promise<Collection> {
  return fetchJson<Collection>("/api/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateCollection(
  id: string,
  payload: CollectionUpdatePayload
): Promise<Collection> {
  return fetchJson<Collection>(`/api/collections/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteCollection(id: string): Promise<void> {
  await fetchJson(`/api/collections/${id}`, { method: "DELETE" });
}

export async function reorderCollections(
  order: { id: string; order: number }[]
): Promise<void> {
  await fetchJson("/api/collections/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });
}

export async function getTags(): Promise<Tag[]> {
  return fetchJson<Tag[]>("/api/tags");
}

export async function getJobs(
  filters: Record<string, string> = {}
): Promise<JobListResponse> {
  return fetchJson<JobListResponse>("/api/jobs", { params: filters });
}

export async function getBuilds(): Promise<Build[]> {
  return fetchJson<Build[]>("/api/builds");
}

export async function getReleases(): Promise<Release[]> {
  return fetchJson<Release[]>("/api/releases");
}

export async function triggerBuild(): Promise<Build> {
  return fetchJson<Build>("/api/builds", { method: "POST" });
}

export async function rollbackRelease(releaseId: string): Promise<void> {
  await fetchJson(`/api/releases/${releaseId}/rollback`, { method: "POST" });
}

export async function getAuditLog(
  filters: AuditFilters = {}
): Promise<AuditListResponse> {
  const params: Record<string, string> = {};
  if (filters.action) params.action = filters.action;
  if (filters.objectId) params.objectId = filters.objectId;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.page) params.page = String(filters.page);
  if (filters.pageSize) params.pageSize = String(filters.pageSize);
  return fetchJson<AuditListResponse>("/api/audit", { params });
}

export async function exportAuditLog(format: "json" | "csv"): Promise<string> {
  const res = await fetch(`/api/audit/export?format=${format}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Export failed");
  return res.text();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return fetchJson<DashboardStats>("/api/dashboard/stats");
}

export async function getPasskeys(): Promise<PasskeyInfo[]> {
  return fetchJson<PasskeyInfo[]>("/api/auth/passkeys");
}

export async function revokePasskey(id: string): Promise<void> {
  await fetchJson(`/api/auth/passkeys/${id}`, { method: "DELETE" });
}

export async function getSessionList(): Promise<SessionInfo[]> {
  return fetchJson<SessionInfo[]>("/api/auth/sessions");
}

export async function revokeSession(id: string): Promise<void> {
  await fetchJson(`/api/auth/sessions/${id}`, { method: "DELETE" });
}

export async function revokeAllSessions(): Promise<void> {
  await fetchJson("/api/auth/sessions", { method: "DELETE" });
}

export async function regenerateRecoveryCodes(): Promise<string[]> {
  return fetchJson<string[]>("/api/auth/recovery-codes", { method: "POST" });
}

export async function logout(): Promise<void> {
  await fetchJson("/api/auth/logout", { method: "POST" });
}
