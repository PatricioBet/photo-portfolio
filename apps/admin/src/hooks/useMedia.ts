import { useState, useCallback, useRef } from "react";
import {
  MediaItem,
  MediaFilters,
  MediaUploadItem,
  MediaUploadStatus,
  MediaCreatePayload,
  MediaUpdatePayload,
} from "../types";
import * as api from "../api/client";

export function useMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtersRef = useRef<MediaFilters>({});

  const fetchList = useCallback(
    async (filters?: MediaFilters) => {
      if (filters) {
        filtersRef.current = filters;
        setPage(1);
      }
      const f = filters || filtersRef.current;
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, string> = {};
        if (f.type) params.type = f.type;
        if (f.status) params.status = f.status;
        if (f.collectionId !== undefined)
          params.collectionId = f.collectionId ?? "";
        if (f.tag) params.tag = f.tag;
        if (f.search) params.search = f.search;
        params.page = String(f.page || 1);
        params.pageSize = String(f.pageSize || 24);

        const res = await api.getMediaList(params);
        setItems(res.items);
        setTotal(res.total);
        setPage(res.page);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
        else setError("Error al cargar la biblioteca");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refresh = useCallback(() => fetchList(), [fetchList]);

  return {
    items,
    total,
    page,
    loading,
    error,
    fetchList,
    refresh,
    setPage,
  };
}

export function useMediaDetail(id: string) {
  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMedia(id);
      setItem(data);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      else setError("Error al cargar el medio");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const save = useCallback(
    async (payload: MediaUpdatePayload) => {
      try {
        const updated = await api.updateMedia(id, payload);
        setItem(updated);
        return { success: true };
      } catch (e) {
        if (e instanceof Error && e.message.includes("CONFLICT")) {
          return { success: false, reason: "conflict" as const };
        }
        if (e instanceof Error) return { success: false, reason: e.message };
        return { success: false, reason: "Error desconocido" };
      }
    },
    [id]
  );

  const trash = useCallback(async () => {
    try {
      await api.trashMedia(id);
      return { success: true };
    } catch (e) {
      return { success: false, reason: e instanceof Error ? e.message : "Error" };
    }
  }, [id]);

  const restore = useCallback(async () => {
    try {
      await api.restoreMedia(id);
      return { success: true };
    } catch (e) {
      return { success: false, reason: e instanceof Error ? e.message : "Error" };
    }
  }, [id]);

  const purge = useCallback(async () => {
    try {
      await api.purgeMedia(id);
      return { success: true };
    } catch (e) {
      return { success: false, reason: e instanceof Error ? e.message : "Error" };
    }
  }, [id]);

  const publish = useCallback(async () => {
    try {
      await api.publishMedia(id);
      return { success: true };
    } catch (e) {
      return { success: false, reason: e instanceof Error ? e.message : "Error" };
    }
  }, [id]);

  const reprocess = useCallback(async () => {
    try {
      await api.reprocessMedia(id);
      return { success: true };
    } catch (e) {
      return { success: false, reason: e instanceof Error ? e.message : "Error" };
    }
  }, [id]);

  return {
    item,
    loading,
    error,
    fetch,
    save,
    trash,
    restore,
    purge,
    publish,
    reprocess,
  };
}

export function useMediaUpload() {
  const [uploads, setUploads] = useState<MediaUploadItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    const newUploads: MediaUploadItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "selected" as MediaUploadStatus,
      progress: 0,
      error: null,
      mediaId: null,
    }));
    setUploads((prev) => [...prev, ...newUploads]);
  }, []);

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const startUpload = useCallback(
    async (uploadId: string) => {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId
            ? { ...u, status: "uploading" as MediaUploadStatus }
            : u
        )
      );

      const upload = uploads.find((u) => u.id === uploadId);
      if (!upload) return;

      try {
        const payload: MediaCreatePayload = {
          type: upload.file.type.startsWith("image/") ? "photo" : "video",
          originalFilename: upload.file.name,
          fileSize: upload.file.size,
        };

        const { uploadUrl, mediaId } = await api.getSignedUploadUrl(payload);

        await api.uploadToR2(uploadUrl, upload.file, (percent) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === uploadId ? { ...u, progress: percent } : u
            )
          );
        });

        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  status: "processing" as MediaUploadStatus,
                  progress: 100,
                  mediaId,
                }
              : u
          )
        );
      } catch (e) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  status: "failed" as MediaUploadStatus,
                  error: e instanceof Error ? e.message : "Error de subida",
                }
              : u
          )
        );
      }
    },
    [uploads]
  );

  const startAll = useCallback(async () => {
    setUploading(true);
    const selected = uploads.filter((u) => u.status === "selected");
    for (const upload of selected) {
      await startUpload(upload.id);
    }
    setUploading(false);
  }, [uploads, startUpload]);

  const pauseUpload = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: "paused" as MediaUploadStatus }
          : u
      )
    );
  }, []);

  const resumeUpload = useCallback(
    async (id: string) => {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: "uploading" as MediaUploadStatus }
            : u
        )
      );
      await startUpload(id);
    },
    [startUpload]
  );

  const retryUpload = useCallback(
    async (id: string) => {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: "selected" as MediaUploadStatus, error: null }
            : u
        )
      );
    },
    []
  );

  const clearCompleted = useCallback(() => {
    setUploads((prev) =>
      prev.filter(
        (u) =>
          u.status !== "ready" &&
          u.status !== "failed" &&
          u.status !== "duplicate"
      )
    );
  }, []);

  return {
    uploads,
    uploading,
    addFiles,
    removeUpload,
    startUpload,
    startAll,
    pauseUpload,
    resumeUpload,
    retryUpload,
    clearCompleted,
  };
}
