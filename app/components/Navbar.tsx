"use client";

import React from "react";

import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="flex  py-5 w-screen justify-center gap-50 px-5 absolute z-10 top-0 left-0 items-center">
      <div className="text-white flex  gap-3  ">
        <img src="/icons/logo2.png" alt="logo" className="w-30" />{" "}
      </div>
      <div className="bg-white/10 px-5 py-3 rounded-full border-2 border-white text-white uppercase font-bold ">
        <ul className="flex gap-5">
          <li
            className="hover: cursor-pointer"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Dashboard
          </li>
          <li
            className="hover: cursor-pointer"
            onClick={() => {
              router.push("/inventory");
            }}
          >
            Inventaire
          </li>
          <li
            className="hover: cursor-pointer"
            onClick={() => {
              router.push("/shootings");
            }}
          >
            Shootings
          </li>

          <li
            className="hover: cursor-pointer"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Logout
          </li>
        </ul>
      </div>
      <div>
        <button
          onClick={() => {
            router.push("/apropos");
          }}
          className="bg-white/10 px-5 py-3 rounded-full border-2 border-white text-white uppercase font-bold hover: cursor-pointer"
        >
          A propos
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
