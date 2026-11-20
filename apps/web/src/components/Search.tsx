---
/**
 * Search island — client-side search with Pagefind integration.
 * Props: locale
 */
import { useState, useEffect, useRef } from "react";

interface Props {
  locale: "es" | "en";
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  term: string;
}

export default function Search({ locale }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"all" | "photos" | "videos" | "collections">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Pagefind is loaded via script tag in the page
  const search = async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      // @ts-expect-error Pagefind global
      if (typeof window.pagefind === "undefined") {
        setResults([]);
        setLoading(false);
        return;
      }

      // @ts-expect-error Pagefind global
      const res = await window.pagefind.query(q, {
        // @ts-expect-error Pagefind options
        filter: type === "all" ? undefined : `type:${type}`,
      });

      if (res && res.results) {
        setResults(
          res.results.map((r: any) => ({
            id: r.id,
            title: r.data?.title || "",
            description: r.data?.description || "",
            url: r.data?.url || "",
            term: q,
          }))
        );
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      search(value);
    }, 300);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setType("all");
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const translations = {
    es: {
      placeholder: "Busca por título, descripción, colección o etiqueta…",
      all: "Todo",
      photos: "Fotos",
      videos: "Videos",
      collections: "Colecciones",
      noResults: `No encontramos resultados para «${query}»`,
      noResultsHint: "Prueba con otra palabra o quita los filtros.",
      loading: "Buscando…",
    },
    en: {
      placeholder: "Search by title, description, collection or tag…",
      all: "All",
      photos: "Photos",
      videos: "Videos",
      collections: "Collections",
      noResults: `No results for "${query}"`,
      noResultsHint: "Try another word or clear the filters.",
      loading: "Searching…",
    },
  };

  const t = translations[locale];

  const typeOptions: { value: typeof type; label: string }[] = [
    { value: "all", label: t.all },
    { value: "photos", label: t.photos },
    { value: "videos", label: t.videos },
    { value: "collections", label: t.collections },
  ];

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
      {/* Search input */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={t.placeholder}
          aria-label="Buscar en el sitio"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontSize: "1rem",
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text)",
            minHeight: "2.75rem",
          }}
        />
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {typeOptions.map((opt) => (
          <button
            type="button"
            onClick={() => setType(opt.value)}
            aria-pressed={type === opt.value}
            style={{
              padding: "0.375rem 0.75rem",
              fontSize: "0.875rem",
              borderRadius: "9999px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: type === opt.value ? "var(--accent-text)" : "var(--text-muted)",
              cursor: "pointer",
              minHeight: "2.75rem",
              transition: "all 150ms ease-out",
            }}
          >
            {opt.label}
          </button>
        ))}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: "0.375rem 0.75rem",
              fontSize: "0.875rem",
              borderRadius: "9999px",
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--danger)",
              cursor: "pointer",
              minHeight: "2.75rem",
            }}
          >
            {locale === "es" ? "Limpiar filtros" : "Clear filters"}
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
          {t.loading}
        </p>
      )}

      {/* Results */}
      {!loading && query.length >= 2 && results.length > 0 && (
        <div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
            {locale === "es" ? `${results.length} resultados` : `${results.length} results`}
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {results.map((r) => (
              <li key={r.id}>
                <a
                  href={r.url}
                  style={{
                    display: "block",
                    padding: "1rem",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    textDecoration: "none",
                    transition: "border-color 150ms ease-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <h4 style={{ fontSize: "1.125rem", marginBottom: "0.25rem", color: "var(--text)" }}>
                    {r.title}
                  </h4>
                  {r.description && (
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{r.description}</p>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results */}
      {!loading && query.length >= 2 && results.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            {t.noResults}
          </p>
          <p style={{ color: "var(--text-muted)" }}>{t.noResultsHint}</p>
        </div>
      )}
    </div>
  );
}
