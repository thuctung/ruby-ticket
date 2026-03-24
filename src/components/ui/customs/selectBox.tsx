import { SelectBoxProps } from "@/types";

export function SelectBox({
  onChange,
  firstOption,
  value,
  children,
  className,
  ...prop
}: SelectBoxProps) {
  return (
    <select
      {...prop}
      className={`w-full bg-white border-none shadow-sm rounded-2xl p-2 outline-none cursor-pointer ${className}`}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    >
      {firstOption ? <option value="all">Tất cả</option> : null}
      {children}
    </select>
  );
}
