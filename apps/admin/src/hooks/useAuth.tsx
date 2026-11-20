import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { AuthSession, ApiError } from "../types";

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  login: (recoveryCode?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(
    async (recoveryCode?: string) => {
      setError(null);
      try {
        const res = await fetch("/api/auth/passkey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: recoveryCode ? "recovery" : "passkey",
            code: recoveryCode,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          let data: Record<string, unknown> = {};
          try {
            data = await res.json();
          } catch {
            /* ignore */
          }
          const msg =
            (data.message as string) || "No pudimos verificar tu credencial";
          setError(msg);
          throw new Error(msg);
        }

        const data = await res.json();
        setSession(data);
      } catch (e) {
        if (!(e instanceof Error)) throw e;
        setError(e.message);
        throw e;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      /* ignore cleanup errors */
    } finally {
      setSession(null);
      window.location.href = "/login";
    }
  }, []);

  return (
    <AuthContext value={{ session, loading, error, login, logout }}>
      {children}
    </AuthContext>
  );
}
