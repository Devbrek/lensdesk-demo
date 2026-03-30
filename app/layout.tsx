import type { Metadata } from "next";

import "./globals.css";

import LayoutWrapper from "./components/LayoutWrapper";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

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
    <html lang="fr" className={cn(poppins.variable)}>
      {/* IMPORTANT: permet dark mode + hydration stable */}
      <body
        className={cn(
          "min-h-screen   text-foreground bg-cover bg-center bg-no-repeat pt-20",
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
