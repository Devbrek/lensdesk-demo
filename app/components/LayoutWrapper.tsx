"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import ScrollToTopBottom from "@/components/ui/ScrollToTopBottom";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = ["/", "/login", "/landing"].includes(pathname);

  function getBackground(pathname: string) {
    if (pathname.startsWith("/dashboard")) {
      return "url('/leoFlames.webp')";
    }

    if (pathname.startsWith("/shootings")) {
      return "url('/leoHole.webp')";
    }
    if (pathname === "/inventory") {
      return "url('/windoor.webp')";
    }

    if (pathname === "/") {
      return "url('/abuzone2.webp')";
    }

    return "url('/abuzone2.webp')";
  }

  const backgroundImage = getBackground(pathname);

  return (
    <div
      className="min-h-dvh flex flex-col bg-cover bg-center bg-no-repeat transition-opacity duration-500"
      style={{ backgroundImage }}
    >
      {!isAuthPage  && <Navbar />}

      <main className="flex-1 pt-20">{children}</main>

      {!isAuthPage && <ScrollToTopBottom />}
    </div>
  );
}
