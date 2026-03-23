import { ButtonProp } from "@/types";

export function ResetButton({ onClick, ...prop }: ButtonProp) {
  return (
    <button
      {...prop}
      onClick={onClick}
      className="px-6 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-white transition-all"
    >
      Reset
    </button>
  );
}
