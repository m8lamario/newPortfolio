import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

export const metadata: Metadata = {
  title: "M8LA — Full-stack Developer",
  description:
    "Mario Mottola (M8LA) — Full-stack Developer. Next.js, TypeScript, Prisma. Portfolio personale.",
  keywords: ["M8LA", "Mario Mottola", "Full-stack Developer", "Next.js", "Portfolio"],
  authors: [{ name: "Mario Mottola", url: "https://github.com/m8lamario" }],
  openGraph: {
    title: "M8LA — Full-stack Developer",
    description: "Building digital solutions that work.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={spaceGrotesk.variable}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
