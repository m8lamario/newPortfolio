"use client";

import { GridProvider } from "@/components/background/GridContext";
import GridCanvas from "@/components/background/GridCanvas";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Preloader from "@/components/loader/Preloader";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <GridProvider>
      <GridCanvas />
      <Preloader>
        <SmoothScroll>{children}</SmoothScroll>
      </Preloader>
    </GridProvider>
  );
}
