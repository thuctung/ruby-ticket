"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

type LazyImageProps = Omit<ImageProps, "onLoad" | "onError"> & {
  wrapperClassName?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
};

export default function LazyImage({
  wrapperClassName = "",
  className = "",
  alt,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);
  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 z-10 flex items-center justify-center bg-slate-200 transition-opacity duration-500 ${
          loaded || failed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 -translate-x-full animate-[lazy-shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="relative h-8 w-8 animate-spin rounded-full border-[3px] border-slate-400/40 border-t-slate-500" />
      </div>

      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-xs text-slate-400">
          Không tải được ảnh
        </div>
      )}

      <Image
        ref={imgRef}
        alt={alt}
        {...props}
        className={`${className} transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          setFailed(true);
          onError?.();
        }}
      />

      <style jsx global>{`
        @keyframes lazy-shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
