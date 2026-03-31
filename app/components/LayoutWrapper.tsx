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

  const isAuthPage = ["/", "/login"].includes(pathname);

  function getBackground(pathname: string) {
    if (pathname.startsWith("/dashboard")) {
      return "url('/leoFlames.jpg')";
    }

    if (pathname.startsWith("/shootings")) {
      return "url('/leoHole.jpg')";
    }
    if (pathname === "/inventory") {
      return "url('/windoor.jpg')";
    }

    if (pathname === "/") {
      return "url('/abuzone2.jpg')";
    }

    return "url('/default-bg.jpg')";
  }

  const backgroundImage = getBackground(pathname);

  return (
    <div
      className="min-h-dvh flex flex-col bg-cover bg-center bg-no-repeat "
      style={{ backgroundImage }}
    >
      {!isAuthPage && <Navbar />}

      <main className="flex-1 pt-20">{children}</main>

      {!isAuthPage && <ScrollToTopBottom />}
    </div>
  );
}
