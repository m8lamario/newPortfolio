"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { buildLayout } from "@/lib/pixelFont";
import styles from "./Skills.module.css";

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

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/* ── PixelLabel ── */
function PixelLabel({ text, style }: { text: string; style?: React.CSSProperties }) {
  const layout = buildLayout(text, 0.55, 1);
  const PAD_COLS = 60;
  const rotatedRects = layout.rects.map((r) => ({
    x: r.y,
    y: PAD_COLS - r.x - 0.55,
    w: r.h,
    h: r.w,
  }));
  return (
    <svg
      viewBox={`0 0 ${layout.totalRows} ${PAD_COLS}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={text}
      style={{
        display: "block",
        height: "60vh",
        width: "auto",
        flexShrink: 0,
        ...style,
      }}
    >
      {rotatedRects.map((r, i) => (
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

/* ── Stampa 3D (Infinite Scroll Words) ── */
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

const SPANS_PER_ROW = 12;

function ThreeDPrintSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-40px" });

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
  const filledStyle: React.CSSProperties = { ...baseStyle, color: "var(--brown-red)" };
  const outlineStyle: React.CSSProperties = { ...baseStyle, color: "transparent", WebkitTextStroke: "1px var(--brown-red)" };

  return (
    <div
      ref={containerRef}
      className={styles.passionSection}
    >
      {/* Header staggered */}
      <div ref={headerRef} className={styles.passionHeader}>
        <motion.span
          className={styles.passionLabel}
          initial={{ opacity: 0, y: 10 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Progettazione 3D
        </motion.span>
      </div>

      <div className={styles.wordScroller}>
        {TD_ROWS.map((row, rowIdx) => (
          <motion.div
            key={row.word}
            style={{ x: transforms[rowIdx], display: "flex", whiteSpace: "nowrap", willChange: "transform" }}
          >
            {Array.from({ length: SPANS_PER_ROW }, (_, i) => (
              <span key={i} style={i % 2 === 0 ? filledStyle : outlineStyle}>
                {row.word}&nbsp;
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Fotografia (Scroll-Driven Continuous) ── */
function PhotographySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackInnerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-40px" });

  const firstSet = chunk(PHOTOS, 3);
  const loopRows = chunk(PHOTOS.slice(0, 9), 3);
  const allRows = [...firstSet, ...loopRows];

  useEffect(() => {
    const container = containerRef.current;
    const inner = trackInnerRef.current;
    if (!container || !inner) return;
    let rafId: number;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) { rafId = requestAnimationFrame(update); return; }
      const raw = -rect.top / scrollable;
      const loopProgress = raw % 1;
      const firstSetHeight = inner.scrollHeight / allRows.length * firstSet.length;
      const offset = -loopProgress * firstSetHeight;
      inner.style.transform = `translateY(${offset}px)`;
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [allRows.length]);

  const outerHeight = "400vh";

  return (
    <div className={styles.passionSection}>
      <div ref={containerRef} className={styles.photography} style={{ height: outerHeight }}>
        <div className={styles.photographyInner}>
          {/* Header staggered */}
          <div ref={headerRef} className={styles.passionHeader}>
            <motion.span
                className={styles.passionLabel}
                initial={{ opacity: 0, y: 10 }}
                animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
              Fotografia
            </motion.span>
          </div>
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
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="passions" ref={sectionRef} className={styles.skills}>
      {/* Heading staggered */}
      <div className={styles.sectionHeader}>
        <motion.span
          className={styles.sectionLabel}
          initial={{ opacity: 0, y: 10 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Altre passioni
        </motion.span>

        <h2 ref={headingRef} className={styles.heading}>
          {"Oltre il codice.".split(" ").map((word, i) => (
            <motion.span
              key={i}
              className={styles.word}
              initial={{ opacity: 0, y: 30, rotateX: -30 }}
              animate={
                isHeadingInView
                  ? { opacity: 1, y: 0, rotateX: 0 }
                  : { opacity: 0, y: 30, rotateX: -30 }
              }
              transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Fotografia, stampa 3D, design — cose che nutrono la mia creatività.
        </motion.p>
      </div>

      <PhotographySection />
      <ThreeDPrintSection />
    </section>
  );
}
