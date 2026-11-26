import { ButtonProp } from "@/types";

export function SearchButton({ onClick, ...prop }: ButtonProp) {
  return (
    <button
      {...prop}
      onClick={onClick}
      className="h-10 rounded-md bg-rose-700 px-5 text-sm font-medium text-white hover:bg-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
    >
      Tìm kiếm
    </button>
  );
}
