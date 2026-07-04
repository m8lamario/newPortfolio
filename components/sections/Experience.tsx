"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { EXPERIENCES } from "@/lib/constants";
import { buildLayout } from "@/lib/pixelFont";
import styles from "./Experience.module.css";

/* ============================================
   PixelLabel – titolo a quadratini SVG verticale
   ============================================ */
function PixelLabel({ text, style }: { text: string; style?: React.CSSProperties }) {
  const layout = buildLayout(text, 0.55, 1);
  const PAD_COLS = 90;

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
        height: "70vh",
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

/* ============================================
   TimelineDot – nodo animato sulla timeline
   ============================================ */
function TimelineDot({
  active,
  index,
  total,
}: {
  active: boolean;
  index: number;
  total: number;
}) {
  return (
    <motion.div
      className={styles.dotWrapper}
      animate={{
        scale: active ? 1 : 0.6,
        opacity: active ? 1 : 0.3,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Anello esterno pulsante */}
      {active && (
        <motion.div
          className={styles.dotRing}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
      {/* Nodo centrale */}
      <div className={`${styles.dot} ${active ? styles.dotActive : ""}`}>
        <span className={styles.dotIndex}>{index + 1}</span>
      </div>
    </motion.div>
  );
}

/* ============================================
   ExperienceCard – singola voce esperienza
   ============================================ */
function ExperienceCard({
  exp,
  index,
  total,
}: {
  exp: (typeof EXPERIENCES)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Badge periodo */}
      <div className={styles.periodBadge}>
        <span className={styles.periodDot} />
        {exp.period}
      </div>

      {/* Ruolo */}
      <h3 className={styles.role}>{exp.role}</h3>

      {/* Azienda */}
      <p className={styles.company}>{exp.company}</p>

      {/* Separatore */}
      <div className={styles.separator} />

      {/* Descrizione */}
      <p className={styles.description}>{exp.description}</p>

      {/* Linea decorativa in basso */}
      <div className={styles.cardGlow} />
    </motion.div>
  );
}

/* ============================================
   TimelineBar – barra progressiva animata
   ============================================ */
function TimelineBar({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className={styles.timelineBar}>
      <div className={styles.timelineTrack} />
      <motion.div className={styles.timelineFill} style={{ height }} />
    </div>
  );
}

/* ============================================
   Experience – componente principale
   ============================================ */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"],
  });

  return (
    <section id="experience" ref={sectionRef} className={styles.section}>
      {/* --- Colonna sinistra: PixelLabel sticky --- */}
      <div className={styles.labelCol}>
        <div className={styles.stickyLabel}>
          <PixelLabel text="EXPERIENCE" style={{ opacity: 0.2 }} />
        </div>
      </div>

      {/* --- Colonna destra: contenuto scrollabile --- */}
      <div className={styles.contentCol}>
        {/* Header */}
        <motion.div
          ref={headerRef}
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className={styles.timeline}>
          {/* Barra progressiva */}
          <div className={styles.timelineBarCol}>
            <TimelineBar scrollYProgress={scrollYProgress} />
          </div>

          {/* Righe: ogni riga ha dot + card allineati */}
          <div className={styles.timelineRows}>
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className={styles.timelineRow}>
                <div className={styles.timelineDotCol}>
                  <TimelineDot
                    index={i}
                    total={EXPERIENCES.length}
                    active={true}
                  />
                </div>
                <div className={styles.timelineCardCol}>
                  <ExperienceCard
                    exp={exp}
                    index={i}
                    total={EXPERIENCES.length}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
