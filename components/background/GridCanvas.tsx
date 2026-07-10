"use client";

import { useEffect, useRef } from "react";
import { useGridContext } from "./GridContext";
import {
  getConfig,
  buildSquares,
  renderGridFrame,
  type Square,
} from "@/lib/gridRenderer";
import styles from "./GridCanvas.module.css";

export default function GridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const squaresRef = useRef<Square[]>([]);
  const animFrameRef = useRef<number>(0);
  const pendingMouseRef = useRef<{ x: number; y: number } | null>(null);
  const { mouseRef, configRef } = useGridContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const config = getConfig(canvas.width);
      configRef.current = config;
      squaresRef.current = buildSquares(canvas.width, canvas.height, config);
    }

    // Throttled mouse handler — aggiorni solo una volta per frame
    function handleMouseMove(e: MouseEvent) {
      pendingMouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function animate() {
      if (!ctx || !canvas) return;

      // Applica l'ultima posizione mouse pendente (throttled a ~60fps)
      if (pendingMouseRef.current) {
        mouseRef.current = pendingMouseRef.current;
        pendingMouseRef.current = null;
      }

      renderGridFrame(
        ctx,
        squaresRef.current,
        mouseRef.current.x,
        mouseRef.current.y,
        configRef.current
      );
      animFrameRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [mouseRef, configRef]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
