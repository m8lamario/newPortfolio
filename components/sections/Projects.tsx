"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PROJECTS, type Project } from "@/lib/constants";
import { buildLayout } from "@/lib/pixelFont";
import styles from "./Projects.module.css";

/* ============================================
   PixelLabel – titolo a quadratini SVG verticale
   ============================================ */
function PixelLabel({ text, style }: { text: string; style?: React.CSSProperties }) {
  const layout = buildLayout(text, 0.55, 1);
  const PAD_COLS = 90;

  const rotatedRects = layout.rects.map((r) => ({
    x: r.y,
    y: PAD_COLS - r.x - 0.55,
    w: r.h,
    h: r.w,
  }));

  return (
    <svg
      viewBox={`0 0 ${layout.totalRows} ${PAD_COLS}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label={text}
      style={{
        display: "block",
        height: "70vh",
        width: "auto",
        flexShrink: 0,
        ...style,
      }}
    >
      {rotatedRects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={0.12}
          fill="var(--brown-red)"
        />
      ))}
    </svg>
  );
}

/* ============================================
   Icons SVG inline
   ============================================ */
function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

/* ============================================
   ProjectCard
   ============================================ */
function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Anno badge */}
      <div className={styles.yearBadge}>
        <span className={styles.yearDot} />
        {project.year}
      </div>

      {/* Titolo */}
      <h3 className={styles.cardTitle}>{project.title}</h3>

      {/* Descrizione */}
      <p className={styles.cardDesc}>{project.description}</p>

      {/* Stack */}
      <div className={styles.stackRow}>
        <span className={styles.stackLabel}>Stack</span>
        <span className={styles.stackValue}>{project.stack}</span>
      </div>

      {/* Tags */}
      <div className={styles.tags}>
        {project.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className={styles.links}>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkBtn}
            title="Visita il sito"
          >
            <ExternalLinkIcon />
            <span>Live</span>
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkBtn}
            title="Vedi su GitHub"
          >
            <GitHubIcon />
            <span>Codice</span>
          </a>
        )}
      </div>

      {/* Glow decorativo */}
      <div className={styles.cardGlow} />
    </motion.div>
  );
}

/* ============================================
   Projects – componente principale
   ============================================ */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

  const [showAll, setShowAll] = useState(false);

  const featured = PROJECTS.filter((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);
  const visibleProjects = showAll ? PROJECTS : featured;

  return (
    <section id="projects" ref={sectionRef} className={styles.section}>
      {/* Colonna sinistra: PixelLabel sticky */}
      <div className={styles.labelCol}>
        <div className={styles.stickyLabel}>
          <PixelLabel text="PROJECTS" style={{ opacity: 0.2 }} />
        </div>
      </div>

      {/* Colonna destra: contenuto */}
      <div className={styles.contentCol}>
        {/* Header */}
        <motion.div
          ref={headerRef}
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={
            isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
          }
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
        </motion.div>

        {/* Grid */}
        <div className={styles.grid}>
          {visibleProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Toggle "altri progetti" */}
        {others.length > 0 && (
          <motion.div
            className={styles.toggleWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button
              className={styles.toggleBtn}
              onClick={() => setShowAll((prev) => !prev)}
            >
              <span className={styles.toggleLabel}>
                {showAll
                  ? "Mostra solo i principali"
                  : `Altri progetti (${others.length})`}
              </span>
              <ChevronDownIcon open={showAll} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
