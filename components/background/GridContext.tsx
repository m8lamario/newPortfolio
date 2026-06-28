"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import type { GridConfig } from "@/lib/gridRenderer";

interface GridContextValue {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  configRef: React.MutableRefObject<GridConfig>;
}

const GridContext = createContext<GridContextValue | null>(null);

export function GridProvider({ children }: { children: ReactNode }) {
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const configRef = useRef<GridConfig>({
    cellSize: 50,
    squareRatio: 0.6,
    maxScale: 1.8,
    minScale: 0.5,
    falloff: 0.0025,
    lerpSpeed: 0.07,
    glowRadius: 350,
  });

  return (
    <GridContext.Provider value={{ mouseRef, configRef }}>
      {children}
    </GridContext.Provider>
  );
}

export function useGridContext(): GridContextValue {
  const ctx = useContext(GridContext);
  if (!ctx) {
    throw new Error("useGridContext must be used within a GridProvider");
  }
  return ctx;
}
