import { useState, useEffect, useCallback } from "react";
import { AuditEntry, AuditFilters } from "../types";
import * as api from "../api/client";

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [page, setPage] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAuditLog({
        ...filters,
        page,
        pageSize: 50,
      });
      setEntries(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el registro");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleExport = async (format: "json" | "csv") => {
    try {
      const content = await api.exportAuditLog(format);
      const ext = format === "json" ? "json" : "csv";
      const blob = new Blob([content], { type: `text/${format}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error al exportar el registro");
    }
  };

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
  };

  return (
    <div className="audit-log">
      <div className="page-header">
        <h1>Actividad</h1>
        <div className="page-header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => handleExport("json")}
          >
            Exportar JSON
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport("csv")}
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="audit-filters">
        <label className="form-group">
          <span className="form-label">Acción</span>
          <select
            className="form-select"
            value={filters.action || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                action: e.target.value || undefined,
                page: 1,
              }))
            }
          >
            <option value="">Todas</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="media.create">Crear medio</option>
            <option value="media.update">Actualizar medio</option>
            <option value="media.publish">Publicar</option>
            <option value="media.trash">Mover a papelera</option>
            <option value="media.purge">Purgar</option>
            <option value="build.trigger">Trigger build</option>
            <option value="build.rollback">Rollback</option>
            <option value="collection.create">Crear colección</option>
            <option value="collection.delete">Eliminar colección</option>
            <option value="security.passkey">Passkey</option>
            <option value="security.session">Sesión</option>
          </select>
        </label>
        <label className="form-group">
          <span className="form-label">Desde</span>
          <input
            className="form-input"
            type="date"
            value={filters.from || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                from: e.target.value || undefined,
                page: 1,
              }))
            }
          />
        </label>
        <label className="form-group">
          <span className="form-label">Hasta</span>
          <input
            className="form-input"
            type="date"
            value={filters.to || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                to: e.target.value || undefined,
                page: 1,
              }))
            }
          />
        </label>
      </div>

      {loading && <SkeletonList />}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {entries.length === 0 && !loading ? (
        <div className="empty-state">
          <h2>Sin registros</h2>
          <p>No hay entradas que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="card">
          <table className="audit-table">
            <caption>
              Registro de actividad — solo lectura, append-only
            </caption>
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Acción</th>
                <th scope="col">Objeto</th>
                <th scope="col">Actor</th>
                <th scope="col">IP</th>
                <th scope="col">UA</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{timeAgo(entry.createdAt)}</td>
                  <td>
                    <code>{entry.action}</code>
                  </td>
                  <td>
                    {entry.object ? (
                      <span>{entry.object}</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{entry.actor}</td>
                  <td>
                    <code className="text-muted">{entry.ip}</code>
                  </td>
                  <td>
                    <span className="text-muted" title={entry.userAgent}>
                      {entry.userAgent.slice(0, 30)}
                      {entry.userAgent.length > 30 ? "…" : ""}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="skeleton-line" />
      ))}
    </div>
  );
}
