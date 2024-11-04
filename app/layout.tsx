// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
  adjustFontFallback: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Commercial Department Project Management",
  description:
    "Web-based application for managing projects, tasks, and trackers within the Commercial Department",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
