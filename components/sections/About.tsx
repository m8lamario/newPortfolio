"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BIO } from "@/lib/constants";
import { buildLayout } from "@/lib/pixelFont";
import styles from "./About.module.css";

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
   AnimatedCounter – numero che sale
   ============================================ */
function AnimatedCounter({
  end,
  suffix = "",
  isActive,
}: {
  end: number;
  suffix?: string;
  isActive: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const duration = 1200;
    const steps = 30;
    const increment = end / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(end, Math.round(increment * step));
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isActive, end]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

/* ============================================
   About – componente principale
   ============================================ */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-60px" });
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-40px" });

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      {/* Colonna sinistra: PixelLabel sticky */}
      <div className={styles.labelCol}>
        <div className={styles.stickyLabel}>
          <PixelLabel text="ABOUT" style={{ opacity: 0.2 }} />
        </div>
      </div>

      {/* Colonna destra: contenuto */}
      <div ref={contentRef} className={styles.contentCol}>
        {/* Heading */}
        <div ref={headingRef} className={styles.header}>
          <motion.span
            className={styles.sectionLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Chi sono
          </motion.span>

          <h2 className={styles.heading}>
            {"Sviluppatore. Studente. Curioso.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className={styles.word}
                initial={{ opacity: 0, y: 30, rotateX: -30 }}
                animate={
                  isHeadingInView
                    ? { opacity: 1, y: 0, rotateX: 0 }
                    : { opacity: 0, y: 30, rotateX: -30 }
                }
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* Bio + Facts grid */}
        <div className={styles.body}>
          {/* Bio card */}
          <motion.div
            className={styles.bioCard}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.bio}>{BIO}</p>
            <div className={styles.cardGlow} />
          </motion.div>

          {/* Facts */}
          <div className={styles.factsGrid}>
            <motion.div
              className={styles.factCard}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <span className={styles.factValue}>
                <AnimatedCounter end={17} isActive={isInView} />
              </span>
              <span className={styles.factLabel}>anni</span>
              <div className={styles.factGlow} />
            </motion.div>

            <motion.div
              className={styles.factCard}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.85 }}
            >
              <span className={styles.factValue}>Brescia</span>
              <span className={styles.factLabel}>Italia</span>
              <div className={styles.factGlow} />
            </motion.div>

            <motion.div
              className={styles.factCard}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <span className={styles.factValue}>ITIS Castelli</span>
              <span className={styles.factLabel}>5° anno</span>
              <div className={styles.factGlow} />
            </motion.div>

            <motion.div
              className={styles.factCard}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 1.15 }}
            >
              <span className={styles.factValue}>
                <AnimatedCounter end={2008} isActive={isInView} />
              </span>
              <span className={styles.factLabel}>classe</span>
              <div className={styles.factGlow} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
