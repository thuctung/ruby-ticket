import { MapPin, Ticket, X } from "lucide-react";
import { Destination } from "@/data/destinations";

type Props = {
  place: Destination | null;
  onClose: () => void;
  onBuy: (place: Destination) => void;
};

export default function DetailModal({ place, onClose, onBuy }: Props) {
  if (!place) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <img
          src={place.img}
          alt={place.name}
          className="h-56 w-full object-cover"
        />

        <div className="flex flex-col gap-2.5 px-6 py-6">
          <div className="flex items-center gap-1.5 font-mono text-[11.5px] font-medium uppercase tracking-wide text-jade">
            <MapPin size={13} strokeWidth={2.5} />
            <span>{place.region}</span>
          </div>

          <h2 className="font-display text-2xl font-semibold">{place.name}</h2>

          <p className="text-[14.5px] leading-relaxed text-ink/70">
            {place.desc}
          </p>

          <div className="mt-2.5 flex items-center justify-between border-t-[1.5px] border-dashed border-ink/20 pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink/50">
                Giá vé
              </span>
              <span className="font-display text-lg font-semibold text-lacquer">
                {place.price}₫
              </span>
            </div>
            <button
              onClick={() => onBuy(place)}
              className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-jade px-4 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-jade-dark"
            >
              <Ticket size={15} strokeWidth={2.5} />
              Mua vé ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
