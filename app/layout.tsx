import type { Metadata } from "next";

import "./globals.css"

import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Poppins } from "next/font/google";
import { cn } from "@/app/lib/utils";

import RouteLoader from "@/components/routeLoader/RouteLoader";

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
    <html lang="fr" className={cn(poppins.variable, "h-full ")}>
      {/* IMPORTANT: permet dark mode + hydration stable */}
      <body
        className={cn(
          " text-foreground  bg-center bg-no-repeat bg-cover bg-fixed min-h-dvh ",
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
