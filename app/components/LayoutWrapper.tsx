// components/LayoutWrapper.tsx
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

  const isLoginPage = pathname === "/";

  return (
    <>
      {!isLoginPage && <Navbar />}
      {children}
      {!isLoginPage && <ScrollToTopBottom />}
    </>
  );
}
