import { useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { PasskeyInfo, SessionInfo } from "../types";
import * as api from "../api/client";

export default function SecuritySettings() {
  const { logout } = useAuth();
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reauthCode, setReauthCode] = useState("");
  const [showReauth, setShowReauth] = useState(false);
  const [reauthLoading, setReauthLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pk, ss] = await Promise.all([
        api.getPasskeys(),
        api.getSessionList(),
      ]);
      setPasskeys(pk);
      setSessions(ss);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar la configuración");
    } finally {
      setLoading(false);
    }
  }, []);

  useCallback(() => {
    fetch();
  }, [fetch]);

  const handleReauth = useCallback(async () => {
    if (!reauthCode.trim()) return;
    setReauthLoading(true);
    try {
      // Verify reauth code with the server
      const res = await fetch("/api/auth/reauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: reauthCode.trim() }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Código de reautenticación inválido");
      window.localStorage.setItem("reauth-timestamp", String(Date.now()));
      setShowReauth(false);
      setReauthCode("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de reautenticación");
    } finally {
      setReauthLoading(false);
    }
  }, [reauthCode]);

  const needsReauth = useCallback((): boolean => {
    const ts = window.localStorage.getItem("reauth-timestamp");
    if (!ts) return true;
    return Date.now() - parseInt(ts) > 5 * 60 * 1000; // 5 min
  }, []);

  const handleRevokePasskey = useCallback(
    async (id: string) => {
      if (needsReauth() && !showReauth) {
        setShowReauth(true);
        return;
      }
      try {
        await api.revokePasskey(id);
        setPasskeys((prev) => prev.filter((p) => p.id !== id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al revocar passkey");
      }
    },
    [needsReauth, showReauth]
  );

  const handleRevokeSession = useCallback(
    async (id: string) => {
      if (needsReauth() && !showReauth) {
        setShowReauth(true);
        return;
      }
      try {
        await api.revokeSession(id);
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al revocar sesión");
      }
    },
    [needsReauth, showReauth]
  );

  const handleRevokeAllSessions = useCallback(async () => {
    if (
      !window.confirm(
        "¿Cerrar todas las sesiones? Te cerrará la sesión actual."
      )
    )
      return;
    try {
      await api.revokeAllSessions();
      setSessions([]);
      await logout();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cerrar sesiones");
    }
  }, [logout]);

  const handleRegenerateCodes = useCallback(async () => {
    if (needsReauth() && !showReauth) {
      setShowReauth(true);
      return;
    }
    if (
      !window.confirm(
        "¿Regenerar códigos de recuperación? Los anteriores dejarán de funcionar."
      )
    )
      return;
    try {
      const codes = await api.regenerateRecoveryCodes();
      alert(
        `Nuevos códigos generados. Guárdalos de forma segura:\n\n${codes.join(
          "\n"
        )}`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al regenerar códigos");
    }
  }, [needsReauth, showReauth]);

  if (loading) return <SkeletonList />;

  return (
    <div className="security-settings">
      <div className="page-header">
        <h1>Seguridad</h1>
      </div>

      {showReauth && (
        <div className="alert alert-warning" role="alert">
          <strong>Reautenticación requerida</strong>
          <div className="form-group" style={{ marginTop: "8px" }}>
            <input
              className="form-input"
              type="text"
              placeholder="Ingresa tu código de reautenticación"
              value={reauthCode}
              onChange={(e) => setReauthCode(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={handleReauth}
              disabled={!reauthCode.trim() || reauthLoading}
            >
              {reauthLoading ? "Verificando..." : "Verificar"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => setShowReauth(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Passkeys */}
      <div className="card">
        <h2>Passkeys</h2>
        {passkeys.length === 0 ? (
          <p className="empty-state">Sin passkeys registradas.</p>
        ) : (
          <ul className="passkey-list">
            {passkeys.map((pk) => (
              <li key={pk.id} className="passkey-item">
                <span className="passkey-icon" aria-hidden="true">●</span>
                <div className="passkey-info">
                  <span className="passkey-name">{pk.name}</span>
                  <span className="passkey-meta">
                    {pk.device} · añadida{" "}
                    {new Date(pk.createdAt).toLocaleDateString("es")}
                    {pk.lastUsedAt &&
                      ` · último uso ${timeAgo(pk.lastUsedAt)}`}
                  </span>
                </div>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleRevokePasskey(pk.id)}
                >
                  Revocar
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="table-hint">
          La primera passkey se configura por CLI. Las adicionales se registran en
          esta página.
        </p>
      </div>

      {/* Recovery codes */}
      <div className="card">
        <h2>Códigos de recuperación</h2>
        <p className="table-hint">
          10 códigos de un solo uso, guardados como hash argon2id.
        </p>
        <div className="form-actions">
          <button
            className="btn btn-secondary"
            onClick={handleRegenerateCodes}
          >
            Regenerar (requiere reauth)
          </button>
        </div>
      </div>

      {/* Sessions */}
      <div className="card">
        <h2>Sesiones</h2>
        {sessions.length === 0 ? (
          <p className="empty-state">Sin sesiones activas.</p>
        ) : (
          <ul className="session-list">
            {sessions.map((session) => (
              <li key={session.id} className="session-item">
                <span className="session-name">
                  {session.device}
                  {session.isCurrent && (
                    <span className="badge badge-success">Este dispositivo</span>
                  )}
                </span>
                <span className="session-meta">
                  {session.location} · {timeAgo(session.lastActive)}
                </span>
                {!session.isCurrent && (
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => handleRevokeSession(session.id)}
                  >
                    Revocar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="form-actions">
          <button
            className="btn btn-danger"
            onClick={handleRevokeAllSessions}
          >
            Cerrar todas las sesiones
          </button>
        </div>
      </div>

      {/* Recent events */}
      <div className="card">
        <h2>Últimos eventos</h2>
        <ul className="events-list">
          <li className="event-item event-success">
            <span>✓ Login correcto</span>
            <span className="event-time">hace 2 min</span>
          </li>
          <li className="event-item event-warning">
            <span>⚠ Intento fallido</span>
            <span className="event-time">hace 1 h</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

function SkeletonList() {
  return (
    <div aria-hidden="true">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card skeleton" />
      ))}
    </div>
  );
}
