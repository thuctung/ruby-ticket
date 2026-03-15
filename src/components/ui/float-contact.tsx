import Image from "next/image"

export default function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="https://zalo.me/0705551668"
        target="_blank"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
      >
        <span className="absolute h-12 w-12 animate-ping rounded-full bg-sky-400 opacity-30"></span>

        <Image
          src="/icons/zalo1.jpg"
          alt="zalo"
          width={28}
          height={28}
        />
      </a>

      {/* Facebook */}
      <a
        href="https://facebook.com/yourpage"
        target="_blank"
        className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-110"
      >
        <Image
          src="/icons/facebook1.jpg"
          alt="facebook"
          width={26}
          height={26}
        />
      </a>

      <a
        href="tel:0705551668"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-110"
      >
        📞
      </a>

    </div>
  )
}