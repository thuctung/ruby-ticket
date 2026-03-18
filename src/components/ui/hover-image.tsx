'use client'

import Image from "next/image"

type Props = {
  image: string
  hoverImage: string
  className?: string
}

export default function HoverImage({ image, hoverImage, className }: Props) {
  return (
    <div className={`group relative overflow-hidden ${className}`}>

      {/* default image */}
      <Image
        src={image}
        alt=""
        fill
        className="object-cover transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-0 group-hover:brightness-110"
      />

      {/* hover image */}
      <Image
        src={hoverImage}
        alt=""
        fill
        className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-110 group-hover:brightness-110"
      />

    </div>
  )
}