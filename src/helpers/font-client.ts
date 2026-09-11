import localFont from "next/font/local";

export const body = localFont({
  src: [
    {
      path: "../font/BeVietnamPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/BeVietnamPro-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-body",
});

export const mono = localFont({
  src: [
    {
      path: "../font/GeistMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/GeistMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
});
