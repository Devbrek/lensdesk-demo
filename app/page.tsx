"use client";

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      
      <main>
        <div className="min-h-screen flex flex-col items-center justify-center gap-10  p-5  bg-black/50 p-5 rounded backdrop-blur-xs">
          <div className="justify-center flex flex-col  text-center ">
            <img
              src="/icons/logo2.png"
              alt="logo"
              className=" justify-center m-auto w-1/2 "
            />
          </div>
          <button
            onClick={() => router.push("/login")}
            className=" px-8 bg-white text-black rounded-full py-4 mt-2 font-semibold hover:bg-gray-200 transition uppercase "
          >
            login
          </button>
        </div>
      </main>
    </div>
  );
}
