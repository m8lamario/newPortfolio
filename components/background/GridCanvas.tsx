"use client";

import { useEffect, useRef } from "react";
import { useGridContext } from "./GridContext";
import {
  getConfig,
  buildSquares,
  renderGridFrame,
  renderAutonomousGridFrame,
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

    const mobileQuery = window.matchMedia("(max-width: 767px) and (pointer: coarse)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isMobile = mobileQuery.matches;
    let isReducedMotion = reducedMotionQuery.matches;
    let pageVisible = !document.hidden;
    let animationEnabled = document.body.dataset.preloaderReady === "true";
    let lastMobileFrame = 0;

    function resize() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const config = getConfig(window.innerWidth);
      configRef.current = config;
      squaresRef.current = buildSquares(window.innerWidth, window.innerHeight, config);
    }

    // Throttled mouse handler — aggiorni solo una volta per frame
    function handleMouseMove(e: MouseEvent) {
      pendingMouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function animate(time: number) {
      if (!ctx || !canvas || !animationEnabled) {
        animFrameRef.current = 0;
        return;
      }

      if (isMobile && time - lastMobileFrame < 33) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastMobileFrame = time;

      // Applica l'ultima posizione mouse pendente (throttled a ~60fps)
      if (pendingMouseRef.current) {
        mouseRef.current = pendingMouseRef.current;
        pendingMouseRef.current = null;
      }

      if (isMobile) {
        renderAutonomousGridFrame(
          ctx,
          squaresRef.current,
          time,
          configRef.current,
          isReducedMotion
        );
      } else {
        renderGridFrame(
          ctx,
          squaresRef.current,
          mouseRef.current.x,
          mouseRef.current.y,
          configRef.current
        );
      }

      if (pageVisible) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        animFrameRef.current = 0;
      }
    }

    function handleModeChange() {
      isMobile = mobileQuery.matches;
      resize();
    }

    function handleMotionChange() {
      isReducedMotion = reducedMotionQuery.matches;
    }

    function handleVisibilityChange() {
      pageVisible = !document.hidden;
      if (!pageVisible) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = 0;
      } else if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    }

    function startAnimation() {
      animationEnabled = true;
      if (pageVisible && !animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("portfolio:ready", startAnimation);
    mobileQuery.addEventListener("change", handleModeChange);
    reducedMotionQuery.addEventListener("change", handleMotionChange);
    if (animationEnabled && pageVisible) {
      animFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("portfolio:ready", startAnimation);
      mobileQuery.removeEventListener("change", handleModeChange);
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [mouseRef, configRef]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
