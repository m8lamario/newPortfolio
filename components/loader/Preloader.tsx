"use client";

import { useState, useEffect, useCallback } from "react";
import { usePreload } from "./usePreload";
import Loader from "./Loader";
import styles from "./Loader.module.css";

/**
 * Lista delle immagini critiche da precaricare.
 */
const CRITICAL_IMAGES = [
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

interface PreloaderProps {
  children: React.ReactNode;
}

/**
 * Preloader avanzato.
 *
 * Avvolge l'applicazione e:
 * 1. Blocca lo scroll del body finché il loader è visibile
 * 2. Precarica le immagini critiche con progresso reale
 * 3. Mostra il Loader animato con logo + progress bar
 * 4. Fade-out elegante quando tutto è pronto
 */
export default function Preloader({ children }: PreloaderProps) {
  const [isReady, setIsReady] = useState(false);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const { progress } = usePreload({
    images: CRITICAL_IMAGES,
    minDisplayTime: 1400,
    onReady: handleReady,
  });

  useEffect(() => {
    if (!isReady) {
      document.body.classList.add(styles.bodyLocked);
      document.body.dataset.preloaderReady = "false";
      return () => document.body.classList.remove(styles.bodyLocked);
    }

    document.body.classList.remove(styles.bodyLocked);
    document.body.dataset.preloaderReady = "true";
    window.dispatchEvent(new Event("portfolio:ready"));

    return () => {
      delete document.body.dataset.preloaderReady;
    };
  }, [isReady]);

  return (
    <>
      <Loader progress={progress} isVisible={!isReady} />

      <div
        style={{
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.35s ease-out",
        }}
      >
        {children}
      </div>
    </>
  );
}
