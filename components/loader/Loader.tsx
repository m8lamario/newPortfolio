"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./Loader.module.css";

export interface LoaderProps {
  /** Progresso percentuale (0–100) */
  progress: number;
  /** Mostra/nasconde il loader */
  isVisible: boolean;
}

/**
 * Loader full-screen minimalista.
 *
 * Mostra:
 * - Logo "M8LA" con accento rosso
 * - Progress bar reale (basata su usePreload)
 * - Percentuale numerica in mono
 *
 * Scompare con fade + scale quando isVisible diventa false.
 */
export default function Loader({ progress, isVisible }: LoaderProps) {
  // Arrotonda il progresso per la visualizzazione
  const displayProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.overlay}
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: {
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
        >
          {/* Logo */}
          <motion.div
            className={styles.logo}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            M<span className={styles.logoAccent}>8</span>LA
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className={styles.progressContainer}
            initial={{ opacity: 0, scaleX: 0.8 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className={styles.progressFill}
              initial={{ width: "0%" }}
              animate={{ width: `${displayProgress}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

          {/* Percentuale */}
          <motion.p
            className={styles.progressText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {displayProgress}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

