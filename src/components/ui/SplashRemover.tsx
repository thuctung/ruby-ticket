// components/Splash.tsx
"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setFading(true);
    const t = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-300 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-ocean" />
    </div>
  );
}
