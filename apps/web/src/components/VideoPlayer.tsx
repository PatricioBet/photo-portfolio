---
/**
 * VideoPlayer — Accessible HTML5 video player with HLS support.
 * Props: src, poster, title, locale, captions, qualities
 */
import { useState, useRef, useEffect } from "react";

interface Props {
  src: string;
  poster?: string;
  title: string;
  locale: "es" | "en";
  captions?: string;
  qualities?: { label: string; src: string }[];
}

export default function VideoPlayer({ src, poster, title, locale, captions, qualities }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [fullscreen, setFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(0);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

  // Auto-play muted on load
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(formatTime(video.currentTime));
        setDuration(formatTime(video.duration));
      }
    };

    const onEnded = () => setPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    video.play().catch(() => {
      // Autoplay blocked; user must interact
    });

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const time = (Number(e.target.value) / 100) * video.duration;
    video.currentTime = time;
    setProgress(Number(e.target.value));
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    const controls = controlsRef.current;
    if (!video || !controls) return;

    if (!document.fullscreenElement) {
      controls.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  const selectQuality = (index: number) => {
    const video = videoRef.current;
    const source = video?.querySelector("source");
    if (!video || !source || !qualities) return;

    source.src = qualities[index].src;
    video.load();
    setSelectedQuality(index);
    setShowQualityMenu(false);
  };

  const t = {
    play: locale === "es" ? "Reproducir" : "Play",
    pause: locale === "es" ? "Pausar" : "Pause",
    mute: locale === "es" ? "Silenciar" : "Mute",
    unmute: locale === "es" ? "Activar sonido" : "Unmute",
    quality: locale === "es" ? "Calidad" : "Quality",
    fullscreen: locale === "es" ? "Pantalla completa" : "Full screen",
    captions: locale === "es" ? "Subtítulos" : "Captions",
    time: (current: string, total: string) => `${current} / ${total}`,
  };

  return (
    <div style={{ position: "relative", width: "100%", background: "var(--surface)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <video
        ref={videoRef}
        poster={poster}
        preload="metadata"
        playsInline
        style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "contain", background: "#000" }}
        aria-label={title}
      >
        <source src={src} type="video/mp4" />
        {captions && (
          <track
            src={captions}
            kind="captions"
            srcLang="es"
            label={locale === "es" ? "Español" : "Spanish"}
            default={showCaptions}
          />
        )}
        {qualities?.map((q, i) => (
          <source key={i} src={q.src} type="video/mp4" />
        ))}
        {locale === "es"
          ? "Tu navegador no soporta video HTML5."
          : "Your browser does not support HTML5 video."}
      </video>

      {/* Controls overlay */}
      <div
        ref={controlsRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
          padding: "2rem 1rem 0.75rem",
          opacity: playing ? 0.3 : 1,
          transition: "opacity 200ms ease-out",
        }}
        onMouseMove={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => { if (playing) e.currentTarget.style.opacity = "0.3"; }}
      >
        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          aria-label={locale === "es" ? "Progreso del video" : "Video progress"}
          style={{
            width: "100%",
            height: "4px",
            marginBottom: "0.5rem",
            cursor: "pointer",
            accentColor: "var(--accent-text)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            aria-label={playing ? t.pause : t.play}
            style={{ background: "none", border: "none", color: "#fff", fontSize: "1.25rem", cursor: "pointer", minWidth: "1.75rem", minHeight: "1.75rem", display: "flex", alignItems: "center" }}
          >
            {playing ? "⏸" : "▶"}
          </button>

          {/* Mute */}
          <button
            onClick={toggleMute}
            aria-label={muted ? t.unmute : t.mute}
            style={{ background: "none", border: "none", color: "#fff", fontSize: "1.125rem", cursor: "pointer", minWidth: "1.75rem", minHeight: "1.75rem", display: "flex", alignItems: "center" }}
          >
            {muted ? "🔇" : "🔊"}
          </button>

          {/* Time */}
          <span style={{ color: "#fff", fontSize: "0.75rem", minWidth: "5rem" }}>
            {t.time(currentTime, duration)}
          </span>

          <div style={{ flex: 1 }} />

          {/* Quality selector */}
          {qualities && qualities.length > 1 && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                aria-label={t.quality}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", fontSize: "0.75rem", cursor: "pointer", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-sm)", minWidth: "2rem", minHeight: "1.75rem" }}
              >
                {qualities[selectedQuality]?.label || t.quality}
              </button>
              {showQualityMenu && (
                <div style={{ position: "absolute", bottom: "100%", right: 0, backgroundColor: "rgba(0,0,0,0.9)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                  {qualities.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => selectQuality(i)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "0.5rem 1rem",
                        background: i === selectedQuality ? "var(--accent)" : "transparent",
                        border: "none",
                        color: "#fff",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Captions */}
          {captions && (
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              aria-label={t.captions}
              aria-pressed={showCaptions}
              style={{ background: "none", border: "none", color: showCaptions ? "#fff" : "rgba(255,255,255,0.6)", fontSize: "0.875rem", cursor: "pointer", minWidth: "1.75rem", minHeight: "1.75rem" }}
            >
              CC
            </button>
          )}

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            aria-label={t.fullscreen}
            style={{ background: "none", border: "none", color: "#fff", fontSize: "1.125rem", cursor: "pointer", minWidth: "1.75rem", minHeight: "1.75rem", display: "flex", alignItems: "center" }}
          >
            {fullscreen ? "⊡" : "⛶"}
          </button>
        </div>
      </div>
    </div>
  );
}
