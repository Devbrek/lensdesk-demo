import type { Metadata } from "next";

import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "AbuzOne Checker",
  description: "An app to organize and schedule photo shootings sessions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body
        className="bg-cover bg-center min-h-screen flex items-center justify-center bg-no-repeat"
        style={{
          backgroundImage: "url('/abuzone2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
