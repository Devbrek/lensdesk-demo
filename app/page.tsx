"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <main>
        <div className="min-h-screen flex flex-col items-center justify-center  p-5">
          <h1 className="text-5xl font-bold mb-8 text-white">
            Bienvenue dans l&apos;application &quot;ABUZONE CHECKER&quot;
          </h1>
          <button
            onClick={() => router.push("/login")}
            className="w-full px-5 bg-white text-black rounded-full py-3 mt-2 font-semibold hover:bg-gray-200 transition uppercase"
          >
            Se login
          </button>
        </div>
      </main>
    </div>
  );
}
