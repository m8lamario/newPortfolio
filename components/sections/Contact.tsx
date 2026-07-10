"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CONTACT_LINKS } from "@/lib/constants";
import styles from "./Contact.module.css";

/* ============================================
   Icone SVG
   ============================================ */
function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.ReactNode> = {
  email: <EmailIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  instagram: <InstagramIcon />,
};

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  instagram: "Instagram",
};

/* ============================================
   SocialLinkRow – riga animata con icona e label
   ============================================ */
function SocialLinkRow({
  url,
  label,
  iconKey,
  index,
}: {
  url: string;
  label: string;
  iconKey: string;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.socialRow}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{
        duration: 0.5,
        delay: 0.5 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ x: 8 }}
    >
      <span className={styles.socialIcon}>{ICON_MAP[iconKey]}</span>
      <span className={styles.socialLabel}>{label}</span>
      <span className={styles.socialArrow}>
        <ArrowRightIcon />
      </span>
    </motion.a>
  );
}

/* ============================================
   Contact – componente principale
   ============================================ */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: "-60px" });

  const socialLinks = CONTACT_LINKS.filter((l) => l.icon !== "email");

  return (
    <section id="contact" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* === Colonna sinistra: testo === */}
        <div className={styles.leftCol}>
          {/* Label */}
          <motion.span
            className={styles.label}
            initial={{ opacity: 0, y: 10 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Contatti
          </motion.span>

          {/* Heading con effetto reveal per parole */}
          <h2 ref={headingRef} className={styles.heading}>
            {"Let's build something together.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className={styles.word}
                initial={{ opacity: 0, y: 40, rotateX: -40 }}
                animate={
                  isHeadingInView
                    ? { opacity: 1, y: 0, rotateX: 0 }
                    : { opacity: 0, y: 40, rotateX: -40 }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          {/* Subtitle */}
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Se vuoi collaborare a un progetto, scambiare idee o anche solo
            fare due chiacchiere, scrivimi pure.
          </motion.p>

          {/* Email CTA */}
          <motion.a
            href="mailto:mario.m8la@gmail.com"
            className={styles.emailBtn}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.9 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <EmailIcon />
            <span>mario.m8la@gmail.com</span>
            <span className={styles.emailGlow} />
          </motion.a>
        </div>

        {/* === Colonna destra: social links === */}
        <div className={styles.rightCol}>
          <motion.span
            className={styles.socialHeading}
            initial={{ opacity: 0, y: 10 }}
            animate={
              isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
            }
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Trovami su
          </motion.span>

          <div className={styles.socialList}>
            {socialLinks.map((link, i) => (
              <SocialLinkRow
                key={link.icon}
                url={link.url}
                label={SOCIAL_LABELS[link.icon] ?? link.label}
                iconKey={link.icon}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>

      {/* === Pixel decorativi sparsi (geometric pattern) === */}
      <div className={styles.pixels}>
        <motion.div
          className={styles.pixel}
          style={{ top: "15%", left: "10%", width: 8, height: 8 }}
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }}
        />
        <motion.div
          className={styles.pixel}
          style={{ top: "25%", right: "15%", width: 6, height: 6 }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div
          className={styles.pixel}
          style={{ bottom: "20%", left: "20%", width: 10, height: 10 }}
          animate={{ opacity: [0.15, 0.5, 0.15], scale: [1, 1.15, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className={styles.pixel}
          style={{ bottom: "30%", right: "8%", width: 7, height: 7 }}
          animate={{ opacity: [0.2, 0.55, 0.2], scale: [1, 1.25, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.div
          className={styles.pixel}
          style={{ top: "60%", left: "5%", width: 5, height: 5 }}
          animate={{ opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* === Footer === */}
      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={isHeadingInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <span>© {new Date().getFullYear()} M8LA — Mario Mottola</span>
      </motion.footer>
    </section>
  );
}
