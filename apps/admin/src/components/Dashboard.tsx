import { useState, useEffect, useCallback } from "react";
import { useJobs, useBuilds } from "../hooks/useJobs";
import { DashboardStats, BackupStatus } from "../types";
import * as api from "../api/client";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const { jobs } = useJobs();
  const { builds } = useBuilds();

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e) {
      setStatsError(e instanceof Error ? e.message : "Error al cargar estadísticas");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const checkList = [
    {
      label: "Passkey de respaldo",
      done: stats ? stats.lastBuild !== null : false,
      href: "/settings/security",
    },
    {
      label: "Backup activo",
      done:
        stats?.lastBackup?.status === "ok" &&
        stats.lastBackup.lastRun &&
        new Date(stats.lastBackup.lastRun).getTime() >
          Date.now() - 24 * 60 * 60 * 1000,
      href: "/settings/backups",
    },
    {
      label: "Contenido real",
      done: (stats?.photosPublished || 0) + (stats?.videosPublished || 0) > 0,
      href: "/media/new",
    },
    {
      label: "Demo retirado",
      done: true,
      href: null,
    },
    {
      label: "SEO verificado",
      done: false,
      href: null,
    },
  ];

  const doneCount = checkList.filter((c) => c.done).length;

  const statusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      queued: "warning",
      processing: "accent",
      ready: "success",
      failed: "danger",
      interrupted: "warning",
      publishing: "accent",
      published: "success",
      building: "accent",
      ok: "success",
      failed: "danger",
      pending: "warning",
    };
    return (
      <span
        className={`badge badge-${colorMap[status] || "default"}`}
        style={{ textTransform: "capitalize" }}
      >
        {status}
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

  const timeAgo = (dateStr: string | null): string => {
    if (!dateStr) return "—";
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
    <div className="dashboard">
      <h1>Estado</h1>

      {statsLoading && <SkeletonGrid />}
      {statsError && (
        <div className="alert alert-error" role="alert">
          <strong>Error</strong> {statsError}
        </div>
      )}

      {!statsLoading && !statsError && stats && (
        <>
          {/* Stats cards */}
          <div className="stats-grid">
            <a href="/media" className="stat-card">
              <span className="stat-value">{stats.photosPublished}</span>
              <span className="stat-label">Fotos publicadas</span>
            </a>
            <a href="/media" className="stat-card">
              <span className="stat-value">{stats.videosPublished}</span>
              <span className="stat-label">Videos publicados</span>
            </a>
            <a href="/media?status=draft" className="stat-card">
              <span className="stat-value">{stats.drafts}</span>
              <span className="stat-label">Borradores</span>
            </a>
            <a href="/media?status=trashed" className="stat-card">
              <span className="stat-value">{stats.trashed}</span>
              <span className="stat-label">Papelera</span>
            </a>
          </div>

          {/* Alerts */}
          {stats.jobsFailed > 0 && (
            <div className="alert alert-warning" role="alert">
              <strong>Jobs fallidos:</strong> {stats.jobsFailed} job
              {stats.jobsFailed > 1 ? "s" : ""} requieren atención.
            </div>
          )}
          {stats.lastBackup?.status === "failed" && (
            <div className="alert alert-danger" role="alert">
              <strong>Backup fallido:</strong> La última copia de seguridad no se
              completó correctamente.
            </div>
          )}
          {stats.diskUsageLocal > stats.diskLimitLocal * 0.8 && (
            <div className="alert alert-warning" role="alert">
              <strong>Disco lleno:</strong> Uso local superior al 80%.
            </div>
          )}

          <div className="dashboard-grid">
            {/* Launch checklist */}
            <div className="card">
              <h2>Checklist de lanzamiento</h2>
              <ol className="checklist">
                {checkList.map((item, i) => (
                  <li key={i} className={`checklist-item${item.done ? " done" : ""}`}>
                    <span className="checklist-icon" aria-hidden="true">
                      {item.done ? "✓" : "○"}
                    </span>
                    {item.href ? (
                      <a href={item.href}>{item.label}</a>
                    ) : (
                      item.label
                    )}
                  </li>
                ))}
              </ol>
              <div className="checklist-progress">
                {doneCount}/{checkList.length} completado
              </div>
            </div>

            {/* System status */}
            <div className="card">
              <h2>Estado del sistema</h2>
              <dl className="status-list">
                <div>
                  <dt>Último build</dt>
                  <dd>
                    {builds[0] ? (
                      <>
                        {statusBadge(builds[0].status)} —{" "}
                        {formatDuration(builds[0].durationMs)}
                      </>
                    ) : (
                      "Sin builds"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Último backup</dt>
                  <dd>
                    {stats.lastBackup ? (
                      <>
                        {statusBadge(stats.lastBackup.status)} —{" "}
                        {timeAgo(stats.lastBackup.lastRun)}
                      </>
                    ) : (
                      "Sin backups"
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Cola de jobs</dt>
                  <dd>
                    {stats.jobsQueued} en cola · {stats.jobsProcessing}{" "}
                    procesando
                  </dd>
                </div>
                <div>
                  <dt>Disco local</dt>
                  <dd>
                    {Math.round(
                      (stats.diskUsageLocal / stats.diskLimitLocal) * 100
                    )}
                    %
                  </dd>
                </div>
                <div>
                  <dt>Disco R2</dt>
                  <dd>
                    {Math.round(
                      (stats.diskUsageR2 / stats.diskLimitR2) * 100
                    )}
                    %
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Recent jobs */}
          <div className="card">
            <h2>Últimos trabajos</h2>
            {jobs.length === 0 ? (
              <p className="empty-state">Sin trabajos activos.</p>
            ) : (
              <ul className="job-list">
                {jobs.slice(0, 5).map((job) => (
                  <li key={job.id} className="job-item">
                    <span className="job-name">
                      {job.mediaId
                        ? `#${job.mediaId.slice(0, 8)}`
                        : job.type}
                    </span>
                    <span className="job-status">{statusBadge(job.status)}</span>
                    <span className="job-time">{timeAgo(job.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="stats-grid" aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="stat-card skeleton" />
      ))}
    </div>
  );
}
