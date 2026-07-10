"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildLayout } from "@/lib/pixelFont";
import styles from "./Loader.module.css";

/* ============================================
   Loader — preloader con griglia animata e
   pixel font coerente con lo stile del sito
   ============================================ */

export interface LoaderProps {
  progress: number;
  isVisible: boolean;
}

const TITLE = "M8LA";
const PIXEL_UNIT = 1.0;
const CHAR_GAP = 1;

/* ============================================
   GridBackground — mini GridCanvas per il loader
   ============================================ */
function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    const CELL = 12;
    const RATIO = 0.45;
    const BASE = CELL * RATIO;
    const MAX_SCALE = 1.6;
    const FALLOFF = 0.003;
    const LERP = 0.05;

    const cols = Math.ceil(canvas.width / CELL) + 1;
    const rows = Math.ceil(canvas.height / CELL) + 1;
    const total = cols * rows;

    const squares = new Float32Array(total * 4); // x, y, baseSize, scale
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 4;
        squares[i] = c * CELL + CELL / 2;
        squares[i + 1] = r * CELL + CELL / 2;
        squares[i + 2] = BASE;
        squares[i + 3] = 0.3;
      }
    }

    // Simulated mouse position — slow drifting
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let time = 0;

    function animate() {
      if (!running || !ctx || !canvas) return;

      time += 0.005;
      // Drift the "mouse" in a slow figure-8 pattern
      mouseX = canvas.width * (0.5 + 0.25 * Math.sin(time * 0.7));
      mouseY = canvas.height * (0.5 + 0.2 * Math.cos(time * 0.5 + 1.5));

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < total; i++) {
        const idx = i * 4;
        const sx = squares[idx];
        const sy = squares[idx + 1];
        const baseSize = squares[idx + 2];

        const dx = sx - mouseX;
        const dy = sy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetScale = MAX_SCALE - dist * FALLOFF;
        targetScale = Math.max(0, Math.min(MAX_SCALE, targetScale));
        squares[idx + 3] += (targetScale - squares[idx + 3]) * LERP;

        const s = squares[idx + 3];
        const size = baseSize * s;
        const half = size / 2;
        const glow = Math.max(0, 1 - dist / 150);

        const alpha = 0.08 + glow * 0.35;
        ctx.fillStyle = `rgba(173, 40, 49, ${alpha})`;
        ctx.fillRect(sx - half, sy - half, size, size);

        const borderAlpha = 0.04 + glow * 0.15;
        ctx.strokeStyle = `rgba(173, 40, 49, ${borderAlpha})`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(sx - half, sy - half, size, size);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.bgCanvas} />;
}

/* ============================================
   PixelTitle — "M8LA" a quadratini SVG
   ============================================ */
function PixelTitle() {
  const layout = useMemo(() => buildLayout(TITLE, PIXEL_UNIT, CHAR_GAP), []);

  return (
    <svg
      className={styles.pixelSvg}
      viewBox={`0 0 ${layout.totalCols} ${layout.totalRows}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={TITLE}
    >
      {layout.rects.map((r, i) => (
        <motion.rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={0.15}
          fill="var(--brown-red)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: Math.random() * 0.8 + 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </svg>
  );
}

/* ============================================
   Componente principale
   ============================================ */
export default function Loader({ progress, isVisible }: LoaderProps) {
  const displayProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.overlay}
          key="loader"
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Sfondo griglia animata (come GridCanvas ma autonomo) */}
          <GridBackground />

          {/* Contenuto centrale */}
          <div className={styles.content}>
            {/* Logo pixel SVG */}
            <div className={styles.logoWrapper}>
              <PixelTitle />
            </div>

            {/* Progress bar + percentage */}
            <motion.div
              className={styles.progressArea}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={styles.progressTrack}>
                <motion.div
                  className={styles.progressFill}
                  initial={{ width: "0%" }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className={styles.progressText}>
                {displayProgress}%
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

