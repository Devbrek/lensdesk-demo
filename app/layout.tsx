import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import LayoutWrapper from "./components/LayoutWrapper";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AbuzOne Checker",
  description: "An app to organize and schedule photo shootings sessions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn(inter.variable)}>
      {/* IMPORTANT: permet dark mode + hydration stable */}
      <body
        className={cn(
          "min-h-screen font-sans bg-background text-foreground bg-cover bg-center bg-no-repeat",
        )}
        style={{
          backgroundImage: "url('/abuzone2.jpg')",
        }}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
