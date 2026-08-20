import { MapPin, ArrowRight, Ticket, Star } from "lucide-react";
import { Destination } from "./destinations";
import { SiteType } from "@/types/ticket";

type Props = {
  place: SiteType;
  onDetail: (place: Destination) => void;
  onBuy: (place: Destination) => void;
};

export default function DestinationCard({ place, onDetail, onBuy }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]">
      {/* Ảnh */}
      <div className="group relative h-48 overflow-hidden">
        <img
          src="/thantai1.jpg"
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 rounded-full border border-gold/40 bg-ink/70 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-paper backdrop-blur-sm">
          {place.name}
        </span>
      </div>

      {/* Đường viền vé xé */}
      <div className="relative flex justify-evenly px-2 pb-2 pt-3.5 before:absolute before:inset-x-0 before:top-2 before:border-t-[1.5px] before:border-dashed before:border-ink/25">
        {Array.from({ length: 22 }).map((_, i) => (
          <span key={i} className="h-[7px] w-[7px] rounded-full bg-ink/90" />
        ))}
      </div>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col gap-2.5 px-5 pb-5 pt-1.5">
        <div className="flex items-center gap-1.5 font-mono text-[11.5px] font-medium uppercase tracking-wide text-jade">
          <MapPin size={13} strokeWidth={2.5} />
          <span>{place.name}</span>
        </div>

        <h3 className="font-display text-xl font-semibold text-ink">{place.name}</h3>

        <p className="flex-1 text-sm leading-relaxed text-ink/65">
          {" "}
          <span>{place.name}</span>
        </p>

        <div className="mt-2 flex items-end justify-between gap-3 border-t-[1.5px] border-dashed border-ink/20 pt-4">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wide text-ink/50">
              Giá vé
            </span>
            <span className="font-display text-lg font-semibold text-lacquer">{place.name}₫</span>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row">
            <button className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-ink/25 px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-jade hover:bg-jade/10">
              Xem chi tiết
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
            <button className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-jade px-3.5 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-jade-dark">
              <Ticket size={15} strokeWidth={2.5} />
              Mua vé ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
