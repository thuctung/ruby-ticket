// hooks/useDebounce.js
import { useEffect, useState } from "react";

export function useDebounce(value: any, delay = 1000, callback?: any) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (typeof callback === "function") callback(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      callback(false);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
