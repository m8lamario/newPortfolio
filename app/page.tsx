import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import WebDev from "@/components/sections/WebDev";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";


export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      {/* ── WEB DEV ── */}
      <SectionDivider label="WEB DEV" />
      <WebDev />
      <Experience />
      <Projects />

      {/* ── ALTRE PASSIONI ── */}
      <SectionDivider label="OLTRE IL CODICE" />
      <Skills />
      <Contact />
    </main>
  );
}

/* Divider visivo tra macro-sezioni */
function SectionDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "4rem 2rem 2rem",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 80vw)",
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(173, 40, 49, 0.25), transparent)",
        }}
      />
      <span
        style={{
          position: "relative",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "var(--brown-red)",
          padding: "0.3em 1.5em",
          border: "1px solid rgba(173, 40, 49, 0.2)",
          borderRadius: 4,
          background: "rgba(37, 9, 2, 0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
