"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import ScrollToTopBottom from "@/components/scroll/ScrollToTopBottom";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = ["/", "/login", "/landing"].includes(pathname);

  return (
    <div className="min-h-dvh flex flex-col bg-cover bg-center bg-no-repeat transition-opacity duration-500">
      {!isAuthPage && <Navbar />}

      <main className="flex-1 pt-20">{children}</main>

      {!isAuthPage && <ScrollToTopBottom />}
    </div>
  );
}
