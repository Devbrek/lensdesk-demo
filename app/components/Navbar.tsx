"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { fa } from "zod/locales";

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
    <nav className="flex py-5 w-screen justify-between px-5 absolute z-10 top-0 left-0 items-center">
      {/* LOGO */}
      <button
        className="text-white flex gap-3"
        onClick={() => handleNav("/dashboard")}
      >
        <img src="/icons/logo2.png" alt="logo" className="w-30" />
      </button>

      {/* MENU DESKTOP */}
      <div className="hidden md:block bg-white/10 px-5 py-3 rounded-full border-2 border-white text-white uppercase font-bold">
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
          <li onClick={() => handleLogout()} className="cursor-pointer">
            Se deconnecter
          </li>
        </ul>
      </div>

      {/* BOUTON A PROPOS */}
      <div className="hidden md:block">
        <button
          onClick={() => router.push("/apropos")}
          className="bg-white/10 px-5 py-3 rounded-full border-2 border-white text-white uppercase font-bold"
        >
          A propos
        </button>
      </div>

      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden text-black  px-4 py-2"
      >
        <img src="/icons/menuW.svg" alt="menu" className="w-10" />
      </button>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* MENU MOBILE SLIDE */}
      <div
        className={`fixed top-0 left-0 h-screen w-3/4  max-w-xs bg-sky-900/90 backdrop-blur-sm text-white p-6 py-12 flex flex-col gap-6 uppercase font-bold transform transition-transform duration-300 ease-in-out z-20
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between mb-20">
          <img src="/icons/logo2.png" alt="logo" className="w-1/2 " />
          {/* BOUTON FERMER */}
          <button
            onClick={() => setOpen(false)}
            className="self-end text-xl font-bold  my-auto "
          >
            ✕
          </button>
        </div>

        {/* LIENS */}
        <button className="uppercase" onClick={() => handleNav("/dashboard")}>
          Dashboard
        </button>
        <button className="uppercase" onClick={() => handleNav("/shootings")}>
          Shootings
        </button>
        <button className="uppercase" onClick={() => handleNav("/inventory")}>
          Inventaire
        </button>
        <button className="uppercase" onClick={() => handleNav("/apropos")}>
          A propos
        </button>
        <button
          className="uppercase mt-20 items-center justify-center flex flex-col gap-3"
          onClick={() => handleLogout()}
        >
          <img src="/icons/logout.svg" alt="logout" className="w-12" />
          Se deconnecter
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
