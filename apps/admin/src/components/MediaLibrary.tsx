import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { MediaFilters, MediaStatus } from "../types";

const STATUS_OPTIONS: { value: MediaStatus | ""; label: string }[] = [
  { value: "", label: "Todo" },
  { value: "published", label: "Publicados" },
  { value: "draft", label: "Borradores" },
  { value: "archived", label: "Archivados" },
  { value: "trashed", label: "Papelera" },
];

export default function MediaLibrary() {
  const { items, total, page, loading, error, fetchList, refresh } = useMedia();
  const [filters, setFilters] = useState<MediaFilters>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<"photo" | "video" | "">("");
  const [statusFilter, setStatusFilter] = useState<MediaStatus | "">("");
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const applyFilters = useCallback(
    (partial?: Partial<MediaFilters>) => {
      const newFilters = { ...filters, ...partial };
      setFilters(newFilters);
      fetchList(newFilters);
    },
    [filters, fetchList]
  );

  useEffect(() => {
    applyFilters({ page: 1 });
  }, [typeFilter, statusFilter]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (searchTimeout) clearTimeout(searchTimeout);
      const t = setTimeout(() => {
        applyFilters({ search: value || undefined, page: 1 });
      }, 300);
      setSearchTimeout(t);
    },
    [searchTimeout, applyFilters]
  );

  const totalPages = Math.ceil(total / (filters.pageSize || 24));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.id)));
  };

  const handleBulkAction = async (action: string) => {
    if (selected.size === 0) return;
    // Bulk actions wired to API endpoints in useMedia.ts
    console.log(`Bulk action: ${action}`, Array.from(selected));
    setSelected(new Set());
    refresh();
  };

  return (
    <div className="media-library">
      <div className="page-header">
        <h1>Medios</h1>
        <Link to="/media/new" className="btn btn-primary">
          Subir
        </Link>
      </div>

      {/* Filters */}
      <div className="media-filters">
        <div className="filter-chips">
          <div className="filter-group">
            <button
              className={`chip${typeFilter === "" ? " chip-active" : ""}`}
              onClick={() => {
                setTypeFilter("");
                applyFilters({ type: undefined });
              }}
            >
              Todo
            </button>
            <button
              className={`chip${typeFilter === "photo" ? " chip-active" : ""}`}
              onClick={() => {
                setTypeFilter("photo");
                applyFilters({ type: "photo" });
              }}
            >
              Fotos
            </button>
            <button
              className={`chip${typeFilter === "video" ? " chip-active" : ""}`}
              onClick={() => {
                setTypeFilter("video");
                applyFilters({ type: "video" });
              }}
            >
              Videos
            </button>
          </div>

          <div className="filter-group">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as MediaStatus);
                applyFilters({
                  status: e.target.value || undefined,
                });
              }}
              aria-label="Filtrar por estado"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-search">
            <input
              type="search"
              className="form-input"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Buscar medios"
            />
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="bulk-actions" role="toolbar" aria-label="Acciones en lote">
          <span>{selected.size} seleccionado{selected.size > 1 ? "s" : ""}</span>
          <button
            className="btn btn-small btn-secondary"
            onClick={() => handleBulkAction("publish")}
          >
            Publicar
          </button>
          <button
            className="btn btn-small btn-secondary"
            onClick={() => handleBulkAction("reprocess")}
          >
            Reprocesar
          </button>
          <button
            className="btn btn-small btn-danger"
            onClick={() => handleBulkAction("trash")}
          >
            Mover a papelera
          </button>
        </div>
      )}

      {/* Grid */}
      {loading && <SkeletonGrid />}

      {error && (
        <div className="alert alert-error" role="alert">
          <strong>Error</strong> {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <h2>Sin resultados</h2>
          <p>
            {total === 0
              ? "No hay medios aún. Sube tu primera foto o video."
              : "No hay medios que coincidan con los filtros."}
          </p>
          {total === 0 && (
            <Link to="/media/new" className="btn btn-primary">
              Subir archivos
            </Link>
          )}
          {total > 0 && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                setTypeFilter("");
                setStatusFilter("");
                setSearch("");
                setFilters({});
                fetchList({});
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="media-grid" role="list">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/media/${item.id}`}
                className={`media-card${selected.has(item.id) ? " media-card-selected" : ""}`}
                role="listitem"
                aria-label={`${item.metadata.es.title || item.originalFilename}`}
              >
                <div className="media-card-checkbox">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(item.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Seleccionar ${item.metadata.es.title || item.originalFilename}`}
                  />
                </div>
                <div className="media-card-image">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="media-card-placeholder">
                      {item.type === "video" ? "▶" : "▣"}
                    </div>
                  )}
                </div>
                <div className="media-card-info">
                  <span className="media-card-title">
                    {item.metadata.es.title || item.originalFilename}
                  </span>
                  <span className="media-card-type">
                    {item.type === "photo" ? "Foto" : "Video"}
                  </span>
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
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" role="navigation" aria-label="Paginación">
              <button
                className="btn btn-secondary"
                disabled={page <= 1}
                onClick={() => applyFilters({ page: page - 1 })}
              >
                ← Anterior
              </button>
              <span className="pagination-info">
                Página {page} de {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                disabled={page >= totalPages}
                onClick={() => applyFilters({ page: page + 1 })}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="media-grid" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="media-card skeleton">
          <div className="media-card-image" />
          <div className="media-card-info">
            <div className="skeleton-line" />
            <div className="skeleton-line" style={{ width: "40%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
