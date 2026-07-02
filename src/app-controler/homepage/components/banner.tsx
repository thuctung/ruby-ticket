"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const BANNER_IMAGES = [
  "/bannber_bana.png",
  "/banner_nuithantai.png",
  "/banner_mikayiki.png",
  "/banner_vinpearl.png",
];

export function Banner() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BANNER_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full aspect-video overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 w-full h-full">
        {BANNER_IMAGES.map((imgUrl, index) => {
          const isActive = index === currentImageIndex;
          return (
            <Image
              key={imgUrl}
              src={imgUrl}
              fill
              priority={index === 0}
              sizes="100vw"
              alt={`Banner điểm du lịch ${index + 1}`}
              className={`absolute inset-0 object-cover will-change-[opacity] transition-opacity ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDuration: "1200ms" }}
            />
          );
        })}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/90 z-10" />

      <div className="absolute inset-0 flex justify-end items-end z-20">
        <a
          href="#locations"
          className="inline-block bg-[#E0115F] hover:bg-[#C00F4E] text-white font-semibold text-xs mb-10 mr-10 sm:text-sm md:text-base px-5 py-2.5 md:px-6 md:py-3 rounded-md transition-all shadow-lg shadow-[#E0115F]/30 active:scale-95"
        >
          Đặt Vé Ngay
        </a>
      </div>

      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
        {BANNER_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentImageIndex ? "bg-blue-600 w-6" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Chuyển đến ảnh banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
