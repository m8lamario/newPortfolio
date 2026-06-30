"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import styles from "./Skills.module.css";

/* ── Dati skill Web Dev ── */
const WEB_DEV_SKILLS = [
  { name: "Next.js", desc: "Framework React per applicazioni web moderne" },
  { name: "TypeScript", desc: "Tipizzazione statica per codice più solido" },
  { name: "React", desc: "Componenti UI dinamici e reattivi" },
  { name: "Prisma", desc: "ORM per database relazionali" },
  { name: "SQL", desc: "Query e gestione database" },
  { name: "CSS Modules", desc: "Stili scoped e manutenibili" },
  { name: "Node.js", desc: "Runtime JavaScript lato server" },
  { name: "REST API", desc: "Progettazione e consumo di API" },
];

/* ── Dati foto ── */
const PHOTOS = [
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

/* Raggruppa in righe da 3 */
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/* ── Singola voce skill ── */
function SkillItem({
  name,
  desc,
  isActive,
}: {
  name: string;
  desc: string;
  isActive: boolean;
}) {
  return (
    <motion.div
      className={styles.skillItem}
      animate={{
        opacity: isActive ? 1 : 0.25,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <span
        className={styles.skillName}
        style={{
          color: isActive ? "var(--brown-red)" : "var(--text-primary)",
          transition: "color 0.35s ease-out",
        }}
      >
        {name}
      </span>
      <span className={styles.skillDesc}>{desc}</span>
    </motion.div>
  );
}

/* ── Sezione Fotografia ── */
function PhotographySection() {
  const [isPaused, setIsPaused] = useState(false);
  const rows = chunk(PHOTOS, 3);
  const duplicatedRows = [...rows, ...rows];

  return (
    <div className={styles.photography}>
      {/* Colonna sinistra — titolo */}
      <div className={styles.photoTitleCol}>
        <h2 className={styles.photoTitle}>Fotografia</h2>
      </div>

      {/* Colonna destra — stage 3D */}
      <div className={styles.photoStageCol}>
        <div className={styles.photoStage}>
          <motion.div
            className={styles.photoTrack}
            animate={{ y: ["0%", "-50%"] }}
            transition={{
              y: {
                duration: 18,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              },
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedRows.map((row, rowIdx) => (
              <div key={rowIdx} className={styles.photoRow}>
                {row.map((src, colIdx) => (
                  <div
                    key={colIdx}
                    className={styles.photoCard}
                    style={{
                      backgroundImage: `url(${src})`,
                    }}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── Componente principale ── */
export default function Skills() {
  const scrollColRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(() => {
    const container = scrollColRef.current;
    if (!container) return;

    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = scrollColRef.current;
    if (!container) return;

    window.addEventListener("scroll", updateActive, { passive: true });
    updateActive();

    return () => window.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  return (
    <section id="skills" className={styles.skills}>
      {/* ─── Sezione 1: Web Dev ─── */}
      <div className={styles.webDev}>
        <div className={styles.stickyCol}>
          <div className={styles.stickyTitle}>
            <h2>Web Dev</h2>
          </div>
        </div>

        <div className={styles.scrollCol} ref={scrollColRef}>
          <div className={styles.skillList}>
            {WEB_DEV_SKILLS.map((skill, i) => (
              <div
                key={skill.name}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
              >
                <SkillItem
                  name={skill.name}
                  desc={skill.desc}
                  isActive={i === activeIndex}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Sezione 2: Fotografia ─── */}
      <PhotographySection />

      {/* ─── Sezione 3: Stampa 3D (placeholder) ─── */}
      <div className={styles.placeholder}>
        <span className={styles.placeholderText}>
          Stampa 3D — Coming soon
        </span>
      </div>
    </section>
  );
}
