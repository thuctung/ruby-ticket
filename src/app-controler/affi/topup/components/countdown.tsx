"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const TOTAL_SECONDS = 10 * 60; // 10 phút

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type CountdownProps = {
  totalSecounds: number;
};
export default function Countdown({ totalSecounds }: CountdownProps) {
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remaining]);

  const isFinished = remaining === 0;

  return (
    <div className="flex flex-col items-center gap-2  bg-white ">
      <span
        className={`text-lg font-semibold tabular-nums ${
          isFinished ? "text-red-500" : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {isFinished ? "Đơn hàng đã bị hủy" : formatTime(remaining)}
      </span>
    </div>
  );
}
