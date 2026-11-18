import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import MediaLibrary from "./components/MediaLibrary";
import MediaUpload from "./components/MediaUpload";
import MediaDetail from "./components/MediaDetail";
import CollectionsManager from "./components/CollectionsManager";
import TagsManager from "./components/TagsManager";
import Releases from "./components/Releases";
import AuditLog from "./components/AuditLog";
import SecuritySettings from "./components/SecuritySettings";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/media"
        element={
          <RequireAuth>
            <Layout>
              <MediaLibrary />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/media/new"
        element={
          <RequireAuth>
            <Layout>
              <MediaUpload />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/media/:id"
        element={
          <RequireAuth>
            <Layout>
              <MediaDetail />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/collections"
        element={
          <RequireAuth>
            <Layout>
              <CollectionsManager />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/tags"
        element={
          <RequireAuth>
            <Layout>
              <TagsManager />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/publish"
        element={
          <RequireAuth>
            <Layout>
              <Releases />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/activity"
        element={
          <RequireAuth>
            <Layout>
              <AuditLog />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/settings/security"
        element={
          <RequireAuth>
            <Layout>
              <SecuritySettings />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
