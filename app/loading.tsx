/**
 * loading.tsx — Fallback server-side per il loading.
 *
 * Next.js App Router mostra automaticamente questo componente
 * durante il caricamento della pagina (streaming SSR).
 * Il Preloader vero e proprio è client-side e si attiva
 * dopo l'hydration.
 */
export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        gap: "2rem",
      }}
    >
      {/* Logo statico (nessuna animazione lato server) */}
      <span
        style={{
          fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          color: "#f5f0ed",
          letterSpacing: "0.04em",
        }}
      >
        M<span style={{ color: "#ad2831" }}>8</span>LA
      </span>

      {/* Barra placeholder */}
      <div
        style={{
          width: "min(280px, 70vw)",
          height: 2,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            background: "#ad2831",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

