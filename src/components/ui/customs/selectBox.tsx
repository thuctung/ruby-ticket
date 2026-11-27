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
      className={`w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal text-slate-900 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30 ${className}`}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    >
      {firstOption ? <option value="all">Chọn công viên</option> : null}
      {children}
    </select>
  );
}
