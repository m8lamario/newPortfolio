"use client";

import { GridProvider } from "@/components/background/GridContext";
import GridCanvas from "@/components/background/GridCanvas";
import SmoothScroll from "@/components/layout/SmoothScroll";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <GridProvider>
      <GridCanvas />
      <SmoothScroll>{children}</SmoothScroll>
    </GridProvider>
  );
}
