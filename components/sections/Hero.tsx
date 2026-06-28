"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import CanvasMirror from "./CanvasMirror";
import { HERO_ROLES } from "@/lib/constants";
import styles from "./Hero.module.css";

/* ============================================
   Costanti
   ============================================ */

const TITLE = "Mario M8LA";
const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SCRAMBLE_TICK = 40;
const SETTLE_TICKS = 3;
const PAUSE_AFTER = 2000;

// Block reveal
const BLOCK_SIZE = 14;
const REVEAL_DURATION = 1;

/* ============================================
   Helpers
   ============================================ */

function randomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/* ============================================
   Hero
   ============================================ */

interface HeroProps {
  variant?: "pure" | "glow";
}

interface BlockData {
  id: number;
  top: number;
  left: number;
  delay: number;
}

export default function Hero({ variant = "glow" }: HeroProps) {
  // --- Block Reveal state ---
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- Canvas Mirror hover state ---
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  // --- Scramble text state ---
  const [displayText, setDisplayText] = useState("");
  const roleIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const settleCountRef = useRef(0);
  const phaseRef = useRef<"scrambling" | "waiting">("scrambling");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Block Reveal: genera blocchi per ogni lettera ---
  useEffect(() => {
    const title = titleRef.current;
    const wrapper = wrapperRef.current;
    if (!title || !wrapper) return;

    function measure() {
      if (!title || !wrapper) return;
      // Misura ogni carattere del titolo (ora sono span semplici)
      const chars = title.querySelectorAll<HTMLSpanElement>(`.${styles.char}`);
      const wrapperRect = wrapper.getBoundingClientRect();

      const newBlocks: BlockData[] = [];
      let id = 0;

      chars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const relLeft = rect.left - wrapperRect.left;
        const relTop = rect.top - wrapperRect.top;
        const w = rect.width;
        const h = rect.height;

        const cols = Math.max(1, Math.ceil(w / BLOCK_SIZE));
        const rows = Math.max(1, Math.ceil(h / BLOCK_SIZE));

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            newBlocks.push({
              id: id++,
              top: relTop + r * BLOCK_SIZE,
              left: relLeft + c * BLOCK_SIZE,
              delay: Math.random() * REVEAL_DURATION,
            });
          }
        }
      });

      setBlocks(newBlocks);
    }

    const measureTimer = setTimeout(measure, 50);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(measureTimer);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // --- Block Reveal: sequenza temporale ---
  useEffect(() => {
    if (blocks.length === 0) return;
    const revealTimer = setTimeout(() => {
      setIsRevealed(true);
    }, REVEAL_DURATION * 1000 + 400);
    return () => clearTimeout(revealTimer);
  }, [blocks]);

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
      {/* --- Titolo con Block Reveal + Canvas Mirror --- */}
      <div
        className={styles.titleWrapper}
        ref={wrapperRef}
        onMouseEnter={() => setIsTitleHovered(true)}
        onMouseLeave={() => setIsTitleHovered(false)}
      >
        <h1
          ref={titleRef}
          className={`${styles.title} ${variant === "glow" && !isRevealed ? styles.glow : ""}`}
        >
          {TITLE.split("").map((char, i) => (
            <span key={i} className={styles.char}>
              {char}
            </span>
          ))}
        </h1>

        {/* Canvas Mirror — griglia animata dentro le lettere */}
        <CanvasMirror text={TITLE} isHovered={isTitleHovered} titleRef={titleRef} />

        {/* Block Reveal overlay */}
        {blocks.length > 0 && !isRevealed && (
          <div className={styles.blockOverlay}>
            {blocks.map((b) => (
              <motion.div
                key={b.id}
                className={styles.block}
                style={{
                  top: b.top,
                  left: b.left,
                }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  delay: b.delay,
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- Scramble Text --- */}
      <motion.div
        className={styles.scrambleWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
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
        transition={{ duration: 0.7, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
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
        transition={{ delay: 2.8, duration: 0.8 }}
      >
        <span className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}
