import { InputProps } from "@/types";

export function Input({ onChange, type, value, placeholder, className, ...prop }: InputProps) {
  return (
    <input
      {...prop}
      type={type || "text"}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all ${className}`}
    />
  );
}
