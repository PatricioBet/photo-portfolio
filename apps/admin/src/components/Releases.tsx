import { useBuilds, useReleases } from "../hooks/useJobs";
import { BuildStatus } from "../types";

export default function Releases() {
  const { builds, loading: buildsLoading, error: buildsError, trigger, triggering } = useBuilds();
  const { releases, loading: releasesLoading, error: releasesError, rollback, rollingBack } = useReleases();

  const statusBadge = (status: BuildStatus) => {
    const map: Record<BuildStatus, string> = {
      pending: "default",
      queued: "warning",
      building: "accent",
      running: "accent",
      published: "success",
      success: "success",
      failed: "danger",
    };
    return (
      <span className={`badge badge-${map[status]}`}>
        {status === "building" ? "Construyendo" : status}
      </span>
    );
  };

  const formatDuration = (ms: number | null): string => {
    if (ms === null) return "—";
    const s = Math.floor(ms / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
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
    <div className="releases-page">
      <div className="page-header">
        <h1>Publicar</h1>
      </div>

      {/* Trigger build */}
      <div className="card build-trigger">
        <h2>Build actual</h2>
        <p className="build-hint">
          Los cambios se agrupan en un build cada 60 segundos.
        </p>
        <button
          className="btn btn-primary"
          onClick={async () => {
            const result = await trigger();
            if (!result.success) {
              alert(result.error);
            }
          }}
          disabled={triggering}
        >
          {triggering ? "Construyendo..." : "Publicar cambios"}
        </button>
      </div>

      {/* Builds */}
      <div className="card">
        <h2>Historial de builds</h2>
        {buildsLoading && <SkeletonList />}
        {buildsError && (
          <div className="alert alert-error" role="alert">{buildsError}</div>
        )}
        {builds.length === 0 ? (
          <p className="empty-state">Sin builds registrados.</p>
        ) : (
          <table className="builds-table">
            <thead>
              <tr>
                <th scope="col">Hora</th>
                <th scope="col">Build</th>
                <th scope="col">Estado</th>
                <th scope="col">Duración</th>
                <th scope="col">Release</th>
              </tr>
            </thead>
            <tbody>
              {builds.map((build) => (
                <tr key={build.id}>
                  <td>{timeAgo(build.createdAt)}</td>
                  <td>
                    <code>#{build.number}</code>
                  </td>
                  <td>{statusBadge(build.status)}</td>
                  <td>{formatDuration(build.durationMs)}</td>
                  <td>
                    {build.releaseId ? (
                      <code>{build.releaseId.slice(0, 8)}</code>
                    ) : build.error ? (
                      <span className="build-error">{build.error}</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Releases */}
      <div className="card">
        <h2>Releases vivas</h2>
        {releasesLoading && <SkeletonList />}
        {releasesError && (
          <div className="alert alert-error" role="alert">{releasesError}</div>
        )}
        {releases.length === 0 ? (
          <p className="empty-state">Sin releases registradas.</p>
        ) : (
          <table className="releases-table">
            <thead>
              <tr>
                <th scope="col">Estado</th>
                <th scope="col">Release</th>
                <th scope="col">Fecha</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((release) => (
                <tr key={release.id}>
                  <td>
                    <span
                      className={`badge badge-${
                        release.isActive ? "success" : "default"
                      }`}
                    >
                      {release.isActive ? "● Actual" : "○ Anterior"}
                    </span>
                  </td>
                  <td>
                    <code>{release.id.slice(0, 8)}</code>
                    {release.error && (
                      <span className="build-error">{release.error}</span>
                    )}
                  </td>
                  <td>{timeAgo(release.createdAt)}</td>
                  <td>
                    <a
                      href={`https://photo.patriciobet.dev`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-small btn-ghost"
                    >
                      Ver
                    </a>
                    {!release.isActive && (
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              "¿Rollback a esta release? La versión actual se reemplazará."
                            )
                          ) return;
                          const result = await rollback(release.id);
                          if (!result.success) alert(result.error);
                        }}
                        disabled={rollingBack === release.id}
                      >
                        {rollingBack === release.id
                          ? "Haciendo rollback..."
                          : "Rollback"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-line" />
      ))}
    </div>
  );
}
