import { useState, useEffect, useCallback } from "react";
import { Tag } from "../types";
import * as api from "../api/client";

export default function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTags();
      setTags(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar etiquetas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const filtered = search
    ? tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    : tags;

  const sorted = [...filtered].sort((a, b) => b.mediaCount - a.mediaCount);

  if (loading) return <SkeletonList />;

  return (
    <div className="tags-manager">
      <div className="page-header">
        <h1>Etiquetas</h1>
      </div>

      <div className="tags-search">
        <input
          className="form-input"
          type="search"
          placeholder="Buscar etiquetas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar etiquetas"
        />
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="empty-state">
          <h2>Sin etiquetas</h2>
          <p>Las etiquetas se crean automáticamente al asignarlas a medios.</p>
        </div>
      ) : (
        <div className="card">
          <div className="tags-cloud">
            {sorted.map((tag) => (
              <span key={tag.name} className="tag-chip">
                {tag.name}
                <span className="tag-count">{tag.mediaCount}</span>
              </span>
            ))}
          </div>
          <p className="table-hint">
            {tags.length} etiqueta{tags.length !== 1 ? "s" : ""} en total
          </p>
        </div>
      )}

      {/* Tag usage table */}
      <div className="card">
        <h2>Uso de etiquetas</h2>
        <table className="tags-table">
          <thead>
            <tr>
              <th scope="col">Etiqueta</th>
              <th scope="col">Medios</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((tag) => (
              <tr key={tag.name}>
                <td>
                  <code className="tag-name">{tag.name}</code>
                </td>
                <td>{tag.mediaCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div aria-hidden="true">
      <div className="card skeleton" style={{ height: "60px" }} />
      <div className="card skeleton" style={{ height: "120px" }} />
    </div>
  );
}
