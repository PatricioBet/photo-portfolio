import { useState, useCallback, useRef } from "react";
import { useMediaUpload } from "../hooks/useMedia";
import { MediaUploadStatus } from "../types";

const ACCEPTED_TYPES = {
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
  "image/avif": true,
  "image/tiff": true,
  "video/mp4": true,
  "video/quicktime": true,
  "video/webm": true,
};

const MAX_PHOTO_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export default function MediaUpload() {
  const {
    uploads,
    uploading,
    addFiles,
    removeUpload,
    startAll,
    retryUpload,
    clearCompleted,
  } = useMediaUpload();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      validateAndAdd(files);
    },
    []
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      validateAndAdd(files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    []
  );

  const validateAndAdd = (files: File[]) => {
    const valid = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const maxSize = isImage ? MAX_PHOTO_SIZE : isVideo ? MAX_VIDEO_SIZE : 0;

      if (!ACCEPTED_TYPES[file.type as keyof typeof ACCEPTED_TYPES]) {
        alert(
          `Formato no compatible: ${file.name}. Formatos aceptados: JPEG, PNG, WebP, AVIF, TIFF, MP4, MOV, WebM.`
        );
        return false;
      }
      if (file.size > maxSize) {
        const limit = isImage ? "50 MB" : "2 GB";
        alert(
          `Archivo demasiado grande: ${file.name} (${formatSize(file.size)}). Límite: ${limit}.`
        );
        return false;
      }
      return true;
    });
    if (valid.length > 0) addFiles(valid.slice(0, 20));
  };

  const selectedCount = uploads.filter(
    (u) => u.status === MediaUploadStatus.SELECTED
  ).length;
  const readyCount = uploads.filter((u) => u.status === MediaUploadStatus.COMPLETED || u.status === MediaUploadStatus.READY).length;

  return (
    <div className="media-upload">
      <h1>Subir archivos</h1>

      {/* Drop zone */}
      <div
        className={`drop-zone${dragOver ? " drop-zone-active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Arrastra archivos aquí o haz clic para seleccionar"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/tiff,video/mp4,video/quicktime,video/webm"
          style={{ display: "none" }}
          onChange={handleFileSelect}
          aria-hidden="true"
        />
        <div className="drop-zone-content">
          <p className="drop-zone-title">
            Arrastra fotos o videos aquí
          </p>
          <p className="drop-zone-subtitle">
            o{" "}
            <span className="drop-zone-link">selecciona archivos</span>{" "}
            o pega desde el portapapeles
          </p>
          <div className="drop-zone-hints">
            <span>
              Fotos: JPEG/PNG/WebP/AVIF/TIFF ≤ 50 MB
            </span>
            <span>
              Videos: MP4/MOV/WebM ≤ 2 GB
            </span>
          </div>
        </div>
      </div>

      {/* Upload list */}
      {uploads.length > 0 && (
        <div className="upload-list">
          {uploads.map((upload) => (
            <div key={upload.id} className="upload-item">
              <div className="upload-item-info">
                <span className="upload-item-name">{upload.file.name}</span>
                <span className="upload-item-size">
                  {formatSize(upload.file.size)}
                </span>
              </div>

              {/* Progress */}
              {upload.status === "uploading" && (
                <div className="upload-progress">
                  <div
                    className="upload-progress-bar"
                    style={{ width: `${upload.progress}%` }}
                  />
                  <span className="upload-progress-text">
                    {upload.progress}%
                  </span>
                </div>
              )}

              {/* Status */}
              {upload.status === MediaUploadStatus.PROCESSING && (
                <span className="upload-status upload-status-processing">
                  → en cola
                </span>
              )}
              {upload.status === MediaUploadStatus.READY && (
                <span className="upload-status upload-status-ready">
                  ✓ subido
                </span>
              )}
              {upload.status === MediaUploadStatus.FAILED && (
                <span className="upload-status upload-status-failed">
                  ⚠ {upload.error || "Error"}
                </span>
              )}

              {/* Actions */}
              <div className="upload-item-actions">
                {upload.status === "selected" && (
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() =>
                      window.location.assign(`/media/${upload.mediaId}`)
                    }
                  >
                    Subir
                  </button>
                )}
                {upload.status === "failed" && (
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => retryUpload(upload.id)}
                  >
                    Reintentar
                  </button>
                )}
                <button
                  className="btn btn-small btn-ghost"
                  onClick={() => removeUpload(upload.id)}
                  aria-label={`Eliminar ${upload.file.name}`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      {selectedCount > 0 && (
        <div className="upload-actions">
          <button
            className="btn btn-primary"
            onClick={startAll}
            disabled={uploading}
          >
            {uploading
              ? "Subiendo..."
              : `Subir ${selectedCount} archivo${selectedCount > 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {readyCount > 0 && (
        <div className="upload-actions">
          <button
            className="btn btn-ghost"
            onClick={clearCompleted}
          >
            Limpiar completados
          </button>
        </div>
      )}
    </div>
  );
}
