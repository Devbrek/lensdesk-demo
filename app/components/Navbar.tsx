"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleNav = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    router.replace("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 z-40 w-screen flex py-2 justify-between px-10 items-center backdrop-blur-sm">
        {/* LOGO */}
        <button
          className="text-white flex gap-3"
          onClick={() => handleNav("/dashboard")}
        >
          <img src="/icons/logo2.png" alt="logo" className="w-24" />
        </button>

        {/* MENU DESKTOP */}
        <div className="hidden md:block bg-white/10 px-5 py-2 rounded-full border-2 border-white text-white uppercase font-bold">
          <ul className="flex gap-5">
            <li
              onClick={() => handleNav("/dashboard")}
              className="cursor-pointer"
            >
              Dashboard
            </li>
            <li
              onClick={() => handleNav("/inventory")}
              className="cursor-pointer"
            >
              Inventaire
            </li>
            <li
              onClick={() => handleNav("/shootings")}
              className="cursor-pointer"
            >
              Shootings
            </li>
            <li onClick={handleLogout} className="cursor-pointer">
              Se deconnecter
            </li>
          </ul>
        </div>

        {/* A PROPOS */}
        <div className="hidden md:block">
          <button
            onClick={() => router.push("/apropos")}
            className="bg-white/10 px-5 py-3 rounded-full border-2 border-white text-white uppercase font-bold"
          >
            A propos
          </button>
        </div>

        {/* BURGER */}
        <button onClick={() => setOpen(true)} className="md:hidden">
          <img src="/icons/menuW.svg" alt="menu" className="w-10" />
        </button>
      </nav>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-sky-900 text-white p-6 py-12 flex flex-col  gap-6 uppercase font-bold transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-16">
          <img src="/icons/logo2.png" alt="logo" className="w-1/2" />

          <button onClick={() => setOpen(false)} className="text-xl font-bold">
            ✕
          </button>
        </div>

        {/* LINKS */}
        <button onClick={() => handleNav("/dashboard")} className="uppercase">
          Dashboard
        </button>
        <button onClick={() => handleNav("/shootings")} className="uppercase">
          Shootings
        </button>
        <button onClick={() => handleNav("/inventory")} className="uppercase">
          Inventaire
        </button>
        <button onClick={() => handleNav("/apropos")} className="uppercase">
          A propos
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto flex flex-col items-center gap-3 uppercase pb-10"
        >
          <img src="/icons/logout.svg" alt="logout" className="w-10" />
          Se deconnecter
        </button>
      </div>
    </>
  );
};

export default Navbar;
