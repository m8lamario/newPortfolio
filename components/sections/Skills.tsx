"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SKILL_CATEGORIES } from "@/lib/constants";
import styles from "./Skills.module.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref} className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <span className={styles.label}>Cosa so fare</span>
        <h2 className={styles.title}>Skills</h2>
      </motion.div>

      <div className={styles.grid}>
        {SKILL_CATEGORIES.map((category) => (
          <div key={category.title} className={styles.category}>
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            <motion.ul
              className={styles.tags}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {category.skills.map((skill) => (
                <motion.li
                  key={skill.name}
                  className={styles.tag}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {skill.name}
                </motion.li>
              ))}
            </motion.ul>
          </div>
        ))}
      </div>
    </section>
  );
}
