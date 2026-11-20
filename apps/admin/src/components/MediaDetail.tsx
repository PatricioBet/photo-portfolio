import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMediaDetail } from "../hooks/useMedia";
import { getCollections } from "../api/client";
import { MediaMetadata, MediaUpdatePayload } from "../types";

export default function MediaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
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
  } = useMediaDetail(id || "");

  const [collections, setCollections] = useState<
    { id: string; name: string }[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    reason?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"es" | "en" | "org">("es");

  const [metadata, setMetadata] = useState<Partial<MediaMetadata>>({});

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (item) {
      setMetadata(item.metadata);
    }
  }, [item]);

  useEffect(() => {
    getCollections().then((cols) =>
      setCollections(cols.map((c) => ({ id: c.id, name: c.name })))
    );
  }, []);

  const handleSave = async () => {
    if (!item) return;
    setSaving(true);
    setSaveResult(null);
    const payload: MediaUpdatePayload = {
      version: item.version,
      metadata: metadata as Partial<MediaMetadata>,
    };
    const result = await save(payload);
    setSaveResult(result);
    if (result.success) setSaving(false);
  };

  const handleStatusChange = async (action: "trash" | "restore" | "purge" | "publish" | "reprocess") => {
    let result;
    switch (action) {
      case "trash":
        result = await trash();
        if (result.success) navigate("/media");
        break;
      case "restore":
        result = await restore();
        if (result.success) navigate("/media");
        break;
      case "purge":
        if (
          window.confirm(
            "¿Estás seguro? Esta acción eliminará el archivo permanentemente."
          )
        ) {
          result = await purge();
          if (result.success) navigate("/media");
        }
        break;
      case "publish":
        result = await publish();
        if (result.success) {
          setSaveResult({ success: true });
        }
        break;
      case "reprocess":
        result = await reprocess();
        if (result.success) {
          setSaveResult({ success: true });
        }
        break;
    }
    if (!result?.success) {
      setSaveResult({ success: false, reason: result?.reason });
    }
  };

  const updateField = <K extends string>(
    field: K,
    value: boolean | string | string[] | number | null
  ) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const updateTranslation = (
    lang: "es" | "en",
    field: "title" | "alt" | "description" | "slug",
    value: string
  ) => {
    setMetadata((prev) => {
      const current = lang === "es" ? prev.es : prev.en;
      if (!current) return prev;
      return {
        ...prev,
        [lang]: { ...current, [field]: value },
      };
    });
  };

  if (loading) return <SkeletonDetail />;
  if (error) return <ErrorState message={error} />;
  if (!item) return <p>Medio no encontrado.</p>;

  return (
    <div className="media-detail">
      <div className="detail-header">
        <button
          className="btn btn-ghost"
          onClick={() => navigate("/media")}
          aria-label="Volver a la biblioteca"
        >
          ← Medios
        </button>
        <h1>{item.metadata.es.title || item.originalFilename}</h1>
        <div className="detail-actions">
          <button
            className="btn btn-secondary"
            onClick={() => window.open(item.thumbnailUrl || "#", "_blank")}
          >
            Vista previa
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {saveResult && (
        <div
          className={`alert ${saveResult.success ? "alert-success" : "alert-error"}`}
          role="alert"
        >
          {saveResult.success
            ? "Guardado correctamente"
            : saveResult.reason === "conflict"
              ? "Otra pestaña modificó este medio. Recarga para ver los cambios."
              : saveResult.reason}
        </div>
      )}

      <div className="detail-grid">
        {/* Preview */}
        <div className="detail-preview">
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt=""
              className="detail-image"
            />
          ) : (
            <div className="detail-placeholder">
              {item.type === "video" ? "▶" : "▣"}
            </div>
          )}
          <div className="detail-preview-actions">
            <button
              className="btn btn-small btn-ghost"
              onClick={() =>
                document.getElementById("focal-point")?.scrollIntoView()
              }
            >
              Punto focal
            </button>
            {item.type === "video" && (
              <button className="btn btn-small btn-ghost">Poster</button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          {/* Status */}
          <div className="card">
            <h2>Estado</h2>
            <div className="status-detail">
              <span
                className={`badge badge-${
                  item.status === "published"
                    ? "success"
                    : item.status === "draft"
                      ? "warning"
                      : item.status === "trashed"
                        ? "danger"
                        : "default"
                }`}
              >
                {item.status}
              </span>
              <span className="detail-version">Versión {item.version}</span>
            </div>
            <div className="status-actions">
              {item.status === "draft" && (
                <button
                  className="btn btn-small btn-primary"
                  onClick={() => handleStatusChange("publish")}
                >
                  Publicar
                </button>
              )}
              {item.status === "published" && (
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => handleStatusChange("trash")}
                >
                  Despublicar
                </button>
              )}
              {(item.status === "trashed" || item.status === "archived") && (
                <button
                  className="btn btn-small btn-secondary"
                  onClick={() => handleStatusChange("restore")}
                >
                  Restaurar
                </button>
              )}
              {item.status === "trashed" && (
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleStatusChange("purge")}
                >
                  Purgar
                </button>
              )}
              <button
                className="btn btn-small btn-ghost"
                onClick={() => handleStatusChange("reprocess")}
              >
                Reprocesar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            <button
              className={`tab${activeTab === "es" ? " tab-active" : ""}`}
              onClick={() => setActiveTab("es")}
            >
              Español
            </button>
            <button
              className={`tab${activeTab === "en" ? " tab-active" : ""}`}
              onClick={() => setActiveTab("en")}
            >
              Inglés
            </button>
            <button
              className={`tab${activeTab === "org" ? " tab-active" : ""}`}
              onClick={() => setActiveTab("org")}
            >
              Organización
            </button>
          </div>

          {/* ES fields */}
          {activeTab === "es" && (
            <div className="detail-fields">
              <label className="form-group">
                <span className="form-label">
                  Título <span className="required">*</span>
                </span>
                <input
                  className="form-input"
                  type="text"
                  value={metadata.es?.title || ""}
                  onChange={(e) => updateTranslation("es", "title", e.target.value)}
                />
              </label>
              <label className="form-group">
                <span className="form-label">
                  Alt <span className="required">*</span>
                </span>
                <input
                  className="form-input"
                  type="text"
                  value={metadata.es?.alt || ""}
                  onChange={(e) => updateTranslation("es", "alt", e.target.value)}
                  placeholder="Descripción accesible de la imagen"
                />
              </label>
              <label className="form-group">
                <span className="form-label">Descripción</span>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={metadata.es?.description || ""}
                  onChange={(e) =>
                    updateTranslation("es", "description", e.target.value)
                  }
                />
              </label>
              <label className="form-group">
                <span className="form-label">Slug</span>
                <input
                  className="form-input"
                  type="text"
                  value={metadata.es?.slug || ""}
                  onChange={(e) => updateTranslation("es", "slug", e.target.value)}
                />
              </label>
            </div>
          )}

          {/* EN fields */}
          {activeTab === "en" && (
            <div className="detail-fields">
              <label className="form-group">
                <span className="form-label">
                  Title <span className="required">*</span>
                </span>
                <input
                  className="form-input"
                  type="text"
                  value={metadata.en?.title || ""}
                  onChange={(e) => updateTranslation("en", "title", e.target.value)}
                />
              </label>
              <label className="form-group">
                <span className="form-label">
                  Alt <span className="required">*</span>
                </span>
                <input
                  className="form-input"
                  type="text"
                  value={metadata.en?.alt || ""}
                  onChange={(e) => updateTranslation("en", "alt", e.target.value)}
                  placeholder="Accessible description"
                />
              </label>
              <label className="form-group">
                <span className="form-label">Description</span>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={metadata.en?.description || ""}
                  onChange={(e) =>
                    updateTranslation("en", "description", e.target.value)
                  }
                />
              </label>
              <label className="form-group">
                <span className="form-label">Slug</span>
                <input
                  className="form-input"
                  type="text"
                  value={metadata.en?.slug || ""}
                  onChange={(e) => updateTranslation("en", "slug", e.target.value)}
                />
              </label>
            </div>
          )}

          {/* Organization fields */}
          {activeTab === "org" && (
            <div className="detail-fields">
              <label className="form-group">
                <span className="form-label">Fecha de captura</span>
                <input
                  className="form-input"
                  type="date"
                  value={metadata.captureDate || ""}
                  onChange={(e) => updateField("captureDate", e.target.value)}
                />
              </label>
              <label className="form-group">
                <span className="form-label">Colección</span>
                <select
                  className="form-select"
                  value={metadata.collectionId || ""}
                  onChange={(e) =>
                    updateField(
                      "collectionId",
                      e.target.value || null
                    )
                  }
                >
                  <option value="">Sin colección</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-group">
                <span className="form-label">Etiquetas</span>
                <input
                  className="form-input"
                  type="text"
                  value={(metadata.tags || []).join(", ")}
                  onChange={(e) =>
                    updateField(
                      "tags",
                      e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                    )
                  }
                  placeholder="Etiquetas separadas por coma"
                />
              </label>
              <label className="form-group">
                <span className="form-label">Licencia</span>
                <select
                  className="form-select"
                  value={metadata.license || ""}
                  onChange={(e) => updateField("license", e.target.value || null)}
                >
                  <option value="">Sin licencia</option>
                  <option value="all-rights-reserved">Todos los derechos reservados</option>
                  <option value="cc-by-nc">CC BY-NC</option>
                  <option value="cc-by">CC BY</option>
                  <option value="cc-by-sa">CC BY-SA</option>
                </select>
              </label>
              <label className="form-group">
                <span className="form-label">Crédito</span>
                <input
                  className="form-input"
                  type="text"
                  value={metadata.credit || ""}
                  onChange={(e) => updateField("credit", e.target.value || null)}
                />
              </label>
              <label className="form-group">
                <span className="form-label">Ubicación</span>
                <input
                  className="form-input"
                  type="text"
                  value={metadata.location || ""}
                  onChange={(e) => updateField("location", e.target.value || null)}
                />
              </label>
              <label className="form-group checkbox-group">
                <input
                  type="checkbox"
                  checked={metadata.isFeatured || false}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                />
                <span>Destacado</span>
              </label>
              <label className="form-group checkbox-group">
                <input
                  type="checkbox"
                  checked={item?.isDemo || false}
                  onChange={(e) => updateField("isDemo", e.target.checked)}
                />
                <span>Contenido demo</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div className="media-detail" aria-hidden="true">
      <div className="detail-grid">
        <div className="detail-preview skeleton" />
        <div className="detail-sidebar">
          <div className="card skeleton" />
          <div className="card skeleton" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="alert alert-error" role="alert">
      <strong>Error</strong> {message}
    </div>
  );
}
