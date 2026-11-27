"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  src: string;
  fallback?: string;
};

export default function ImageWithFallback({
  src,
  fallback = "/buy-ticket-image/BCN/ve-thuong.png",
  ...props
}: Props) {
  const [imageSrc, setImageSrc] = useState(src);
  return (
    <Image
      {...props}
      src={imageSrc}
      onError={() => {
        if (imageSrc !== fallback) {
          setImageSrc(fallback);
        }
      }}
    />
  );
}
