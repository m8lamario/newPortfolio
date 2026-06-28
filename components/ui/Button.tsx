"use client";

import { type ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  href?: string; // se fornito, scrolla alla sezione con Lenis
}

export default function Button({
  variant = "primary",
  href,
  children,
  onClick,
  className = "",
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      const target = document.querySelector(href) as HTMLElement | null;
      if (target) {
        const lenis = window.__lenis;
        if (lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
    onClick?.(e);
  };

  const variantClass = variant === "secondary" ? styles.secondary : styles.primary;

  return (
    <button
      className={`${styles.button} ${variantClass} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
