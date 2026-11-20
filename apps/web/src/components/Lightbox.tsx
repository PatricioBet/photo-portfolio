/**
 * Lightbox — Accessible image lightbox with trapped focus, keyboard nav, SR announcements.
 * Props: photos (array of { src, thumb, title, alt }), initialIndex
 */
import { useState, useEffect, useRef, useCallback } from "react";

interface Photo {
  src: string;
  thumb: string;
  title: string;
  alt: string;
}

interface Props {
  photos: Photo[];
  initialIndex: number;
  locale: "es" | "en";
}

export default function Lightbox({ photos, initialIndex, locale }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLButtonElement>(null);

  const photo = photos[index];

  const close = useCallback(() => {
    setIsOpen(false);
    setZoom(1);
  }, []);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % photos.length);
    setZoom(1);
  }, [photos.length]);

  const prev = useCallback(() => {
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setZoom(1);
  }, [photos.length]);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 0.5, 3)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 0.5, 1)), []);

  // Keyboard handler
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          close();
          break;
        case "ArrowRight":
          next();
          break;
        case "ArrowLeft":
          prev();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "Home":
          setIndex(0);
          setZoom(1);
          break;
        case "End":
          setIndex(photos.length - 1);
          setZoom(1);
          break;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close, next, prev, zoomIn, zoomOut, photos.length]);

  // Trap focus
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const focusable = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    containerRef.current.addEventListener("keydown", trap);
    return () => containerRef.current?.removeEventListener("keydown", trap);
  }, [isOpen]);

  // SR announcement
  const srText = photo
    ? `Foto ${index + 1} de ${photos.length}: ${photo.title}`
    : "";

  if (!photo) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={srText}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.92)",
        display: isOpen ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Screen reader announcement */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}
      >
        {srText}
      </div>

      {/* Close button */}
      <button
        ref={focusRef}
        onClick={close}
        aria-label="Cerrar"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "1.5rem",
          cursor: "pointer",
          minWidth: "2.75rem",
          minHeight: "2.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        ✕
      </button>

      {/* Previous */}
      {photos.length > 1 && (
        <button
          onClick={prev}
          aria-label="Anterior"
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            fontSize: "2rem",
            cursor: "pointer",
            minWidth: "2.75rem",
            minHeight: "2.75rem",
            width: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius-md)",
          }}
        >
          ←
        </button>
      )}

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={next}
          aria-label="Siguiente"
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#fff",
            fontSize: "2rem",
            cursor: "pointer",
            minWidth: "2.75rem",
            minHeight: "2.75rem",
            width: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--radius-md)",
          }}
        >
          →
        </button>
      )}

      {/* Image */}
      <div style={{ maxWidth: "90vw", maxHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={photo.src}
          alt={photo.alt || photo.title}
          style={{
            maxWidth: "90vw",
            maxHeight: "80vh",
            objectFit: "contain",
            transform: `scale(${zoom})`,
            transition: "transform 200ms ease-out",
            cursor: zoom > 1 ? "zoom-out" : "default",
          }}
          onClick={zoom > 1 ? () => setZoom(1) : undefined}
        />
      </div>

      {/* Caption */}
      <div style={{ color: "#fff", textAlign: "center", padding: "1rem", maxWidth: "68ch" }}>
        <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>{photo.title}</p>
        <p style={{ fontSize: "0.75rem", opacity: 0.5 }}>
          {index + 1} / {photos.length}
        </p>
      </div>

      {/* Zoom controls */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button onClick={zoomIn} aria-label="Acercar" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", minWidth: "2rem", minHeight: "2rem" }}>+</button>
        <button onClick={zoomOut} aria-label="Alejar" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", minWidth: "2rem", minHeight: "2rem" }} disabled={zoom <= 1}>−</button>
      </div>
    </div>
  );
}
