import { ButtonProp } from "@/types";

export function ButtonCommon({ title, onClick, ...prop }: ButtonProp) {
  return (
    <button
      {...prop}
      onClick={onClick}
      className="px-8 py-2.5 rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"
    >
      {title}
    </button>
  );
}
