"use client";

import { useEffect, useState, useCallback } from "react";
import { usePreload } from "./usePreload";
import Loader from "./Loader";
import styles from "./Loader.module.css";

/**
 * Lista delle immagini critiche da precaricare.
 */
const CRITICAL_IMAGES = [
  "/images/photography/1.jpg",
  "/images/photography/2.jpg",
  "/images/photography/3.jpg",
  "/images/photography/4.jpg",
  "/images/photography/5.jpg",
  "/images/photography/6.jpg",
  "/images/photography/7.jpg",
  "/images/photography/8.jpg",
  "/images/photography/9.jpg",
  "/images/photography/10.jpg",
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

  // Blocca/sblocca scroll sul body
  useEffect(() => {
    if (!isReady) {
      document.body.classList.add(styles.bodyLocked);
      return () => {
        document.body.classList.remove(styles.bodyLocked);
      };
    } else {
      document.body.classList.remove(styles.bodyLocked);
    }
  }, [isReady]);

  return (
    <>
      <Loader progress={progress} isVisible={!isReady} />

      {/* Fade-in del contenuto dopo che il loader è sparito */}
      <div
        style={{
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      >
        {children}
      </div>
    </>
  );
}
