import { useState, useEffect, useCallback } from "react";
import { Collection, CollectionCreatePayload, CollectionUpdatePayload } from "../types";
import * as api from "../api/client";

export default function CollectionsManager() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState<CollectionCreatePayload>({
    name: "",
    slug: "",
  });
  const [editForm, setEditForm] = useState<CollectionUpdatePayload | null>(null);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCollections();
      setCollections(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar colecciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleCreate = useCallback(async () => {
    if (!createForm.name.trim()) return;
    setSaving(true);
    try {
      const slug = createForm.slug || createForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      const newCollection = await api.createCollection({ ...createForm, slug });
      setCollections((prev) => [...prev, newCollection]);
      setCreateForm({ name: "", slug: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear colección");
    } finally {
      setSaving(false);
    }
  }, [createForm]);

  const handleEdit = useCallback(
    async (id: string) => {
      if (!editForm) return;
      setSaving(true);
      try {
        const updated = await api.updateCollection(id, editForm);
        setCollections((prev) => prev.map((c) => (c.id === id ? updated : c)));
        setEditing(null);
        setEditForm(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al actualizar colección");
      } finally {
        setSaving(false);
      }
    },
    [editForm]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("¿Eliminar esta colección? Los medios asociados no se eliminarán.")) return;
      try {
        await api.deleteCollection(id);
        setCollections((prev) => prev.filter((c) => c.id !== id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al eliminar colección");
      }
    },
    []
  );

  if (loading) return <SkeletonList />;

  return (
    <div className="collections-manager">
      <div className="page-header">
        <h1>Colecciones</h1>
      </div>

      {/* Create form */}
      <div className="card create-form">
        <h2>Nueva colección</h2>
        <div className="create-form-row">
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Nombre</span>
            <input
              className="form-input"
              type="text"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nombre de la colección"
              autoFocus
            />
          </label>
          <label className="form-group" style={{ flex: 1 }}>
            <span className="form-label">Slug</span>
            <input
              className="form-input"
              type="text"
              value={createForm.slug}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="Se genera automáticamente"
            />
          </label>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!createForm.name.trim() || saving}
          >
            {saving ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {/* Collection list */}
      {collections.length === 0 ? (
        <div className="empty-state">
          <h2>Sin colecciones</h2>
          <p>Crea tu primera colección para organizar tus medios.</p>
        </div>
      ) : (
        <div className="card">
          <table className="collections-table">
            <thead>
              <tr>
                <th scope="col">Orden</th>
                <th scope="col">Nombre</th>
                <th scope="col">Elementos</th>
                <th scope="col">Estado</th>
                <th scope="col" style={{ width: "120px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col, index) => (
                <tr key={col.id}>
                  <td className="collections-order">
                    <span aria-hidden="true">≡</span> {index + 1}
                  </td>
                  <td>
                    {editing === col.id ? (
                      <input
                        className="form-input"
                        type="text"
                        value={editForm?.name || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                        autoFocus
                      />
                    ) : (
                      col.name
                    )}
                  </td>
                  <td>{col.elementCount}</td>
                  <td>
                    <span
                      className={`badge badge-${
                        col.elementCount > 0 ? "success" : "default"
                      }`}
                    >
                      {col.elementCount > 0 ? "Publicada" : "Borrador"}
                    </span>
                  </td>
                  <td>
                    {editing === col.id ? (
                      <div className="inline-actions">
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => handleEdit(col.id)}
                          disabled={saving}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn btn-small btn-ghost"
                          onClick={() => {
                            setEditing(null);
                            setEditForm(null);
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="inline-actions">
                        <button
                          className="btn btn-small btn-ghost"
                          onClick={() => {
                            setEditing(col.id);
                            setEditForm({
                              version: 0,
                              name: col.name,
                              slug: col.slug,
                            });
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDelete(col.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="table-hint">
            Arrastra ≡ para ordenar. Los cambios se guardan solos.
          </p>
        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div aria-hidden="true">
      <div className="card skeleton" style={{ height: "80px" }} />
      <div className="card skeleton" style={{ height: "200px" }} />
    </div>
  );
}
