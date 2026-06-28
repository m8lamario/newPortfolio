"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGridContext } from "@/components/background/GridContext";
import {
  buildSquares,
  type Square,
  type GridConfig,
} from "@/lib/gridRenderer";
import styles from "./CanvasMirror.module.css";

/* ============================================
   CanvasMirror — griglia animata dentro il testo
   Canvas puro, globalCompositeOperation "source-in"
   ============================================ */

interface CanvasMirrorProps {
  text: string;
  isHovered: boolean;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Renderizza la griglia direttamente (senza clearRect, chiamato dopo source-in) */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  squares: Square[],
  mouseX: number,
  mouseY: number,
  config: GridConfig
) {
  const { maxScale, minScale, falloff, lerpSpeed, glowRadius } = config;

  for (const sq of squares) {
    const dx = sq.x - mouseX;
    const dy = sq.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let targetScale = maxScale - distance * falloff;
    targetScale = Math.max(minScale, Math.min(maxScale, targetScale));
    sq.targetScale = targetScale;
    sq.currentScale = lerp(sq.currentScale, sq.targetScale, lerpSpeed);

    const size = sq.baseSize * sq.currentScale;
    const halfSize = size / 2;
    const glowFactor = Math.max(0, 1 - distance / glowRadius);

    // Colori alternati brown-red / dark-wine, alpha 0.5-0.6
    const isEven =
      (Math.floor(sq.x / config.cellSize) + Math.floor(sq.y / config.cellSize)) % 2 === 0;
    const fillAlpha = 0.5 + glowFactor * 0.1;
    const r = isEven ? 173 : 128;
    const g = isEven ? 40 : 14;
    const b = isEven ? 49 : 19;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${fillAlpha})`;
    ctx.fillRect(sq.x - halfSize, sq.y - halfSize, size, size);

    const borderAlpha = 0.2 + glowFactor * 0.1;
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${borderAlpha})`;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(sq.x - halfSize, sq.y - halfSize, size, size);
  }
}

export default function CanvasMirror({ text, isHovered, titleRef }: CanvasMirrorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const squaresRef = useRef<Square[]>([]);
  const animFrameRef = useRef<number>(0);
  const { mouseRef, configRef } = useGridContext();
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const fontRef = useRef("bold 80px Space Grotesk, Inter, system-ui, sans-serif");
  const textOffsetRef = useRef({ x: 0, y: 0 });

  // Legge il font esatto e la posizione del testo dall'h1
  const syncFont = useCallback(() => {
    const h1 = titleRef.current;
    if (!h1) return;
    const cs = getComputedStyle(h1);
    fontRef.current = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

    // Misura l'offset reale del primo span rispetto al wrapper
    const firstSpan = h1.querySelector("span");
    const wrapper = wrapperRef.current;
    if (firstSpan && wrapper) {
      const spanRect = firstSpan.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      textOffsetRef.current = {
        x: spanRect.left - wrapperRect.left,
        y: spanRect.bottom - wrapperRect.top,
      };
    }
  }, [titleRef]);

  // Misura + init canvas
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    function measure() {
      if (!wrapper) return;
      syncFont();
      const rect = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      setDimensions({ w, h });

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        squaresRef.current = buildSquares(w, h, configRef.current);
      }
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [configRef, syncFont]);

  // Loop animazione — si avvia/si ferma in base a isHovered
  useEffect(() => {
    if (!isHovered) return;

    const canvas = canvasRef.current;
    if (!canvas || dimensions.w === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    function animate() {
      if (!running || !ctx || !canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const w = dimensions.w;
      const h = dimensions.h;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 1. Pulisci tutto
      ctx.clearRect(0, 0, w, h);

      // 2. Converti coordinate mouse
      const canvasRect = canvas.getBoundingClientRect();
      const localMouseX = mouseRef.current.x - canvasRect.left;
      const localMouseY = mouseRef.current.y - canvasRect.top;

      // 3. Disegna la griglia normalmente (riempie tutto il canvas)
      drawGrid(ctx, squaresRef.current, localMouseX, localMouseY, configRef.current);

      // 4. Usa il testo come MASCHERA: "destination-in" mantiene i pixel
      //    della griglia SOLO dove il testo ha alpha > 0
      ctx.globalCompositeOperation = "destination-in";
      ctx.font = fontRef.current;
      ctx.textBaseline = "bottom";
      ctx.fillStyle = "#000"; // colore irrilevante, conta solo l'alpha
      ctx.fillText(text, textOffsetRef.current.x, textOffsetRef.current.y);

      // 5. Ripristina per il prossimo frame
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isHovered, dimensions, mouseRef, configRef, text]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.mirror} ${isHovered ? styles.visible : ""}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
