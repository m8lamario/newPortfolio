"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { buildLayout } from "@/lib/pixelFont";
import styles from "./Skills.module.css";

/* ── Dati skill Web Dev ── */
const WEB_DEV_SKILLS = [
  { name: "Next.js", desc: "Framework React per applicazioni web moderne" },
  { name: "TypeScript", desc: "Tipizzazione statica per codice più solido" },
  { name: "React", desc: "Componenti UI dinamici e reattivi" },
  { name: "Prisma", desc: "ORM per database relazionali" },
  { name: "SQL", desc: "Query e gestione database" },
  { name: "CSS Modules", desc: "Stili scoped e manutenibili" },
  { name: "Node.js", desc: "Runtime JavaScript lato server" },
  { name: "REST API", desc: "Progettazione e consumo di API" },
];

/* ── Dati foto ── */
const PHOTOS = [
  "/images/photography/1.webp",
  "/images/photography/2.webp",
  "/images/photography/3.webp",
  "/images/photography/4.webp",
  "/images/photography/5.webp",
  "/images/photography/6.webp",
  "/images/photography/7.webp",
  "/images/photography/8.webp",
  "/images/photography/9.webp",
  "/images/photography/10.webp",
];

/* Raggruppa in righe da 3 */
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/* ── PixelLabel — titolo a quadratini SVG, ruotato di 90° ── */
function PixelLabel({ text, style }: { text: string; style?: React.CSSProperties }) {
  const layout = buildLayout(text, 0.55, 1);
  return (
    <svg
      viewBox={`0 0 ${layout.totalCols} ${layout.totalRows}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={text}
      style={{
        display: "block",
        height: "60vh",
        transform: "rotate(90deg)",
        transformOrigin: "center center",
        ...style,
      }}
    >
      {layout.rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={0.12}
          fill="var(--brown-red)"
        />
      ))}
    </svg>
  );
}

/* ── Singola voce skill ── */
function SkillItem({
  name,
  desc,
  isActive,
}: {
  name: string;
  desc: string;
  isActive: boolean;
}) {
  return (
    <motion.div
      className={styles.skillItem}
      animate={{
        opacity: isActive ? 1 : 0.25,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <span
        className={styles.skillName}
        style={{
          color: isActive ? "var(--brown-red)" : "var(--text-primary)",
          transition: "color 0.35s ease-out",
        }}
      >
        {name}
      </span>
      <span className={styles.skillDesc}>{desc}</span>
    </motion.div>
  );
}

/* ── Sezione Stampa 3D (Infinite Scroll Words) ── */
const TD_ROWS = [
  { word: "IDEA",      from: "-20%", to: "20%" },
  { word: "SKETCH",    from: "20%",  to: "-20%" },
  { word: "CAD",       from: "-18%", to: "18%" },
  { word: "MODELING",  from: "18%",  to: "-18%" },
  { word: "SLICING",   from: "-16%", to: "16%" },
  { word: "PRINTING",  from: "16%",  to: "-16%" },
  { word: "TESTING",   from: "-14%", to: "14%" },
  { word: "ITERATION", from: "14%",  to: "-14%" },
] as const;

const SPANS_PER_ROW = 12; // abbastanza per coprire qualsiasi larghezza schermo

function ThreeDPrintSection() {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { amount: 0.2 });

  const { scrollYProgress } = useScroll();

  const transforms = TD_ROWS.map((r) =>
    useTransform(scrollYProgress, [0, 1], [r.from, r.to])
  );

  const baseStyle: React.CSSProperties = {
    fontSize: "clamp(3rem, 6vw, 5rem)",
    fontWeight: 800,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    letterSpacing: "0.02em",
    display: "inline-block",
  };

  const filledStyle: React.CSSProperties = {
    ...baseStyle,
    color: "var(--brown-red)",
  };

  const outlineStyle: React.CSSProperties = {
    ...baseStyle,
    color: "transparent",
    WebkitTextStroke: "1px var(--brown-red)",
  };

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        opacity: isInView ? 1 : 0.6,
        transition: "opacity 0.6s ease-out",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.75rem, 2vw, 1.25rem)",
          width: "100%",
        }}
      >
        {TD_ROWS.map((row, rowIdx) => (
          <motion.div
            key={row.word}
            style={{
              x: transforms[rowIdx],
              display: "flex",
              whiteSpace: "nowrap",
              willChange: "transform",
            }}
          >
            {Array.from({ length: SPANS_PER_ROW }, (_, i) => (
              <span
                key={i}
                style={i % 2 === 0 ? filledStyle : outlineStyle}
              >
                {row.word}&nbsp;
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Sezione Fotografia (Scroll-Driven Continuous) ── */
function PhotographySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackInnerRef = useRef<HTMLDivElement>(null);

  // Righe: 3 righe da 3 foto + 1 riga con la 10ª + loop delle prime 3 righe
  const firstSet = chunk(PHOTOS, 3); // [[1,2,3], [4,5,6], [7,8,9], [10]]
  // Per il loop: ripetiamo le prime 3 righe (9 foto) dopo la 10ª
  const loopRows = chunk(PHOTOS.slice(0, 9), 3); // [[1,2,3], [4,5,6], [7,8,9]]
  const allRows = [...firstSet, ...loopRows];

  useEffect(() => {
    const container = containerRef.current;
    const inner = trackInnerRef.current;
    if (!container || !inner) return;

    let rafId: number;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        inner.style.transform = "translateY(0px)";
        rafId = requestAnimationFrame(update);
        return;
      }
      // Progresso 0..1 sull'intero scroll del container
      const raw = -rect.top / scrollable;
      // Modulo: loop infinito — ogni "unità" corrisponde a firstSet (4 righe)
      const loopProgress = raw % 1;
      // Altezza di un ciclo completo (firstSet = 4 righe)
      // Calcoliamo dinamicamente l'altezza di firstSet
      const firstSetHeight = inner.scrollHeight / allRows.length * firstSet.length;
      const offset = -loopProgress * firstSetHeight;
      inner.style.transform = `translateY(${offset}px)`;
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [allRows.length]);

  // Altezza totale: abbastanza per far scorrere almeno 2-3 cicli
  const outerHeight = "400vh";

  return (
    <div ref={containerRef} className={styles.photography} style={{ height: outerHeight }}>
      <div className={styles.photographyInner}>
        {/* Colonna sinistra — titolo */}
        <div className={styles.photoTitleCol}>
          <PixelLabel text="FOTOGRAFIA" style={{ opacity: 0.25 }} />
        </div>

        {/* Colonna destra — stage 3D */}
        <div className={styles.photoStageCol}>
          <div className={styles.photoStage}>
            <div className={styles.photoTrack}>
              <div ref={trackInnerRef} className={styles.photoTrackInner}>
                {allRows.map((row, rowIdx) => (
                  <div key={rowIdx} className={styles.photoRow}>
                    {row.map((src, colIdx) => (
                      <div
                        key={colIdx}
                        className={styles.photoCard}
                        style={{ backgroundImage: `url(${src})` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Componente principale ── */
export default function Skills() {
  const scrollColRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(() => {
    const container = scrollColRef.current;
    if (!container) return;

    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = scrollColRef.current;
    if (!container) return;

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();

    return () => window.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  return (
    <section id="skills" className={styles.skills}>
      {/* ─── Sezione 1: Web Dev ─── */}
      <div className={styles.webDev}>
        <div className={styles.stickyCol}>
          <div className={styles.stickyTitle}>
            <PixelLabel text="WEB DEV" style={{ opacity: 0.25 }} />
          </div>
        </div>

        <div className={styles.scrollCol} ref={scrollColRef}>
          <div className={styles.skillList}>
            {WEB_DEV_SKILLS.map((skill, i) => (
              <div
                key={skill.name}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
              >
                <SkillItem
                  name={skill.name}
                  desc={skill.desc}
                  isActive={i === activeIndex}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Sezione 2: Fotografia ─── */}
      <PhotographySection />

      {/* ─── Sezione 3: Stampa 3D ─── */}
      <ThreeDPrintSection />
    </section>
  );
}
