"use client";

import { useState, useEffect, useRef } from "react";

interface UsePreloadOptions {
  /** Array di URL immagini da precaricare */
  images: string[];
  /** Tempo minimo di visualizzazione del loader (ms) */
  minDisplayTime?: number;
  /** Callback chiamata quando tutto è pronto */
  onReady?: () => void;
}

interface UsePreloadResult {
  /** Progresso del caricamento (0–100) */
  progress: number;
  /** Immagini caricate / totali */
  loaded: number;
  /** Totale immagini */
  total: number;
  /** true quando immagini caricate + minDisplayTime trascorso */
  isReady: boolean;
}

/**
 * Custom hook per il preloading di immagini con progresso reale.
 * Usa new Image() per precaricare e traccia il progresso.
 * isReady diventa true solo quando TUTTE le immagini sono caricate
 * ED è trascorso il minDisplayTime.
 */
export function usePreload({
  images,
  minDisplayTime = 1400,
  onReady,
}: UsePreloadOptions): UsePreloadResult {
  const [loaded, setLoaded] = useState(0);
  const [isImagesDone, setIsImagesDone] = useState(false);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const total = images.length;

  // Precarica immagini
  useEffect(() => {
    if (total === 0) {
      setIsImagesDone(true);
      return;
    }

    let cancelled = false;
    let loadedCount = 0;

    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          if (!cancelled) {
            loadedCount++;
            setLoaded(loadedCount);
          }
          resolve();
        };
        img.onerror = () => {
          // Anche in caso di errore, contiamo come "caricata"
          if (!cancelled) {
            loadedCount++;
            setLoaded(loadedCount);
          }
          resolve();
        };
        img.src = src;
      });
    };

    Promise.all(images.map(loadImage)).then(() => {
      if (!cancelled) {
        setIsImagesDone(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [images, total]);

  // Timer minimo
  useEffect(() => {
    if (total === 0) {
      setIsTimerDone(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsTimerDone(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, total]);

  // isReady = immagini caricate + timer trascorso
  const isReady = isImagesDone && isTimerDone;

  // Chiama onReady
  useEffect(() => {
    if (isReady && onReadyRef.current) {
      // Piccolo ritardo per far completare l'animazione di fade-out
      const t = setTimeout(() => onReadyRef.current!(), 100);
      return () => clearTimeout(t);
    }
  }, [isReady]);

  const progress = total === 0 ? 100 : Math.round((loaded / total) * 100);

  return { progress, loaded, total, isReady };
}
