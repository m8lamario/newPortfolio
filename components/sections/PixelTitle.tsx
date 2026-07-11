"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGridContext } from "@/components/background/GridContext";
import { buildLayout, type RectData } from "@/lib/pixelFont";
import styles from "./PixelTitle.module.css";

/* ============================================
   PixelTitle — titolo "Mario M8LA" a griglia SVG
   Integrato visivamente nel GridCanvas
   ============================================ */

const TITLE = "Mario M8LA";
const PIXEL_UNIT = 0.7;
const CHAR_GAP = 1;
const REVEAL_DURATION = 0.4;

// Parametri hover — identici al GridCanvas
const MAX_SCALE = 0.9;
const MIN_SCALE = 0.1;
const FALLOFF = 0.004;
const LERP_SPEED = 0.07;
const GLOW_RADIUS = 200;

/* ============================================
   Tipi e Helpers
   ============================================ */

interface RectDataWithDelay extends RectData {
  delay: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buildLayoutWithDelays(text: string): {
  rects: RectDataWithDelay[];
  totalCols: number;
  totalRows: number;
} {
  const { rects: base, totalCols, totalRows } = buildLayout(text, PIXEL_UNIT, CHAR_GAP);
  const rects = base.map((r) => ({ ...r, delay: Math.random() * REVEAL_DURATION }));
  return { rects, totalCols, totalRows };
}

/* ============================================
   Componente
   ============================================ */

export default function PixelTitle() {
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRefs = useRef<Map<number, SVGRectElement>>(new Map());
  const scalesRef = useRef<number[]>([]);
  const animFrameRef = useRef<number>(0);
  const { mouseRef } = useGridContext();
  const [revealed, setRevealed] = useState(false);
  const [layout] = useState(() => buildLayoutWithDelays(TITLE));

  // Inizializza scale array
  useEffect(() => {
    scalesRef.current = new Array(layout.rects.length).fill(MIN_SCALE);
  }, [layout.rects.length]);

  // Reveal completato dopo REVEAL_DURATION + margine
  useEffect(() => {
    const timer = setTimeout(
      () => setRevealed(true),
      REVEAL_DURATION * 1000 + 400
    );
    return () => clearTimeout(timer);
  }, []);

  // Loop hover — reagisce al mouse come il GridCanvas
  useEffect(() => {
    if (!revealed) return;

    const svg = svgRef.current;
    if (!svg) return;

    let running = true;
    const touchQuery = window.matchMedia("(pointer: coarse)");
    let isTouch = touchQuery.matches;

    if (isTouch) {
      layout.rects.forEach((r, i) => {
        const rect = rectRefs.current.get(i);
        if (!rect) return;
        rect.style.transform = `scale(${MAX_SCALE})`;
        rect.style.transformOrigin = `${r.cx}px ${r.cy}px`;
        rect.style.transformBox = "fill-box";
        rect.setAttribute("opacity", "1");
      });
      return;
    }

    function animate() {
      if (!running || !svg) return;

      const svgRect = svg.getBoundingClientRect();
      const localMouseX = mouseRef.current.x - svgRect.left;
      const localMouseY = mouseRef.current.y - svgRect.top;

      // Su touch il titolo resta leggibile senza dipendere da un cursore.
      const scaleX = layout.totalCols / svgRect.width;
      const scaleY = layout.totalRows / svgRect.height;
      const svgMouseX = localMouseX * scaleX;
      const svgMouseY = localMouseY * scaleY;

      for (let i = 0; i < layout.rects.length; i++) {
        const r = layout.rects[i];
        const rect = rectRefs.current.get(i);
        if (!rect) continue;

        const dx = r.cx - svgMouseX;
        const dy = r.cy - svgMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetScale = MAX_SCALE - distance * FALLOFF;
        targetScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, targetScale));

        scalesRef.current[i] = lerp(
          scalesRef.current[i],
          targetScale,
          LERP_SPEED
        );
        const s = scalesRef.current[i];

        // Scala dal centro del rettangolo
        rect.style.transform = `scale(${s})`;
        rect.style.transformOrigin = `${r.cx}px ${r.cy}px`;
        rect.style.transformBox = "fill-box";

        // Opacità proporzionale alla vicinanza
        const glowFactor = Math.max(0, 1 - distance / GLOW_RADIUS);
        const alpha = 0.7 + glowFactor * 0.3;
        rect.setAttribute("opacity", String(alpha));
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [revealed, layout, mouseRef]);

  // Callback per registrare i ref dei rect
  const setRectRef = useCallback(
    (i: number) => (el: SVGRectElement | null) => {
      if (el) {
        rectRefs.current.set(i, el);
      } else {
        rectRefs.current.delete(i);
      }
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`0 0 ${layout.totalCols} ${layout.totalRows}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label={TITLE}
      >
        {layout.rects.map((r, i) => (
          <rect
            key={i}
            ref={setRectRef(i)}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            rx={0.15}
            fill="var(--brown-red)"
            className={`${styles.pixel} ${revealed ? styles.revealed : ""}`}
            style={{ animationDelay: `${r.delay}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
