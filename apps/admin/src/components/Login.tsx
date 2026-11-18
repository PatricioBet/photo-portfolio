import { useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePasskeyLogin = useCallback(async () => {
    setSubmitting(true);
    try {
      await login();
    } catch {
      /* error handled by context */
    } finally {
      setSubmitting(false);
    }
  }, [login]);

  const handleRecoveryLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!recoveryCode.trim()) return;
      setSubmitting(true);
      try {
        await login(recoveryCode.trim());
      } catch {
        /* error handled by context */
      } finally {
        setSubmitting(false);
      }
    },
    [login, recoveryCode]
  );

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">PB</span>
          <h1>Administración de Fotografía</h1>
          <p>Acceso protegido por Cloudflare Access</p>
        </div>

        {!recoveryMode ? (
          <>
            <button
              className="btn btn-primary btn-large"
              onClick={handlePasskeyLogin}
              disabled={loading || submitting}
              type="button"
            >
              {submitting ? "Verificando..." : "Usar passkey"}
            </button>

            <div className="login-divider">
              <span>¿Perdiste tu dispositivo?</span>
            </div>

            <button
              className="btn btn-ghost"
              onClick={() => setRecoveryMode(true)}
              type="button"
            >
              Usar código de recuperación
            </button>
          </>
        ) : (
          <form onSubmit={handleRecoveryLogin} className="recovery-form">
            <h2>Código de recuperación</h2>
            <p className="form-help">
              Ingresa uno de los 10 códigos de un solo uso generados durante tu
              configuración inicial.
            </p>
            <label htmlFor="recovery-code" className="form-label">
              Código
            </label>
            <input
              id="recovery-code"
              type="text"
              className="form-input"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
              placeholder="XXXX-XXXX"
              autoComplete="one-time-code"
              autoFocus
            />
            <div className="form-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!recoveryCode.trim() || submitting}
              >
                {submitting ? "Verificando..." : "Iniciar sesión"}
              </button>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setRecoveryMode(false);
                  setRecoveryCode("");
                }}
              >
                Volver
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <p className="login-footer">
          Sesión segura · Sin contraseñas
        </p>
      </div>
    </div>
  );
}
