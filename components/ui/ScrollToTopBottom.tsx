"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, ChevronLeft } from "lucide-react";

export default function ScrollDrawer() {
  const [open, setOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-0 bottom-1/10 z-50 flex items-center">
      {/* PANEL */}
      <div
        className={`
          bg-white/10 backdrop-blur border border-white/20
            flex flex-col 
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-26"}
        `}
      >
        <button
          onClick={scrollToTop}
          className="p-3 hover:bg-white/20 rounded-xl text-white transition"
        >
          <ArrowUp size={18} />
        </button>

        <button
          onClick={scrollToBottom}
          className="p-3 hover:bg-white/20 rounded-xl text-white transition"
        >
          <ArrowDown size={18} />
        </button>
      </div>

      {/* TOGGLE HANDLE */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-white/10 backdrop-blur border border-white/20
                   text-white p-1 rounded-l-xl"
      >
        <ChevronLeft
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
