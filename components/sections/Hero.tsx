"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import PixelTitle from "./PixelTitle";
import { HERO_ROLES } from "@/lib/constants";
import styles from "./Hero.module.css";

/* ============================================
   Costanti
   ============================================ */

const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SCRAMBLE_TICK = 40;
const SETTLE_TICKS = 3;
const PAUSE_AFTER = 2000;

/* ============================================
   Helpers
   ============================================ */

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/* ============================================
   Hero
   ============================================ */

export default function Hero() {
  // --- Scramble text state ---
  const [displayText, setDisplayText] = useState("");
  const roleIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const settleCountRef = useRef(0);
  const phaseRef = useRef<"scrambling" | "waiting">("scrambling");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Scramble text loop ---
  const runScramble = useCallback(() => {
    charIndexRef.current = 0;
    settleCountRef.current = 0;
    phaseRef.current = "scrambling";

    intervalRef.current = setInterval(() => {
      if (phaseRef.current !== "scrambling") return;

      const t = HERO_ROLES[roleIndexRef.current];

      if (charIndexRef.current >= t.length) {
        phaseRef.current = "waiting";
        setDisplayText(t);

        timeoutRef.current = setTimeout(() => {
          roleIndexRef.current = (roleIndexRef.current + 1) % HERO_ROLES.length;
          if (intervalRef.current) clearInterval(intervalRef.current);
          runScramble();
        }, PAUSE_AFTER);
        return;
      }

      settleCountRef.current++;

      let result = "";
      for (let i = 0; i < t.length; i++) {
        if (i < charIndexRef.current) {
          result += t[i];
        } else if (i === charIndexRef.current) {
          if (settleCountRef.current >= SETTLE_TICKS) {
            result += t[i];
            charIndexRef.current++;
            settleCountRef.current = 0;
          } else {
            result += randomChar();
          }
        } else {
          result += Math.random() > 0.7 ? randomChar() : "\u00A0";
        }
      }

      setDisplayText(result);
    }, SCRAMBLE_TICK);
  }, []);

  useEffect(() => {
    runScramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [runScramble]);

  return (
    <section id="hero" className={styles.hero}>
      {/* --- Pixel Title SVG — integrato nel GridCanvas --- */}
      <div className={styles.titleWrapper}>
        <PixelTitle />
      </div>

      {/* --- Scramble Text --- */}
      <motion.div
        className={styles.scrambleWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <span className={styles.scrambleText}>
          {displayText}
          <span className={styles.cursor}>|</span>
        </span>
      </motion.div>

      {/* --- CTA Buttons --- */}
      <motion.div
        className={styles.ctas}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Button href="#projects">Vedi i progetti</Button>
        <Button variant="secondary" href="#contact">
          Contattami
        </Button>
      </motion.div>

      {/* --- Scroll Indicator --- */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.45 }}
      >
        <span className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}
