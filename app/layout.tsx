import type { Metadata } from "next";

import "./globals.css";

import LayoutWrapper from "./components/LayoutWrapper";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import ScrollToTopBottom from "@/components/ui/ScrollToTopBottom";
import RouteLoader from "./components/RouteLoader";

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
          "h-screen top-0  text-foreground  bg-center bg-no-repeat pt-20",
        )}
        style={{
          backgroundImage: "url('/abuzone2.jpg')",
        }}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
        <RouteLoader />
      </body>
    </html>
  );
}
