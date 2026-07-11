"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { SKILL_CATEGORIES } from "@/lib/constants";
import styles from "./WebDev.module.css";

/* ── Dati ── */
const TECH_SKILLS = SKILL_CATEGORIES.flatMap((category) =>
  category.skills.map((skill) => ({
    name: skill.name,
    desc: `${category.title} — competenza tecnica`,
  }))
);

/* ── Skill item ── */
function SkillItem({ name, desc, isActive }: { name: string; desc: string; isActive: boolean }) {
  return (
    <motion.div
      className={styles.skillItem}
      animate={{ opacity: isActive ? 1 : 0.25 }}
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

/* ── Componente principale ── */
export default function WebDev() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollColRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-60px" });

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
      if (distance < closestDistance) { closestDistance = distance; closestIndex = i; }
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
    <section id="skills" ref={sectionRef} className={styles.section}>
      {/* Colonna sinistra: heading sticky */}
      <div className={styles.stickyCol}>
        <div className={styles.stickyInner}>
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 10 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Competenze
          </motion.span>

          <h2 ref={headingRef} className={styles.heading}>
            {"Tech Stack.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className={styles.word}
                initial={{ opacity: 0, y: 30, rotateX: -30 }}
                animate={isHeadingInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 30, rotateX: -30 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </div>
      </div>

      {/* Colonna destra: skill scroll highlight */}
      <div className={styles.scrollCol} ref={scrollColRef}>
        <div className={styles.skillList}>
          {TECH_SKILLS.map((skill, i) => (
            <div
              key={skill.name}
              ref={(el) => { itemRefs.current[i] = el; }}
            >
              <SkillItem name={skill.name} desc={skill.desc} isActive={i === activeIndex} />
            </div>
          ))}
        </div>
        <div className={styles.mobileSkillGroups}>
          {SKILL_CATEGORIES.map((category) => (
            <div className={styles.skillGroup} key={category.title}>
              <h3 className={styles.skillGroupTitle}>{category.title}</h3>
              <div className={styles.chips}>
                {category.skills.map((skill, index) => (
                  <motion.span
                    className={styles.chip}
                    key={skill.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
