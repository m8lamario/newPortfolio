"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import styles from "./SmoothScroll.module.css";

// Espone Lenis globalmente per permettere scrollTo da qualsiasi componente
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    window.__lenis = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      window.__lenis = undefined;
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div className={styles.wrapper}>{children}</div>;
}
