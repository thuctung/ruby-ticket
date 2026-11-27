"use client";

import Image from "next/image";
import LazyImage from "./lazy-image";

type Props = {
  image: string;
  hoverImage: string;
  className?: string;
  alt?: string;
};

export default function HoverImage({ image, hoverImage, className, alt }: Props) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <LazyImage
        alt={alt || ""}
        src={image}
        fill
        wrapperClassName="h-full"
        className="object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-0 group-hover:brightness-110"
      />
      {/* hover image */}

      <Image
        src={hoverImage}
        alt={alt || ""}
        fill
        loading="lazy"
        className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-110 group-hover:brightness-110"
      />
    </div>
  );
}
